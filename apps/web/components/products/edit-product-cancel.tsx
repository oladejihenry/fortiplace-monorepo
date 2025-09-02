'use client'
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";


export default function EditProductCancel() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/products')
  }

  return (
    <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
        </Button>
    </div>
  )
}