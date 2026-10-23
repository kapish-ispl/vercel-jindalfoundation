"use client";

import { GET_SPECIFIC_POST_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InnerBanner from "../Elements/InnerBanner";
import Publications from "@/components/Slug/Publications";

const PostDetails = (props: any) => {
    const router = useRouter();
    const [detailData, setDetailData] = useState<any>(null);

    useEffect(() => {
        const getData = async () => {
            if (props.slug !== '') {
                const taxonomyInfo = await serverRequest(
                    {},
                    `${GET_SPECIFIC_POST_ENDPOINT}?slug=${props.slug}&excludeUrl=1`,
                    CONSTANTS.REQUEST_GET
                );
                if (taxonomyInfo && taxonomyInfo.data.length === 0) {
                    router.push(`/${props.parentSlug}`);
                } else {
                    setDetailData(taxonomyInfo.data);
                }
            } else {
                router.push(`/${props.parentSlug}`);
            }
        };

        getData();
    }, [props.parentSlug, props.slug, router]);


    const renderComponent = () => {
        if (!detailData) return null;

        switch (props.parentSlug) {
            case "publications":
                return <Publications data={detailData} />;
            default:
                return <p>Not Found</p>;
        }
    };

    return (
        <>
            {detailData !== null &&
                <div className="container-fluid generic_bottom_spacer">
                    <div className="row">
                        <div className="col-12 p-0">
                            <InnerBanner
                                label={detailData.title}
                                slug={detailData.slug}
                                currentPage={detailData}
                                innerBanner={detailData.media}
                                tagline={detailData.customField?.tagline}
                            />
                        </div>
                    </div>
                </div>
            }
            {detailData && renderComponent()}
        </>
    );
};

export default PostDetails;
