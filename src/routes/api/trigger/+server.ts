import { type RequestHandler } from "@sveltejs/kit";
import { globalState } from "../../../lib/server/globalState.js";

export const GET: RequestHandler = async () => {
    const triggered = globalState.getTriggerState();
    return new Response(triggered.toString(), {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};
