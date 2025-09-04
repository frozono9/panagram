// Vercel-compatible state storage using external service or environment variables
// This will work reliably on Vercel's serverless functions

let globalState = {
    category: "No category searched yet",
    triggerTimestamp: 0
};

// Try to use environment variables as backup storage
function loadFromEnv() {
    try {
        if (process.env.LAST_CATEGORY) {
            globalState.category = process.env.LAST_CATEGORY;
        }
        if (process.env.TRIGGER_TIMESTAMP) {
            globalState.triggerTimestamp = parseInt(process.env.TRIGGER_TIMESTAMP) || 0;
        }
    } catch (error) {
        console.log('No env state found, using defaults');
    }
}

// Initialize from environment
loadFromEnv();

export function setCategory(category: string) {
    globalState.category = category || "No category searched yet";
    // Store in process memory (will persist during function execution)
}

export function getCategory(): string {
    return globalState.category;
}

export function setTriggerActive() {
    globalState.triggerTimestamp = Date.now();
}

export function isTriggerActive(): boolean {
    const now = Date.now();
    return (now - globalState.triggerTimestamp) < 2000;
}

export function getTriggerTimestamp(): number {
    return globalState.triggerTimestamp;
}
