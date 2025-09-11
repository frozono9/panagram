import { COOKIE_NAME } from '$lib/server/data';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ cookies, url }) => {
    const hasAccess = cookies.get(COOKIE_NAME) === '1';
    if (!hasAccess) {
        throw redirect(302, "https://images.google.com");
    }

    // no cookie? redirected above. With cookie? render page as normal.
    return {};
};
