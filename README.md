# Emoji Game

An interactive game where you catch good emojis and avoid bad ones to score points. Experience dynamic gameplay with responsive audio-visual effects, automatic pause/resume, and YaGames SDK integration for a seamless gaming experience.

## Game Features

- **Score System**:
  - Earn points by clicking on good emojis.
  - Points range from 1 to 10, based on the emoji's size and speed (smaller and faster emojis yield higher scores).
  - Hitting a high-scoring emoji awards bonus time.
  - Avoid bad emojis (💀, 🦠, 🤬, ☠️, 💩) which decrease your score and remaining time.
- **Time Limit**:
  - Each round lasts 30 seconds.
  - Bonus time is added for high-scoring hits.
  - The game automatically ends when time runs out.
- **Dynamic Spawning**:
  - Emojis appear randomly from the bottom of the screen.
  - Spawn intervals decrease as your score increases, increasing the game's difficulty.
- **Size Variation & Interactive Effects**:
  - Each emoji appears in a random size, affecting both its score and the associated sound effects.
  - Clicking an emoji triggers a burst of particles and a corresponding sound effect.
- **Audio Feedback**:
  - Utilizes the Web Audio API for dynamic sound effects.
  - Spawn sounds, click sounds, and distinct sounds for bad emojis enhance the gameplay experience.
- **Automatic Pause/Resume**:
  - The game automatically pauses when the browser tab loses focus or becomes hidden, and resumes upon reactivation.
- **YaGames SDK Integration**:
  - The game initializes the YaGames SDK on load for additional features such as gameplay tracking and leaderboard submissions.

## How to Play

1. Open `index.html` in your browser.
2. Press the central start button (▶️) to start the game.
3. Click or tap good emojis (🍋, 🍎, 🍊, 🍌, 🍉, 🍇, 🍓, 🥝, 🥭, 🍍, 🥑, 🍒) to earn points.
4. Avoid bad emojis (💀, 🦠, 🤬, ☠️, 💩) which reduce your score and time.
5. Aim for smaller and faster emojis to maximize your score.
6. Enjoy the dynamic game with bonus time challenges and responsive audio-visual effects.
7. When the game ends, press the restart button (🔄) to play again.

## Technical Details

- **Emoji Spawning**: 
  - Spawn rate dynamically adjusts from approximately 800ms to 100ms based on your score.
- **Audio System**:
  - Spawn sounds: Sine wave with frequency based on emoji size.
  - Click sounds: Triangle wave with quick attack and smooth decay.
  - Bad click sounds: Sawtooth wave with a harsher tone.
- **Animation & Particle System**:
  - CSS-based animations control emoji movement.
  - Particle effects are generated on emoji interactions, bursting in a circular pattern.
- **Scoring & Difficulty**:
  - Points calculated from emoji size and movement speed.
  - Higher scores result in faster emoji spawn rates.
- **Pause/Resume Functionality**:
  - The game pauses automatically when the tab loses focus and resumes when active.
- **YaGames SDK**:
  - Integrated for game loading notifications, gameplay state updates, and leaderboard score submissions.

## Files

- `index.html`: Main HTML file that sets up the game's UI and initializes the YaGames SDK.
- `styles.css`: Contains styling and animation definitions.
- `script.js`: Implements game logic, including scoring, audio effects, emoji spawning, and game state management.
