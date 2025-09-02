"use client"

import { Button } from "@workspace/ui/components/button"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useProductForm } from "@/store/use-product-form"
import { toast } from "sonner"
import { AxiosError } from "axios"

export function NewProductHeader() {
  const router = useRouter()
  const { product_type, name, price, initializeProduct } = useProductForm()

  const isFormValid = product_type && name.trim() && price >= 1000

  const handleContinue = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all fields")
      return
    }

    if(!price || price < 1000) {
      toast.error("Price must be at least ₦1,000")
      return
    }

    try {
      const productId = await initializeProduct()
      router.push(`/products/${productId}/edit`)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Failed to create product")
      } else {
        toast.error("Failed to create product")
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create New Product</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Choose a product type to get started
        </p>
      </div>
      <div className="flex items-center gap-4 sm:gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex-1 sm:flex-none"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!product_type}
          className="flex-1 sm:flex-none"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}