import { error, text, type RequestHandler } from "@sveltejs/kit";
import { MAGIC_CATEGORIES, findCategoryBySearchTerm } from '$lib/data/magicData';

/**
 * GET /api/message
 *
 * Returns the current category name as plain text.
 *
 * Query Parameters:
 * - q: Search term
 * - category: Category key (for MAGIC_CATEGORIES)
 * - ai: 'true' if AI-generated category
 *
 * Headers (alternative to query params):
 * - x-search-term: Search term
 * - x-category-key: Category key
 * - x-ai-generated: 'true' if AI-generated
 *
 * Examples:
 * GET /api/message?q=movies&category=movies&ai=false → "movies"
 * GET /api/message?q=science&ai=true → "science"
 */
export const GET: RequestHandler = async ({ url, request, cookies }) => {
    try {
        // Try to get parameters from query string first
        let searchTerm = url.searchParams.get('q');
        let categoryKey = url.searchParams.get('category');
        let isAiGenerated = url.searchParams.get('ai') === 'true';

        // If no query parameters, try to get from headers (for programmatic access)
        if (!searchTerm) {
            searchTerm = request.headers.get('x-search-term') || null;
        }
        if (!categoryKey) {
            categoryKey = request.headers.get('x-category-key') || null;
        }
        if (!isAiGenerated && request.headers.get('x-ai-generated') === 'true') {
            isAiGenerated = true;
        }

        // If still no parameters, try to get from cookies (for direct access)
        if (!searchTerm && !categoryKey && !isAiGenerated) {
            const cookieData = cookies.get('current_category');
            if (cookieData) {
                try {
                    const parsed = JSON.parse(cookieData);
                    searchTerm = parsed.searchTerm;
                    categoryKey = parsed.categoryKey;
                    isAiGenerated = parsed.isAiGenerated;
                } catch (e) {
                    // Invalid cookie data, ignore
                }
            }
        }

        // If still no parameters, return unknown
        if (!searchTerm && !categoryKey && !isAiGenerated) {
            return text('unknown');
        }

        let categoryName: string = 'unknown';

        if (isAiGenerated && searchTerm) {
            // For AI-generated categories, use the original search term as category name
            categoryName = searchTerm;
        } else if (categoryKey) {
            // For MAGIC_CATEGORIES, use the category key (e.g., "movies", "landmarks")
            categoryName = categoryKey;
        } else if (searchTerm) {
            // Try to find category by search term
            const foundCategory = findCategoryBySearchTerm(searchTerm);
            if (foundCategory) {
                // Find the key in MAGIC_CATEGORIES that matches this category
                const matchingKey = Object.keys(MAGIC_CATEGORIES).find(key =>
                    MAGIC_CATEGORIES[key] === foundCategory
                );
                categoryName = matchingKey || searchTerm;
            } else {
                // Fallback to search term if no category found
                categoryName = searchTerm;
            }
        }

        return text(categoryName);

    } catch (err) {
        console.error('Error in /api/message:', err);
        return text('unknown');
    }
};