import { serverRequest } from '@/services/getServerSideRender';
import { CONSTANTS } from '@/config/constant';
import { decodeHtmlEntities } from '@/lib/htmlUtils';
import { Metadata } from 'next';

interface GenerateMetadataOptions {
  slug: string;
  endpoint: string;
  fallbackTitle?: string;
}

export async function getPageMetadata({ slug, endpoint, fallbackTitle = 'Jindal Foundation' }: GenerateMetadataOptions): Promise<Metadata> {
  const fetchedInfo = await serverRequest({}, `${endpoint}?slug=${slug}&excludeUrl=1`, CONSTANTS.REQUEST_GET);

  const pageData = fetchedInfo?.data;

  if (!pageData || (Array.isArray(pageData) && pageData.length === 0)) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  const metaTitleValue = pageData?.meta?.title?.trim() || pageData?.meta_title?.trim();

  const metaTitle = decodeHtmlEntities(metaTitleValue ? `${metaTitleValue} | Jindal Foundation` : fallbackTitle);

  const metaDescription = decodeHtmlEntities(
    pageData?.meta?.description ||
    pageData?.meta_description ||
    "Jindal Foundation's commitment to social change through education, healthcare and sustainable development initiatives. Join us in making a difference.",
  );

  const metaKeywords = decodeHtmlEntities(
    pageData?.meta?.keywords ||
    pageData?.meta_keyword ||
    pageData?.meta_keywords ||
    'Jindal Foundation, education, healthcare, sustainable development',
  );

  const metaImage = "https://jindalfoundation.com/images/logo/jf-main-logo.jpg";
  const siteUrl = `https://jindalfoundation.com/${slug}`;

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