import { serverRequest } from "@/services/getServerSideRender";
import {
  FOOTER_CONTENT_BLOCK_ENDPOINT,
  FOOTER_MENU_ENDPOINT,
  GET_CONTENT_BLOCK_ENDPOINT,
  GET_MENU_ENDPOINT,
  HEADER_MENU_ENDPOINT,
} from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";

export async function getMenuData() {
  const [headerRes, footerMenuRes, footerContentRes] = await Promise.all([
    serverRequest(
      {},
      `${GET_MENU_ENDPOINT}?slug=${HEADER_MENU_ENDPOINT}`,
      CONSTANTS.REQUEST_GET
    ),
    serverRequest(
      {},
      `${GET_MENU_ENDPOINT}?slug=${FOOTER_MENU_ENDPOINT}`,
      CONSTANTS.REQUEST_GET
    ),
    serverRequest(
      {},
      `${GET_CONTENT_BLOCK_ENDPOINT}?keyword=${FOOTER_CONTENT_BLOCK_ENDPOINT}`,
      CONSTANTS.REQUEST_GET
    ),
  ]);

  return {
    headerMenu:
      headerRes?.code === CONSTANTS.STATUS_SUCCESS ? headerRes.data : [],
    footerBottomMenu:
      footerMenuRes?.code === CONSTANTS.STATUS_SUCCESS
        ? footerMenuRes.data
        : [],
    footerContent:
      footerContentRes?.code === CONSTANTS.STATUS_SUCCESS
        ? footerContentRes.data
        : null,
  };
}
