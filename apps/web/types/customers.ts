interface CustomerDetails {
  name: string
  email: string
}

//items are an array of objects with product in the array
interface Items {
  product: {
    name: string
    description: string
    price: number
    image: string
  }
  unit_price_ngn: number
}

interface FinancialDetails {
  amount_ngn: number
  currency: string,
  total: number
  original_currency: string
}

interface OrderDetails {
  status: 'pending' | 'success' | 'failed'
  created_at: string
}

interface ProductDetails {
  name: string
  description: string
}

export interface Customer {
  id: string
  order_id: string
  customer_details: CustomerDetails
  financial_details: FinancialDetails
  order_details: OrderDetails
  product_details: ProductDetails
  items: Items[]
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