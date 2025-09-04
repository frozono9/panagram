import { type RequestHandler } from "@sveltejs/kit";
import { getTriggerState } from "$lib/server/stores";

export const GET: RequestHandler = async () => {
    const state = getTriggerState();
    return new Response(state ? 'True' : 'False', {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};
