// Server-side global state management for Vercel deployment
// Using a simple approach that works reliably on Vercel

interface AppState {
    latestSearchedCategory: string;
    triggerState: boolean;
    triggerTimestamp: number;
}

// Use environment variable or simple memory storage
let globalAppState: AppState = {
    latestSearchedCategory: "No category searched yet",
    triggerState: false,
    triggerTimestamp: 0
};

class GlobalState {
    private getState(): AppState {
        // Check if trigger should be reset (more than 2 seconds old)
        if (globalAppState.triggerState && Date.now() - globalAppState.triggerTimestamp > 2000) {
            globalAppState.triggerState = false;
        }
        
        return { ...globalAppState };
    }

    setLatestSearchedCategory(category: string) {
        globalAppState.latestSearchedCategory = category || "No category searched yet";
    }

    getLatestSearchedCategory(): string {
        const state = this.getState();
        return state.latestSearchedCategory;
    }

    getTriggerState(): boolean {
        const state = this.getState();
        return state.triggerState;
    }

    activateTrigger() {
        globalAppState.triggerState = true;
        globalAppState.triggerTimestamp = Date.now();
    }

    // Reset state (useful for testing)
    reset() {
        globalAppState = {
            latestSearchedCategory: "No category searched yet",
            triggerState: false,
            triggerTimestamp: 0
        };
    }
}

// Export a singleton instance
export const globalState = new GlobalState();
