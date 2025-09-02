"use client"

import { Card } from "@workspace/ui/components/card"
import { ProductType } from "@/types/product"
import { useProductForm } from "@/store/use-product-form"
import { FileText, Book } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Currency } from "@/types/currencies"
import { useEffect } from "react"


interface ProductTypeCard {
  title: string
  description: string
  icon: React.ElementType
  type: ProductType
}

const productTypes: ProductTypeCard[] = [
  {
    title: "Digital Product",
    description: "Any set of files to download or stream",
    icon: FileText,
    type: ProductType.DIGITAL,
  },
  {
    title: "E-book",
    description: "Offer a book or comic in PDF, ePub, and Mobi formats",
    icon: Book,
    type: ProductType.EBOOK,
  },
  {
    title: "Course",
    description: "Sell a course or tutorial",
    icon: Book,
    type: ProductType.COURSE,
  },

]

export function ProductTypeSelector() {
    const { setBasicInfo, product_type, name, price, metadata, reset } = useProductForm()
    
    useEffect(() => {
      reset()
    }, [reset])

    const handleSelectType = (type: ProductType) => {
      setBasicInfo({ product_type: type })
    }

    // const handlePriceChange = (value: string) => {
    //   const numericValue = parseFloat(value)
    //   if
    // }

  return (
    <form className="space-y-12">
        <div className="space-y-2">
            <label className="text-sm font-medium">Product Name</label>
            <Input
                type="text"
                name="name"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setBasicInfo({ name: e.target.value })}
                className="bg-background"
            />
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium">Product Type</label>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {productTypes.map((item) => {
                    const Icon = item.icon
                    return (
                    <Card
                        key={item.type}
                        className={`relative cursor-pointer transition-all hover:border-primary ${
                        product_type === item.type ? "border-2 border-primary" : ""
                        }`}
                        onClick={() => handleSelectType(item.type)}
                    >
                        <div className="p-6 space-y-4">
                        <div className="rounded-lg w-12 h-12 flex items-center justify-center bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">
                            {item.description}
                            </p>
                        </div>
                        </div>
                    </Card>
                    )
                })}
            </div>
        </div>

         {/* Currency & Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Price</label>
          <div className="relative flex items-center">
            <div className="relative flex-1">
              <Select
                value={metadata.currency}
                onValueChange={(value: Currency) => 
                    setBasicInfo({ 
                    metadata: { ...metadata, currency: value } 
                    })
                }
              >
                <SelectTrigger className="w-[80px] absolute left-0 top-0 bottom-0 rounded-r-none border-r-0 cursor-pointer">
                  <SelectValue placeholder="$" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="1000"
                step="100"
                placeholder="Minimum price is ₦1,000"
                className="pl-[85px] bg-background"
                value={price || ""}
                onChange={(e) => setBasicInfo({ price: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </div>
    </form>
  )
}