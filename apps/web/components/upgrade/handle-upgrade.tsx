'use client'
import axios from "@/lib/axios"
import { Button } from "@workspace/ui/components/button"
import { toast } from "sonner"
import { AxiosError } from "axios"

export function HandleUpgrade() {
    const handleUpgrade = async () => {
        try {
            const response = await axios.post("/api/customer-orders/upgrade-account")
            if (response.status === 200) {
                toast.success("Upgrade successful")
                //reload the page
                window.location.reload()
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message)
            }
        }
    }
    return (
        <>
            <div className="flex flex-col gap-4 mt-4">
                <p className="text-sm text-muted-foreground">Upgrade your account to become a seller</p>
                <Button onClick={handleUpgrade} type="button" className="w-1/2">Upgrade</Button>
            </div>
        </>
    )
}