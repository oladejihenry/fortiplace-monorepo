'use client'

import { formatDate } from '@/lib/utils'
import { Button } from '@workspace/ui/components/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@workspace/ui/components/table'
import { Badge } from '@workspace/ui/components/badge'
import { Check, Copy, Edit, Trash2 } from 'lucide-react'
import { useCoupons } from '@/hooks/useCoupons'
import { Coupon } from '@/types/coupons'
import { toast } from 'sonner'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCoupon } from '@/lib/action/coupons'

export function CouponTable() {
  const { data: coupons } = useCoupons()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const router = useRouter()
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="default">Active</Badge>
      case 'expired':
        return <Badge className="bg-destructive text-destructive-foreground">Expired</Badge>
      default:
        return <Badge className="outline">{status}</Badge>
    }
  }

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      toast.success('Coupon code copied to clipboard')
      setTimeout(() => {
        setCopiedCode(null)
      }, 2000)
    } catch (error) {
      toast.error('Failed to copy coupon code')
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/coupons/edit/${id}`)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteCoupon(id)
      console.log(response)
      if (response.status === 200) {
        toast.success('Coupon deleted successfully')
        router.refresh()
      } else {
        toast.error('Failed to delete coupon')
      }
    } catch (error) {
      toast.error('Failed to delete coupon')
      // router.refresh()
    }
  }

  return (
    <div className="space-y-4 py-8">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead>Code</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden md:table-cell">Amount</TableHead>
            <TableHead className="hidden md:table-cell">Expires At</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons?.map((coupon: Coupon) => (
            <TableRow key={coupon.id}>
              <TableCell className="font-medium">{coupon.code}</TableCell>
              <TableCell className="hidden capitalize md:table-cell">{coupon.type}</TableCell>
              <TableCell className="hidden md:table-cell">
                {coupon.type === 'percentage' ? `${coupon.amount}%` : `₦${coupon.amount}`}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(coupon.expires_at || '')}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {getStatusBadge(coupon.status)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(coupon.code)}>
                    {copiedCode === coupon.code ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(coupon.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(coupon.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
    </div>
  )
}
