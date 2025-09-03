import { error, json, type RequestHandler } from "@sveltejs/kit";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "$env/dynamic/private";

export const POST: RequestHandler = async ({ request }) => {
    const { searchTerm } = await request.json();
    
    if (!searchTerm) {
        throw error(400, 'Search term is required');
    }

    if (!env.GEMINI_API_KEY) {
        throw error(500, 'Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Create a magic trick category for the search term "${searchTerm}". 

The category should contain:
1. A binary question that divides items into two groups (A or B, left or right column)
2. Set A: 6 items that answer the first part of the question
3. Set B: 6 items that answer the second part of the question
4. Search terms: relevant keywords for this category

IMPORTANT REQUIREMENTS:
- The items should be relatively general (for example, not computer models but brands), recognizable things that people can easily identify in images
- The question should be clear and binary and easy for anyone to answer, even without specific knowledge of the topic (e.g., "Male or female?", "Hot or cold?", "Natural or artificial?")
- Items should be single words or very short phrases (no spaces if possible, use camelCase)
- Items should be visually distinct and easily searchable in Google Images
- The two sets should be clearly different and mutually exclusive

Return ONLY a valid JSON object in this exact format (no markdown, no extra text):
{
  "question": "Binary question (A or B)?",
  "setA": ["Item1", "Item2", "Item3", "Item4", "Item5", "Item6"],
  "setB": ["Item1", "Item2", "Item3", "Item4", "Item5", "Item6"],
  "searchTerms": ["term1", "term2", "term3", "term4", "term5"]
}

Examples:
- For "cars": {"question": "Luxury or economy?", "setA": ["Ferrari", "Lamborghini", "RollsRoyce", "Porsche", "Bentley", "Maserati"], "setB": ["Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Hyundai"], "searchTerms": ["car", "vehicle", "automobile", "transport", "driving"]}
- For "music": {"question": "Classical or modern?", "setA": ["Mozart", "Beethoven", "Bach", "Chopin", "Vivaldi", "Brahms"], "setB": ["BTS", "TaylorSwift", "Drake", "Adele", "EdSheeran", "Beyonce"], "searchTerms": ["music", "song", "artist", "musician", "singer"]}
- For "flowers": {"question": "Red or other colors?", "setA": ["Rose", "Tulip", "Poppy", "Carnation", "Hibiscus", "Geranium"], "setB": ["Sunflower", "Daisy", "Violet", "Lily", "Orchid", "Lavender"], "searchTerms": ["flower", "bloom", "garden", "nature", "plant"]}`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        // Clean up the response - sometimes it includes markdown formatting
        let cleanedText = text.trim();
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        // Parse the JSON response
        const categoryData = JSON.parse(cleanedText);
        
        // Validate the structure
        if (!categoryData.question || !categoryData.setA || !categoryData.setB || !categoryData.searchTerms) {
            throw new Error('Invalid category structure generated');
        }

        if (!Array.isArray(categoryData.setA) || !Array.isArray(categoryData.setB) || !Array.isArray(categoryData.searchTerms)) {
            throw new Error('Invalid array types in category data');
        }

        if (categoryData.setA.length !== 6 || categoryData.setB.length !== 6) {
            throw new Error('Invalid set sizes generated');
        }

        return json(categoryData);
    } catch (err) {
        console.error('Error generating category:', err);
        throw error(500, 'Failed to generate category: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
};
