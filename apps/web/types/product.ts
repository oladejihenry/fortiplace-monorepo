import { Currency } from "./currencies"

export enum ProductType {
  DIGITAL = 'digital_product',
  EBOOK = 'ebook',
  PHYSICAL = 'physical_product',
  COURSE = 'course',
}

export enum CallToAction {
  BUY_NOW = 'buy_now',
  I_WANT_THIS = 'i_want_this',
  PAY_NOW = 'pay_now',
}

export interface Product {
  id: string
  product_id: string
  name: string
  content: string
  description: string
  product_type: ProductType
  cover_image: string
  price: number
  slashed_price: number
  product_url?: string
  product_file?: string
  preview_images: string[]
  is_published: boolean
  version: number
  metadata: Record<string, string>
  created_at: string
  updated_at: string
  creator: {
    subdomain: string
  }
}

export interface CreateProductData {
  name: string
  description: string
  product_type: ProductType
  cover_image: string
  price: number
  preview_images?: string[]
  is_published?: boolean
  metadata?: {
    currency: string
    callToAction: string
    summary?: string
  }
}

//Proudct draft Update
export interface ProductDraftUpdate {
  name: string;
  content?: string;
  product_type: ProductType;
  price: number;
  product_file?: string;
  cover_image?: string;
  is_published: boolean;
  status: string;
  metadata: {
    currency: Currency;
    callToAction: "buy_now" | "i_want_this" | "pay_now";
    summary?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}