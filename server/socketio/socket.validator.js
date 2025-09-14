// validators/socket.validator.js
import Joi from 'joi';

// Schema for setUser data
const setUserSchema = Joi.object({
  username: Joi.string().min(1).max(30).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 1 character long',
    'string.max': 'Username must be less than or equal to 30 characters long',
  }),
  role: Joi.string().valid('player', 'gameMaster').required().messages({
    'any.only': 'Role must be either "player" or "gameMaster"',
  }),
});

// Schema for createSession data
const createSessionSchema = Joi.object({
  difficulty: Joi.string().valid('easy', 'medium', 'hard').optional().messages({
    'any.only': 'Difficulty must be "easy", "medium", or "hard"',
  }),
  // userId will come from the socket connection, not the payload
});

// Schema for joinSession data
const joinSessionSchema = Joi.object({
  sessionId: Joi.string().required().messages({
    'string.empty': 'Session ID is required',
  }),
  // userId will come from the socket connection
});

// Schema for startGame data
const startGameSchema = Joi.object({
  sessionId: Joi.string().required().messages({
    'string.empty': 'Session ID is required',
  }),
  // userId will come from the socket connection
});

// Schema for makeGuess data
const makeGuessSchema = Joi.object({
  sessionId: Joi.string().required().messages({
    'string.empty': 'Session ID is required',
  }),
  guess: Joi.alternatives().try(Joi.number().integer(), Joi.string().pattern(/^\d+$/)).required().messages({
    'any.required': 'Guess is required',
    'number.base': 'Guess must be a number',
    'string.pattern.base': 'Guess must be a valid integer string',
  }),
  // userId will come from the socket connection
});

// Export the schemas
export {setUserSchema, createSessionSchema, joinSessionSchema, startGameSchema, makeGuessSchema};