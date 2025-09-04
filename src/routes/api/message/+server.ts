import { type RequestHandler } from "@sveltejs/kit";
import { globalState } from "../../../lib/server/globalState.js";

export const GET: RequestHandler = async () => {
    const category = globalState.getLatestSearchedCategory();
    return new Response(category, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};