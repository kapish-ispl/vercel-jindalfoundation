
"use client";
import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, DOMNode } from 'html-react-parser';
import dynamic from 'next/dynamic';
import CMSImage from '../CustomComponents/CMSImage';
import StateOperationsSlider from '../CustomComponents/StateOperationsSlider';
import AreaOfOperationsSection from '../CustomComponents/AreaOfOperationsSection';
import HealthInitiativeSection from '../CustomComponents/HealthInitiativeSection';
import Area from '../CustomComponents/Area';
import StackSlider from '../CustomComponents/StackSlider';
import { PostListProps } from '../CustomComponents/PostList';

import Loader from '../Elements/Loader';

const CustomContentSlider = dynamic(() => import('@/components/CustomComponents/CustomContentSlider'), { ssr: false });
const CustomTabs = dynamic(() => import('@/components/CustomComponents/CustomTabs'), { ssr: false });
const PostList = dynamic(() => import("@/components/CustomComponents/PostList"), {
    ssr: false,
    loading: () => <Loader minHeight="250px" text="Loading posts..." />
});
const CustomApproach = dynamic(() => import("@/components/CustomComponents/CustomApproach"), { ssr: false });
const WalkingFootsteps = dynamic(() => import("@/components/CustomComponents/WalkingFootsteps"), { ssr: false });
const VideoSection = dynamic(() => import("@/components/CustomComponents/VideoSection"), { ssr: false });
const HeadlinesSection = dynamic(() => import("@/components/CustomComponents/HeadlinesSection"), { ssr: false });
const MediaSection = dynamic(() => import("@/components/CustomComponents/MediaSection"), { ssr: false });
const CustomCounter = dynamic(() => import("@/components/CustomComponents/CustomCounter"), { ssr: false });
const StateFootprintScroll = dynamic(() => import("@/components/CustomComponents/StateFootprintScroll"), { ssr: false });
const JobForm = dynamic(() => import("@/components/Forms/JobForm"), {
    ssr: false,
    loading: () => <Loader minHeight="400px" text="Loading form..." />
});
const PageTemplate = ({ data }: any) => {
    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.attribs) {
                if (!domNode.attribs) {
                    return;
                }
                if (domNode.name == "animatedcounters") {
                    // const props = attributesToProps(domNode.attribs);
                    //return <Header {...props} />;
                }
                if (domNode.name === "img") {
                    const props = attributesToProps(domNode.attribs);
                    return <CMSImage {...props} />;
                }
                if (domNode.name == "custompost") {
                    const props = attributesToProps(domNode.attribs);
                    const postData: PostListProps = {
                        slug: String(props.slug ?? ''),
                        component: String(props.component ?? ''),
                        itemsperpage: Number(props.itemsperpage ?? 9),
                        pageSlug: data?.slug || '',
                    };
                    return <PostList {...postData} />;
                }
                if (domNode.name == "customcontentslider") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomContentSlider {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "jobform") {
                    // const props = attributesToProps(domNode.attribs);
                    // const children = domToReact(domNode.children as DOMNode[]);
                    return <JobForm />;
                }

                if (domNode.name == "walkingfootsteps") {
                    const props = attributesToProps(domNode.attribs);
                    return <WalkingFootsteps {...props} />;
                }

                if (domNode.name == "headlinessection") {
                    const props = attributesToProps(domNode.attribs);
                    return <HeadlinesSection {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name == "mediaarticles") {
                    const props = attributesToProps(domNode.attribs);
                    return <MediaSection {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name == "videosection") {
                    const props = attributesToProps(domNode.attribs);
                    return <VideoSection {...props} />;
                }
                if (domNode.name === "customtabs") {
                    return <CustomTabs data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "customapproach") {
                    return <CustomApproach data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name == "statefootprintscroll") {
                    const props = attributesToProps(domNode.attribs);
                    return <StateFootprintScroll {...props} />;
                }
                if (domNode.name === "customcounter") {
                    return <CustomCounter data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "stateoperationslider") {
                    return <StateOperationsSlider />;
                }
                if (domNode.name === "mangadiv") {
                    return <AreaOfOperationsSection />;
                }
                if (domNode.name === "healthinitaitve") {
                    return <HealthInitiativeSection />;
                }
                if (domNode.name === "area") {
                    return <Area />;
                }
                if (domNode.name == "stackslider") {
                    const props = attributesToProps(domNode.attribs);
                    return <StackSlider {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }

                if (domNode.name === "areaofoperation") {
                    return <AreaOfOperationsSection />;
                }
            }
            return null;
        },
        htmlparser2: {
            lowerCaseTags: false,
            xmlMode: true,
        },
    }
    return (
        <>
            {parse(data.content, options)}
        </>
    );
}

export default PageTemplate;