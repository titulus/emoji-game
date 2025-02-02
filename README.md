# Emoji Game

An interactive game where you catch fruit-themed emojis before time runs out!

## Game Features

- **Score System**:
  - Earn points by clicking good emojis
    - Points (1-10) based on emoji size and speed
    - Smaller and faster emojis are worth more points
  - Avoid bad emojis (💀, 🦠, 🤬, ☠️, 💩) which decrease score and time
- **Time Limit**: 30-second countdown per round
  - Bonus time for high-scoring hits (>7 points)
  - Time decreases when hitting bad emojis
- **Dynamic Spawning**: Emojis appear randomly from the bottom of the screen
- **Size Variation**: Each emoji appears in different sizes
- **Interactive Effects**: 
  - Emojis burst into particles when clicked
  - Particle effects with sparkle emojis (🌟, ✨, 💥, ⭐, 🔅, 🔆)
- **Audio Feedback**: 
  - Spawn sounds with pitch varying by emoji size
  - Click sounds with smooth fade in/out effects
  - Special sound for bad emojis

## How to Play

1. Open `index.html` in your browser
2. Click or tap good emojis (🍋, 🍎, 🍊, 🍌, 🍉, 🍇, 🍓, 🥝, 🥭, 🍍, 🥑, 🍒) to earn points
3. Avoid bad emojis (💀, 🦠, 🤬, ☠️, 💩) - they reduce score and time!
4. Smaller and faster emojis are worth more points - try to catch them!
5. Score as many points as possible before time runs out
6. When game ends, click "Play Again" to start a new round

## Technical Details

- **Emoji Spawning**: Dynamic intervals that decrease with score (800ms to 100ms)
- **Audio System**: Web Audio API with dynamic frequency and volume control
  - Spawn sounds: Sine wave with size-based frequency
  - Good click sounds: Triangle wave with quick attack and smooth decay
  - Bad click sounds: Sawtooth wave with lower frequency
- **Animation**: CSS-based animations for movement and effects
- **Particle System**: Creates 3-8 particle emojis that spread in a circular pattern
- **Scoring Algorithm**: Points based on emoji size and movement speed
- **Difficulty Progression**: Spawn rate increases with score

## Files

- `index.html`: Main HTML file with game UI elements
- `styles.css`: CSS file for styling and animations
- `script.js`: JavaScript file containing game logic, scoring system, and audio
