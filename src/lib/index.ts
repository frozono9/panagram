
export type ImageResult = {
    id: string;
    url: string;
    width: number;
    height: number;
    color: string | null;
    preview: {
        url: string;
        width: number;
        height: number;
    };
    origin: {
        title: string;
        website: {
            name: string
        }
    }
};