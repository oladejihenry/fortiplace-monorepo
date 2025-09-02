import { Editor } from "@/components/editor"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Currency } from "@/types/currencies"
import { UseFormReturn } from "react-hook-form"
import { BasicInfoFormValues } from "../basic-product-form"
import { Button } from "@workspace/ui/components/button"
import { WandSparkles } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface ProductInfoTabProps {
  form: UseFormReturn<BasicInfoFormValues>
  onAIOpen: () => void
  isGenerating: boolean
}

export function ProductInfoTab({ form, onAIOpen, isGenerating }: ProductInfoTabProps) {
  return (
    <div className="grid gap-6">
        <div className="space-y-2">
            <Button
                type="button"
                onClick={onAIOpen}
                disabled={isGenerating}
                variant="outline" 
                size="sm" 
                className="gap-2 w-fit px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-700 dark:hover:text-emerald-300"
            >
                <WandSparkles className="h-4 w-4" />
                <span className="font-medium">AI Generate</span>
            </Button>
        </div>


        {/* Product Name */}
        <div className="space-y-2">
            <label className="text-sm font-medium">Product Name</label>
            <Input 
            placeholder="e.g., Ultimate Design System"
            {...form.register("name")}
            className="bg-background"
            />
            {form.formState.errors.name && (
            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
        </div>

        {/* Currency & Price */}
        <div className="space-y-2">
            <label className="text-sm font-medium">Price</label>
            <div className="relative flex items-center">
            <div className="relative flex-1">
                <Select
                onValueChange={(value) => form.setValue("metadata.currency", value as Currency)}
                value={form.watch("metadata.currency")}
                >
                <SelectTrigger className="w-[80px] absolute left-0 top-0 bottom-0 rounded-r-none border-r-0">
                    <SelectValue placeholder="$" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="NGN">NGN</SelectItem>
                </SelectContent>
                </Select>
                <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Price your product"
                className="pl-[85px] bg-background"
                {...form.register("price", { 
                    valueAsNumber: true,
                    setValueAs: (value) => value === "" ? undefined : parseFloat(value)
                })}
                />
            </div>
            </div>
            {form.formState.errors.price && (
            <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
            )}
        </div>

        {/* Content */}
        <div className="space-y-2">
            <label className="text-sm font-medium">Product Content</label>
            <div className="overflow-hidden rounded-md border">
                <Editor
                    value={form.watch("content") || ""}
                    onChange={(value) => form.setValue("content", value)}
                    placeholder="Write a detailed description of your product..."
                />
            </div>
            <p className="text-sm text-muted-foreground">
                Use formatting tools to make your content more engaging
            </p>
            {form.formState.errors.content && (
                <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
            )}
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
            <label className="text-sm font-medium">Cover Image</label>
            <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Thumbnail container - smaller thumbnail on mobile, larger on desktop */}
                <div className="w-48 md:w-80 md:h-80 relative rounded-lg"> {/* Changed to w-32 h-32 for mobile */}
                    <ImageUpload
                        value={form.watch("cover_image") || ""}
                        onChange={(value) => form.setValue("cover_image", value)}
                        onRemove={() => form.setValue("cover_image", "")}
                        endpoint="cover-image"
                    />
                    {form.formState.errors.cover_image && (
                        <p className="text-sm text-red-500">
                            {form.formState.errors.cover_image.message}
                        </p>
                    )}
                </div>
                {/* Help text - full width on mobile, side on desktop */}
                <div className="w-full md:flex-1 space-y-1"> {/* Reduced mt-12 to mt-2 */}
                    <p className="text-sm text-muted-foreground">
                        Upload a cover image for your product
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Recommended size: 800x800px. Max size: 2MB
                    </p>
                </div>
                
            </div>
            
            
        </div>
    </div>
  )
}