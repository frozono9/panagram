import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { code } = await request.json();

	if (code === 'ANAGRAM2026') {
		cookies.set('access_granted', 'true', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 365 // 1 year
		});
		return json({ success: true });
	}

	return json({ success: false }, { status: 401 });
};
