"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GET_POST_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import { PostData, InitialPostList } from "@/types/postData";
import { getPageNumber, getPostListQuery } from '@/lib/postListQuery';
import CardList from "./CardList";
import PurposeInPractice from "./PurposeInPractice";
import NewsCardList from "./NewsCardList";
import JobListing from "@/components/CustomComponents/JobListing";

import Loader from "@/components/Elements/Loader";

interface SharedComponentProps {
    postData: PostData[];
    pageSlug?: string;
    totalPosts: number;
    itemsPerPage?: number;
}

export interface PostListProps {
    slug: string;
    pageSlug: string;
    component: string;
    itemsperpage: number;
    mode?: "server" | "client";
    initialData?: InitialPostList;
}

const componentMap: Record<string, React.ComponentType<SharedComponentProps>> = {
    CardList: CardList as React.ComponentType<SharedComponentProps>,
    PurposeInPractice: PurposeInPractice as React.ComponentType<SharedComponentProps>,
    NewsCardList: NewsCardList as React.ComponentType<SharedComponentProps>,
    JobListing: JobListing as React.ComponentType<SharedComponentProps>,
};

const PostList = ({
    slug,
    pageSlug,
    component,
    itemsperpage,
    mode = "client",
    initialData,
}: PostListProps) => {
    const searchParams = useSearchParams();
    const page = getPageNumber(searchParams.get('page'));
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const Limit = Number(itemsperpage) || 9;

    const query = getPostListQuery(slug, pageSlug, Limit, page, type);
    const hasInitialData = initialData?.query === query;
    const [postData, setPostData] = useState<PostData[]>(initialData?.posts || []);
    const [totalPosts, setTotalPosts] = useState<number>(initialData?.total ?? 0);
    const [isLoading, setIsLoading] = useState<boolean>(!hasInitialData);

    useEffect(() => {
        if (initialData?.query === query) {
            setPostData(initialData.posts);
            setTotalPosts(initialData.total);
            setIsLoading(false);
            return;
        }
        let isMounted = true;
        const url = `${GET_POST_ENDPOINT}?${query}`;

        const loadPosts = async () => {
            if (!slug) return;
            setIsLoading(true);
            try {
                const taxonomyInfo = await serverRequest({}, url, CONSTANTS.REQUEST_GET, mode);
                if (isMounted) {
                    if (taxonomyInfo && taxonomyInfo.code === CONSTANTS.STATUS_SUCCESS && Array.isArray(taxonomyInfo.data)) {
                        const currentData: PostData[] = [...taxonomyInfo.data];
                        const seen = new Set<string | number>();
                        const filtered = currentData.filter((item) => {
                            if (!item || !item.id) return false;
                            if (seen.has(item.id)) return false;
                            seen.add(item.id);
                            return true;
                        });
                        setPostData(filtered);
                        setTotalPosts(taxonomyInfo.total || filtered.length);
                    } else {
                        setPostData([]);
                        setTotalPosts(0);
                    }
                }
            } catch (error) {
                console.error(`[PostList:${mode}] Error:`, error);
                if (isMounted) {
                    setPostData([]);
                    setTotalPosts(0);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadPosts();

        return () => {
            isMounted = false;
        };
    }, [query, slug, category, mode, initialData]);

    const PostComponentRender = componentMap[component];

    return (
        <>
            {!hasInitialData && isLoading ? (
                <Loader minHeight="300px" text="Loading posts..." />
            ) : (
                PostComponentRender && (
                    <PostComponentRender
                        postData={hasInitialData ? initialData.posts : postData}
                        pageSlug={pageSlug}
                        totalPosts={hasInitialData ? initialData.total : totalPosts}
                        itemsPerPage={itemsperpage}
                    />
                )
            )}
        </>
    );
};

export default PostList;
