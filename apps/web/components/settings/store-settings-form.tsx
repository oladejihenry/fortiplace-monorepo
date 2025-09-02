"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { useUser } from "@/hooks/useUser"

const storeFormSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
  logo: z.string().url().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
})

type StoreFormValues = z.infer<typeof storeFormSchema>

export function StoreSettingsForm() {
  const user = useUser()
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: user?.user?.data?.subdomain || "",
      logo: "",
      description: "",
      phone: "",
      email: user?.user?.data?.email || "",
    },
  })

  async function onSubmit(data: StoreFormValues) {
    try {
      // Handle form submission
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-8">
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="name">Store name</Label>
          <p className="text-sm text-muted-foreground">
            This is your brand identity name.
          </p>
        </div>
        <div className="space-y-1">
          <Input
            id="name"
            className="capitalize"
            placeholder="Enter your store name"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>
      </div>
      <hr className="border-t border-border" role="separator" />

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>Store logo</Label>
          <p className="text-sm text-muted-foreground">
            The Store logo should be at least 200 x 40 (72dpi) pixels, preferably a horizontal rectangular (landscape) image.
          </p>
        </div>
        <div className="space-y-1">
          {/* <ImageUpload
            value={form.watch("logo")}
            onChange={(url) => form.setValue("logo", url)}
            onRemove={() => form.setValue("logo", "")}
          /> */}
        </div>
        
      </div>
      <hr className="border-t border-border" role="separator" />

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="description">Store description</Label>
          <p className="text-sm text-muted-foreground">
            In a few words, explain what this store is about.
          </p>
        </div>
        <div className="space-y-1">
          <Textarea
            id="description"
            placeholder="Enter store description..."
            className="min-h-[100px] resize-none"
            {...form.register("description")}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
          )}
        </div>
      </div>
      <hr className="border-t border-border" role="separator" />

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="phone">Support phone number</Label>
          <p className="text-sm text-muted-foreground">
            This is the phone number customers can contact to reach your business.
          </p>
        </div>
        <div className="space-y-1">
          {/* <PhoneInput
            id="phone"
            placeholder="Enter phone number"
            {...form.register("phone")}
          /> */}
          {form.formState.errors.phone && (
            <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
          )}
        </div>
        
      </div>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="email">Support email address</Label>
          <p className="text-sm text-muted-foreground">
            This is the email address customers can contact to reach your business.
          </p>
        </div>
        <div className="space-y-1">
          <Input
            id="email"
            type="email"
            placeholder="Enter support email"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="w-full sm:w-auto">
          Save changes
        </Button>
      </div>
    </form>
  )
}