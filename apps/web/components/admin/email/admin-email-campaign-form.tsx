'use client'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/ui/form";
import { Editor } from "@/components/editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEmailCampaignById } from "@/lib/admin/fetchEmail";
import { useQuery } from "@tanstack/react-query";
import { EmailCampaign } from "@/types/email-campaign";
import { useEffect } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
const formSchema = z.object({
    name: z.string().min(2).max(50),
    subject: z.string().min(2).max(100),
    content: z.string().min(10),
    status: z.enum(['draft', 'scheduled', 'sending', 'completed']),
    send_to_unverified_users: z.boolean(),
    max_sends: z.number().min(1).max(10),
    schedule_config: z.object({
        frequency: z.enum(['weekly', 'daily', 'monthly']),
        custom_date: z.string().optional(),
    }),
    target_audience: z.object({
        user_type: z.enum(['creator', 'customer']),
        country: z.string().min(2).max(2),
    }),
})



export function AdminEmailCampaignForm({id}: {id: string}) {
    const router = useRouter()

    // Fetch initial data using useQuery
    const { data: initialData } = useQuery<EmailCampaign>({
        queryKey: ['email-campaign', id],
        queryFn: () => getEmailCampaignById(id),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            subject: '',
            content: '',
            status: 'draft',
            max_sends: 1,
            send_to_unverified_users: false,
            schedule_config: {
                frequency: 'weekly',
            },
            target_audience: {
                user_type: 'creator',
                country: 'NG',
            },
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                subject: initialData.subject,
                content: initialData.content,
                status: initialData.status,
                max_sends: initialData.max_sends,
                send_to_unverified_users: initialData.send_to_unverified_users,
                schedule_config: {
                    frequency: initialData.schedule_config.frequency,
                    custom_date: initialData.schedule_config.custom_date,
                },
                target_audience: {
                    user_type: initialData.target_audience.user_type,
                    country: initialData.target_audience.country,
                },
            });
        }
    }, [initialData, form])

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await axios.put(`/api/admin/promotions/${id}`, values)
            if (response.status === 200) {
                router.push('/send-email')
                toast.success('Campaign updated successfully')
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "Failed to update campaign");
            }else{
                toast.error("Failed to update campaign");
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2 flex-1">
                <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Campaign Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Summer Sale" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Subject</FormLabel>
                            <FormControl>
                                <Input placeholder="Don't Miss Our Summer Sale!" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel>Email Content</FormLabel>
                            <FormControl>
                                <Editor 
                                    placeholder="Get 20% off all digital products..." 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="max_sends"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Maximum Sends</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number" 
                                        min={1} 
                                        max={10}
                                        {...field}
                                        onChange={e => field.onChange(parseInt(e.target.value))}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Number of times this campaign will be sent
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="target_audience.country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Target Country</FormLabel>
                                <FormControl>
                                    <Input placeholder="NG" maxLength={2} {...field} />
                                </FormControl>
                                <FormDescription>
                                    Two-letter country code (e.g., NG for Nigeria)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="schedule_config.frequency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Frequency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="target_audience.user_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Target Audience</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select audience type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="creator">Creators</SelectItem>
                                        <SelectItem value="customer">Customers</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-2">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Schedule Campaign</FormLabel>
                                    <FormDescription>
                                        Toggle to schedule this campaign for sending
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value === 'scheduled'}
                                        onCheckedChange={(checked) => 
                                            field.onChange(checked ? 'scheduled' : 'draft')
                                        }
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="send_to_unverified_users"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-2">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Send to unverified users</FormLabel>
                                    <FormDescription>
                                        Toggle to send this campaign to all users who have not verified their email
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value === true}
                                        onCheckedChange={(checked) => 
                                            field.onChange(checked ? true : false)
                                        }
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                </div>

                <div className="flex justify-end space-x-4 pt-2">
                    {/* <Button type="button" variant="outline" onClick={() => router.back()}>
                        
                    </Button> */}
                    <Button type="submit">
                        {initialData ? 'Update Campaign' : 'Create Campaign'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}