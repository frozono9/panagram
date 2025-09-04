import { type RequestHandler } from "@sveltejs/kit";

// Use global variable that persists during function lifetime
let globalCategory = "No category searched yet";

export const GET: RequestHandler = async ({ url }) => {
    // Check if we have a category parameter (for direct updates from other functions)
    const categoryParam = url.searchParams.get('category');
    if (categoryParam) {
        globalCategory = categoryParam;
    }
    
    return new Response(globalCategory, {
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
        const { category } = body;
        
        if (category) {
            globalCategory = category;
        }
        
        return new Response(globalCategory, {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(globalCategory, {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};