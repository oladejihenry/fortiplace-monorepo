"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Trash, Eye, EyeClosed, ExternalLink, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import axios from "@/lib/axios"
import { AxiosError } from "axios"
import { parseAsString } from "nuqs"
import { useQueryState } from "nuqs"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
// Define the type for creator (user) data
interface CreatorData {
  id: string;
  username: string;
  email: string;
  subdomain: string;
  store_url: string;
}

// Define the type for individual product based on API response
interface ProductData {
  id: string;
  product_id: string;
  name: string;
  description: string;
  content: string;
  price: string;
  cover_image: string;
  preview_images: string | null;
  product_file: string;
  product_url: string;
  product_type: string;
  is_published: boolean;
  metadata: {
    currency: string;
    callToAction: string;
  };
  creator: CreatorData;
  created_at: string;
  updated_at: string;
  version: number;
  banned?: boolean;
  ban_reason?: string;
  banned_at?: string;
}



export function ManageProductsTable() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search] = useQueryState('search', parseAsString.withDefault(''));
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // Fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/admin/products');
      setProducts(response.data.data || []);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
        throw error.response?.data
      }
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Sort products: most recent first
  const sortedProducts = [...products].sort((a, b) => {
    // Sort by created date, newest first
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  
  // Filter products based on search
  const filteredProducts = sortedProducts.filter((product) => 
    (product.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (product.description?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (product.creator?.username?.toLowerCase() || '').includes(search.toLowerCase())
  );

  useEffect(() => {
    setPage(1);
  }, [search]);
  
  // Paginate products
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePublishToggle = async (productId: string, isCurrentlyPublished: boolean) => {
    try {
      const response = await axios.put(`/api/admin/products/${productId}/status`, { 
        is_published: !isCurrentlyPublished 
      });
      toast.success(response.data.message || `Product ${isCurrentlyPublished ? 'unpublished' : 'published'} successfully`);
      fetchProducts();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          toast.error(error.response.data.message || "You are not authorized to update this product's status");
        } else {
          toast.error(error.response?.data.message || "Failed to update product status");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };


  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await axios.delete(`/api/admin/products/${productId}`);
      setProductToDelete(null);
      toast.success(response.data.message || "Product deleted successfully");
      fetchProducts();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Failed to delete product");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return "₦0";
    
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(numericAmount);
  };

  // Check if product is banned
  const isBanned = (product: ProductData): boolean => {
    return product.banned === true;
  };

  const handleViewProduct = (product: ProductData) => {

    const subdomain = product.creator.subdomain
    const maindomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN
    const production = process.env.NODE_ENV === 'production'
    const url = production ? `https://${subdomain}.${maindomain}/product/${product.product_id}` : `http://${subdomain}.localhost:3000/product/${product.product_id}`
    window.open(url, '_blank')
  };

  if (isLoading) {
    return (
      <div className="space-y-4 py-8">
        <div className="flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-8">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px] hidden md:table-cell"></TableHead>
            <TableHead className="w-[300px]">Product</TableHead>
            <TableHead className="hidden md:table-cell">Creator</TableHead>
            <TableHead className="hidden md:table-cell">Price</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center overflow-hidden">
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
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col">
                    <span>{product.creator.username}</span>
                    <a 
                      href={product.creator.store_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View Store
                    </a>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col">
                    <span className="font-medium">{formatCurrency(product.price)}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col">
                    <span>{formatDate(product.created_at)}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell capitalize">
                  {product.product_type.replace('_', ' ')}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      isBanned(product) ? "destructive" :
                      product.is_published ? "default" : "secondary"
                    }
                  >
                    {isBanned(product) ? "Banned" : 
                     product.is_published ? "Published" : "Draft"}
                  </Badge>
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
                        onClick={() => handleViewProduct(product)}
                        className="cursor-pointer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>View Product</span>
                      </DropdownMenuItem>
                      {!isBanned(product) && (
                        <DropdownMenuItem
                          onClick={() => handlePublishToggle(product.product_id, product.is_published)}
                          className="cursor-pointer"
                        >
                          {product.is_published ? (
                            <EyeClosed className="mr-2 h-4 w-4" />
                          ) : (
                            <Eye className="mr-2 h-4 w-4" />
                          )}
                          {product.is_published ? (
                            <span>Unpublish</span>
                          ) : (
                            <span>Publish</span>
                          )}
                        </DropdownMenuItem>
                      )}
                      <hr className="my-1" />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              setProductToDelete(product.product_id);
                            }}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete Product</span>
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the product
                              and all associated data including sales records.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => productToDelete && handleDeleteProduct(productToDelete)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                {search ? 'No products found matching your search.' : 'No products found.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{paginatedProducts.length > 0 ? startIndex + 1 : 0}</span> to{" "}
          <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> of{" "}
          <span className="font-medium">{filteredProducts.length}</span> products
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page => Math.max(1, page - 1))}
            disabled={page <= 1}
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
            const pageNumber = i + 1;
            return (
              <Button
                key={pageNumber}
                variant={page === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(pageNumber)}
                className="w-8 h-8 p-0"
              >
                {pageNumber}
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page => Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
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
  );
}