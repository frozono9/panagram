import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request, url }) => {
    const params = url.searchParams;
    // here we want to generate the three character license key.
    // THis API route will be used (server side!) to generate new keys, and store them in the database when a user purchases a copy.  This can either be a purchase system we build, or build it into some retailer's system.

    // The logic here is as follows
    /* If there's some verification (an API key, for example, can be passed in in headers, or even a URL param) to ensure no one can just create license keys
    - Generate a new key
    - Store it in the database, along with the user's info
    - Done!

    Alternitively, if we were to self-publish, we could use a vendor's license key system.  For example, jumps uses gumroad, and gumroad can generate and validate license keys:
    - Vendor will generate a long license key
    - The user can go to googieimages.com/activate, and enter their long license key
    - This route will be called to validate that the license key: 1) Hasn't been activated yet, and 2) is actually valid/issued by the vendor
    - This will return a short key (3-4 chars, maybe even an easily remembered 4 letter word?)
    - This key will be added to the DB, associated with their generated license key.
    - Then, good to go!  Because the long license key will be in their email upon purchase, they can always go back to that page to see what their short key is, if they forget it.
    - If they enter a license key with a short key already associated, show that short key
    */
    return new Response();
};