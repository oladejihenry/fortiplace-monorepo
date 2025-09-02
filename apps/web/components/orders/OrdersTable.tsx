'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Download, ExternalLink, Eye, ImageIcon } from "lucide-react"
import { useCustomerOrder } from "@/hooks/useCustomerOrder"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import { toast } from "sonner"
import { Order, OrderItem } from "@/types/customer-orders"
import { parseAsString, useQueryState } from "nuqs"
import { PDFViewer } from "../downloads/pdf-viewer"
import { DialogDescription, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog"
import { Dialog, DialogContent } from "@workspace/ui/components/dialog"

export function OrdersTable() {
  const [page, setPage] = useQueryState('page', parseAsString.withDefault('1'))
  const [search] = useQueryState('search', parseAsString.withDefault(''))
  const { data: orderData, isLoading } = useCustomerOrder()

  // Format currency
  const formatCurrency = (amount: string) => {
    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount)) return "₦0"
    
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(numericAmount)
  }


  // Handle download
  const handleDownload = async (item: OrderItem) => {

    try {

      if (!item.product.download_url) {
        toast.error("Download URL not available")
        return
      }


      //send to download api route

      const apiDownloadUrl = `/api/downloads?fileUrl=${encodeURIComponent(item.product.download_url)}&fileName=${encodeURIComponent(item.product.file_name)}`;
      
      const link = document.createElement('a');
      link.href = apiDownloadUrl;
      link.setAttribute('download', item.product.file_name);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started")
    } catch (error) {
      console.log(error)
      toast.error("Failed to generate download link. Please try again.")
    }
  }

  // View product in store
  const handleViewProduct = (subdomain: string, productId: string) => {
    const maindomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN
    const production = process.env.NODE_ENV === 'production'
    const url = production 
      ? `https://${subdomain}.${maindomain}/product/${productId}`
      : `http://${subdomain}.localhost:3000/product/${productId}`
    window.open(url, '_blank')
  }

  // Filter orders based on search
  const filteredOrders = orderData?.data?.filter((order: Order) => 
    order.items.some(item => 
      item.product.name.toLowerCase().includes(search.toLowerCase()) ||
      order.order_id.toLowerCase().includes(search.toLowerCase())
    )
  ) || []

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
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]"></TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="hidden md:table-cell">Order ID</TableHead>
            <TableHead className="hidden md:table-cell">Seller</TableHead>
            <TableHead className="hidden md:table-cell">Amount</TableHead>
            <TableHead className="hidden md:table-cell">Downloads</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order: Order) => (
              order.items.map((item: OrderItem) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                      {item.product.cover_image ? (
                        <Image 
                          src={item.product.cover_image} 
                          alt={item.product.name}
                          width={250}
                          height={250}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.product.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{order.order_id}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col">
                      <span>{item.product.seller.store.name}</span>
                      <span className="text-sm text-muted-foreground">
                        by {item.product.seller.username}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatCurrency(item.total_price_ngn)}</TableCell>
                  <TableCell className="hidden md:table-cell">{item.download_count}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(order.created_at)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={order.payment_status === 'success' ? 'default' : 'destructive'}>
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProduct(
                          item.product.seller.store.subdomain,
                          item.product.product_id
                        )}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View Product</span>
                      </Button>
                      {item.product.view_product_online ? (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                variant="default"
                                size="sm"
                                disabled={!item.product.download_url || order.payment_status !== 'success'}
                                >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View PDF</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-7xl w-[95vw] h-[90vh] overflow-hidden flex flex-col p-0">
                                <DialogDescription className="sr-only">{item.product.file_name}</DialogDescription>
                                <DialogTitle className="sr-only">{item.product.file_name}</DialogTitle>
                                <div className="flex-1 overflow-auto">
                                    <PDFViewer
                                        fileUrl={item.product.download_url}
                                        // fileName={item.product.file_name}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleDownload(item)}
                          disabled={!item.product.download_url || order.payment_status !== 'success'}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                {search ? 'No orders found matching your search.' : 'No orders found.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{orderData?.meta?.from || 0}</span> to{" "}
          <span className="font-medium">{orderData?.meta?.to || 0}</span> of{" "}
          <span className="font-medium">{orderData?.meta?.total || 0}</span> orders
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(String(Number(page) - 1))}
            disabled={Number(page) <= 1}
          >
            Previous
          </Button>
          
          {Array.from({ length: Math.min(5, orderData?.meta?.last_page || 1) }, (_, i) => {
            const pageNumber = i + 1
            return (
              <Button
                key={pageNumber}
                variant={Number(page) === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(String(pageNumber))}
                className="w-8 h-8 p-0"
              >
                {pageNumber}
              </Button>
            )
          })}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(String(Number(page) + 1))}
            disabled={Number(page) >= (orderData?.meta?.last_page || 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}