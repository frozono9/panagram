// Simple state management that works reliably on Vercel
// Uses a combination of server memory and client coordination

let lastSearchedCategory = "No category searched yet";
let triggerState = false;
let triggerTimestamp = 0;

export function setCategory(category: string) {
    lastSearchedCategory = category || "No category searched yet";
}

export function getCategory(): string {
    return lastSearchedCategory;
}

export function activateTrigger() {
    triggerState = true;
    triggerTimestamp = Date.now();
}

export function getTriggerState(): boolean {
    // Auto-reset after 2 seconds
    if (triggerState && Date.now() - triggerTimestamp > 2000) {
        triggerState = false;
    }
    return triggerState;
}
