export interface Bank {
    id: number
    name: string
    code: string
}

export interface User {
    
    data: {
        id: number
        username: string
        subdomain: string
        description: string
        phone_number: string
        email: string
        logo: string
        email_verified_at: string | null
        bank_code: string | null
        bank_account_number: string | null
        bank_account_name: string | null
        bank_id: string | null
        bank_name: string | null
        payment_schedule: string | null
        available_balance: number
        pending_balance: number
        created_at: string
        updated_at: string
        store_url: string
        role: string[]
        permissions: string[]
        availableBanks: Bank[]
        store_name: string
        is_impersonated: boolean
        leave_impersonation: string
        google_avatar: string | null
        twitter_avatar: string | null
    }
    meta: {
        total: number
        per_page: number
        current_page: number
        total_pages: number
    }
}