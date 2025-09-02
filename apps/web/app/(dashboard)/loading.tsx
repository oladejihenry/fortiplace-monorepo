import { TableSkeleton } from "@/components/skeletons/table-skeleton"

export default function Loading() {
  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <TableSkeleton />
      </div>
    </div>
  )
}