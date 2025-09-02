'use client'
import axios from "@/lib/axios"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { toast } from "sonner"
export default function IntegrationsForm() {
    const [googleTag, setGoogleTag] = useState("")
    // const [metaPixel, setMetaPixel] = useState("")
    const [twitterUsername, setTwitterUsername] = useState("")
    const [facebookUsername, setFacebookUsername] = useState("")
    const [pending, setPending] = useState(false)
    const [errors, setErrors] = useState<Record<string, string[]>>({})

    //fetch and prepopulate data on page load
    useEffect(() => {
        async function fetchIntegrations() {
            try {
                const response = await axios.get("/api/integrations")
                setGoogleTag(response.data?.data?.googleTag)
                setTwitterUsername(response.data?.data?.twitterUsername)
                setFacebookUsername(response.data?.data?.facebookUsername)
            } catch (error) {
                if (error instanceof AxiosError) {
                    //silent error
                    return
                }
            }
        }
        fetchIntegrations()
    }, [])
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setPending(true)
        setErrors({})
        try {
            const response = await axios.post("/api/integrations", {
                googleTag, twitterUsername, facebookUsername
            })
            if (response.status === 200) {
                toast.success("Integrations updated successfully")
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors)
                } else {
                    setErrors({ general: [error.response?.data?.message || "An error occurred"] })
                }
            }
        }
        setPending(false)
    }
    {/*A form with two col with label and input for google tag, twitter username and facebook username */}
  return (
    <form  className="flex flex-col space-y-8" onSubmit={handleSubmit}>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
                <Label htmlFor="google-tag">Google Tag</Label>
                <p className="text-sm text-muted-foreground">
                    Google Tag is a code that you can add to your website to track your users.
                </p>
            </div>
            <div className="space-y-1">
                <Input 
                    id="google-tag" 
                    placeholder="Google Tag" 
                    value={googleTag} 
                    onChange={(e) => setGoogleTag(e.target.value)} 
                    className={errors.googleTag ? "border-red-500" : ""}
                />
                {errors.googleTag && (
                    <p className="text-sm text-red-500">{errors.googleTag[0]}</p>
                )}
            </div>
        </div>
        {/* <hr className="border-t border-border" role="separator" /> */}
        {/* <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
                <Label htmlFor="twitter-username">Meta Pixel</Label>
                <p className="text-sm text-muted-foreground">
                    Meta Pixel is a code that you can add to your website to track your users.
                </p>
            </div>
            <div className="space-y-1">
                <Input 
                    id="meta-pixel" 
                    placeholder="Meta Pixel" 
                    value={metaPixel} 
                    onChange={(e) => setMetaPixel(e.target.value)} 
                    className={errors.metaPixel ? "border-red-500" : ""}
                />
                {errors.metaPixel && (
                    <p className="text-sm text-red-500">{errors.metaPixel[0]}</p>
                )}
            </div>
        </div> */}
        <hr className="border-t border-border" role="separator" />
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
                <Label htmlFor="twitter-username">Twitter Username</Label>
                <p className="text-sm text-muted-foreground">
                    Twitter Username is the username of your Twitter account.
                </p>
            </div>
            <div className="space-y-1">
                <Input 
                    id="twitter-username" 
                    placeholder="Twitter Username" 
                    value={twitterUsername} 
                    onChange={(e) => setTwitterUsername(e.target.value)} 
                    className={errors.twitterUsername ? "border-red-500" : ""}
                />
                {errors.twitterUsername && (
                    <p className="text-sm text-red-500">{errors.twitterUsername[0]}</p>
                )}
            </div>
        </div>
        <hr className="border-t border-border" role="separator" />
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
                <Label htmlFor="facebook-username">Facebook Username</Label>
                <p className="text-sm text-muted-foreground">
                    Facebook Username is the username of your Facebook account.
                </p>
            </div>
            <div className="space-y-1">
                <Input 
                    id="facebook-username" 
                    placeholder="Facebook Username" 
                    value={facebookUsername} 
                    onChange={(e) => setFacebookUsername(e.target.value)} 
                    className={errors.facebookUsername ? "border-red-500" : ""}
                />
                {errors.facebookUsername && (
                    <p className="text-sm text-red-500">{errors.facebookUsername[0]}</p>
                )}
            </div>
        </div>
        <div className="flex justify-end">
            <Button type="submit" disabled={pending} >
                {pending ? "Saving..." : "Save changes"}
            </Button>
      </div>
    </form>
  )
}
