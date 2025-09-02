"use client"


import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { useUser } from "@/hooks/useUser"
import { useActionState, useEffect } from "react"
import { updateProfile } from "@/lib/action/profile"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { toast } from "sonner"
const initialState = {
  message: "",
  errors: {
    username: [],
    email: [],
    phone_number: [],
    description: [],
    store_name: [],
    // logo: [],
  },
}
export function SettingsForm() {
  const {user, refetchUser, isSeller, isAdmin, isCustomer} = useUser()
  const [state, formAction, pending] = useActionState(updateProfile, initialState)
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  

  useEffect(() => {
    if(state.message) {
      if(state.errors && Object.values(state.errors).some(error => error.length > 0)) {
        toast.error(state.message)
      } else if(state.toast === true) {
        toast.success(state.message)
        if(state.data) {
          refetchUser()
        }
      }
    }
  }, [state, refetchUser])

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onloadend = () => {
  //       setPreviewUrl(reader.result as string)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }


  // const handleRemoveImage = () => {
  //   setPreviewUrl(null)
  //   // You might need to add a hidden input to track image removal on the server
  //   const fileInput = document.getElementById('logo') as HTMLInputElement
  //   if (fileInput) {
  //     fileInput.value = ''
  //   }
  // }

  return (
    <form action={formAction} className="flex flex-col space-y-8">
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <p className="text-sm text-muted-foreground">
            This is your username.
          </p>
        </div>
        <div className="space-y-1">
          <Input
            id="username"
            className="capitalize"
            placeholder="Enter your username"
            name="username"
            defaultValue={user?.data?.username}
          />
          {state.errors?.username && (
            <p className="text-sm text-red-500">{state.errors.username[0]}</p>
          )}
        </div>
      </div>
      <hr className="border-t border-border" role="separator" />

      {(isSeller || isAdmin) && (
        <>
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="store_name">Store name</Label>
            <p className="text-sm text-muted-foreground">
              This is your store name.
            </p>
          </div>
          <div className="space-y-1">
            <Input
              id="store_name"
              className="capitalize"
              placeholder="Enter your store name"
              name="store_name"
              defaultValue={user?.data?.store_name}
            />
            {state.errors?.store_name && (
              <p className="text-sm text-red-500">{state.errors.store_name[0]}</p>
            )}
            </div>
          </div>
          <hr className="border-t border-border" role="separator" />
        </>
      )}

      {/* <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>Store logo</Label>
          <p className="text-sm text-muted-foreground">
            The Store logo should be at least 200 x 40 (72dpi) pixels, preferably a horizontal rectangular (landscape) image.
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex flex-col gap-4">
            {/* Image preview */}
            {/* {(user?.user?.data?.logo || previewUrl) && (
              <div className="relative h-40 w-full overflow-hidden rounded-md border border-border">
                <img 
                  src={previewUrl || user?.user?.data?.logo} 
                  alt="Store logo preview" 
                  className="h-full w-auto object-contain"
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  className="absolute right-2 top-2"
                  onClick={handleRemoveImage}
                >
                  Remove
                </Button>
              </div>
            )} */}
            
            {/* File input */}
            {/* <Input
              id="logo"
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer file:cursor-pointer"
            />
            {state.errors?.logo && (
              <p className="text-sm text-red-500">{state.errors.logo[0]}</p>
            )}
          </div> */}
        {/* </div>
      </div> */}
      {/* <hr className="border-t border-border" role="separator" /> */}

      {(isSeller || isAdmin) && (
        <>
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
            name="description"
            defaultValue={user?.data?.description}
          />
          {state.errors?.description && (
            <p className="text-sm text-red-500">{state.errors.description[0]}</p>
          )}
        </div>
          </div>
          <hr className="border-t border-border" role="separator" />
        </>
      )}

      {(isSeller || isAdmin) && (
        <>
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="phone_number">Support phone number</Label>
              <p className="text-sm text-muted-foreground">
                This is the phone number customers can contact to reach your business.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex">
                <Select name="countryCode" defaultValue="+234">
                  <SelectTrigger className="w-[80px] rounded-r-none">
                    <SelectValue placeholder="+234" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+234">+234</SelectItem>
                    <SelectItem value="+233">+233</SelectItem>
                    <SelectItem value="+237">+237</SelectItem>
                    <SelectItem value="+236">+236</SelectItem>
                    <SelectItem value="+229">+229</SelectItem>
                    <SelectItem value="+225">+225</SelectItem>
                    <SelectItem value="+226">+226</SelectItem>
                    <SelectItem value="+227">+227</SelectItem>
                    <SelectItem value="+228">+228</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="phone_number"
                  type="tel"
                  className="flex-1 rounded-l-none"
                  placeholder="Enter phone number"
                  name="phone_number"
                  defaultValue={user?.data?.phone_number?.replace(/^\+\d{3}/, '')}
                />
              </div>
              {state.errors?.phone_number && (
                <p className="text-sm text-red-500">{state.errors.phone_number[0]}</p>
              )}
            </div>
          </div>
          <hr className="border-t border-border" role="separator" />
        </>
      )}

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          {(isSeller || isAdmin) && (
            <Label htmlFor="email">Support email address</Label>
          )}
          {isCustomer && (
            <Label htmlFor="email">Email address</Label>
          )}
          <p className="text-sm text-muted-foreground">
            This is the email address customers can contact to reach your business.
          </p>
        </div>
        <div className="space-y-1">
          <Input
            id="email"
            type="email"
            placeholder="Enter support email"
            name="email"
            defaultValue={user?.data?.email}
          />
          {state.errors?.email && (
            <p className="text-sm text-red-500">{state.errors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  )
}