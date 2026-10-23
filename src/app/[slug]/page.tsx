import { notFound, redirect } from "next/navigation";

import { GET_SPECIFIC_PAGE_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import InnerBanner from '@/components/Elements/InnerBanner';
import PageTemplate from "@/components/Templates/PageTemplate";
import { getPageMetadata } from "@/lib/metadata";
import { Metadata } from "next";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  return getPageMetadata({
    slug,
    endpoint: GET_SPECIFIC_PAGE_ENDPOINT,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug.toLowerCase() === 'home') {
    redirect('/');
  }

  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=${slug}&excludeUrl=1`,
    CONSTANTS.REQUEST_GET,
    'server'
  );

  if (!fetchedInfo || !fetchedInfo.data || fetchedInfo.data.length === 0) {
    return notFound();
  }

  return (
    <>
      <div className="container-fluid generic_bottom_spacer">
        <div className="row">
          <div className="col-12 p-0">
            <InnerBanner
              label={fetchedInfo.data.title}
              slug={fetchedInfo.data.slug}
              currentPage={fetchedInfo.data}
              innerBanner={fetchedInfo.data.media}
              tagline={fetchedInfo.data.customField?.tagline}
            />
          </div>
        </div>
      </div>
      <PageTemplate data={fetchedInfo.data} />
    </>
  );
}


