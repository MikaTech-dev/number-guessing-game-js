import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import sendResponse from './utils/sendResponse.js';
import { config } from 'dotenv';
import http from 'http';
import { Server } from 'socket.io'; // Import Socket.IO Server here
import { initializeSocket } from './socketio/socket.service.js'; // Import socket service
import morgan from 'morgan';
import path from 'path'; // Uncomment if serving static files
import { fileURLToPath } from 'url'; // Uncomment if serving static files

config();

// --- Setup for ES Modules __dirname equivalent (Uncomment if needed) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO

// --- Socket.IO Setup ---
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"],
  },
});

// Initialize Socket.IO logic by passing the `io` instance
initializeSocket(io);

app.use(cors());
app.use(express.json());
app.use (morgan("tiny"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public'))); // Serve static files if needed



// --- Routes ---
app.get('/', (req, res) => {
//   sendResponse(res, 200, "Welcome to the Number Guessing Game Lobby API");
	res.render("index");
});

// --- API Endpoint to Create User (Alternative to socket 'setUser') ---
app.post('/api/users', async (req, res) => {
  try {
    const { username, role, socketId } = req.body;

    if (!username || !role || !socketId) {
      return sendResponse(res, 400, "Username, role, and socketId are required");
    }

    if (role !== 'player' && role !== 'gameMaster') {
       return sendResponse(res, 400, "Role must be 'player' or 'gameMaster'");
    }
    if (typeof username !== 'string' || username.trim().length === 0) {
        return sendResponse(res, 400, "Username must be a non-empty string");
    }

    let user = await User.findById(socketId);
    if (user) {
      return sendResponse(res, 409, "User with this socket ID already exists", { userId: user._id });
    }

    user = new User({
      _id: socketId,
      username: username.trim(),
      role,
      socketId
    });
    await user.save();

    sendResponse(res, 201, "User created successfully", { userId: user._id, username: user.username, role: user.role });
  } catch (error) {
    console.error("Error creating user via API:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
});

// --- API Endpoint to Get Session Info ---
app.get('/api/sessions/:id', async (req, res) => {
  try {
    const { id: sessionId } = req.params;
    const session = await GameSession.findOne({ sessionId }).populate('gameMaster', 'username');

    if (!session) {
      return sendResponse(res, 404, "Session not found");
    }

    const sessionInfo = {
      sessionId: session.sessionId,
      gameMaster: { playerId: session.gameMaster._id, username: session.gameMaster.username },
      gameState: session.gameState,
      difficulty: session.difficulty,
      players: session.players.map(p => ({
        playerId: p.playerId,
        username: p.username,
        score: p.score,
        attemptsLeft: p.attemptsLeft,
      })),
      winner: session.winner,
      createdAt: session.createdAt,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      roundEndTime: session.roundEndTime
    };

    sendResponse(res, 200, "Session found", sessionInfo);
  } catch (error) {
    console.error("Error fetching session:", error);
    sendResponse(res, 500, "Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;

// Connect to DB then start the server
connectDB(PORT).then(() => {
  server.listen(PORT, () => console.log(`💻 Server & Socket.IO listening on http://localhost:${PORT}`));
}).catch(err => {
  console.error("🚫Failed to connect to the database:", err);
  process.exit(1);
});

// Import models *after* server setup starts but before they are used in routes. This ensures Mongoose models are registered. 
import User from './models/users.js';
import GameSession from './models/gameSession.js';
