"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Customer } from "@/types/customers"
import { format } from "date-fns"
import { Badge } from "@workspace/ui/components/badge"
import { formatPrice } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { User2 } from "lucide-react"
import { DialogDescription } from "@radix-ui/react-dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import Image from "next/image"
interface OrderDialogProps {
  customer?: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDialog({ customer, open, onOpenChange }: OrderDialogProps) {
  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">

        <VisuallyHidden>
          <DialogDescription>
            Order details and transaction information for order {customer.order_id}
          </DialogDescription>
        </VisuallyHidden>

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order #{customer.order_id}
          </DialogTitle>
        </DialogHeader>
        <div className="h-[600px] overflow-hidden">
          <Tabs defaultValue="details" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="receipt">Receipt</TabsTrigger>
            </TabsList>
            
            <div className="h-full overflow-y-auto px-1 py-4">
              <TabsContent value="details" className="mt-0 h-full">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User2 className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium">Name</p>
                        <p className="text-sm text-muted-foreground">{customer.customer_details.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{customer.customer_details.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Order Date</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(customer.order_details.created_at), 'PPP')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status</p>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="product" className="mt-4 h-full">
                <div className="rounded-md">
                    <UITable>
                        <TableHeader className="bg-muted text-muted-foreground">
                            <TableRow className="border-b border-border hover:bg-transparent">
                            <TableHead className="text-sm font-medium uppercase text-muted-foreground">Image</TableHead>
                            <TableHead className="text-sm font-medium uppercase text-muted-foreground">Name</TableHead>
                            <TableHead className="text-center text-sm font-medium uppercase text-muted-foreground">Quantity</TableHead>
                            <TableHead className="text-right text-sm font-medium uppercase text-muted-foreground">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customer.items.map((item, index) => (
                            <TableRow key={index} className="hover:bg-muted/50">
                                <TableCell className="w-[100px]">
                                <div className="h-[50px] w-[50px] overflow-hidden rounded-md border">
                                    <Image 
                                    src={item.product?.image} 
                                    alt={item.product.name}
                                    className="h-full w-full object-cover"
                                    width={50}
                                    height={50}
                                    />
                                </div>
                                </TableCell>
                                <TableCell className="max-w-[200px]">
                                <div className="font-medium text-primary">
                                    {item.product.name}
                                </div>
                                </TableCell>
                                <TableCell className="text-center">1</TableCell>
                                <TableCell className="text-right">
                                {formatPrice(item.unit_price_ngn || 0, 'NGN')}
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </UITable>
                </div>
            </TabsContent>

              <TabsContent value="receipt" className="mt-0 h-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Receipt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <h4 className="text-sm font-medium">Transaction Details</h4>
                        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <div>
                            <p className="text-sm font-medium">Amount</p>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(customer.financial_details.amount_ngn || 0, customer.financial_details.original_currency)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Payment Status</p>
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
                          </div>
                          <div>
                            <p className="text-sm font-medium">Transaction ID</p>
                            <p className="text-sm text-muted-foreground">{customer.order_id}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Payment Date</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(customer.order_details.created_at), 'PPP')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium">Customer Details</h4>
                        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <div>
                            <p className="text-sm font-medium">Name</p>
                            <p className="text-sm text-muted-foreground">{customer.customer_details.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{customer.customer_details.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}