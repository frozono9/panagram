import { writable, type Writable } from "svelte/store";
import type { Category, ForceItem } from "./data/magicData";

export const forceSelection: Writable<ForceItem> = writable("37");
export const selectedCategory: Writable<Category | null> = writable(null);