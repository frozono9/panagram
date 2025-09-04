import { writable, type Writable } from "svelte/store";
import type { Category } from "./data/magicData";

export const selectedCategory: Writable<Category | null> = writable(null);

// Store for the latest searched category name (for /api/message endpoint)
export const latestSearchedCategory: Writable<string> = writable("");

// Store for the trigger state (for /api/trigger endpoint)
export const triggerState: Writable<boolean> = writable(false);