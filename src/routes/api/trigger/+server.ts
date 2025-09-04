import { type RequestHandler } from "@sveltejs/kit";
import { getTriggerState } from "../../../lib/server/simpleState.js";

export const GET: RequestHandler = async () => {
    const triggered = getTriggerState();
    return new Response(triggered.toString(), {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
    });
};
