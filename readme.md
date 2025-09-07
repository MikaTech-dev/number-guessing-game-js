# 🎯 Live Number Guessing Game

A real-time multiplayer number guessing game built with a chat-like interface where players compete to guess the correct number and earn points. Utilizing the MERN stack with socket.io for live game updates.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [How to Play](#how-to-play)
- [Game Rules](#game-rules)
- [Smart Hints System](#smart-hints-system)
- [Technical Requirements](#technical-requirements)
- [Installation](#installation)

## 📖 Overview

This is a fun, interactive number guessing game designed for you and your friends to play together in real-time. One player acts as the Game Master and thinks of a secret number, while other players try to guess it within limited attempts and time. The game features a chat-like interface for seamless interaction and real-time updates with intelligent hinting system.

## ✨ Features

### Game Session Management
- **Create Game Sessions**: One player acts as Game Master to start a session
- **Join Sessions**: Other players can join before the game begins
- **Player Count Display**: Real-time view of connected players
- **Session Security**: Players cannot join once the game starts

### Gameplay Features
- **Number Range**: Game Master chooses a preset range which will be shown to the players
- **Number Selection**: Game Master chooses a secret number
- **Limited Attempts**: Players get 3 attempts per game
- **Time Limit**: Default 60-second timer per round
- **Real-time Scoring**: Instant point assignment for correct guesses
- **Score Tracking**: Players can view each other's scores
- **Smart Hints**: Temperature-based proximity hints + directional guidance

### Game Flow
- **Automatic Game Master Rotation**: Next player becomes Game Master after each round
- **Session Cleanup**: Automatic deletion when all players leave
- **Winner Announcement**: Immediate notification when someone guesses correctly

## 🎮 How to Play

1. **Start a Session**: One player becomes a Game Master and creates a game session
2. **Join the Game**: Friends join the session before it starts
3. **Wait for Minimum Players**: Game requires at least 3 players to begin
4. **Game Master Chooses Number**: The Game Master selects a number range and types in a secret number within said range 
5. **Start the Game**: Game Master initiates the guessing round
6. **Guess the Number**: Players try to guess the secret number within 3 attempts
7. **Receive Smart Hints**: Get temperature and directional feedback after each guess
8. **Win or Time Out**: Game ends when someone wins or time expires
9. **Next Round**: Players can vote to stop or continue, if continue, next playr becomes game master.

## 📜 Game Rules

### Pre-Game
- Minimum 3 players required to start (maximum players in one session = 10)
- Only Game Master can start the session
- Players can join until game begins

### During Game
- Each player gets 3 attempts to guess the number
- 60-second timer per round
- No joining once game starts
- First correct guess wins the round
- Players can exit mid-game. if fewer than 2 players remain, the session ends. 

### Winning Conditions
- **Correct Number**: First player to guess the secret number wins
- **Time Expired**: No winner if time runs out
- **Points**: Winner receives 10 points

### Post-Game
- Winner and secret number displayed to all players
- Secret number revealed if time expires
- Users have 10s to vote to continue or quit — Next player becomes Game Master
- Scores persist throughout the session


## 🤓 Smart Hints System

After each guess, players receive two types of intelligent hints to help them narrow down the secret number:

### 1. Temperature-Based Proximity Hints
- **🔥🔥 Very Warm**: Your guess is within 5% of the secret number
- **🔥 Warm**: Your guess is within 10% of the secret number  
- **❄️ Cold**: Your guess is within 30% of the secret number
- **❄️❄️ Very Cold**: Your guess is more than 30% away from the secret number

### 2. Directional Guidance
- **⬆️ Guess Higher**: Your guess is lower than the secret number
- **⬇️ Guess Lower**: Your guess is higher than the secret number

### Example Hint Feedback:
Your guess: 45
Hint: 🔥 Warm | ⬆️ Guess Higher
Attempts remaining: 2


### Hint Logic:
- **Very Warm**: |guess - secret| ≤ 5% of secret number
- **Warm**: |guess - secret| ≤ 10% of secret number
- **Cold**: |guess - secret| ≤ 30% of secret number
- **Very Cold**: |guess - secret| > 30% of secret number

## 🛠 Technical Requirements

### Input Validation
- Validate number inputs (ensure they're numbers within range and not decimals)
- Prevent malicious input and injection attacks
- Handle edge cases gracefully

### Real-time Features
- WebSocket connections for live updates
- Concurrent player handling
- Session state management
- Real-time hint generation and distribution

### Interface Design
- Chat-like interface for all interactions
- Responsive design
- Clear visual feedback for game states
- Intuitive hint display system

## 🚀 Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start the development server
npm start