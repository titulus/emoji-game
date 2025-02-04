# Browser Game Template with YSDK

This template provides the essential framework for developing browser games with YaGames SDK integration on both desktop and mobile platforms. It includes the following core functionalities:

- **Game Launch**: Initialize the game with a start button that also activates the audio system.
- **Score Display**: Shows the player's current score.
- **Sound Control**: Toggle sound on and off during gameplay.
- **Round Timer**: A countdown timer displays the remaining time for the current round.
- **Pause/Resume**: Automatically pauses the game when the browser tab or window loses focus and resumes when focus is restored.
- **Game Over Screen**: Displays a final screen at the end of the round with options to restart the game or restart with a rewarded ad.
- **YaGames SDK Integration**: Provides a framework for YaGames SDK features such as gameplay state notifications and leaderboard score submissions.

## How to Use

1. Open `index.html` in your browser.
2. Press the start button to begin the game. This initializes the audio system and starts the round.
3. The template handles pausing/resuming automatically based on window focus.
4. After the round ends, use the provided buttons to restart the game or watch a rewarded ad for extra time.

## Technical Details

- The template sets up the essential UI elements and event listeners.
- Core functionalities such as score updating, timer countdown, audio system initialization, and YaGames SDK integration are implemented in `script.js`.
- Developers should implement custom gameplay logic by extending this template.

## Files

- `index.html`: Sets up the UI and initializes YaGames SDK.
- `styles.css`: Contains styling for the UI and animations.
- `script.js`: Contains the core functionality for game launch, score, timer, pause/resume, and game over handling.

## Codestyle and Architecture Recommendations

### Codestyle

1. **Consistent Naming Conventions**:
   - Use camelCase for variable and function names.
   - Use PascalCase for class names.
   - Use UPPER_CASE for constants.

2. **Indentation**:
   - Use 4 spaces for indentation.
   - Ensure consistent indentation throughout the file.

3. **Spacing**:
   - Use spaces around operators and after commas.
   - Avoid unnecessary spaces.

4. **Line Length**:
   - Keep lines within 80-120 characters to improve readability.

5. **Comments**:
   - Use comments to explain complex logic or non-obvious code.
   - Avoid redundant comments.

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