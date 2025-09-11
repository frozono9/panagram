import { COOKIE_NAME } from '$lib/server/data';
import { redirect, error, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ params, cookies, url }) => {
    const key = params.userKey ?? null;

    if (!(await isValidKey(key))) {
        throw redirect(401, "https://images.google.com");
    }

    cookies.set(COOKIE_NAME, '1', {
        path: '/',
        httpOnly: true,      // not readable by client JS
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60 * 24 * 30 // 30 days?  We can have it expire instrantly
    });

    // redirect back to homepage, which will now work because of cookie
    throw redirect(303, "/");
};

async function isValidKey(key: string | null): Promise<boolean> {
    if (!key)
        return false;



    return true;
}