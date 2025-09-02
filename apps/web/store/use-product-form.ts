import { create } from 'zustand'
import { ProductType } from '@/types/product'
import { Currency } from '@/types/currencies'
import axios from '@/lib/axios'
import { AxiosError } from 'axios'
interface ProductFormState {
  // Basic Info (Step 1)
  id: string | null
  product_id: string | null
  name: string
  description: string | null
  product_type: ProductType
  price: number
  slashed_price: number
  metadata: {
    currency: Currency
    callToAction: "buy_now" | "i_want_this" | "pay_now"
    summary?: string
  }
  product_file?: string
  file_hash?: string
  // Publishing Info (Step 2)
  cover_image: string
  is_published: boolean
  preview_images?: string[]
  content: string

  //Status
  status: 'draft' | 'published'

  // Actions
  initializeProduct: () => Promise<string>
  setBasicInfo: (data: Partial<ProductFormState>) => void
  setPublishingInfo: (data: Partial<ProductFormState>) => void
  fetchProduct: (productId: string) => Promise<void>
  reset: () => void
}

const initialState = {
  id: null,
  product_id: null,
  name: '',
  description: '',
  product_type: ProductType.DIGITAL,
  price: 0,
  metadata: {
    currency: Currency.NGN,
    callToAction: "buy_now" as const,
    summary: '',
  },
  product_file: '',
  cover_image: '',
  is_published: false,
  preview_images: [],
  content: '',
  status: 'draft' as const,
  slashed_price: 0,
}

export const useProductForm = create<ProductFormState>((set, get) => ({
  ...initialState,

  initializeProduct: async () => {
    const state = get()
    try{
      const response = await axios.post<{id: string}>('/api/products/draft', {
        product_type: state.product_type,
        price: state.price,
        metadata: state.metadata,
        name: state.name,
      })

      set({
        id: response.data.id,
      })

      return response.data.id
      
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data.message || "Failed to create product"
      }else{
        throw error
      }
    }
  },

  fetchProduct: async (productId: string) => {
    try {
      const response = await axios.get(`/api/products/${productId}`)
      const productData = response.data.data
      set({
        id: productData.id,
        product_id: productData.product_id,
        name: productData.name,
        description: productData.description,
        product_type: productData.product_type,
        price: productData.price,
        metadata: productData.metadata || {
          currency: Currency.NGN,
          callToAction: "buy_now",
          summary: "",
        },
        product_file: productData.product_file,
        status: productData.status,
        cover_image: productData.cover_image,
        is_published: productData.is_published,
        preview_images: productData.preview_images,
        content: productData.content,
        slashed_price: productData.slashed_price || 0,
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  setBasicInfo: (data) => set((state) => ({ ...state, ...data })),
  setPublishingInfo: (data) => set((state) => ({ ...state, ...data })),
  reset: () => set(initialState),
}))