'use client'

import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Skeleton } from '@workspace/ui/components/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import { usePayments } from '@/hooks/admin/usePayments'
import { formatPrice } from '@/lib/utils'
import { format } from 'date-fns'
import { useQueryState } from 'nuqs'
import { parseAsInteger } from 'nuqs'

export function ManagePaymentsTable() {
  const [, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const { data: payments, isLoading } = usePayments()

  if (isLoading)
    return (
      <div className="space-y-4 py-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )

  const totalPages = payments?.meta.last_page || 1
  const currentPage = payments?.meta.current_page || 1
  const totalItems = payments?.meta.total || 0
  const perPage = payments?.meta.per_page || 15
  const startItem = (currentPage - 1) * perPage + 1
  const endItem = Math.min(startItem + perPage - 1, totalItems)

  return (
    <div className="space-y-4 py-8">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead className="w-[300px]">Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Amount</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden md:table-cell">Payment Gateway</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.data.map((payment) => (
            <TableRow key={payment.id} className="hover:bg-muted/50">
              <TableCell className="py-4 font-medium">{payment.order_id}</TableCell>
              <TableCell className="py-4 font-medium">{payment.customer_email}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    payment.payment_status === 'success'
                      ? 'default'
                      : payment.payment_status === 'pending'
                        ? 'secondary'
                        : 'destructive'
                  }
                >
                  {payment.payment_status}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatPrice(payment.amount, payment.currency || 'NGN')}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {format(new Date(payment.created_at), 'PPP')}
              </TableCell>
              <TableCell className="hidden md:table-cell">{payment.payment_gateway}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-muted-foreground text-sm">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> payments
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((page) => Math.max(1, page - 1))}
            disabled={currentPage <= 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="sr-only">Previous Page</span>
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = i + 1
            return (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(pageNumber)}
                className="h-8 w-8 p-0"
              >
                {pageNumber}
              </Button>
            )
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage >= totalPages}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span className="sr-only">Next Page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
