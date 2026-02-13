# Number Guessing Game

A real-time multiplayer number guessing game with chat functionality.

[![License: MIT](https://img.shields.io/github/license/Mikatech-Dev/guessing-game-js?style=for-the-badge&color=white)](https://opensource.org/licenses/MIT)
![Issues](https://img.shields.io/github/issues/Mikatech-Dev/guessing-game-js?style=for-the-badge&color=purple)
![Forks](https://img.shields.io/github/forks/MikaTech-dev/number-guessing-game-js?style=for-the-badge&color=purple)
![Stars](https://img.shields.io/github/stars/Mikatech-Dev/guessing-game-js?style=for-the-badge&color=white)


## Features

- Game Master creates sessions with difficulty levels (Easy: 1-50, Medium: 1-100, Hard: 1-500)
- Players join sessions using session ID
- Smart hints system after each guess (temperature and directional)
- In-game chat for communication
- Score tracking and winner announcement

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd number-guessing-game-js
   npm install
   ```

## Running the Application

1. Set up `.env` file with MongoDB connection string:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open browser at `http://localhost:3000`

## Usage

1. Enter username and select role (Player/Game Master)
2. Game Master creates session and shares ID
3. Players join using the session ID
4. Game Master starts the game when ready
5. Guess the number or chat with other players

## Technology Stack

- Node.js
- Express
- Socket.IO
- MongoDB
- EJS
- Mongoose




