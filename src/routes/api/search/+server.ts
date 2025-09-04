import { error, json, type RequestHandler } from "@sveltejs/kit";
import google from 'googlethis';
import { triggerSearch } from "$lib/server/stores";

export const GET: RequestHandler = async ({ url }) => {
    const query = url.searchParams.get("q");
    if (query == null)
        throw error(400);
    
    // Trigger the state updates
    triggerSearch(query);
    
    const images = await google.image(query, { safe: true });
    return json(images);
};