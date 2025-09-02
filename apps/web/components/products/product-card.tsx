import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Image
            src={product.cover_image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="font-bold">${product.price}</span>
        <Link 
          href={`/products/${product.id}`}
          className="text-sm text-primary hover:underline"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}