// services/socket.service.js
import { Server } from 'socket.io';
import User from '../models/users.js';
import GameSession from '../models/gameSession.js';
import DIFFICULTY_CONFIG from '../utils/difficulty.js';
import { v4 as uuidv4 } from 'uuid';
import {
  setUserSchema,
  createSessionSchema,
  joinSessionSchema,
  startGameSchema,
  makeGuessSchema,
} from '../socketio/socket.validator.js';
import sendResponse from '../utils/sendResponse.js'; // For consistent error responses if needed

// --- Store active sessions and players in memory for quick access ---
// Consider using Redis for production scalability
const activeSessions = new Map(); // Key: sessionId, Value: session data (optional, can query DB)
const socketToUserMap = new Map(); // Key: socket.id, Value: userId

// Helper function to generate unique session ID
const generateSessionId = async () => {
  let sessionId;
  let isUnique = false;
  while (!isUnique) {
    sessionId = uuidv4().substring(0, 6).toUpperCase(); // Shorter ID
    const existing = await GameSession.findOne({ sessionId });
    if (!existing) isUnique = true;
  }
  return sessionId;
};

// Helper function for Joi validation
const validateData = (schema, data, socket, eventName) => {
  const { error, value } = schema.validate(data);
  if (error) {
    console.error(`Validation error in ${eventName}:`, error.details[0].message);
    socket.emit('error', { message: error.details[0].message });
    return { isValid: false, value: null };
  }
  return { isValid: true, value };
};

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // --- Handle User Creation/Selection ---
    socket.on('setUser', async (data) => {
      const { isValid, value } = validateData(setUserSchema, data, socket, 'setUser');
      if (!isValid) return;

      const { username, role } = value;

      try {
        // Check if user already exists (by socket ID)
        let user = await User.findById(socket.id);

        if (!user) {
          // Create new user using socket.id as _id
          user = new User({
            _id: socket.id,
            username,
            role,
            socketId: socket.id,
          });
          await user.save();
          console.log(`👤 New user created: ${user.username} (${user.role})`);
        } else {
          console.log(`👤 Existing user reconnected: ${user.username} (${user.role})`);
          // Optionally update username/role if they changed? For now, we assume they don't.
        }

        socketToUserMap.set(socket.id, user._id);
        socket.emit('userSet', { userId: user._id, username: user.username, role: user.role });
      } catch (error) {
        console.error("Error setting user:", error);
        socket.emit('error', { message: 'Failed to set user.' });
      }
    });

    // --- Handle Session Creation (Game Master) ---
    socket.on('createSession', async (data) => {
      const userId = socketToUserMap.get(socket.id);
      if (!userId) {
        socket.emit('error', { message: 'User not set. Please set user first.' });
        return;
      }

      const { isValid, value } = validateData(createSessionSchema, data, socket, 'createSession');
      if (!isValid) return;

      try {
        const user = await User.findById(userId);
        if (!user || user.role !== 'gameMaster') {
          socket.emit('error', { message: 'Only Game Masters can create sessions.' });
          return;
        }

        const { difficulty = 'medium' } = value;
        const difficultyConfig = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;

        const sessionId = await generateSessionId();

        const newSession = new GameSession({
          sessionId,
          gameMaster: userId,
          difficulty: {
            level: difficulty,
            minRange: difficultyConfig.minRange,
            maxRange: difficultyConfig.maxRange,
          },
          players: [{
            playerId: userId,
            username: user.username,
            score: 0,
            attemptsLeft: 3,
          }],
        });

        await newSession.save();

        // Join the socket room for this session
        socket.join(newSession.sessionId);

        // Update user's session ID
        user.sessionId = newSession.sessionId;
        await user.save();

        // Store in memory for quick access (optional)
        activeSessions.set(newSession.sessionId, newSession);

        socket.emit('sessionCreated', {
          sessionId: newSession.sessionId,
          gameMaster: { playerId: newSession.gameMaster, username: user.username }, // Include GM username
          difficulty: newSession.difficulty,
          players: newSession.players,
          gameState: newSession.gameState
        });

        console.log(`🎲 Session created: ${newSession.sessionId} by ${user.username}`);

      } catch (error) {
        console.error("Error creating session:", error);
        socket.emit('error', { message: error.message || 'Failed to create session.' });
      }
    });

    // --- Handle Joining Session (Player) ---
    socket.on('joinSession', async (data) => {
      const userId = socketToUserMap.get(socket.id);
      if (!userId) {
        socket.emit('error', { message: 'User not set. Please set user first.' });
        return;
      }

      const { isValid, value } = validateData(joinSessionSchema, data, socket, 'joinSession');
      if (!isValid) return;

      try {
        const { sessionId } = value;
        const user = await User.findById(userId);
        if (!user) {
          socket.emit('error', { message: 'User not found.' });
          return;
        }

        // Check if session exists and is joinable
        const session = await GameSession.findOne({ sessionId });
        if (!session) {
             socket.emit('error', { message: 'Session not found.' });
             return;
        }
        if (session.gameState !== 'waiting') {
             socket.emit('error', { message: 'Cannot join session, game has already started or ended.' });
             return;
        }

        // Check if player is already in the session
        const playerExists = session.players.some(p => p.playerId.toString() === userId);
        if (playerExists) {
             socket.emit('error', { message: 'You are already in this session.' });
             return;
        }

        // Add player to session
        session.players.push({
          playerId: userId,
          username: user.username,
          score: 0,
          attemptsLeft: 3,
        });

        await session.save();

        // Join the socket room
        socket.join(sessionId);

        // Update user's session ID
        user.sessionId = sessionId;
        await user.save();

        // Update in-memory session (optional)
        activeSessions.set(sessionId, session);

        // Notify the joining player with full session state
        socket.emit('sessionJoined', {
          sessionId: session.sessionId,
          gameMaster: session.gameMaster, // Could populate username if needed
          gameState: session.gameState,
          difficulty: session.difficulty,
          players: session.players // Updated list
        });

        // Notify all other players in the session about the new player
        socket.to(sessionId).emit('playerJoined', {
          player: { playerId: user._id, username: user.username, score: 0, attemptsLeft: 3 },
          players: session.players // Send updated list to others too
        });

        console.log(`👥 Player ${user.username} joined session: ${sessionId}`);

      } catch (error) {
        console.error("Error joining session:", error);
        socket.emit('error', { message: error.message || 'Failed to join session.' });
      }
    });

     // --- Handle Starting Game (Game Master) ---
  socket.on('startGame', async (data) => {
    const userId = socketToUserMap.get(socket.id);
    if (!userId) {
      socket.emit('error', { message: 'User not set.' });
      return;
    }

    const { isValid, value } = validateData(startGameSchema, data, socket, 'startGame');
    if (!isValid) return;

    try {
      const { sessionId } = value;

      // Find session and verify GM
      const session = await GameSession.findOne({ sessionId, gameMaster: userId });
      if (!session) {
        socket.emit('error', { message: 'Session not found or you are not the Game Master.' });
        return;
      }

      if (session.players.length < 2) { // Minimum 2 players (GM + 1 other)
        socket.emit('error', { message: 'Minimum 2 players required to start.' });
        return;
      }

      if (session.gameState !== 'waiting') {
        socket.emit('error', { message: 'Game is already in progress or ended.' });
        return;
      }

      // Generate secret number
      const min = session.difficulty.minRange;
      const max = session.difficulty.maxRange;
      const secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;

      session.secretNumber = secretNumber;
      session.gameState = 'in-progress';
      session.startedAt = new Date();
      // Set timer (e.g., 60 seconds)
      const ROUND_DURATION = 60000; // 60 seconds
      session.roundEndTime = new Date(Date.now() + ROUND_DURATION);

      await session.save();

      // Update in-memory session (optional)
      activeSessions.set(sessionId, session);

      // Notify all players in the session
      io.to(sessionId).emit('gameStarted', {
        message: 'Game has started!',
        secretNumberRange: { min, max }, // Send range to players
        roundEndTime: session.roundEndTime,
        gameState: session.gameState // Send updated state
      });

      console.log(`🏁 Game started in session: ${sessionId} (Secret: ${secretNumber})`);

      // Set a timeout to end the game if no one guesses correctly
      setTimeout(async () => {
        try {
            // Re-fetch session to check if it's still in progress
            const updatedSession = await GameSession.findById(session._id);
            if (updatedSession && updatedSession.gameState === 'in-progress') {
                 updatedSession.gameState = 'ended';
                 updatedSession.endedAt = new Date();
                 await updatedSession.save();
                 // Update memory
                 activeSessions.set(sessionId, updatedSession);

                 io.to(sessionId).emit('gameTimeout', {
                     message: '⏰ Time is up!',
                     secretNumber: updatedSession.secretNumber,
                     gameState: 'ended' // Send updated state
                 });
                 console.log(`⏰ Game timeout in session: ${sessionId}`);
            }
        } catch (timeoutError) {
             console.error("Error in game timeout handler:", timeoutError);
             // Optionally notify players of error
        }
      }, ROUND_DURATION);

    } catch (error) {
      console.error("Error starting game:", error);
      socket.emit('error', { message: 'Failed to start game.' });
    }
  });

    // --- Handle Player Guess ---
  socket.on('makeGuess', async (data) => {
    const userId = socketToUserMap.get(socket.id);
    if (!userId) {
      socket.emit('error', { message: 'User not set.' });
      return;
    }

    const { isValid, value } = validateData(makeGuessSchema, data, socket, 'makeGuess');
    if (!isValid) return;

    try {
      const { sessionId, guess } = value;
      // Ensure guess is a number
      const guessNum = typeof guess === 'string' ? parseInt(guess, 10) : guess;

      // Validate number after parsing
      if (isNaN(guessNum)) {
         socket.emit('guessResult', { message: 'Invalid guess format.', isValid: false });
         return;
      }

      const session = await GameSession.findOne({ sessionId });
      if (!session || session.gameState !== 'in-progress') {
        socket.emit('error', { message: 'Game is not active.' });
        return;
      }

      const playerIndex = session.players.findIndex(p => p.playerId.toString() === userId);
      if (playerIndex === -1) {
        socket.emit('error', { message: 'Player not found in session.' });
        return;
      }

      const player = session.players[playerIndex];

      if (player.attemptsLeft <= 0) {
        socket.emit('guessResult', { message: 'You have no attempts left!', isValid: false });
        return;
      }

      // Check if guess is within range
      const min = session.difficulty.minRange;
      const max = session.difficulty.maxRange;
      if (guessNum < min || guessNum > max) {
         socket.emit('guessResult', { message: `Guess must be between ${min} and ${max}.`, isValid: false });
         return;
      }

      player.attemptsLeft -= 1;
      let isCorrect = false;
      let hints = {};

      if (guessNum === session.secretNumber) {
        isCorrect = true;
        player.score += 10; // Award points
        session.winner = { playerId: userId, username: player.username };
        session.gameState = 'ended';
        session.endedAt = new Date();

        // Save session
        await session.save();
        // Update memory
        activeSessions.set(sessionId, session);

        // Broadcast win to all players
        io.to(sessionId).emit('gameWon', {
          message: `🎉 ${player.username} guessed correctly! The number was ${session.secretNumber}.`,
          winner: { username: player.username, playerId: userId },
          secretNumber: session.secretNumber,
          players: session.players, // Send updated player list with scores
          gameState: 'ended' // Send updated state
        });

        console.log(`🏆 ${player.username} won session: ${sessionId}`);

      } else {
        // Generate hints
        const range = session.difficulty.maxRange - session.difficulty.minRange;
        if (range > 0) { // Avoid division by zero
            const difference = Math.abs(guessNum - session.secretNumber);
            const percentage = (difference / range) * 100;

            let temperature = '❄️ Very Cold';
            if (percentage <= 5) temperature = '🔥 Very Warm';
            else if (percentage <= 10) temperature = '🔥 Warm';
            else if (percentage <= 30) temperature = '❄️ Cold';

            let direction = '';
            if (guessNum < session.secretNumber) direction = '⬆️ Guess Higher';
            else direction = '⬇️ Guess Lower';

            hints = { temperature, direction };
        } else {
             hints = { temperature: 'N/A', direction: 'N/A' }; // Edge case for range 0
        }


        // Save player's updated attempts and potentially score
        session.players[playerIndex] = player;
        await session.save();
        // Update memory
        activeSessions.set(sessionId, session);

        // Send hint result only to the guessing player
        socket.emit('guessResult', {
          guess: guessNum,
          hints,
          attemptsLeft: player.attemptsLeft,
          message: `${guessNum} - ${hints.temperature} | ${hints.direction} (Attempts left: ${player.attemptsLeft})`,
          isValid: true,
          isCorrect: false
        });

        // Broadcast to others that a guess was made (without revealing the guess or hints)
        socket.to(sessionId).emit('playerGuessed', {
          username: player.username,
          message: `${player.username} made a guess...`
        });
      }

    } catch (error) {
      console.error("Error processing guess:", error);
      socket.emit('error', { message: 'Error processing your guess.' });
    }
  });


    // --- Handle Disconnect ---
    socket.on('disconnect', async () => {
      console.log(`🔌 User disconnected: ${socket.id}`);
      const userId = socketToUserMap.get(socket.id);
      if (userId) {
        socketToUserMap.delete(socket.id);
        // Optional: Handle user leaving session logic here
        // e.g., remove from session players list, check if GM left etc.
        // This can get complex, often handled by timeout or explicit leave events
      }
    });

    // --- Optional: Handle explicit leave session event ---
    socket.on('leaveSession', async (data) => {
         // Implementation for leaving a session (e.g., cleanup, notify others)
         // This is often handled by disconnect or UI logic redirecting to lobby
    });

  });
};

export { initializeSocket, socketToUserMap, activeSessions }; // Export for use in app.js
