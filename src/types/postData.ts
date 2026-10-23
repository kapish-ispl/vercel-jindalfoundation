export interface InitialPostList {
    posts: PostData[];
    total: number;
    query: string;
}

export type InitialPostLists = Record<string, InitialPostList>;

export interface PostData {
    slug: string;
    id: string | number;
    title?: string;
    description?: string;
    featuredMedia: {
        type: 'image' | 'video' | string;
        cdnPath: string;
        length: number;
    };
    media?: {
        type: 'image' | 'attachment';
        cdnPath: string;
        caption?: string | null;
        posterImage?: string | null;
        extension?: string;
    }[];
    postingDate?: string;
    metaInfo: {
        award_year?: string;
        type?: string | [] | undefined;
        video_url?: string;
        link?: string;
        category?: string | [] | undefined;
    };
}
