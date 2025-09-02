export interface Payout {
  id: number;
  user_id: number;
  amount: number;
  reference: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface PayoutsResponse {
  payouts: {
    data: Payout[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  message: string;
}