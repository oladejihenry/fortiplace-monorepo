export const PRODUCT_TYPES = {
  DIGITAL: 'digital',
  EBOOK: 'ebook',
  COURSE: 'course',
  TEMPLATE: 'template',
} as const

export const PRODUCT_TYPE_LABELS = {
  [PRODUCT_TYPES.DIGITAL]: 'Digital Product',
  [PRODUCT_TYPES.EBOOK]: 'E-book',
//   [PRODUCT_TYPES.COURSE]: 'Online Course',
//   [PRODUCT_TYPES.TEMPLATE]: 'Template',
} as const

export const CURRENCIES = {
  USD: 'USD',
  NGN: 'NGN',
} as const

export const CURRENCY_SYMBOLS = {
  [CURRENCIES.USD]: '$',
  [CURRENCIES.NGN]: '₦',
} as const