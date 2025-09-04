import { error, text, type RequestHandler } from "@sveltejs/kit";
import { getCurrentCategoryName } from '$lib/serverStore';

export const GET: RequestHandler = async ({ url }) => {
    try {
        // Get the current category from the server-side store
        const categoryName = getCurrentCategoryName();

        return text(categoryName);

    } catch (err) {
        console.error('Error in /api/message:', err);
        throw error(500, 'Internal server error');
    }
};
