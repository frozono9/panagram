// Entropy calculation for progressive anagram
function entropy(c: number, n: number): number {
    if (c === 0 || c === n) return 0;
    const p = c / n;
    return -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
}

type LetterStats = {
    letter: string;
    count: number;
    entropy: number;
};

// Find the best letter to ask about next
export function bestSplitLetter(words: string[], askedLetters: Set<string>): string | null {
    const n = words.length;
    const counts: Record<string, number> = {};

    for (const word of words) {
        const uniqueChars = new Set(word.toLowerCase());
        for (const char of uniqueChars) {
            if (/[a-z]/.test(char)) {
                counts[char] = (counts[char] ?? 0) + 1;
            }
        }
    }

    const candidates: LetterStats[] = [];
    for (const [char, count] of Object.entries(counts)) {
        if (count > 0 && count < n && !askedLetters.has(char)) {
            candidates.push({
                letter: char,
                count,
                entropy: entropy(count, n),
            });
        }
    }

    if (candidates.length === 0) return null;

    // Sort by entropy (desc), then count (desc), then alphabetically (asc)
    candidates.sort((a, b) => {
        if (b.entropy !== a.entropy) return b.entropy - a.entropy;
        if (b.count !== a.count) return b.count - a.count;
        return a.letter.localeCompare(b.letter);
    });

    return candidates[0].letter;
}
