import { Element, htmlToDOM, type DOMNode } from 'html-react-parser';
import { GET_POST_ENDPOINT } from '@/config/apiConfig';
import { CONSTANTS } from '@/config/constant';
import { serverRequest } from '@/services/getServerSideRender';
import { getPageNumber, getPostListKey, getPostListQuery, type PageSearchParams } from './postListQuery';
import type { InitialPostLists } from '@/types/postData';

// Read the CMS listing configuration so SSR uses the same taxonomy and limit as the UI.
export async function getInitialPostLists(content: string, pageSlug: string, search: PageSearchParams): Promise<InitialPostLists> {
  const lists: Element[] = [];
  const visit = (nodes: DOMNode[]) => {
    for (const node of nodes) {
      if (node instanceof Element) {
        if (node.name === 'custompost') lists.push(node);
        visit(node.children as DOMNode[]);
      }
    }
  };
  visit(htmlToDOM(content));

  const page = getPageNumber(typeof search.page === 'string' ? search.page : undefined);
  const type = typeof search.type === 'string' ? search.type : undefined;
  const results = await Promise.all(lists.map(async ({ attribs }) => {
    const limit = Number(attribs.itemsperpage) || 9;
    const query = getPostListQuery(attribs.slug, pageSlug, limit, page, type);
    const response = await serverRequest({}, `${GET_POST_ENDPOINT}?${query}`, CONSTANTS.REQUEST_GET, 'server');
    if (response?.code !== CONSTANTS.STATUS_SUCCESS || !Array.isArray(response.data)) return null;
    return [getPostListKey(attribs.slug, attribs.component, limit), {
      posts: response.data,
      total: Number(response.total) || response.data.length,
      query,
    }] as const;
  }));
  return Object.fromEntries(results.filter((result) => result !== null));
}
