// Simple in-memory store for server-side state
let latestSearchedCategory = 'No category searched yet';
let triggerState = false;
let triggerTimeout: NodeJS.Timeout | null = null;
let lastUpdateTime = 0;

export function updateLatestCategory(category: string) {
    latestSearchedCategory = category;
}

export function getLatestCategory(): string {
    return latestSearchedCategory;
}

export function setTriggerState(state: boolean) {
    if (triggerTimeout) {
        clearTimeout(triggerTimeout);
        triggerTimeout = null;
    }
    
    triggerState = state;
    
    if (state) {
        // Auto reset to false after 2 seconds
        triggerTimeout = setTimeout(() => {
            triggerState = false;
            triggerTimeout = null;
        }, 2000);
    }
}

export function getTriggerState(): boolean {
    return triggerState;
}

// This is called by the search API but we want to avoid triggering for every individual query
// when a category has multiple search terms
export function triggerSearch(query: string) {
    const now = Date.now();
    // Only update if it's been more than 100ms since last update to avoid multiple rapid triggers
    if (now - lastUpdateTime > 100) {
        // Don't update category here as it's better handled by the explicit update endpoint
        setTriggerState(true);
        lastUpdateTime = now;
    }
}
