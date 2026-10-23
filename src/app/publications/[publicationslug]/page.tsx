import React from 'react'
import PostDetails from '@/components/CustomComponents/PostDetails';
import { GET_SPECIFIC_POST_ENDPOINT } from '@/config/apiConfig';
import { CONSTANTS } from '@/config/constant';
import { serverRequest } from '@/services/getServerSideRender';
import { getPageMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicationslug: string }>
}): Promise<Metadata> {
  const { publicationslug } = await params;

  return getPageMetadata({
    slug: publicationslug,
    endpoint: GET_SPECIFIC_POST_ENDPOINT,
    pathPrefix: '/publications',
  });
}

export default async function PublicationSlug({
  params,
}: {
  params: Promise<{ publicationslug: string }>
}) {
  const { publicationslug } = await params;

  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_POST_ENDPOINT}?slug=${encodeURIComponent(publicationslug)}&excludeUrl=1`,
    CONSTANTS.REQUEST_GET,
    'server'
  );

  if (!fetchedInfo || !fetchedInfo.data || (Array.isArray(fetchedInfo.data) && fetchedInfo.data.length === 0)) {
    return notFound();
  }

  return (
    <>
      <PostDetails slug={publicationslug} parentSlug={'publications'} initialData={fetchedInfo.data} />
    </>
  );
}

