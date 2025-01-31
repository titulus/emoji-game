# Emoji Game

An interactive game where you catch programming-themed emojis before time runs out!

## Game Features

- **Score System**:
  - Earn points by clicking good emojis
    - Smaller emojis are worth more points (up to 30 points)
    - Larger emojis are worth fewer points (minimum 10 points)
  - Avoid bad emojis (💀, 🦠, ⚡) which decrease score and time
- **Time Limit**: 100-second countdown per round
  - Time decreases when hitting bad emojis
- **Dynamic Spawning**: Emojis appear randomly from the bottom of the screen
- **Size Variation**: Each emoji appears in different sizes
- **Interactive Effects**: 
  - Emojis burst into particles when clicked
  - Particle effects with sparkle emojis (🌟, ✨, 💥)
- **Audio Feedback**: 
  - Spawn sounds with pitch varying by emoji size
  - Click sounds with smooth fade in/out effects

## How to Play

1. Open `index.html` in your browser
2. Click or tap good emojis to earn points
3. Avoid red dangerous emojis (💀, 🦠, ⚡) - they reduce score and time!
4. Smaller emojis are worth more points - try to catch them!
5. Score as many points as possible before time runs out
5. When game ends, click "Play Again" to start a new round

## Technical Details

- **Emoji Spawning**: Random intervals between 0.5-1.5 seconds
- **Audio System**: Web Audio API with dynamic frequency and volume control
  - Spawn sounds: Sine wave with size-based frequency
  - Click sounds: Triangle wave with quick attack and smooth decay
- **Animation**: CSS-based animations for movement and effects
- **Particle System**: Creates 3-8 particle emojis that spread in a circular pattern

## Files

- `index.html`: Main HTML file with game UI elements
- `styles.css`: CSS file for styling and animations
- `script.js`: JavaScript file containing game logic, scoring system, and audio
