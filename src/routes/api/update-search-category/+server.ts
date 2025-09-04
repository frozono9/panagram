import { json, type RequestHandler } from "@sveltejs/kit";
import { globalState } from "../../../lib/server/globalState.js";

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const { category } = body;
    
    if (typeof category === 'string') {
        globalState.setLatestSearchedCategory(category);
        globalState.activateTrigger(); // Activate trigger when category is updated
        return json({ success: true });
    }
    
    return json({ success: false, error: "Invalid category" }, { status: 400 });
};
