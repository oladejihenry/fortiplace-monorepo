import { useCartStore } from "@/store/use-cart-store"
import { X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import Image from "next/image"
import { formatPrice, getPriceForCurrency } from "@/lib/utils"
import { useCurrencyStore } from "@/store/use-currency-store"
import { CartItem as CartItemType } from "@/types"


interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const removeItem = useCartStore((state) => state.removeItem)
  const { selectedCurrency } = useCurrencyStore()
  
  const price = getPriceForCurrency(item.prices, selectedCurrency)
  return (
    <div className="flex gap-4">
      <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
        <Image
          src={item.cover_image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex justify-between gap-2">
          <span className="text-sm font-medium">
            {item.name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => removeItem(item.id)}
          >
            <X className="size-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          Qty: {item.quantity}
        </span>
        <span className="text-sm font-medium">
          {formatPrice(price, selectedCurrency)}
        </span>
      </div>
    </div>
  )
}