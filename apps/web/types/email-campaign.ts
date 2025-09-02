export interface EmailCampaign {
    id: string
    name: string
    subject: string
    content: string
    max_sends: number
    schedule_config: {
        frequency: 'weekly' | 'daily' | 'monthly'
        custom_date?: string
    }
    target_audience: {
        user_type: 'creator' | 'customer'
        country: string
    }
    created_at: string
    status: 'draft' | 'scheduled' | 'sending' | 'completed'
    send_to_unverified_users: boolean
}

export interface CreateEmailCampaignDto {
    name: string
    subject: string
    content: string
    max_sends: number,
    status: 'draft' | 'scheduled' | 'sending' | 'completed',
    schedule_config: {
        frequency: 'weekly' | 'daily' | 'monthly'
        custom_date?: string
    }
    target_audience: {
        user_type: 'creator' | 'customer'
        country: string
    }
    send_to_unverified_users: boolean
}