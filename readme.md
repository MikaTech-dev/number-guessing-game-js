# Number Guessing Game

A real-time multiplayer number guessing game with chat functionality.

[![License: MIT](https://img.shields.io/github/license/Mikatech-Dev/guessing-game-js?style=for-the-badge&color=white)](https://opensource.org/licenses/MIT)
![Issues](https://img.shields.io/github/issues/Mikatech-Dev/guessing-game-js?style=for-the-badge&color=purple)
![Forks](https://img.shields.io/github/forks/MikaTech-dev/number-guessing-game-js?style=for-the-badge&color=purple)
![Stars](https://img.shields.io/github/stars/Mikatech-Dev/guessing-game-js?style=for-the-badge&color=white)


## Features

- User creation/registration
- Difficulty levels (Easy: 1-50, Medium: 1-100, Hard: 1-500)
- Randomly generated session codes which can be used to join game rooms
- Player count tracking per session/game room
- Directional and temperature based hinting
- Server allows users to chat while to game goes on
- Users allowed to leave specific rooms

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/MikaTech-dev/number-guessing-game-js.git
   ```
2. Install dependencies:
   ```bash
   cd number-guessing-game-js
   npm i
   ```

## Running the Application

1. Set up `.env` & dont forget to add your MongoDB connection string:
   ```bash
   cp .env.example .env
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open browser at `http://localhost:3000`

## Usage

1. Enter username and select role (Player/Host)
2. Host creates session and shares ID
3. Players join using the session ID
4. Host starts the game when ready
5. Guess the number & chat with other players

## Tech Stack

- Node.js
- Express.js
- Socket.IO
- MongoDB
- EJS
- Mongoose




