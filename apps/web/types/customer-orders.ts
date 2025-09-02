// types/order.ts
interface ProductSeller {
  username: string;
  email: string;
  store: {
    name: string;
    subdomain: string;
  };
}

interface OrderProduct {
  id: string;
  product_id: string;
  name: string;
  product_type: string;
  cover_image: string;
  product_url: string;
  seller: ProductSeller;
  download_url: string;
  file_name: string;
  view_product_online: boolean;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unit_price: string;
  unit_price_ngn: string;
  total_price: string;
  total_price_ngn: string;
  commission_amount: string;
  seller_amount: string;
  currency: string;
  status: string;
  download_count: number;
  product: OrderProduct;
}

interface CustomerDetails {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
}

export interface Order {
  id: string;
  order_id: string;
  user_id: string;
  amount: string;
  amount_ngn: string;
  commission_amount: string;
  seller_amount: string;
  currency: string;
  payment_status: string;
  payment_gateway: string;
  payment_reference: string;
  provider_reference: string | null;
  customer_details: CustomerDetails;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}