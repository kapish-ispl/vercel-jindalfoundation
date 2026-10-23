import { serverRequest } from '@/services/getServerSideRender';
import { CONSTANTS } from '@/config/constant';
import { decodeHtmlEntities } from '@/lib/htmlUtils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCanonicalUrl, SITE_URL } from '@/lib/seo';
import { getPageNumber, type PageSearchParams } from '@/lib/postListQuery';

interface GenerateMetadataOptions {
  slug: string;
  endpoint: string;
  fallbackTitle?: string;
  pathPrefix?: string;
  searchParams?: PageSearchParams;
}

export async function getPageMetadata({ slug, endpoint, fallbackTitle = 'Jindal Foundation', pathPrefix, searchParams = {} }: GenerateMetadataOptions): Promise<Metadata> {
  const fetchedInfo = await serverRequest({}, `${endpoint}?slug=${encodeURIComponent(slug)}&excludeUrl=1`, CONSTANTS.REQUEST_GET);

  const pageData = fetchedInfo?.data;

  if (!pageData || (Array.isArray(pageData) && pageData.length === 0)) {
    notFound();
  }

  const pageTitle = decodeHtmlEntities(pageData.title?.trim() || slug.replace(/-/g, ' ') || fallbackTitle);
  const metaTitleValue = decodeHtmlEntities(pageData?.meta?.title?.trim() || pageData?.meta_title?.trim() || pageTitle);

  const metaTitle = /jindal foundation/i.test(metaTitleValue) ? metaTitleValue : `${metaTitleValue} | Jindal Foundation`;

  const contentDescription = decodeHtmlEntities((pageData.description || pageData.content || '')
    .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()).slice(0, 160);

  const metaDescription = decodeHtmlEntities(
    pageData?.meta?.description ||
    pageData?.meta_description ||
    contentDescription ||
    `Explore ${pageTitle} at Jindal Foundation and learn about our initiatives and their impact on communities.`,
  );

  const metaKeywords = decodeHtmlEntities(
    pageData?.meta?.keywords ||
    pageData?.meta_keyword ||
    pageData?.meta_keywords ||
    'Jindal Foundation, education, healthcare, sustainable development',
  );

  const metaImage = `${SITE_URL}/images/logo/jf-main-logo.jpg`;
  const canonical = new URL(getCanonicalUrl(slug.trim(), pathPrefix));
  // Pagination and categories change the content. Tracking parameters never do.
  if (/<custompost\b/i.test(pageData.content || '')) {
    const page = getPageNumber(typeof searchParams.page === 'string' ? searchParams.page : undefined);
    if (page > 1) canonical.searchParams.set('page', String(page));
    const type = typeof searchParams.type === 'string' ? searchParams.type : '';
    const defaults: Record<string, string> = { publications: 'Success Stories', news: 'Media Coverage', gallery: 'photo' };
    if (type && type.toLowerCase() !== defaults[slug]?.toLowerCase()) canonical.searchParams.set('type', type);
  }
  const siteUrl = canonical.toString();

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: { canonical: siteUrl },

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      siteName: 'Jindal Foundation',
      type: 'website',
      url: siteUrl,
      images: [
        {
          url: metaImage,
          width: 800,
          height: 600,
          alt: 'Jindal Foundation',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@JindalFoundation',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
  };
}
