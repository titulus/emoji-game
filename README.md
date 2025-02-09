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
  - Spawn rates are affected by level type (speed/slow) and bonus effects.
  - Bad emoji probability increases with level progression (10% + level progression).
  - Bonus emojis have a 1% chance to appear.
- **Emoji Types**:
  - **Good Emojis**: A variety of fruits, vegetables, and floral icons, with a trophy (🏆) available at advanced levels.
  - **Bad Emojis**: Identified as 💀, ☠️, and 💩, which penalize your score and progress.
  - **Bonus Emoji**:
    - Represented by 🧨, which, when clicked, vaporizes all bad emojis on screen without affecting the player.
    - Represented by 📦, which, when clicked, temporarily increases the frequency of emoji spawning to 10ms for 1 second and then returns to the normal frequency for another second.
    - Represented by 🚀, which, when clicked, temporarily increases the speed of all emojis for 5 seconds.
    - Represented by 🐌, which, when clicked, temporarily decreases the speed of all emojis for 5 seconds.
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
- **Level System**:
  - Each level features different emojis from the good emoji pool.
  - Every 5th level (level % 10 === 5) is a speed level where emojis move faster.
  - Every 10th level (level % 10 === 0) is a slow level where emojis move slower.
  - Bad emoji probability increases with level progression.
  - Level transitions are marked with visual effects and emoji changes.

## How to Play

1. Open `index.html` in your browser.
2. Press the central start button (▶️) to begin the game.
3. Click or tap on good emojis to earn points.
4. Avoid clicking on bad emojis (💀, ☠️, 💩) to prevent score penalties.
5. Look out for bonus emojis (🧨, 📦, 🐌, 🚀) which change game for a few seconds.
6. Enjoy the dynamic, progressively challenging gameplay.
7. When the game ends, press the restart button (🔄) to play again.
8. Optionally, watch a rewarded video ad (📺) to resume the game while preserving your current stats.

## Files

- `index.html`: Sets up the game interface and initializes the YaGames SDK.
- `styles.css`: Contains the styling and animation definitions for the game.
- `src/script.ts`: Implements the core game logic and emoji spawning mechanics.
- `src/audio.ts`: Manages all audio-related functionality using Web Audio API.
- `src/sdk.ts`: Handles all interactions with YaGames SDK.
- `src/ui.ts`: Manages the game's user interface elements and their interactions.

## Technical Details

- **Emoji Spawning**:
  - Base spawn intervals dynamically adjust from approximately 800ms to 100ms based on in-game score.
  - The spawn delay is determined by a progression algorithm that factors in the player's score.
  - Speed modifiers:
    - Speed levels (every 5th level): 2x faster
    - Slow levels (every 10th level): 2x slower
    - 🚀 bonus: 2x faster for 5 seconds
    - 🐌 bonus: 2x slower for 5 seconds
    - 📦 bonus: Fixed 10ms delay for 1 second
  - Emoji pool selection:
    - For levels < 20: Available emojis are limited to current level index
    - For levels >= 20: Available emojis are from (level-20) to level index
    - Bad emoji probability: 10% + (level-1) * (0.5/(goodEmojis.length-1))
    - Bonus emoji probability: 1%
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
  - Bad emojis decrease score by 10% and progress bar by 50%.
  - Progress bar fills based on points earned, with each level requiring different amounts based on the current emoji's Fibonacci multiplier.
  - Game ends when progress bar reaches 0.
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

-   **Game Interface**:
    - Score display (🎯) showing current points
    - Progress bar indicating level completion
    - Current level emoji indicator
    - Next level emoji preview
    - Sound toggle button (🔊/🔈)
    - Pause button (⏸️)

-   **Pause Menu**:
    - Resume button (⏯️)
    - Sound toggle button
    - Semi-transparent overlay

-   **Game Over Screen**:
    - Final score display (🏆)
    - Emoji statistics showing collected items
    - Regular restart button (🔄)
    - Ad-based restart button (📺)

-   **Level Transition**:
    - Large emoji animation
    - Visual effects for level change
    - Different animations for speed/slow levels

-   **Progress System**:
    - Dynamic progress bar color
    - White color indication for max level
    - Visual feedback for progress changes

