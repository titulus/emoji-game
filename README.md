# Emoji Game

An interactive game where you catch good emojis and avoid bad ones to score points. Experience dynamic gameplay with responsive audio-visual effects, automatic pause/resume functionality, and YaGames SDK integration for enhanced features like gameplay tracking and leaderboard submissions.

## Game Features

- **Score System**:
  - Earn points by clicking on good emojis.
  - Points range from 1 to 10, calculated based on the emoji’s size and speed, and further enhanced by a Fibonacci-based multiplier unique to each emoji.
  - Avoid bad emojis which decrease your score and progress.
- **Dynamic Spawning**:
  - Emojis appear randomly from the bottom of the screen.
  - Spawn intervals decrease as your score increases, escalating the game's challenge.
- **Emoji Types**:
  - **Good Emojis**: A variety of fruits, vegetables, and floral icons, with a trophy (🏆) available at advanced levels.
  - **Bad Emojis**: Identified as 💀, ☠️, and 💩, which penalize your score and progress.
  - **Bonus Emoji**:
    - Represented by 🧨, which, when clicked, vaporizes all bad emojis on screen without affecting the player.
    - Represented by 📦, which, when clicked, temporarily increases the frequency of emoji spawning to 10ms for 1 second and then returns to the normal frequency for another second.
- **Audio Feedback**:
  - Uses the Web Audio API to generate dynamic sound effects.
  - Different sound profiles for emoji spawning, clicking good emojis (triangle wave), bad emoji clicks (sawtooth wave), and bonus emoji interactions.
- **Animation & Particle Effects**:
  - CSS-based animations govern emoji movement and removal.
  - Clicking emojis triggers particle bursts that enhance visual feedback.
- **Automatic Pause/Resume**:
  - The game automatically pauses when the browser tab loses focus or the window blurs, resuming seamlessly upon reactivation.
- **YaGames SDK Integration**:
  - Initializes the YaGames SDK on load to support additional features such as gameplay state management and leaderboard score submissions.
  - Supports rewarded video ads for resume lost game.

## How to Play

1. Open `index.html` in your browser.
2. Press the central start button (▶️) to begin the game.
3. Click or tap on good emojis (e.g., 🍓, 🍎, 🥭, 🍊, 🍋, 🍍, 🥝, 🥑) to earn points.
4. Avoid clicking on bad emojis (💀, ☠️, 💩) to prevent score penalties.
5. Look out for bonus emojis (🧨 and 📦) which can clear bad emojis from the screen or temporarily increase the frequency of emoji spawning.
6. Enjoy the dynamic, progressively challenging gameplay.
7. When the game ends, press the restart button (🔄) to play again.
8. Optionally, watch a rewarded video ad to resume the game while preserving your current stats.

## Technical Details

- **Emoji Spawning**:
  - Spawn intervals dynamically adjust from approximately 800ms to 100ms based on in-game score.
  - The spawn delay is determined by a progression algorithm that factors in the player’s score.
- **Audio System**:
  - **Spawn Sounds**: Sine wave sounds with frequency modulated by the emoji's size.
  - **Click Sounds**: Triangle wave sounds with a quick attack and smooth decay.
  - **Bad Click Sounds**: Sawtooth wave sounds with a harsher tone.
  - **Bonus Click Sounds**: Enhanced triangle wave sounds with higher frequency.
- **Scoring & Difficulty**:
  - Points are computed from a combination of emoji size (smaller emojis yield higher points) and speed of movement.
  - Each good emoji has a Fibonacci-based multiplier, adding a unique scaling factor to the score.
- **Animation & Particle System**:
  - CSS animations control the movement of emojis.
  - Particle effects are generated on interactions to create a dynamic visual burst.
- **Pause/Resume Functionality**:
  - The game state automatically pauses when the tab or window loses focus and resumes when reactivated.
- **YaGames SDK**:
  - Integration with YaGames SDK allows for gameplay tracking, in-game notifications, and leaderboard submissions.
  - Rewarded video ads are available to provide bonus restart options without resetting progress.

## Files

- `index.html`: Sets up the game interface and initializes the YaGames SDK.
- `styles.css`: Contains the styling and animation definitions for the game.
- `script.js`: Implements the game logic, including emoji spawning, animations, scoring, audio effects, and game state management.

## Codestyle and Architecture Recommendations

1. **Consistent Naming Conventions**:
   - Use camelCase for variable and function names.
   - Use PascalCase for class names.
   - Use UPPER_CASE for constants.

2. **Indentation**:
   - Use 4 spaces per indentation level.
   - Maintain consistent indentation throughout the codebase.

3. **Spacing**:
   - Use appropriate spacing around operators and after commas.
   - Avoid redundant spaces.

4. **Line Length**:
   - Keep lines within 80-120 characters for enhanced readability.

5. **Comments**:
   - Provide comments to explain complex logic or non-obvious code segments.
   - Avoid unnecessary or redundant comments.

6. **Modularization**:
   - Break down the code into smaller, reusable modules.

7. **Consistent Formatting**:
   - Use a consistent formatting style throughout the file.
   - Use consistent spacing and indentation.
   - Use consistent naming conventions.
   - Before creating new piece of code - check how the similar code is already written in the project and match the style.

8. **Partial updates**:
   - Avoid making large changes to the codebase at once.
   - Instead, make smaller, incremental changes.
   - Do not modify (e.g. remove, rename) any existing code (including comments) that is not related to the feature you are working on.
   - Do not remove or add empty lines in the already written code, not related to the feature you are working on.