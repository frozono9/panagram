import { error, json, type RequestHandler } from "@sveltejs/kit";
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Category } from '$lib/data/magicData';
import { GEMINI_API_KEY } from '$env/static/private';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { searchTerm } = await request.json();
        
        if (!searchTerm) {
            throw error(400, 'Search term is required');
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
You are helping create a magic trick category based on a search term. Given the search term "${searchTerm}", create a category that can be used for a binary choice anagram game.

The category should have:
1. A question that creates a clear binary choice (like "Man-made or natural?" or "Sweet or savory?")
2. Two sets of 6 items each that fit the binary choice
3. Search terms that are relevant to the category

Please respond with ONLY a valid JSON object in this exact format:
{
    "question": "Binary choice question (Option A or Option B)?",
    "setA": ["Item1", "Item2", "Item3", "Item4", "Item5", "Item6"],
    "setB": ["Item1", "Item2", "Item3", "Item4", "Item5", "Item6"],
    "searchTerms": ["term1", "term2", "term3", "term4", "term5"]
}

The items should be:
- Single words or compound words (no spaces except for proper nouns like "New York")
- Searchable terms that will return good image results
- Clearly distinguishable between the two sets
- Related to the original search term "${searchTerm}"

Example for search term "music":
{
    "question": "Classical or modern?",
    "setA": ["Mozart", "Bach", "Beethoven", "Chopin", "Vivaldi", "Brahms"],
    "setB": ["Beatles", "Queen", "Drake", "Beyonce", "Adele", "EdSheeran"],
    "searchTerms": ["music", "songs", "artists", "musicians", "bands"]
}

Now create a category for: "${searchTerm}"
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean up the response - remove markdown code blocks if present
        text = text.trim();
        if (text.startsWith('```json')) {
            text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (text.startsWith('```')) {
            text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        try {
            const category = JSON.parse(text) as Category;
            
            // Validate the structure
            if (!category.question || !category.setA || !category.setB || !category.searchTerms) {
                throw new Error('Invalid category structure');
            }
            
            if (category.setA.length !== 6 || category.setB.length !== 6) {
                throw new Error('Each set must contain exactly 6 items');
            }
            
            return json(category);
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', text);
            throw error(500, 'Failed to generate valid category');
        }
        
    } catch (err) {
        console.error('Error generating category:', err);
        throw error(500, 'Failed to generate category');
    }
};
