import { text, type RequestHandler } from "@sveltejs/kit";

// Simple in-memory store for serverless environment
// Note: This will reset on each function cold start, but works for immediate requests
let lastTriggerTime: number = 0;

/**
 * GET /api/trigger
 *
 * Returns "True" if triggered within last 2 seconds, otherwise "False"
 *
 * POST /api/trigger
 *
 * Triggers the state to "True" for 2 seconds
 *
 * Headers (optional):
 * - x-search-term: Search term (for context)
 * - x-category-key: Category key (for context)
 * - x-ai-generated: 'true' if AI-generated (for context)
 */
export const GET: RequestHandler = async ({ url }) => {
    try {
        const now = Date.now();
        const timeSinceLastTrigger = now - lastTriggerTime;

        // Return "True" if triggered within the last 2 seconds
        const isTriggered = timeSinceLastTrigger < 2000;

        return text(isTriggered ? "True" : "False");

    } catch (err) {
        console.error('Error in /api/trigger:', err);
        return text("False");
    }
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Set the trigger time to now
        lastTriggerTime = Date.now();

        // Return success response
        return text("True");

    } catch (err) {
        console.error('Error in /api/trigger POST:', err);
        return text("False");
    }
};
