'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@workspace/ui/components/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { ProductType, ProductDraftUpdate } from '@/types/product'
import { useProductForm } from '@/store/use-product-form'
import { useEffect, useState } from 'react'
import { Currency } from '@/types/currencies'
import { toast } from 'sonner'
import { Switch } from '@workspace/ui/components/switch'
import { Bot, File, FileText, Loader2 } from 'lucide-react'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { Textarea } from '@workspace/ui/components/textarea'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { DialogContent } from '@workspace/ui/components/dialog'
import { AxiosError } from 'axios'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { ProductInfoTab } from './tabs/product-info-tab'
import { ProductFilesTab } from './tabs/product-files-tab'
import { cn } from '@workspace/ui/lib/utils'
import { CourseFile } from '@/types/course-file'
import { Input } from '@workspace/ui/components/input'

const CallToAction = {
  BUY_NOW: 'buy_now',
  I_WANT_THIS: 'i_want_this',
  PAY_NOW: 'pay_now',
} as const

type CallToActionType = (typeof CallToAction)[keyof typeof CallToAction]

interface FileMetadata {
  name: string
  size: number
  type: string
  url: string
  version: number
  file_hash?: string
}

export type BasicInfoFormValues = {
  id?: string
  product_id?: string
  name: string
  description: string
  content: string
  product_type: ProductType
  price: number
  product_file: string
  file_hash?: string
  cover_image: string
  metadata: {
    currency: Currency
    callToAction: 'buy_now' | 'i_want_this' | 'pay_now'
  }
  creator: {
    subdomain?: string
  }
  is_published: boolean
  add_customer_email_to_pdf_footer: boolean
  view_product_online: boolean
  slashed_price: number | null
  product_files?: CourseFile[]
}

const basicInfoSchema = z.object({
  id: z.string().optional(),
  product_id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
  product_type: z.nativeEnum(ProductType),
  price: z
    .number()
    .min(1000, {
      message: 'Minimum price allowed is ₦1,000. Please increase your product price.',
    })
    .nonnegative('Price cannot be negative'),
  product_file: z.string().min(1, 'Product file is required'),
  file_hash: z.string().optional(),
  cover_image: z.string().min(1, 'Cover image is required'),
  metadata: z.object({
    currency: z.nativeEnum(Currency),
    callToAction: z.enum([CallToAction.BUY_NOW, CallToAction.I_WANT_THIS, CallToAction.PAY_NOW], {
      required_error: 'Call to action is required',
    }),
  }),
  creator: z.object({
    subdomain: z.string().optional(),
  }),
  is_published: z.boolean(),
  add_customer_email_to_pdf_footer: z.boolean(),
  view_product_online: z.boolean(), // Remove .default() to match form type
  slashed_price: z.number().nullable(),
})

// export type BasicInfoFormValues = z.infer<typeof basicInfoSchema> & {
//   product_files?: CourseFile[]
// }

type BasicProductFormProps = {
  initialData?: {
    data?: BasicInfoFormValues
  }
}

