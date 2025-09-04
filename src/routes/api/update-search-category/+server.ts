import { json, type RequestHandler } from "@sveltejs/kit";
import { setCategory, activateTrigger } from "../../../lib/server/simpleState.js";

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const { category } = body;
    
    if (typeof category === 'string') {
        setCategory(category);
        activateTrigger(); // Activate trigger when category is updated
        return json({ success: true });
    }
    
    return json({ success: false, error: "Invalid category" }, { status: 400 });
};
