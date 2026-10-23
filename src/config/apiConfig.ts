export const API_URL = process.env.NEXT_PUBLIC_URL;

export const GET_MENU_ENDPOINT = `${API_URL}/v1/menu/get`;
export const GET_SPECIFIC_PAGE_ENDPOINT = `${API_URL}/v1/page/get`;
export const GET_CONTENT_BLOCK_ENDPOINT = `${API_URL}/v1/content-block/get`;//?keyword=footerv2
export const GET_SPECIFIC_POST_ENDPOINT = `${API_URL}/v1/post/get`;
export const GET_POST_ENDPOINT = `${API_URL}/v1/post/get-all`;
export const HEADER_MENU_ENDPOINT = `header-main-menu`;
export const FOOTER_MENU_ENDPOINT = `footer-bottom-menu`;
export const FOOTER_CONTENT_BLOCK_ENDPOINT = `footerv2`;
export const CHECK_APPLICANT_ENDPOINT = `/v1/job/check-applicant`
export const POST_FORM_ENDPOINT = `/v1/form/save`;
export const POST_JOB_ENDPOINT = `/v1/job/post`;
export const GET_FILE_UPLOAD_ENDPOINT = `/v1/upload-file/upload`;
export const GET_JOB_ENDPOINT = `/v1/job/get-data`;