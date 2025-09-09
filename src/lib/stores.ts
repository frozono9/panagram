import { writable, type Writable } from "svelte/store";
import type { Category } from "./data/magicData";

export const selectedCategory: Writable<Category | null> = writable(null);

// Store for tracking the latest searched category name (for /message endpoint)
export const latestSearchedCategory: Writable<string> = writable('');

// Store for trigger state (for /api/trigger endpoint)
export const triggerState: Writable<boolean> = writable(false);

// Store for selected language
export const selectedLanguage: Writable<string> = writable('auto');

// Available languages
export const LANGUAGES = {
	'en': 'English',
	'es': 'Español',
	'fr': 'Français',
	'de': 'Deutsch',
	'it': 'Italiano',
	'pt': 'Português',
	'ja': '日本語',
	'ko': '한국어',
	'zh': '中文'
};