-   **Methods**:
    -   **`constructor()`**:
        -   Initializes UI elements by getting references from DOM
        -   Sets up event listeners to prevent text selection and context menu
    -   **Score Management**:
        -   `updateScore(score: number)`: Updates current score display
        -   `updateFinalScore(score: number)`: Updates final score on game over screen
    -   **Screen Management**:
        -   `showGameOver()`: Displays game over screen
        -   `hideGameOver()`: Hides game over screen
        -   `isGameOverVisible()`: Checks if game over screen is visible
        -   `hideStartScreen()`: Hides start screen
        -   `showPauseMenu()`: Shows pause menu
        -   `hidePauseMenu()`: Hides pause menu
        -   `isPauseMenuVisible()`: Checks if pause menu is visible
    -   **UI Updates**:
        -   `updateProgressBar(value: number, level: number, maxLevel: number)`: Updates progress bar width and color
        -   `updateLevelEmojis(currentEmoji: string, nextEmoji: string)`: Updates level emoji displays
        -   `updateSoundButton(isEnabled: boolean)`: Updates sound button icon
    -   **Event Handlers**:
        -   `onStartButtonClick(handler: (e: Event) => void)`: Start button click handler
        -   `onRestartButtonClick(handler: (e: Event) => void)`: Restart button click handler
        -   `onRestartAdButtonClick(handler: (e: Event) => void)`: Ad restart button click handler
        -   `onSoundButtonClick(handler: (e: Event) => void)`: Sound toggle click handler
        -   `onPauseButtonClick(handler: (e: Event) => void)`: Pause button click handler
        -   `onResumeButtonClick(handler: (e: Event) => void)`: Resume button click handler
        -   `setupWindowEvents(onPause: () => void, onResume: () => void)`: Window focus/blur handlers

### SDK Module (`src/sdk.ts`)

The `SDKManager` class handles all interactions with the YaGames SDK.

-   **Core SDK Methods**:
    -   **`getSDK(): YaGamesSDK | undefined`**:
        -   Private method to get SDK instance
        -   Returns the current YaGames SDK instance if available
    -   **`startGameplay()`**:
        -   Starts gameplay tracking session via GameplayAPI
    -   **`stopGameplay()`**:
        -   Stops gameplay tracking session via GameplayAPI
    -   **`submitScore(score: number)`**:
        -   Submits score to leaderboard named 'leader'
        -   Checks method availability before submission
        -   Handles errors and logs results

-   **Advertisement Methods**:
    -   **`showRewardedVideo(callbacks)`**:
        -   Shows rewarded video advertisement
        -   Accepts callbacks for: onOpen, onRewarded, onClose, onError
        -   Returns boolean indicating if ad was shown
    -   **`showFullscreenAdv(callbacks)`**:
        -   Shows fullscreen interstitial advertisement
        -   Accepts callbacks for: onClose(wasShown), onOpen, onError
        -   Returns boolean indicating if ad was shown

-   **TypeScript Interfaces**:
    -   Defines YaGamesSDK interface for type safety
    -   Extends Window interface to include ysdk property
    -   Provides type definitions for all SDK methods and callbacks

### Audio Module (`src/audio.ts`)

The `AudioManager` class manages all audio-related functionality using the Web Audio API.

-   **Properties**:
    -   `audioContext`: Manages Web Audio API context
    -   `soundEnabled`: Controls global sound state

-   **Core Audio Methods**:
    -   **`init()`**:
        -   Initializes AudioContext if not exists
        -   Resumes AudioContext if suspended
    -   **`getAudioContext(): AudioContext`**:
        -   Private method to safely get AudioContext
        -   Throws error if context not initialized
    -   **`toggleSound(): boolean`**:
        -   Toggles sound state on/off
        -   Returns new sound state
    -   **`isSoundEnabled(): boolean`**:
        -   Returns current sound state

-   **Sound Generation**:
    -   **`playSpawnSound(size: number)`**:
        -   Generates sine wave sound for emoji spawn
        -   Frequency modulated by emoji size (880Hz / (size * 1.5))
        -   0.3s duration with 0.05s attack and fade out
    -   **`playClickSound()`**:
        -   Generates triangle wave sound (880Hz)
        -   0.15s duration with quick 0.02s attack
        -   Used for good emoji clicks
    -   **`playBadClickSound()`**:
        -   Generates sawtooth wave sound (220Hz)
        -   0.2s duration with 0.05s attack
        -   Harsher tone for bad emoji clicks
    -   **`playBonusClickSound()`**:
        -   Generates enhanced triangle wave sound (1320Hz)
        -   0.15s duration with quick 0.02s attack
        -   Higher frequency for bonus emoji clicks

-   **Sound Characteristics**:
    -   All sounds use gain nodes for amplitude control
    -   Each sound type has unique waveform and frequency
    -   Volume levels adjusted for sound type:
        - Spawn sounds: 0.1 gain
        - Good clicks: 0.2 gain
        - Bad clicks: 0.3 gain
        - Bonus clicks: 0.4 gain

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