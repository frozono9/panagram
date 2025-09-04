import { json, type RequestHandler } from "@sveltejs/kit";
import { triggerSearchActivity } from '$lib/serverStore';

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Trigger the search activity
        triggerSearchActivity();

        return json({ success: true });

    } catch (err) {
        console.error('Error in /api/trigger-activity:', err);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
};
