import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  gameMaster: {
    type: String, // References User._id (socket.id)
    required: true,
    ref: 'User'
  },
  players: [{
    playerId: {
      type: String,
      ref: 'User'
    },
    username: String,
    score: {
      type: Number,
      default: 0
    },
    attemptsLeft: {
      type: Number,
      default: 3
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  gameState: {
    type: String,
    enum: ['waiting', 'in-progress', 'round-over', 'ended'],
    default: 'waiting'
  },
  secretNumber: {
    type: Number,
    default: null
  },
  difficulty: {
    level: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    minRange: {
      type: Number,
      default: 1
    },
    maxRange: {
      type: Number,
      default: 100
    }
  },
  roundEndTime: {
    type: Date,
    default: null
  },
  winner: {
    playerId: {
      type: String,
      ref: 'User',
      default: null
    },
    username: {
      type: String,
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date,
    default: null
  },
  endedAt: {
    type: Date,
    default: null
  }
});

// Index for better query performance
gameSessionSchema.index({ sessionId: 1,gameState: 1, gameMaster: 1 });

const GameSession= mongoose.model("GameSession", gameSessionSchema);

export default GameSession;