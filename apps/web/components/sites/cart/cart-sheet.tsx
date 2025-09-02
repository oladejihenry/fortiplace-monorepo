"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/use-cart-store"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CartItem } from "./cart-item"
import { formatPrice, getPriceForCurrency } from "@/lib/utils"
import { useCurrencyStore } from "@/store/use-currency-store"


export function CartSheet() {
    const [open, setOpen] = useState(false)
    const { items, isLoading, setIsLoading} = useCartStore()
    const { selectedCurrency } = useCurrencyStore()
    const router = useRouter()

   

    const calculateTotalPrice = () => {
      return items.reduce((total, item) => {
        const price = getPriceForCurrency(item.prices, selectedCurrency)
        return total + (price * item.quantity)
      }, 0)
    }


    const handleCheckout = async () => {
        setIsLoading(true)
        try {
        router.push('/checkout')
        setOpen(false)
        } finally {
        setIsLoading(false)
        }
    }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="size-5" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 size-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="p-4">
        <SheetHeader className="p-0">
          <SheetTitle>Shopping Cart ({items.length})</SheetTitle>
          <SheetDescription>
            Your cart
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              Your cart is empty
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                  />
                ))}
              </div>
              <div className="mt-auto space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotalPrice(), selectedCurrency)}</span>
                </div>
                <Button 
                  className="w-full bg-[#00A99D]" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Checkout"}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}