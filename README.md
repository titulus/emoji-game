# Emoji Game

An interactive game where you catch good emojis and avoid bad ones to score points. Experience dynamic gameplay with responsive audio-visual effects, automatic pause/resume functionality, and YaGames SDK integration for enhanced features like gameplay tracking and leaderboard submissions.

## Game Features

- **Score System**:
  - Earn points by clicking on good emojis.
  - Points range from 1 to 10, calculated based on the emoji's size and speed, and further enhanced by a Fibonacci-based multiplier unique to each emoji.
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

## Files

- `index.html`: Sets up the game interface and initializes the YaGames SDK.
- `styles.css`: Contains the styling and animation definitions for the game.
- `src/script.ts`: Implements the core game logic and emoji spawning mechanics.
- `src/audio.ts`: Manages all audio-related functionality using Web Audio API.
- `src/sdk.ts`: Handles all interactions with YaGames SDK.
- `src/ui.ts`: Manages the game's user interface elements and their interactions.

## Technical Details

- **Emoji Spawning**:
  - Spawn intervals dynamically adjust from approximately 800ms to 100ms based on in-game score.
  - The spawn delay is determined by a progression algorithm that factors in the player's score.
- **Audio System**:
  - Implemented in a separate `AudioManager` class for better code organization
  - **Spawn Sounds**: Sine wave sounds with frequency modulated by the emoji's size
  - **Click Sounds**: Triangle wave sounds with a quick attack and smooth decay
  - **Bad Click Sounds**: Sawtooth wave sounds with a harsher tone
  - **Bonus Click Sounds**: Enhanced triangle wave sounds with higher frequency
  - Supports sound toggling and automatic initialization
- **Scoring & Difficulty**:
  - Points are computed from a combination of emoji size (smaller emojis yield higher points) and speed of movement.
  - Each good emoji has a Fibonacci-based multiplier, adding a unique scaling factor to the score.
- **Animation & Particle System**:
  - CSS animations control the movement of emojis.
  - Particle effects are generated on interactions to create a dynamic visual burst.
- **Pause/Resume Functionality**:
  - The game state automatically pauses when the tab or window loses focus and resumes when reactivated.
- **YaGames SDK**:
  - Implemented in a separate `SDKManager` class for better code organization
  - Handles gameplay state tracking (start/stop)
  - Manages leaderboard score submissions
  - Provides interface for rewarded video ads
  - Includes TypeScript type definitions for better type safety
- **UI System**:
  - Implemented in a separate `UIManager` class for better code organization
  - Manages all static UI elements defined in HTML
  - Handles score displays, progress bar, and level indicators
  - Controls game screens (start, game over)
  - Provides type-safe event handling for UI interactions

### UI Module (`src/ui.ts`)

The `UIManager` class manages the game's user interface elements and their interactions.

-   **`constructor()`**:
    -   Initializes the UI elements by getting references to them from the DOM.
    -   Attaches event listeners to prevent default behaviors like text selection and context menus.
-   **`updateScore(score: number)`**:
    -   Updates the score displayed on the screen.
-   **`updateFinalScore(score: number)`**:
    -   Updates the final score displayed on the game over screen.
-   **`showGameOver()`**:
    -   Displays the game over screen.
-   **`hideGameOver()`**:
    -   Hides the game over screen.
-   **`isGameOverVisible(): boolean`**:
    -   Returns whether the game over screen is currently visible.
-   **`hideStartScreen()`**:
    -   Hides the start screen.
-   **`updateProgressBar(value: number, level: number, maxLevel: number)`**:
    -   Updates the progress bar's width based on the current progress value.
    -   If the level is at the maximum, the progress bar turns white.
-   **`updateLevelEmojis(currentEmoji: string, nextEmoji: string)`**:
    -   Updates the displayed emojis representing the current and next levels.
    -   Updates the text content of the restart ad button to include the current emoji.
-   **`updateSoundButton(isEnabled: boolean)`**:
    -   Updates the sound toggle button's text to reflect whether sound is enabled or disabled.
-   **`onStartButtonClick(handler: (e: Event) => void)`**:
    -   Attaches an event listener to the start button that triggers the provided handler function when the button is clicked or tapped.
-   **`onRestartButtonClick(handler: (e: Event) => void)`**:
    -   Attaches an event listener to the restart button that triggers the provided handler function when the button is clicked or tapped.
-   **`onRestartAdButtonClick(handler: (e: Event) => void)`**:
    -   Attaches an event listener to the restart ad button that triggers the provided handler function when the button is clicked or tapped.
-   **`onSoundButtonClick(handler: (e: Event) => void)`**:
    -   Attaches an event listener to the sound toggle button that triggers the provided handler function when the button is clicked or tapped.
-   **`setupWindowEvents(onPause: () => void, onResume: () => void)`**:
    -   Sets up event listeners for window focus and blur events to pause and resume the game automatically.
    -   Also listens for the `visibilitychange` event to handle tab switching.

### Audio Module (`src/audio.ts`)

The `AudioManager` class manages all audio-related functionality using the Web Audio API.

-   **`init()`**:
    -   Initializes the `AudioContext` if it hasn't been already.
    -   Resumes the `AudioContext` if it's in a suspended state.
-   **`toggleSound()`**:
    -   Toggles the soundEnabled flag and returns the new state.
-   **`isSoundEnabled(): boolean`**:
    -   Returns the current state of the soundEnabled flag.
-   **`playSpawnSound(size: number)`**:
    -   Plays a sine wave sound that is modulated by the size of the emoji.
-   **`playClickSound()`**:
    -   Plays a triangle wave sound when a good emoji is clicked.
-   **`playBadClickSound()`**:
    -   Plays a sawtooth wave sound when a bad emoji is clicked.
-   **`playBonusClickSound()`**:
    -   Plays an enhanced triangle wave sound when a bonus emoji is clicked.

### SDK Module (`src/sdk.ts`)

The `SDKManager` class handles all interactions with the YaGames SDK.

-   **`startGameplay()`**:
    -   Calls the `start` method of the `GameplayAPI` to track the start of the game.
-   **`stopGameplay()`**:
    -   Calls the `stop` method of the `GameplayAPI` to track the end of the game.
-   **`submitScore(score: number)`**:
    -   Submits the player's score to the leaderboard.
    -   Checks if the `leaderboards.setLeaderboardScore` method is available before submitting.
-   **`showRewardedVideo(callbacks: { onOpen?: () => void; onRewarded?: () => void; onClose?: () => void; onError?: (error: any) => void; }): boolean`**:
    -   Shows a rewarded video ad to the player.
    -   Returns `true` if the ad was successfully shown, `false` otherwise.
    -   The `callbacks` object contains functions to be called when the ad is opened, rewarded, closed, or encounters an error.

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