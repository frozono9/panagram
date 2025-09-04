// Server-side global state management for Vercel deployment
// Uses file-based persistence to work across serverless function invocations

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const STATE_FILE = '/tmp/app-state.json';

interface AppState {
    latestSearchedCategory: string;
    triggerState: boolean;
    triggerTimestamp: number;
}

class GlobalState {
    private getState(): AppState {
        try {
            if (existsSync(STATE_FILE)) {
                const data = readFileSync(STATE_FILE, 'utf-8');
                const state = JSON.parse(data) as AppState;
                
                // Check if trigger should be reset (more than 2 seconds old)
                if (state.triggerState && Date.now() - state.triggerTimestamp > 2000) {
                    state.triggerState = false;
                    this.saveState(state);
                }
                
                return state;
            }
        } catch (error) {
            console.error('Error reading state file:', error);
        }
        
        return {
            latestSearchedCategory: "No category searched yet",
            triggerState: false,
            triggerTimestamp: 0
        };
    }

    private saveState(state: AppState): void {
        try {
            writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
        } catch (error) {
            console.error('Error saving state file:', error);
        }
    }

    setLatestSearchedCategory(category: string) {
        const state = this.getState();
        state.latestSearchedCategory = category || "No category searched yet";
        this.saveState(state);
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
        const state = this.getState();
        state.triggerState = true;
        state.triggerTimestamp = Date.now();
        this.saveState(state);
    }
}

// Export a singleton instance
export const globalState = new GlobalState();
