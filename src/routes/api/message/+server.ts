import { type RequestHandler } from "@sveltejs/kit";
import { getCategory } from "../../../lib/server/simpleState.js";

export const GET: RequestHandler = async () => {
    const category = getCategory();
    return new Response(category, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
    });
};