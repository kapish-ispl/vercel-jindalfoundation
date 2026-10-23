"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GET_POST_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import { PostData } from "@/types/postData";
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
}: PostListProps) => {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const Limit = Number(itemsperpage) || 9;

    const [postData, setPostData] = useState<PostData[]>([]);
    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;
        let slugInfo = slug;

        if (pageSlug === "news") {
            if (!type) {
                slugInfo += `&metaInfo[type_1602134867]=Media Coverage`;
            } else {
                slugInfo += `&metaInfo[type_1602134867]=${type}`;
            }
        }

        if (pageSlug === "publications") {
            const selectedType = type || "Success Stories";
            slugInfo += `&metaInfo[category_1761552186]=${selectedType}`;
        }

        if (pageSlug === "gallery" || slug === "gallery") {
            const selectedType = type || "photo";
            slugInfo += `&metaInfo[type_1617597580]=${selectedType}`;
        }

        const pageNum = parseInt(String(page) || "1", 10);
        const itemsLimit = Number(Limit) || 9;
        const offsetParam = pageNum > 1 ? `&offset=${(pageNum - 1) * itemsLimit}` : "";
        const url = `${GET_POST_ENDPOINT}?slug=${slugInfo}&limit=${itemsLimit}${offsetParam}&excludeUrl=1`;

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
    }, [page, slug, type, category, pageSlug, Limit, mode]);

    const PostComponentRender = componentMap[component];

    return (
        <>
            {isLoading ? (
                <Loader minHeight="300px" text="Loading posts..." />
            ) : (
                PostComponentRender && (
                    <PostComponentRender
                        postData={postData}
                        pageSlug={pageSlug}
                        totalPosts={totalPosts}
                        itemsPerPage={itemsperpage}
                    />
                )
            )}
        </>
    );
};

export default PostList;