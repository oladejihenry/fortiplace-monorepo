'use client'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { Button } from '@workspace/ui/components/button'
import { useState } from 'react'
import { createCoupon } from '@/lib/coupons/coupons'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'

export function CouponForm() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [type, setType] = useState('')
  const [amount, setAmount] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await createCoupon({
        code,
        type,
        amount: amount,
        expires_at: expiresAt,
      })

      if (response.status === 201) {
        toast.success('Coupon created successfully')
        router.push('/coupons')
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 422) {
        toast.error(error.response?.data.message || 'An error occurred')
      } else {
        toast.error('An error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const getAmountPlaceholder = () => {
    if (type === 'percentage') {
      return 'Enter percentage (1-100)'
    } else if (type === 'fixed') {
      return 'Enter amount in NGN'
    }
    return 'Select type first'
  }

  const getAmountLabel = () => {
    if (type === 'percentage') {
      return 'Percentage (%)'
    } else if (type === 'fixed') {
      return 'Amount (₦)'
    }
    return 'Amount'
  }

  const formatAmountInput = (value: string) => {
    if (type === 'percentage') {
      // Only allow numbers 1-100 for percentage
      const num = parseInt(value)
      if (num >= 1 && num <= 100) {
        return value
      }
      return ''
    } else if (type === 'fixed') {
      // Allow decimal numbers for fixed amount
      const num = parseFloat(value)
      if (num > 0) {
        return value
      }
      return ''
    }
    return value
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formattedValue = formatAmountInput(value)
    setAmount(formattedValue)
  }

  const handleTypeChange = (value: string) => {
    setType(value)
    setAmount('') // Clear amount when type changes
  }

  return (
    <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <Label htmlFor="code">Code</Label>
        <Input
          placeholder="Enter coupon code"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="amount">{getAmountLabel()}</Label>
        <div className="relative">
          {type === 'percentage' && (
            <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
              %
            </span>
          )}
          {type === 'fixed' && (
            <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
              ₦
            </span>
          )}
          <Input
            placeholder={getAmountPlaceholder()}
            id="amount"
            type="number"
            min={type === 'percentage' ? 1 : 0.01}
            max={type === 'percentage' ? 100 : undefined}
            step={type === 'percentage' ? 1 : 0.01}
            value={amount}
            onChange={handleAmountChange}
            className={type === 'percentage' ? 'pl-8' : 'pl-8'}
            disabled={!type}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="expiresAt">Expires At</Label>
        <Input
          type="datetime-local"
          id="expiresAt"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>

      <div className="space-y-1">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Coupon'}
        </Button>
      </div>
    </form>
  )
}
