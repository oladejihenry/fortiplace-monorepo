import { SidebarProvider, SidebarInset } from '@workspace/ui/components/sidebar'
import { DashboardSidebar } from '@/components/sidebar'
import type React from 'react'
import { DashboardHeader } from '@/components/header'
import { Toaster } from 'sonner'
import { UserProvider } from '@/lib/providers/user-provider'
import { DashboardFooter } from '@/components/DashboardFooter'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <Toaster richColors position="bottom-right" />
      <div className="bg-background text-foreground flex min-h-screen">
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset className="flex flex-1 flex-col">
            <DashboardHeader />
            <div className="flex flex-1 flex-col">
              <main className="flex-1 overflow-auto">{children}</main>
              <DashboardFooter />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </UserProvider>
  )
}
