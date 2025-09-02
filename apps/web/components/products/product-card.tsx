import { Card, CardContent, CardFooter, CardHeader } from '@workspace/ui/components/card'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-video">
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
        <h3 className="line-clamp-1 font-semibold">{product.name}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="font-bold">${product.price}</span>
        <Link href={`/products/${product.id}`} className="text-primary text-sm hover:underline">
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}
