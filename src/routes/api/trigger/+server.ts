import { text, type RequestHandler } from "@sveltejs/kit";
import { getTriggerState } from '$lib/serverStore';

export const GET: RequestHandler = async ({ url }) => {
    try {
        // Get the current trigger state from the server-side store
        const triggerState = getTriggerState();

        return text(triggerState ? "True" : "False");

    } catch (err) {
        console.error('Error in /api/trigger:', err);
        return text("False");
    }
};
