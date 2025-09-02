
import { Metadata } from "next"
import { Suspense } from "react"
import Loading from "../loading"
import { SupportComponent } from "@/components/support/support-component"

export const metadata: Metadata = {
  title: "Support",
  description: "Support",
}


export default async function SupportPage() {


  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">Support</h2>
            </div>
        </div>
        <Suspense fallback={<Loading />}>
          <SupportComponent />
        </Suspense>
      </div>
    </div>
  )
}

