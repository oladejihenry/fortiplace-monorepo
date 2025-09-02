'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { EmailCampaign } from "@/types/email-campaign"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash } from "lucide-react"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
interface EmailCampaignsTableProps {
    campaigns: EmailCampaign[]
    onDelete: (campaign: EmailCampaign) => void
}

export function EmailCampaignsTable({ campaigns, onDelete }: EmailCampaignsTableProps) {
    const router = useRouter()
    const handleEdit = (campaign: EmailCampaign) => {
        console.log(campaign)
        router.push(`/send-email/${campaign.id}`)
    }

    return (
        <div className="space-y-4 py-8">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                            <TableCell>{campaign.name}</TableCell>
                            <TableCell>{campaign.subject}</TableCell>
                            <TableCell>
                                {campaign.target_audience.user_type} ({campaign.target_audience.country})
                            </TableCell>
                            <TableCell>{campaign.schedule_config.frequency}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    campaign.status === 'completed' ? 'default' :
                                    campaign.status === 'sending' ? 'secondary' :
                                    campaign.status === 'scheduled' ? 'outline' : 'destructive'
                                }>
                                    {campaign.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {format(new Date(campaign.created_at), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => handleEdit(campaign)}
                                            className="cursor-pointer"
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onDelete(campaign)}
                                            className="cursor-pointer text-destructive"
                                        >
                                            <Trash className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}