import { notFound, permanentRedirect } from "next/navigation";

import { GET_SPECIFIC_PAGE_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import InnerBanner from '@/components/Elements/InnerBanner';
import PageTemplate from "@/components/Templates/PageTemplate";
import { getPageMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { getInitialPostLists } from "@/lib/getInitialPostLists";
import { type PageSearchParams } from "@/lib/postListQuery";
import Link from 'next/link';


export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<PageSearchParams>;
}): Promise<Metadata> {
  const { slug } = await params;

  return getPageMetadata({
    slug,
    endpoint: GET_SPECIFIC_PAGE_ENDPOINT,
    searchParams: await searchParams,
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<PageSearchParams>;
}) {
  const { slug } = await params;

  if (slug.toLowerCase() === 'home') {
    permanentRedirect('/');
  }

  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=${encodeURIComponent(slug)}&excludeUrl=1`,
    CONSTANTS.REQUEST_GET,
    'server'
  );

  if (!fetchedInfo || !fetchedInfo.data || fetchedInfo.data.length === 0) {
    return notFound();
  }

  const initialPostLists = await getInitialPostLists(fetchedInfo.data.content, slug, await searchParams);

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
      <PageTemplate data={fetchedInfo.data} initialPostLists={initialPostLists} />
      {slug === 'health-nutrition' && (
        <div className="container custom_container mb-4">
          <p>Explore <Link href="/fortis">Fortis OP Jindal Hospital &amp; Research Centre</Link> and <Link href="/kishori">Kishori Express</Link>, two of our health initiatives.</p>
        </div>
      )}
    </>
  );
}


