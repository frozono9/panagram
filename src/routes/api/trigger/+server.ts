import { type RequestHandler } from "@sveltejs/kit";

// In-memory storage for trigger state
let triggerTimestamp = 0;

export const GET: RequestHandler = async ({ url }) => {
    const timestampParam = url.searchParams.get('timestamp');
    
    if (timestampParam) {
        triggerTimestamp = parseInt(timestampParam);
    }
    
    const currentTime = Date.now();
    const isActive = (currentTime - triggerTimestamp) < 2000; // 2 seconds
    
    return new Response(isActive ? "true" : "false", {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Access-Control-Allow-Origin': '*'
        }
    });
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { timestamp } = body;
        
        if (timestamp) {
            triggerTimestamp = timestamp;
        } else {
            triggerTimestamp = Date.now();
        }
        
        return new Response("true", {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response("false", {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};
