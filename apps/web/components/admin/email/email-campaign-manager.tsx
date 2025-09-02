'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { EmailCampaignForm } from "./email-campaign-form"
import { EmailCampaignsTable } from "./email-campaigns-table"
import { useState } from "react"
import { CreateEmailCampaignDto, EmailCampaign } from "@/types/email-campaign"
import { toast } from "sonner"
import axios from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { AlertDialog, AlertDialogHeader, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { SendEmailHeader } from "./send-email-header"
import { AxiosError } from "axios"

export function EmailCampaignsManager() {
    const [open, setOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null)
    const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null)

    const { data: campaigns = [], refetch } = useQuery<EmailCampaign[]>({
        queryKey: ['email-campaigns'],
        queryFn: async () => {
            const response = await axios.get('/api/admin/promotions')
            return response.data
        },
    })

    const handleCreateOrUpdate = async (data: CreateEmailCampaignDto) => {
        try {
            if (selectedCampaign) {
                await axios.put(`/api/admin/promotions/${selectedCampaign.id}`, data)
                toast.success('Email campaign updated successfully')
            } else {
                await axios.post('/api/admin/promotions', data)
                toast.success('Email campaign created successfully')
            }
            setOpen(false)
            setSelectedCampaign(null)
            refetch()
        } catch (error) {
            toast.error(selectedCampaign ? 'Failed to update campaign' : 'Failed to create campaign')
            throw error
        }
    }

    const handleDelete = async (campaign: EmailCampaign) => {
        setCampaignToDelete(campaign.id)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!campaignToDelete) return

        try {
            await axios.delete(`/api/admin/promotions/${campaignToDelete}`)
            toast.success('Email campaign deleted successfully')
            refetch()
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message)
            } else {
                toast.error('Failed to delete campaign')
            }
        } finally {
            setDeleteDialogOpen(false)
            setCampaignToDelete(null)
        }
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) {
            // Clear selected campaign when modal is closed
            setSelectedCampaign(null)
        }
    }

    return (
        <div className="space-y-6">
            <SendEmailHeader onCreateClick={() => {
                setSelectedCampaign(null) // Clear selected campaign before opening modal
                setOpen(true)
            }} />
            
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedCampaign ? 'Edit' : 'Create'} Email Campaign
                        </DialogTitle>
                        <DialogDescription>
                            {selectedCampaign ? 'Edit your' : 'Create a new'} email campaign to send to your users.
                        </DialogDescription>
                    </DialogHeader>
                    <EmailCampaignForm 
                        onSubmit={handleCreateOrUpdate}
                        onCancel={() => {
                            setOpen(false)
                            setSelectedCampaign(null)
                        }}
                        initialData={selectedCampaign || undefined}
                    />
                </DialogContent>
            </Dialog>

            <EmailCampaignsTable 
                campaigns={campaigns}
                onDelete={handleDelete}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            email campaign.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}