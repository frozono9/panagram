import { json, type RequestHandler } from "@sveltejs/kit";
import { updateLatestCategory } from "$lib/server/stores";

export const POST: RequestHandler = async ({ request }) => {
    const { category } = await request.json();
    
    if (typeof category === 'string') {
        updateLatestCategory(category);
        return json({ success: true });
    }
    
    return json({ success: false, error: 'Invalid category' }, { status: 400 });
};
