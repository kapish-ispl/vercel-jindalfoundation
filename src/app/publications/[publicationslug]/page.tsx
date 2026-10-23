import React from 'react'
import PostDetails from '@/components/CustomComponents/PostDetails';
import { GET_SPECIFIC_POST_ENDPOINT } from '@/config/apiConfig';
import { getPageMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicationslug: string }>
}): Promise<Metadata> {
  const { publicationslug } = await params;

  return getPageMetadata({
    slug: publicationslug,
    endpoint: GET_SPECIFIC_POST_ENDPOINT,
  });
}

export default async function PublicationSlug({
  params,
}: {
  params: Promise<{ publicationslug: string }>
}) {
  const { publicationslug } = await params;

  return (
    <>
      <PostDetails slug={publicationslug} parentSlug={'publications'} />
    </>
  );
}

