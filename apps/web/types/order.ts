export interface Order {
    id: number
    order_id: string
    product_name: string
    customer_email: string
    total_price: number
    status: 'pending' | 'completed' | 'failed' | 'processing' // Add all possible status values
    quantity: number
    created_at: string
}