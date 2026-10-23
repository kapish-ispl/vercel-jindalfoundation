export const CONSTANTS = {
  REQUEST_FORMAT: 'application/json',
  RESPONSE_FORMAT: 'application/json',
  MULTI_FORM: 'multipart/form-data',
  REQUEST_POST: 'POST',
  REQUEST_GET: 'GET',
  LANGUAGE_ENGLISH: 'en',
  HASHING_ALGORITHM: 'sha256',
  SIGNATURE_KEY: 'QD32VdbRuMa0iI0q9q7cH6FIHGcNWGdEZOLyK669',
  WEBSITE_NAME: 'JSP Foundation',
  HEADER_MENU_SLUG: 'header-menu',
  FOOTER_QUICK_MENU_SLUG: 'quick-links-menu',
  FOOTER_OTHER_MENU_SLUG: 'other-links-menu',
  FOOTER_BOTTOM_MENU_SLUG: 'footer-bottom-menu',
  STATUS_SUCCESS: 'SUC200',
  STATUS_FAILED: 'ERR004',
  X_AUTHORIZATION_TOKEN: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
  X_NETWORK_GUID: process.env.NEXT_PUBLIC_GUID,
};

export const NEWS_DROPDOWN = [
  {
    label: 'Media Coverage',
    value: 'Media Coverage',
    taxonomy: 'jf-media-coverage',
  },
  {
    label: 'Press Release',
    value: 'Press Release',
    taxonomy: 'jf-media-coverage',
  },
];
export const GALLERY_DROPDOWN = [
  { label: 'Photo', value: 'Photo', taxonomy: 'jf-gallery-1' },
  { label: 'Video', value: 'video', taxonomy: 'jf-gallery-1' },
];

export const PUBLICATION_DROPDOWN = [
  {
    label: 'Success Stories',
    value: 'success_story',
    taxonomy: 'jf-gallery-1',
  },
  { label: 'Reports', value: 'reports' },
  { label: 'Newsletters', value: 'newsletter' },
];

export const GALLERY_CATEGORY_DROPDOWN = [
  { label: 'Health & Nutrition', value: 'Health %26 Nutrition' },
  { label: 'Environment & Agriculture', value: 'Environment %26 Agriculture' },
  {
    label: 'Livelihood & Women Empowerment',
    value: 'Livelihood %26 Women Empowerment',
  },
  { label: 'Sports', value: 'Sports' },
  { label: 'Art & Culture', value: 'Art %26 Culture' },
  {
    label: 'Rashtriya Swayamsiddh Samman',
    value: 'Rashtriya Swayamsiddh Samman',
  },
  { label: 'Swayamsiddh Samman', value: 'Swayamsiddh Samman' },
  { label: 'Swayam Shilp', value: 'Swayam Shilp' },
  { label: 'Audio & Video', value: 'Audio & Video' },
  { label: 'Social Security Support', value: 'Social Security Support' },
];
