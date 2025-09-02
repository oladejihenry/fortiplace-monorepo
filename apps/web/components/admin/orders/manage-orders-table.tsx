// components/admin/orders/manage-orders-table.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@workspace/ui/components/table'
import { toast } from 'sonner'
import axios from '@/lib/axios'
import { AxiosError } from 'axios'
import { parseAsString } from 'nuqs'
import { useQueryState } from 'nuqs'
import { OrderStatsResponse } from '@/types/order-stats'

export function ManageOrdersTable() {
  const [orderStats, setOrderStats] = useState<OrderStatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search] = useQueryState('search', parseAsString.withDefault(''))
  const [selectedMonth] = useQueryState('month', parseAsString.withDefault(''))

  useEffect(() => {
    async function fetchOrderStats() {
      setIsLoading(true)
      try {
        const response = await axios.get<OrderStatsResponse>('/api/admin/order-stats', {
          params: { month: selectedMonth === 'all-time' ? undefined : selectedMonth },
        })
        setOrderStats(response.data)
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message)
        }
        toast.error('Failed to load order statistics')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrderStats()
  }, [selectedMonth])

  // Filter stores based on search
  const filteredStores =
    orderStats?.data.filter((store) => {
      const searchTerm = search.toLowerCase()
      return (
        store.store_name.toLowerCase().includes(searchTerm) ||
        store.owner_email.toLowerCase().includes(searchTerm)
      )
    }) || []

  if (isLoading) {
    return (
      <div className="space-y-4 py-8">
        <div className="flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 py-8">
      {orderStats && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Period: {orderStats.period}</h3>
          <p className="text-lg font-bold">
            Grand Total: {orderStats.grand_total} {orderStats.currency}
          </p>
        </div>
      )}

      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead>Store Name</TableHead>
            <TableHead>Owner Email</TableHead>
            <TableHead className="text-right">Sell Amount</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStores.length > 0 ? (
            filteredStores.map((store, index) => (
              <TableRow key={`${store.store_name}-${index}`} className="hover:bg-muted/50">
                <TableCell className="font-medium">{store.store_name}</TableCell>
                <TableCell>{store.owner_email}</TableCell>
                <TableCell className="text-right font-medium">
                  {store.seller_amount} {orderStats?.currency}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {store.total_amount} {orderStats?.currency}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                {search
                  ? 'No stores found matching your search.'
                  : 'No orders found for the selected period.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter className="bg-muted/50">
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right font-bold">
              {orderStats?.grand_total} {orderStats?.currency}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
