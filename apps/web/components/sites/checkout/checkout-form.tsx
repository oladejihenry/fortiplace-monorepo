'use client'

import { v4 as uuidv4 } from 'uuid'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Textarea } from '@workspace/ui/components/textarea'
import { useCartStore } from '@/store/use-cart-store'
import { cn } from '@workspace/ui/lib/utils'
import { formatPrice, getPriceForCurrency } from '@/lib/utils'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Check, ChevronsUpDown, ShoppingBag, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import axios from '@/lib/axios'
import { useCurrencyStore } from '@/store/use-currency-store'
import { countries } from '@/lib/countries'
import { ProductType } from '@/types/product'
import { AxiosError } from 'axios'
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@workspace/ui/components/command'
import Link from 'next/link'
import { Badge } from '@workspace/ui/components/badge'
import { applyCoupon } from '@/lib/coupons/coupons'

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
  orderNote: z.string().optional(),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

interface CouponData {
  code: string
  discount_amount: number
  final_amount: number
  coupon_type: string
  coupon_value: number
}

export function CheckoutForm() {
  const [couponCode, setCouponCode] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { items, removeItem } = useCartStore()
  const { selectedCurrency } = useCurrencyStore()
  const [idempotencyKey, setIdempotencyKey] = useState<string | null>(null)
  const router = useRouter()

  const calculateTotalPrice = () => {
    // return items.reduce((total, item) => {
    //   const price = getPriceForCurrency(item.prices, selectedCurrency)
    //   return total + price * item.quantity
    // }, 0)
    const subtotal = items.reduce((total, item) => {
      const price = getPriceForCurrency(item.prices, selectedCurrency)
      return total + price * item.quantity
    }, 0)
    if (appliedCoupon) {
      return appliedCoupon.final_amount
    }
    return subtotal
  }

  const calculateActualTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = getPriceForCurrency(item.prices, selectedCurrency)
      return total + price * item.quantity
    }, 0)
  }

  const calculateDiscountAmount = () => {
    if (!appliedCoupon) return 0

    const subtotal = items.reduce((total, item) => {
      const price = getPriceForCurrency(item.prices, selectedCurrency)
      return total + price * item.quantity
    }, 0)
    return subtotal - appliedCoupon.final_amount
  }

  const productTypeLabels: Record<ProductType, string> = {
    [ProductType.DIGITAL]: 'Digital Product',
    [ProductType.EBOOK]: 'E-book',
    [ProductType.COURSE]: 'Course',
    [ProductType.PHYSICAL]: 'Physical Product',
  }

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      country: '',
      orderNote: '',
    },
  })

  useEffect(() => {
    const storedKey = localStorage.getItem('checkout_idempotency_key')
    const newKey = storedKey || uuidv4()
    if (!storedKey) {
      localStorage.setItem('checkout_idempotency_key', newKey)
    }
    setIdempotencyKey(newKey)
  }, [])

  const handlePayment = async (data: CheckoutFormValues) => {
    try {
      setIsLoading(true)
      const orderData = {
        ...data,
        items: items.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          price: getPriceForCurrency(item.prices, selectedCurrency),
          quantity: item.quantity,
          currency: selectedCurrency,
        })),
        idempotency_key: idempotencyKey,
        discount_amount: calculateDiscountAmount(),
        coupon_code: appliedCoupon?.code || null,
        totalPrice: calculateTotalPrice(),
      }
      const response = await axios.post('/api/orders', orderData)
      if (!response.data?.paymentUrl) {
        throw new Error('Payment URL not found')
      }
      if (!response.data) {
        toast.error('Something went wrong')
        return
      }
      localStorage.setItem('reference', response.data.reference)
      window.location.href = response.data.paymentUrl
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyCoupon = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }
    try {
      setIsApplyingCoupon(true)
      const productIds = items.map((item) => item.id)
      const response = await applyCoupon(
        couponCode,
        calculateActualTotalPrice(),
        selectedCurrency,
        productIds,
      )
      if (response.success) {
        const couponData: CouponData = {
          code: response.coupon_code,
          discount_amount: response.discount_amount,
          final_amount: response.final_amount,
          coupon_type: response.coupon_type,
          coupon_value: response.coupon_value,
        }
        setAppliedCoupon(couponData)
        setCouponCode('')
        toast.success('Coupon applied successfully')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || error.response?.data.error || 'An error occurred',
        )
      }
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    if (appliedCoupon) {
      // Restore original order total
      // setOrderTotal(orderTotal + appliedCoupon.discount_amount)
      setAppliedCoupon(null)
      toast.success('Coupon removed')
    }
  }

  const shouldShowCouponForm = selectedCurrency === 'NGN'

  if (items.length === 0) {
    return (
      //put it in the center of the page
      <div className="flex-1 space-y-6">
        <div className="space-y-6 text-center">
          <div className="bg-muted/50 mx-auto w-fit rounded-full p-4">
            <ShoppingBag className="text-muted-foreground h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Looks like you haven&apos;t added anything to your cart yet
            </p>
          </div>
          <Button
            onClick={() => router.push('/')}
            className="bg-[#00A99D] text-white hover:bg-[#00A99D]/90"
          >
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <form
        onSubmit={form.handleSubmit(handlePayment)}
        className="flex w-full flex-col gap-8 lg:flex-row"
      >
        {/* Left Column - Form */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...form.register('email')}
              className="bg-background"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                {...form.register('firstName')}
                className="bg-background"
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                {...form.register('lastName')}
                className="bg-background"
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Controller
              control={form.control}
              name="country"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between bg-transparent',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? countries.find((country) => country.name === field.value)?.name
                        : 'Select country'}
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-y-auto">
                        {countries.map((country) => (
                          <CommandItem
                            key={country.code}
                            value={country.name}
                            onSelect={() => {
                              field.onChange(country.name)
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                'mr-2 size-4',
                                field.value === country.name ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            {country.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            {form.formState.errors.country && (
              <p className="text-sm text-red-500">{form.formState.errors.country.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              placeholder="Enter your phone number"
              {...form.register('phone')}
              className="bg-background"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderNote">Order note</Label>
            <Textarea
              id="orderNote"
              placeholder="Order note (optional)"
              {...form.register('orderNote')}
              className="bg-transparent"
            />
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6 lg:w-[400px]">
          <div className="space-y-4 rounded-lg border p-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
                  <Image src={item.cover_image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <span className="mb-2 font-medium">{item.name}</span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-red-500/10"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="size-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm">
                      Type: {productTypeLabels[item.product_type as ProductType]}
                    </span>
                    <span className="text-sm">Quantity: {item.quantity}</span>
                    <span className="text-sm font-medium">
                      {formatPrice(
                        getPriceForCurrency(item.prices, selectedCurrency),
                        selectedCurrency,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(calculateTotalPrice(), selectedCurrency)}</span>
              </div>
              {appliedCoupon && shouldShowCouponForm && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-{formatPrice(calculateDiscountAmount(), selectedCurrency)}</span>
                </div>
              )}
              <div className="mt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(calculateTotalPrice(), selectedCurrency)}</span>
              </div>
            </div>
            {shouldShowCouponForm && (
              <div className="space-y-3 border-t pt-4">
                <Label htmlFor="coupon">Coupon</Label>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      placeholder="Enter your coupon code (optional)"
                      className="bg-background flex-1"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon}
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 p-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Coupon {appliedCoupon.code} applied
                      </span>
                      <Badge variant="outline" className="text-green-700">
                        {appliedCoupon.coupon_type === 'percentage'
                          ? `${appliedCoupon.coupon_value}% off`
                          : `₦${appliedCoupon.coupon_value.toLocaleString()} off`}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            <Button
              className="w-full bg-[#00A99D] text-white hover:bg-[#00A99D]/90"
              size="lg"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Pay now'}
            </Button>
            <p className="text-muted-foreground text-sm">
              By clicking the &quot;Pay now&quot; button, you agree to Fortiplace&apos;s{' '}
              <Link href="https://fortiplace.com/terms-of-service" className="text-primary">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </form>
    </>
  )
}
