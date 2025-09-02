"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { EmptyProducts } from "./empty-product"
import { PaginatedResponse, Product } from "@/types/product"
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
import { MoreHorizontal, Pencil, Trash, ImageIcon, ArrowUpRightIcon, EyeClosed, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel } from "@workspace/ui/components/alert-dialog"
import { toast } from "sonner"
import axios from "@/lib/axios"
import { ProductsPagination } from "./products-pagination"
import { AxiosError } from "axios"
interface ProductsListProps {
  products: PaginatedResponse<Product>
}

export function ProductsList({ products }: ProductsListProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [productToDelete, setProductToDelete] = useState<string | null>(null)


  const searchTerm = searchParams.get('search')

  if(!products || !products.data) {
    return <EmptyProducts />
  }

  const filteredProducts = searchTerm
    ? products.data.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      )
    : products.data

  if (products.data.length === 0) {
    return <EmptyProducts />
  }
  const handleDelete = async (productId: string) => {
    try {
      const response = await axios.delete(`/api/products/${productId}`)
      if (response.status === 204) {
        toast.success('Product deleted successfully')
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleViewProduct = (product: Product) => {
    const subdomain = product.creator.subdomain
    const maindomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN
    const production = process.env.NODE_ENV === 'production'
    const url = production ? `https://${subdomain}.${maindomain}/product/${product.product_id}` : `http://${subdomain}.localhost:3000/product/${product.product_id}`
    window.open(url, '_blank')
  }

  const handlePublishToggle = async (productId: string, isCurrentlyPublished: boolean) => {
    try {
      const response = await axios.patch(`/api/products/${productId}/publish`, {
        is_published: !isCurrentlyPublished
      })
      if (response.status === 200) {
        toast.success(isCurrentlyPublished ? 'Product unpublished successfully' : 'Product published successfully')
        router.refresh()
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Failed to publish product")
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  return (
    <div className="space-y-4 py-8">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px] hidden md:table-cell"></TableHead>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden md:table-cell">Price</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Edit</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id} className="hover:bg-muted/50">
              <TableCell className="py-4 hidden md:table-cell">
                <div className="ml-2 h-14 w-14 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                  {product.cover_image ? (
                    <Image
                      src={product.cover_image}
                      alt={product.name}
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
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{product.name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary" className="capitalize">
                  {product.product_type.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {/* {formatPrice(product.price || 0, product.metadata?.currency || 'USD')} */}
                <div className="flex flex-col">
                  {product.slashed_price && product.slashed_price > 0 ? (
                    <>
                      <span className="font-medium">
                        {formatPrice(product.price || 0, product.metadata?.currency || 'USD')}
                      </span>
                      <span className="text-muted-foreground line-through text-sm">
                        {formatPrice(product.slashed_price, product.metadata?.currency || 'USD')}
                      </span>
                    </>
                  ) : (
                    <span className="font-medium">
                      {formatPrice(product.price || 0, product.metadata?.currency || 'USD')}
                    </span>
                  )}

                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                  <Badge 
                    variant={product.is_published ? "default" : "secondary"}
                  >
                    {product.is_published ? "Published" : "Draft"}
                  </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Button 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={() => router.push(`/products/${product.product_id}/edit`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/products/${product.product_id}/edit`)}
                      className="cursor-pointer md:hidden"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    
                    {/* <hr className="my-1" /> */}
                    <DropdownMenuItem
                      onClick={() => handleViewProduct(product)}
                      className="cursor-pointer"
                    >
                      <ArrowUpRightIcon className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <hr className="my-1" />
                    <DropdownMenuItem
                      onClick={() => handlePublishToggle(product.product_id, product.is_published)}
                      className="cursor-pointer"
                    >
                      {product.is_published ? (
                        <>
                          <EyeClosed className="mr-2 h-4 w-4" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Publish
                        </>
                      )}
                    </DropdownMenuItem>
                    <hr className="my-1" />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault()
                            setProductToDelete(product.product_id)
                          }}
                          className="cursor-pointer"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            product and remove all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                              if (productToDelete) {
                                handleDelete(productToDelete)
                              }
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination */}
      <ProductsPagination products={products} />
    </div>
  )
}