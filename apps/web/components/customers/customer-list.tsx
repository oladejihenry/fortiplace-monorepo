"use client"

import { useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { PaginatedResponse, Customer } from "@/types/customers"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import { EmptyCustomers } from "./empty-customer"
import { OrderDialog } from "./customer-dialog"
import Link from "next/link"

export function CustomersList({ customers }: { customers: PaginatedResponse<Customer> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const searchTerm = searchParams.get('search')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>()
  if(!customers || !customers.data) {
    return <EmptyCustomers />
  }
  const createQueryString = (params: Record<string, string | number | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, String(value))
      }
    })
    
    return newSearchParams.toString()
  }

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?${createQueryString({ page: newPage })}`)
  }

  const filteredCustomers = searchTerm
    ? customers.data.filter(customer => 
        customer.customer_details.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customer_details.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.order_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : customers.data

  if (customers.data.length === 0) {
    return <EmptyCustomers />
  }

  return (
    <div className="space-y-4 py-8">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Total</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {customer.order_id}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{customer.customer_details.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {customer.customer_details.email}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatPrice(customer.financial_details.amount_ngn || 0, 'NGN')}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge 
                  variant={
                    customer.order_details.status === 'success' 
                      ? "default" 
                      : customer.order_details.status === 'pending' 
                      ? "secondary" 
                      : "destructive"
                  }
                >
                  {customer.order_details.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {format(new Date(customer.order_details.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <Link href="#" onClick={() => setSelectedCustomer(customer)}>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <Eye className="h-4 w-4" />
                    </Button>
                </Link>
               
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Order Dialog */}
      <OrderDialog
        customer={selectedCustomer}
        open={!!selectedCustomer}
        onOpenChange={(open) => {
          if (!open) setSelectedCustomer(undefined)
        }}
      />

      {customers.meta.total > customers.meta.per_page && (
        <Pagination className="justify-end">
          <PaginationContent>
            {customers.meta.links.map((link, i) => {
              if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                return null
              }

              if (link.label === '...') {
                return (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={() => {
                      if (link.url) {
                        const url = new URL(link.url)
                        const page = url.searchParams.get('page')
                        handlePageChange(Number(page))
                      }
                    }}
                    isActive={link.active}
                  >
                    {link.label}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={() => handlePageChange(customers.meta.current_page - 1)}
                isActive={customers.meta.current_page > 1}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={() => handlePageChange(customers.meta.current_page + 1)}
                isActive={customers.meta.current_page < customers.meta.last_page}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}