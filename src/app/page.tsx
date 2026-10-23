import { Metadata } from 'next';
import { serverRequest } from '@/services/getServerSideRender';
import { GET_SPECIFIC_PAGE_ENDPOINT } from '@/config/apiConfig';
import { CONSTANTS } from '@/config/constant';
import { notFound } from 'next/navigation';
import { getPageMetadata } from '@/lib/metadata';

import HomePage from '@/components/Templates/HomePageTemplate';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata({
    slug: 'home',
    endpoint: GET_SPECIFIC_PAGE_ENDPOINT,
  });
}

export default async function Home() {
  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=home&excludeUrl=1`,
    CONSTANTS.REQUEST_GET,
    'server'
  );

  if (!fetchedInfo || !fetchedInfo.data || fetchedInfo.data.length === 0) return notFound();

  return (
    <>
      <HomePage data={fetchedInfo.data} />
    </>
  );
}