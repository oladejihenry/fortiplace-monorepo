import { Metadata } from "next"
import { Suspense } from "react"
import { SettingsSkeleton } from "@/components/settings/settings-skeleton"
import { SettingsTabs } from "@/components/settings/settings-tabs"


export const metadata: Metadata = {
  title: "Settings",
  description: "Settings",
}

export default function SettingsPage() {

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        </div>
        <Suspense fallback={<SettingsSkeleton />}>
          <SettingsTabs />
        </Suspense>
      </div>
    </div>
  )
}