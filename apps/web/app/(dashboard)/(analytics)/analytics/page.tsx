import { Metadata } from "next"
// import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { AnalyticsContent } from "@/components/analytics/analytics-content"
import { AnalyticsSkeleton } from "@/components/skeletons/analytics-skeleton"

export const dynamic = 'force-dynamic'

interface Props {
    searchParams: Promise<{period?: string}>
}

export const metadata: Metadata = {
  title: "Analytics",
  description: "Analytics",
}

export default async function AnalyticsPage({ searchParams }: Props) {
 

    return (
        <div className="flex-1 space-y-6 p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
                    </div>
                    {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <Button>Download Report</Button>
                    </div> */}
                </div>

                <div className="space-y-8">
                    <Suspense fallback={
                        <div className="space-y-8 py-8">
                            <AnalyticsSkeleton />
                        </div>
                    }>
                        <AnalyticsContent searchParams={searchParams} />
                    </Suspense>

                </div>
            </div>
        </div>
    )
}