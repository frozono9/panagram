import { writable, type Writable } from "svelte/store";
import type { Category } from "./data/magicData";

export const selectedCategory: Writable<Category | null> = writable(null);