import { json, type RequestHandler } from "@sveltejs/kit";
import { getLatestCategory } from "$lib/server/stores";

export const GET: RequestHandler = async () => {
    const category = getLatestCategory();
    return json({ category });
};
