import { json, type RequestHandler } from "@sveltejs/kit";
import { updateCurrentCategory } from '$lib/serverStore';
import { MAGIC_CATEGORIES, type Category } from '$lib/data/magicData';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { searchTerm, category, isAiGenerated } = await request.json();
        
        let categoryName: string = searchTerm;
        
        if (isAiGenerated) {
            // For AI-generated categories, use the original search term as category name
            categoryName = searchTerm;
        } else if (category) {
            // For MAGIC_CATEGORIES, find the category key
            const categoryKey = Object.keys(MAGIC_CATEGORIES).find(key => {
                const magicCategory = MAGIC_CATEGORIES[key];
                return JSON.stringify(magicCategory) === JSON.stringify(category);
            });
            categoryName = categoryKey || searchTerm;
        }

        // Update the server-side store
        updateCurrentCategory(searchTerm, category, isAiGenerated, categoryName);

        return json({ success: true, categoryName });

    } catch (err) {
        console.error('Error in /api/update-category:', err);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
};
