import { error, json, type RequestHandler } from "@sveltejs/kit";
import google from 'googlethis';

export const GET: RequestHandler = async ({ url }) => {
    const query = url.searchParams.get("q");
    if (query == null)
        throw error(400);
    const images = await google.image(query, { safe: true });
    return json(images);
};