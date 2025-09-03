import { redirect, type Load } from '@sveltejs/kit';
import google from 'googlethis';

/** @type {import('@sveltejs/kit').Load} */
export const load: Load = async ({ url }) => {
    const searchTerm = url.searchParams.get("q");
    if (searchTerm == null)
        throw redirect(300, "/");

    const images = await google.image(searchTerm, { safe: true });
    const matchingImageId = images[0].id;

    throw redirect(303, `https://www.google.com/search?tbm=isch&q=${searchTerm}&imgrc=${matchingImageId}`)
}