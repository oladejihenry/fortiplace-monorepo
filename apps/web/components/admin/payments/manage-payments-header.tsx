'use client'
import { Input } from '@workspace/ui/components/input'
import { usePayments } from '@/hooks/admin/usePayments'
import { useQueryState } from 'nuqs'
import { parseAsString } from 'nuqs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { Calendar } from '@workspace/ui/components/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover'
import { Button } from '@workspace/ui/components/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

export function ManagePaymentsHeader() {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''))
  const [paymentReference, setPaymentReference] = useQueryState(
    'payment_reference',
    parseAsString.withDefault(''),
  )
  const [paymentStatus, setPaymentStatus] = useQueryState(
    'payment_status',
    parseAsString.withDefault(''),
  )
  const [paymentGateway, setPaymentGateway] = useQueryState(
    'payment_gateway',
    parseAsString.withDefault(''),
  )
  const [startDate, setStartDate] = useQueryState('start_date', parseAsString.withDefault(''))
  const [endDate, setEndDate] = useQueryState('end_date', parseAsString.withDefault(''))

  const { data: payments } = usePayments()
  const paymentsCount = payments?.meta.total

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight">Payment Management</h2>
          <span className="bg-muted relative box-border inline-flex h-8 items-center rounded-full px-2 text-sm font-medium">
            {paymentsCount}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <Input
          placeholder="Search payments..."
          className="h-8 min-h-8 max-w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Input
          placeholder="Payment Reference..."
          className="h-8 min-h-8 max-w-[200px]"
          value={paymentReference}
          onChange={(e) => setPaymentReference(e.target.value)}
        />

        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger className="h-8 min-h-8 w-[180px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="abandoned">Abandoned</SelectItem>
          </SelectContent>
        </Select>

        <Select value={paymentGateway} onValueChange={setPaymentGateway}>
          <SelectTrigger className="h-8 min-h-8 w-[180px]">
            <SelectValue placeholder="Payment Gateway" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Gateways</SelectItem>
            <SelectItem value="StripeService">Stripe</SelectItem>
            <SelectItem value="KoraService">Kora</SelectItem>
            <SelectItem value="PaystackService">Paystack</SelectItem>
            <SelectItem value="FlutterwaveService">Flutterwave</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-8 min-h-8 w-[180px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(new Date(startDate), 'PPP') : 'Start Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate ? new Date(startDate) : undefined}
              onSelect={(date) => setStartDate(date ? format(date, 'yyyy-MM-dd') : '')}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-8 min-h-8 w-[180px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(new Date(endDate), 'PPP') : 'End Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate ? new Date(endDate) : undefined}
              onSelect={(date) => setEndDate(date ? format(date, 'yyyy-MM-dd') : '')}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
