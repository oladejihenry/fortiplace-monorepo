import { Skeleton } from "@workspace/ui/components/skeleton"
import { CardContent } from "@workspace/ui/components/card"

export function AnalyticsSkeleton() {
  return (
    <div>
      {/* Sales Card */}
      <div>
        <CardContent>
          <div className="space-y-8">
            {/* Sales Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <Skeleton className="h-4 w-[100px] mb-2" />
                  <Skeleton className="h-8 w-[120px]" />
                </div>
              ))}
            </div>
            {/* Sales Chart */}
            <div className="rounded-lg border">
              <div className="p-6">
                <Skeleton className="h-[300px] w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  )
}