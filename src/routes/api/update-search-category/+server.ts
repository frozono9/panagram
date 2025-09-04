import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const body = await request.json();
        const { category } = body;
        
        if (typeof category === 'string') {
            // Update the message endpoint with the new category
            await fetch('/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category })
            });
            
            // Update the trigger endpoint
            await fetch('/api/trigger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ timestamp: Date.now() })
            });
            
            return json({ 
                success: true, 
                category,
                timestamp: Date.now()
            });
        }
        
        return json({ success: false, error: "Invalid category" }, { status: 400 });
    } catch (error) {
        console.error('Error updating search category:', error);
        return json({ success: false, error: "Server error" }, { status: 500 });
    }
};
