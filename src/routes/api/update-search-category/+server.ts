import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const { category } = body;
    
    if (typeof category === 'string') {
        // For Vercel compatibility, we return the data that should be stored client-side
        return json({ 
            success: true, 
            category,
            timestamp: Date.now()
        });
    }
    
    return json({ success: false, error: "Invalid category" }, { status: 400 });
};
