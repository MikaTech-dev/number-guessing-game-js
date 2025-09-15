Of course. Here is the content formatted into a professional `README.md` file.

-----

# 🎯 Live Number Guessing Game

\<div align="center"\>

**A real-time multiplayer number guessing game with a chat-like interface where players compete to guess the correct number and earn points.**

\</div\>

<p align="center">
  <img alt="License" src="https://img.shields.io/github/license/MikaTech-dev/number-guessing-game-js?style=for-the-badge" />
  <img alt="Issues" src="https://img.shields.io/github/issues/MikaTech-dev/number-guessing-game-js?style=for-the-badge&color=important" />
  <img alt="Forks" src="https://img.shields.io/github/forks/MikaTech-dev/number-guessing-game-js?style=for-the-badge&color=success" />
  <img alt="Stars" src="https://img.shields.io/github/stars/MikaTech-dev/number-guessing-game-js?style=for-the-badge&color=yellow" />
</p>

## 📋 Table of Contents

  - [Overview](#overview)
  - [Features](#features)
  - [How to Play](#how-to-play)
  - [Game Rules](#game-rules)
  - [Smart Hints System](#smart-hints-system)
  - [Technology Stack](#technology-stack)
  - [Project Structure](#project-structure)
  - [Installation & Setup](#installation--setup)
  - [Running the Application](#running-the-application)
  - [API Endpoints](#api-endpoints)
  - [Socket.IO Events](#socketio-events)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [License](#license)

-----

## 📖 Overview

This is a fun, interactive number guessing game designed for you and your friends to play together in real-time. One player acts as the **Game Master** and secretly selects a number within a chosen difficulty range, while other players try to guess it within limited attempts and time. The game features a chat-like interface for seamless interaction, real-time updates, and an intelligent hinting system to guide players.

-----

## ✨ Features

### Game Session Management

  - **User Role Selection**: Players choose to be either a 'Player' or 'Game Master' upon entering the lobby.
  - **Create Game Sessions**: Game Masters can create a new game session and select a difficulty level.
  - **Join Sessions**: Players can join an existing session using a unique Session ID.
  - **Player Count Display**: Real-time view of connected players in the session lobby.
  - **Session Security**: Players cannot join once the game has started.

### Gameplay Features

  - **Difficulty Levels**: Easy (1-50), Medium (1-100), Hard (1-500).
  - **Limited Attempts**: Each player gets **3 attempts** per game.
  - **Time Limit**: Default **60-second** timer per round.
  - **Real-time Scoring**: Instant point assignment (10 points) for the winning player.
  - **Score Tracking**: Players can view each other's scores throughout the session.
  - **Smart Hints**: Temperature-based proximity hints + directional guidance after each guess.
  - **In-Game Chat**: Players can send messages to each other during the game.

### Game Flow

  - **Automatic Game Master Rotation**: Next player in the session becomes Game Master after each round.
  - **Session Cleanup**: Game session is automatically deleted when all players leave.
  - **Winner Announcement**: Immediate notification when someone guesses correctly.
  - **Timeout Handling**: Game ends automatically if time expires with no winner.

-----

## 🎮 How to Play

1.  **Enter the Lobby**: Open the application. Enter your username and select your role (Player or Game Master).
2.  **Game Master Setup**:
      * If you chose 'Game Master', select a difficulty level.
      * Click 'Create New Game Session'.
      * Note the generated Session ID and share it with friends.
      * Wait for players to join your session.
3.  **Player Setup**:
      * If you chose 'Player', obtain the Session ID from the Game Master.
      * Enter the Session ID and click 'Join Game Session'.
      * Wait in the lobby for the Game Master to start the game.
4.  **Start the Game**:
      * (Game Master) Once there are at least 2 players, click 'Start Game'.
5.  **Play the Game**:
      * All players will see the game interface with a chat box and guess input.
      * Type a number into the input and press Enter/Send to submit a guess.
      * Type any text message to chat with other players.
      * Receive smart hints after each numerical guess.
      * Try to guess the secret number before time runs out or attempts are used up\!
6.  **Game End**:
      * The game ends when a player guesses correctly or the timer reaches zero.
      * Results are displayed to all players.
      * The next player in the list becomes the Game Master for the subsequent round.

-----

## 📜 Game Rules

### Pre-Game

  - Minimum **2 players** required to start a game session.
  - Only the Game Master can initiate the start of the game.
  - Players can join the session until the Game Master starts the game.

### During Game

  - Each player has **3 attempts** to guess the secret number.
  - The game round lasts for **60 seconds**.
  - New players cannot join a session once the game has started.
  - The first player to guess the secret number correctly wins the round.

### Winning Conditions

  - **Correct Number**: The first player to guess the secret number wins and receives **10 points**.
  - **Time Expired**: If the timer runs out and no one has guessed correctly, the game ends with no winner.
  - **No Points**: No points are awarded if the game times out.

### Post-Game

  - The winner (if any) and the secret number are displayed to all players.
  - The next player in the session list automatically becomes the new Game Master.
  - Players remain in the session and can participate in the next round.

-----

## 🔥 Smart Hints System

After each numerical guess, players receive two types of intelligent hints to help them narrow down the secret number:

### 1\. Temperature-Based Proximity Hints

  - **🔥 Very Warm**: Your guess is within 5% of the secret number range.
  - **🔥 Warm**: Your guess is within 10% of the secret number range.
  - **❄️ Cold**: Your guess is within 30% of the secret number range.
  - **❄️ Very Cold**: Your guess is more than 30% away from the secret number range.

### 2\. Directional Guidance

  - **⬆️ Guess Higher**: Your guess is lower than the secret number.
  - **⬇️ Guess Lower**: Your guess is higher than the secret number.

### Example Hint Feedback:

```
Your guess: 45
Hint: 🔥 Warm | ⬆️ Guess Higher
Attempts remaining: 2
```

-----

## 🛠 Technology Stack

  - **Frontend**: HTML, CSS, JavaScript, EJS (templating)
  - **Backend**: Node.js, Express.js
  - **Real-time Communication**: Socket.IO
  - **Database**: MongoDB, Mongoose (ODM)
  - **Validation**: Joi
  - **Environment Management**: dotenv
  - **Development Tools**: Nodemon
  - **Deployment**: Configured for platforms like PipeOps (using buildpacks)

-----

## 🗂 Project Structure

```
project-root/
|   └── client/                 # (Potentially for future React frontend)
├── config/             # Database configuration
├── controllers/        # Route handler logic (if expanded)
├── models/             # Mongoose data models
├── socketio/           # Socket.IO event handling and services
├── utils/              # Helper functions
├── validators/         # Joi validation schemas
├── views/              # EJS templates
├── app.js              # Main server application file
├── package.json        # Server dependencies and scripts
├── .env                    # Environment variables (not committed)
├── .gitignore              # Files/folders to ignore in Git
├── package.json            # Root package.json (for dev tools like ESLint)
└── README.md               # This file
```

-----

## 🚀 Installation & Setup

### Prerequisites

  - Node.js (v14 or later recommended)
  - npm (comes with Node.js) or yarn
  - MongoDB instance (local or cloud, e.g., MongoDB Atlas)

### Steps

1.  **Clone the Repository**:
    ```bash
    git clone <your-repository-url>
    cd <your-project-directory>
    ```
2.  **Install Root Dependencies** (for development tools like linters):
    ```bash
    npm install
    ```
3.  **Navigate to the Server Directory**:
    ```bash
    cd server
    ```
4.  **Install Server Dependencies**:
    ```bash
    npm install
    ```
5.  **Configure Environment Variables**:
      * Create a `.env` file in the `server/` directory.
      * Add your MongoDB connection string and an optional port:
    <!-- end list -->
    ```
    MONGO_URI=your_mongodb_connection_string_here
    PORT=3000
    ```

-----

## ▶️ Running the Application

### For Development (with Nodemon)

From the `server/` directory, run:

```bash
npm run dev
```

This starts the server using `nodemon`, which automatically restarts upon file changes.

### For Production

From the `server/` directory, run:

```bash
npm start
```

This runs the application using `node app.js`.

The application will be accessible at `http://localhost:3000` (or your specified `PORT`).

-----

## 🌐 API Endpoints

### `POST /api/users`

  - **Description**: Creates a new user in the database. This is an alternative to the Socket.IO `setUser` event, mainly useful for testing.
  - **Request Body**:
    ```json
    {
      "username": "string",
      "role": "player" or "gameMaster",
      "socketId": "string"
    }
    ```
  - **Responses**:
      - `201 Created`: User created successfully.
      - `400 Bad Request`: Missing or invalid fields.
      - `409 Conflict`: User with the provided `socketId` already exists.
      - `500 Internal Server Error`: Database or server error.

### `GET /api/sessions/:id`

  - **Description**: Retrieves basic information about a specific game session by its ID.
  - **Responses**:
      - `200 OK`: Session found, returns session details.
      - `404 Not Found`: Session with the given ID does not exist.
      - `500 Internal Server Error`: Database or server error.

-----

## 🔌 Socket.IO Events

### Client to Server (Emitted by Client)

  - `setUser`

      - **Purpose**: Registers the user with the backend using their Socket.IO ID.
      - **Payload**: `{ username: "string", role: "player"|"gameMaster" }`

  - `createSession`

      - **Purpose**: Creates a new game session managed by the emitting user.
      - **Payload**: `{ difficulty: "easy"|"medium"|"hard" }`

  - `joinSession`

      - **Purpose**: Adds the user to the specified game session.
      - **Payload**: `{ sessionId: "string" }`

  - `startGame`

      - **Purpose**: Initiates the guessing phase for the session.
      - **Payload**: `{ sessionId: "string" }`

  - `makeGuess`

      - **Purpose**: Processes the player's guess against the secret number.
      - **Payload**: `{ sessionId: "string", guess: "number|string" }`

  - `sendChatMessage`

      - **Purpose**: Broadcasts a chat message to other players in the session.
      - **Payload**: `{ sessionId: "string", message: "string" }`

### Server to Client (Listened for by Client)

  - `userSet`

      - **Purpose**: Confirms user registration and provides user details.
      - **Payload**: `{ userId: "string", username: "string", role: "string" }`

  - `sessionCreated`

      - **Purpose**: Provides the new session ID and initial state to the Game Master.
      - **Payload**: `{ sessionId, gameMaster, difficulty, players, gameState }`

  - `sessionJoined`

      - **Purpose**: Confirms the player joined and provides the current session state.
      - **Payload**: `{ sessionId, gameMaster, gameState, difficulty, players }`

  - `playerJoined`

      - **Purpose**: Updates the player list for all members already in the session.
      - **Payload**: `{ players: [...] }`

  - `gameStarted`

      - **Purpose**: Signals the game has begun and provides necessary game parameters.
      - **Payload**: `{ message, secretNumberRange, roundEndTime, gameState }`

  - `guessResult`

      - **Purpose**: Provides feedback (hints, attempts left) for the player's specific guess.
      - **Payload**: `{ guess, hints, attemptsLeft, message, isValid, isCorrect }`

  - `playerGuessed`

      - **Purpose**: Notifies *other* players that a guess was made.
      - **Payload**: `{ username: "string", guess: number, message: "string" }`

  - `chatMessageReceived`

      - **Purpose**: Displays a chat message in the game room.
      - **Payload**: `{ username: "string", message: "string", isSelf: boolean }`

  - `gameWon`

      - **Purpose**: Announces the winner and ends the game round for all players.
      - **Payload**: `{ message, winner, secretNumber, players, gameState }`

  - `gameTimeout`

      - **Purpose**: Announces the end of the game round due to timeout.
      - **Payload**: `{ message, secretNumber, gameState }`

  - `error`

      - **Purpose**: Sends error messages to the client for display.
      - **Payload**: `{ message: "string" }`