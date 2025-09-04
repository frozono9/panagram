import { type RequestHandler } from "@sveltejs/kit";

// For Vercel compatibility, we'll use URL parameters to pass state
export const GET: RequestHandler = async ({ url }) => {
    const category = url.searchParams.get('category') || "No category searched yet";
    return new Response(category, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
    });
};

// Allow POST to update the current category
export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { category } = body;
        
        return new Response(category || "No category searched yet", {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    } catch (error) {
        return new Response("No category searched yet", {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    }
};