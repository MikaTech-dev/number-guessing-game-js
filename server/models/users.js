import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: String, // Will use socket.id as the primary key
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['player', 'gameMaster'],
    required: true
  },
  sessionId: {
    type: String,
    ref: 'GameSession',
    default: null
  },
  attemptsLeft: {
    type: Number,
    default: 3
  },
  socketId: {
    type: String,
    required: true,
    unique: true
  },
  score: {
    type: Number,
    default: 0
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  _id: false, // We'll use socketId as _id
  timestamps: true
});
userSchema.index({ sessionId:1, socketId:1 })

const User = mongoose.model('User', userSchema);
export default User