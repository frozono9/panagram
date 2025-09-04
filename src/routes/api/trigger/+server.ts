import { type RequestHandler } from "@sveltejs/kit";

// For Vercel compatibility, use timestamp-based trigger state
export const GET: RequestHandler = async ({ url }) => {
    const timestamp = url.searchParams.get('timestamp');
    
    if (!timestamp) {
        return new Response("false", {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    }
    
    const triggerTime = parseInt(timestamp);
    const currentTime = Date.now();
    const isActive = (currentTime - triggerTime) < 2000; // 2 seconds
    
    return new Response(isActive ? "true" : "false", {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
    });
};

// Allow POST to activate trigger
export const POST: RequestHandler = async () => {
    const timestamp = Date.now().toString();
    return new Response(JSON.stringify({ timestamp, triggered: true }), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
    });
};
