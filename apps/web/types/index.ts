export interface Price {
  currency: string
  price: number
  regularPrice: number | null
}

export interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  currency: string
  cover_image: string
  product_type: string
  creator: {
    username: string
    email: string
  }
  prices: Price[]
}