import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const access = cookies.get('site_access');
  
  return {
    isAuthenticated: access === 'granted'
  };
};
