import type { ImageResult } from '$lib';
import { redirect, type Load } from '@sveltejs/kit';
import google from 'googlethis';

/** @type {import('@sveltejs/kit').Load} */
export const load: Load = async ({ url }) => {
    const searchTerm = url.searchParams.get("q");
    if (searchTerm == null)
        throw redirect(300, "/");

    const images = await google.image(searchTerm, { safe: true }) as unknown as ImageResult[]

    return { images };
}