import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const accessGranted = cookies.get('access_granted');
	return {
		hasAccess: accessGranted === 'true'
	};
};
