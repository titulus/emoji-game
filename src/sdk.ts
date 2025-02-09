interface YaGamesSDK {
    features: {
        GameplayAPI?: {
            start: () => void;
            stop: () => void;
        };
    };
    adv?: {
        showRewardedVideo: (config: {
            callbacks: {
                onOpen?: () => void;
                onRewarded?: () => void;
                onClose?: () => void;
                onError?: (error: any) => void;
            };
        }) => void;
    };
    isAvailableMethod: (method: string) => Promise<boolean>;
    setLeaderboardScore: (leaderboardName: string, score: number) => Promise<void>;
}

declare global {
    interface Window {
        ysdk?: YaGamesSDK;
    }
}

export class SDKManager {
    private getSDK(): YaGamesSDK | undefined {
        return window.ysdk;
    }

    startGameplay() {
        const sdk = this.getSDK();
        if (sdk) {
            sdk.features.GameplayAPI?.start();
        }
    }

    stopGameplay() {
        const sdk = this.getSDK();
        if (sdk) {
            sdk.features.GameplayAPI?.stop();
        }
    }

    submitScore(score: number) {
        const sdk = this.getSDK();
        if (sdk) {
            sdk.isAvailableMethod('leaderboards.setLeaderboardScore')
                .then(isAvailable => {
                    if (isAvailable && sdk) {
                        sdk.setLeaderboardScore('leader', score)
                            .then(() => console.debug('Score submitted to leaderboard'))
                            .catch(err => console.error('Error submitting score:', err));
                    }
                })
                .catch(err => console.error('Error checking leaderboard availability:', err));
        }
    }

    showRewardedVideo(callbacks: {
        onOpen?: () => void;
        onRewarded?: () => void;
        onClose?: () => void;
        onError?: (error: any) => void;
    }): boolean {
        const sdk = this.getSDK();
        if (sdk?.adv && typeof sdk.adv.showRewardedVideo === 'function') {
            sdk.adv.showRewardedVideo({ callbacks });
            return true;
        }
        return false;
    }
} 