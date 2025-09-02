import { SettingsSkeleton } from "@/components/settings/settings-skeleton";



export default function Loading() {
  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="h-10 w-[140px] animate-pulse rounded-md bg-muted" />
          </div>
        </div>
        <div className="space-y-8">
          <SettingsSkeleton />
        </div>
      </div>
    </div>
  )
}