import { MAGIC_CATEGORIES } from "$lib/data/magicData.js";

export async function GET({ url }) {
    const searchTerm = url.searchParams.get("search") ?? "";
    const r = await fetch(
        "http://suggestqueries.google.com/complete/search?client=firefox&q=" +
        encodeURIComponent(searchTerm)
    );
    const json = await r.json();
    const googleResults: string[] = json[1].slice(0, 10);

    const categoryResults = getCategoryAutocomplete(searchTerm);

    // Deduplicate while preserving order: categories first, then google
    const seen = new Set<string>();
    const merged = [...categoryResults, ...googleResults].filter((item) => {
        const lower = item.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
    });

    return new Response(JSON.stringify(merged));
}


function getCategoryAutocomplete(query: string) {
    let searchResults = Object.keys(MAGIC_CATEGORIES).filter((category) => {
        const { question, setA, setB, searchTerms } = MAGIC_CATEGORIES[category];
        const haystacks = [category, question, ...setA, ...setB, ...searchTerms];

        const q = query.toLowerCase();
        return haystacks.some((s) => s.toLowerCase().includes(q));
    });
    return searchResults;
}
