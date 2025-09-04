// Server-side store to track the current category state
// This allows the /api/message endpoint to return the latest searched category

import type { Category } from '$lib/data/magicData';

interface CategoryState {
    searchTerm: string | null;
    category: Category | null;
    isAiGenerated: boolean;
    categoryName: string | null;
    timestamp: number;
}

let currentCategoryState: CategoryState = {
    searchTerm: null,
    category: null,
    isAiGenerated: false,
    categoryName: null,
    timestamp: 0
};

// Trigger state for search activity
let triggerState: boolean = false;
let triggerTimeout: NodeJS.Timeout | null = null;

export function updateCurrentCategory(
    searchTerm: string,
    category: Category | null,
    isAiGenerated: boolean,
    categoryName?: string
) {
    currentCategoryState = {
        searchTerm,
        category,
        isAiGenerated,
        categoryName: categoryName || searchTerm,
        timestamp: Date.now()
    };
    console.log('Updated server category state:', currentCategoryState);
}

export function getCurrentCategory(): CategoryState {
    return currentCategoryState;
}

export function getCurrentCategoryName(): string {
    return currentCategoryState.categoryName || currentCategoryState.searchTerm || 'unknown';
}

export function getTriggerState(): boolean {
    return triggerState;
}

export function triggerSearchActivity() {
    // Set trigger to true
    triggerState = true;
    
    // Clear any existing timeout
    if (triggerTimeout) {
        clearTimeout(triggerTimeout);
    }
    
    // Set timeout to reset to false after 2 seconds
    triggerTimeout = setTimeout(() => {
        triggerState = false;
        console.log('Trigger state reset to false');
    }, 2000);
    
    console.log('Trigger state set to true for 2 seconds');
}