export function BasicProductForm({ initialData }: BasicProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [aiPrompt, setAIPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('product-info')
  const [fileMetadata, setFileMetadata] = useState<{
    name: string
    size: number
    type: string
    file_hash?: string
  } | null>(() => {
    if (initialData?.data?.product_file && typeof initialData.data.product_file === 'object') {
      const file = initialData.data.product_file as FileMetadata
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        file_hash: file.file_hash,
      }
    }
    return null
  })
  const { ...formState } = useProductForm()
  const router = useRouter()

  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      id: initialData?.data?.id || formState.id || '',
      product_id: initialData?.data?.product_id || formState.product_id || '',
      name: initialData?.data?.name || formState.name || '',
      description: initialData?.data?.description || formState.description || '',
      content: initialData?.data?.content || formState.content || '',
      product_type:
        initialData?.data?.product_type || formState.product_type || ProductType.DIGITAL,
      price: initialData?.data?.price || formState.price || 0,
      product_file:
        typeof initialData?.data?.product_file === 'object'
          ? (initialData.data.product_file as FileMetadata).url
          : initialData?.data?.product_file || formState.product_file || '',
      file_hash: initialData?.data?.file_hash || formState.file_hash || '',
      cover_image: initialData?.data?.cover_image || formState.cover_image || '',
      view_product_online: initialData?.data?.view_product_online ?? false,
      is_published: initialData?.data?.is_published ?? true,
      add_customer_email_to_pdf_footer:
        initialData?.data?.add_customer_email_to_pdf_footer ?? false,
      metadata: {
        currency:
          initialData?.data?.metadata?.currency || formState.metadata?.currency || Currency.NGN,
        callToAction:
          initialData?.data?.metadata?.callToAction ||
          formState.metadata?.callToAction ||
          CallToAction.BUY_NOW,
      },
      slashed_price: initialData?.data?.slashed_price ?? null,
    },
  })

  useEffect(() => {
    if (initialData?.data) {
      Object.entries(initialData.data).forEach(([key, value]) => {
        if (key === 'product_file' && typeof value === 'object') {
          form.setValue('product_file', (value as FileMetadata).url)
          // Set the file metadata
          setFileMetadata({
            name: (value as FileMetadata).name,
            size: (value as FileMetadata).size,
            type: (value as FileMetadata).type,
          })
        } else {
          form.setValue(key as keyof BasicInfoFormValues, value)
        }
      })
    }
  }, [initialData, form])

  useEffect(() => {
    // Watch for product file validation errors
    if (form.formState.errors.product_file?.message) {
      toast.error(form.formState.errors.product_file.message)
      setActiveTab('product-files')
    }
  }, [form.formState.errors.product_file])

  const handleSaveDraft = async () => {
    //save draft to laravel api
    try {
      setIsSavingDraft(true)
      const formData = form.getValues()

      const draftData: ProductDraftUpdate = {
        name: formData.name,
        content: formData.content,
        product_type: formData.product_type,
        price: formData.price,
        product_file: formData.product_file,
        metadata: formData.metadata,
        cover_image: formData.cover_image,
        is_published: formData.is_published,
        status: 'draft',
      }
      const productId = initialData?.data?.product_id || ''
      const response = await axios.put(`/api/products/draft/${productId}`, draftData)
      if (response.status === 200) {
        toast.success('Draft saved successfully')
        router.push('/products/')
      } else {
        toast.error('Failed to save draft')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Failed to save draft')
      } else {
        toast.error('Failed to save draft')
      }
    } finally {
      setIsSavingDraft(false)
    }
  }

  const onSubmit = async (data: BasicInfoFormValues) => {
    try {
      setIsLoading(true)
      const formData = {
        ...data,
        file_hash: form.getValues('file_hash'),
        is_published: true,
        slashed_price: data.slashed_price ?? null,
        add_customer_email_to_pdf_footer: data.add_customer_email_to_pdf_footer,
        view_product_online: data.view_product_online,
      }
      const response = await axios.put(`/api/products/${formData.product_id}`, formData)
      if (response.status === 200) {
        toast.success('Product updated successfully')
        router.push('/products')
      } else {
        toast.error('Failed to update product')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Failed to submit form')
      } else {
        toast.error('Failed to submit form')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for the AI')
      return
    }

    try {
      setIsGenerating(true)

      // Call your AI generation API
      const response = await axios.post('/api/generate-product', {
        prompt: aiPrompt,
      })

      if (response.status === 200) {
        // Update form with generated content
        const generatedContent = response.data

        // Update form fields with generated content
        if (generatedContent.name) {
          form.setValue('name', generatedContent.name)
        }

        if (generatedContent.description) {
          form.setValue('description', generatedContent.description)
        }

        if (generatedContent.content) {
          form.setValue('content', generatedContent.content)
        }

        toast.success('Content generated successfully')
        setIsAIModalOpen(false)
        setAIPrompt('')
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
      } else {
        toast.error('Failed to generate content')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="relative flex flex-col lg:flex-row">
      {/* AI Generate Modal */}

      <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-emerald-500" />
              AI Content Generator
            </DialogTitle>
            <DialogDescription>
              This AI Generator will generate product name, caption and description by providing a
              prompt.
            </DialogDescription>
            {/* Warning message as a separate element, not inside the DialogDescription */}
            <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700">
              <strong>N.B:</strong> After content is generated, it will replace any existing product
              name, caption and description on your product.
            </div>
          </DialogHeader>

          <div className="py-4">
            <label htmlFor="ai-prompt" className="mb-2 block text-sm font-medium">
              Enter your prompt
            </label>
            <Textarea
              id="ai-prompt"
              value={aiPrompt}
              onChange={(e) => setAIPrompt(e.target.value)}
              placeholder="e.g., Create content for a digital marketing ebook that teaches social media strategies"
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAIModalOpen(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAIGenerate}
              disabled={isGenerating}
              className="bg-emerald-500 text-white hover:bg-emerald-600"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">Generate</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex-1 space-y-6 pb-6 lg:pb-0 lg:pr-8">
        <Tabs
          defaultValue="product-info"
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="product-info" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Product Info
            </TabsTrigger>
            <TabsTrigger value="product-files" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              Product Files
            </TabsTrigger>
          </TabsList>

          <form id="basic-product-form" onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="product-info">
              <ProductInfoTab
                form={form}
                onAIOpen={() => setIsAIModalOpen(true)}
                isGenerating={isGenerating}
              />
            </TabsContent>
            <TabsContent value="product-files">
              <ProductFilesTab
                form={form}
                fileMetadata={fileMetadata}
                setFileMetadata={setFileMetadata}
              />
            </TabsContent>
          </form>
        </Tabs>
      </div>

      {/* Sidebar with improved responsive design */}
      <div
        className={cn(
          'w-full shrink-0 border-t lg:w-80 lg:border-l lg:border-t-0',
          activeTab === 'product-files' && 'hidden lg:block',
        )}
      >
        <div className="sticky top-0">
          <div className="space-y-6 p-4 lg:p-6">
            {/* Call to Action */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Call to Action</label>
              <Select
                onValueChange={(value) =>
                  form.setValue('metadata.callToAction', value as CallToActionType)
                }
                value={form.watch('metadata.callToAction')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a call to action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CallToAction.BUY_NOW}>Buy Now</SelectItem>
                  <SelectItem value={CallToAction.I_WANT_THIS}>I Want This</SelectItem>
                  <SelectItem value={CallToAction.PAY_NOW}>Pay Now</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.metadata?.callToAction && (
                <p className="text-sm text-red-500">Call to action is required</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                className="bg-background col-span-2 h-24 resize-none md:h-48"
                placeholder="Write a detailed description of your product..."
                value={form.watch('description') || ''}
                onChange={(e) => form.setValue('description', e.target.value)}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            {/* Publish switch */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="cursor-pointer text-sm font-medium">Publish Product</label>
                <p className="text-muted-foreground text-xs">
                  Make this product available for purchase
                </p>
              </div>
              <Switch
                checked={form.watch('is_published')}
                onCheckedChange={(checked) => form.setValue('is_published', checked)}
                defaultChecked={true}
                className="scale-125"
              />
            </div>

            {/*  Add customer email to product as pdf stamp */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="cursor-pointer text-sm font-medium">
                  Customer Email to PDF Footer
                </label>
                <p className="text-muted-foreground text-xs">
                  Add customer email to the PDF every page of the product
                </p>
              </div>
              <Switch
                checked={form.watch('add_customer_email_to_pdf_footer')}
                onCheckedChange={(checked) =>
                  form.setValue('add_customer_email_to_pdf_footer', checked)
                }
                defaultChecked={false}
                className="scale-125"
              />
            </div>

            {/* Product Slashed Price */}

            <div className="space-y-2">
              <label className="text-sm font-medium">Slashed Price</label>
              <Input
                type="number"
                min="1000"
                step="0.01"
                value={form.watch('slashed_price') ?? ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : Number(e.target.value)
                  form.setValue('slashed_price', value)
                }}
                placeholder="Enter slashed price (minimum ₦1,000)"
              />
              {form.formState.errors.slashed_price && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.slashed_price.message}
                </p>
              )}
            </div>
            {/* Product Info */}
            <div className="space-y-4 pb-[150px] pt-4 md:border-b lg:pb-4">
              {' '}
              {/* Added pb-[150px] for mobile */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Type</span>
                  <span className="text-muted-foreground text-sm capitalize">
                    {form.watch('product_type').replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Status section and Action Buttons - Fixed on mobile, sticky on desktop */}
            <div className="border-border bg-background fixed bottom-0 left-0 right-0 w-full border-t p-4 lg:static lg:w-auto lg:border-0 lg:bg-transparent lg:p-0">
              <div className="mx-auto max-w-6xl lg:mx-0">
                {/* Status section */}
                <div className="space-y-1 pb-4">
                  <h3 className="text-base font-medium">Product Status</h3>
                  <p className="text-muted-foreground text-sm">
                    Save as draft or publish your product
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="flex-1"
                    disabled={isSavingDraft || isLoading}
                  >
                    {isSavingDraft ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      'Save as Draft'
                    )}
                  </Button>
                  <Button
                    type="submit"
                    form="basic-product-form"
                    onClick={form.handleSubmit(onSubmit)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    disabled={isLoading || isSavingDraft}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Publishing...
                      </span>
                    ) : (
                      'Publish'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
