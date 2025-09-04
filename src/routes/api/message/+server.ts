import { type RequestHandler } from "@sveltejs/kit";
import { getLatestCategory } from "$lib/server/stores";

export const GET: RequestHandler = async () => {
    const category = getLatestCategory();
    return new Response(category, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};
