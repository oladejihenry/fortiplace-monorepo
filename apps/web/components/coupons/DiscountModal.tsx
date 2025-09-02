'use client'

import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const discountSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    code: z.string().min(1, 'Code is required').toUpperCase(),
    discount_percentage: z.enum(['10', '30', '50', '70', '100']),
    usage_limit: z.number().min(1, 'Usage limit must be at least 1'),
    starts_at: z.string().min(1, 'Start date is required'),
    expires_at: z.string().min(1, 'Expiry date is required'),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.starts_at)
      const expiryDate = new Date(data.expires_at)
      return expiryDate > startDate
    },
    {
      message: 'Expiry date must be after start date',
      path: ['expires_at'],
    },
  )

type DiscountFormData = z.infer<typeof discountSchema>

interface DiscountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DiscountModal({ open, onOpenChange }: DiscountModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      name: '',
      code: '',
      discount_percentage: '10',
      usage_limit: 1,
      starts_at: '',
      expires_at: '',
    },
  })

  const onSubmit = async (data: DiscountFormData) => {
    try {
      setIsSubmitting(true)

      // TODO: Replace with your actual API call
      const response = await fetch('/api/discounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create discount')
      }

      toast.success('Discount created successfully')
      onOpenChange(false)
      form.reset()

      // TODO: Refresh the discounts list
      // You might want to trigger a refetch of your discounts data here
    } catch (error) {
      toast.error('Failed to create discount. Please try again.')
      console.error('Error creating discount:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Discount</DialogTitle>
          <DialogDescription>
            Add a new discount code for your customers. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter discount name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              placeholder="Enter discount code"
              {...form.register('code')}
              onChange={(e) => {
                const value = e.target.value.toUpperCase()
                form.setValue('code', value)
              }}
            />
            {form.formState.errors.code && (
              <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_percentage">Discount Percentage</Label>
            <Select
              onValueChange={(value) =>
                form.setValue('discount_percentage', value as '10' | '30' | '50' | '70' | '100')
              }
              value={form.watch('discount_percentage')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select discount percentage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10%</SelectItem>
                <SelectItem value="30">30%</SelectItem>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="70">70%</SelectItem>
                <SelectItem value="100">100%</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.discount_percentage && (
              <p className="text-sm text-red-500">
                {form.formState.errors.discount_percentage.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage_limit">Usage Limit</Label>
            <Input
              id="usage_limit"
              type="number"
              min="1"
              placeholder="Enter usage limit"
              {...form.register('usage_limit', { valueAsNumber: true })}
            />
            {form.formState.errors.usage_limit && (
              <p className="text-sm text-red-500">{form.formState.errors.usage_limit.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="starts_at">Starts At</Label>
              <Input id="starts_at" type="datetime-local" {...form.register('starts_at')} />
              {form.formState.errors.starts_at && (
                <p className="text-sm text-red-500">{form.formState.errors.starts_at.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires_at">Expires At</Label>
              <Input id="expires_at" type="datetime-local" {...form.register('expires_at')} />
              {form.formState.errors.expires_at && (
                <p className="text-sm text-red-500">{form.formState.errors.expires_at.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Discount'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
