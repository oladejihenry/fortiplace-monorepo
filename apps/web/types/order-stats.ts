// types/order-stats.ts
export interface StoreOrderStats {
  store_name: string;
  owner_email: string;
  total_amount: string;
  total_amount_raw: number;
  seller_amount: string;
  seller_amount_raw: number;
}

export interface OrderStatsResponse {
  data: StoreOrderStats[];
  grand_total: string;
  currency: string;
  period: string;
}

export interface MonthlyStats {
  month: string;
  total_amount: string;
  total_amount_raw: number;
}

export interface StoreMonthlyStatsResponse {
  store_name: string;
  owner_email: string;
  monthly_stats: MonthlyStats[];
  currency: string;
}