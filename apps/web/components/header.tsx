'use client'

import { Button } from '@workspace/ui/components/button'
import { useSidebar } from '@workspace/ui/components/sidebar'
import { useUser } from '@/hooks/useUser'
import axios from '@/lib/axios'
import { AxiosError } from 'axios'
import { ExternalLink, Menu, LogOut } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import { ModeToggle } from './toggle-mode'
import { UserAvatarDropdown } from './user-avatar-dropdown'
import { Separator } from '@workspace/ui/components/separator'

export function DashboardHeader() {
  const { toggleSidebar } = useSidebar()
  const { user, isSeller, isAdmin, isImpersonated } = useUser()
  const storeUrl = user?.data?.store_url

  const handleLeaveImpersonation = async () => {
    try {
      const response = await axios.post(`/api/admin/impersonate/leave`)
      const token = response.data.token
      if (response.status === 200) {
        Cookies.remove('token')
        Cookies.set('token', token, { path: '/', sameSite: 'Strict' })

        toast.success(response.data.message || 'Impersonated successfully')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 500)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Failed to leave impersonation')
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex h-14 items-center gap-2 border-b px-4 backdrop-blur lg:h-[60px]">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
        <Menu className="size-5" />
      </Button>
      {(isSeller || isAdmin) && (
        <div className="hidden w-full flex-1 lg:flex">
          <Link
            target="_blank"
            href={`${storeUrl}`}
            className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
          >
            <ExternalLink className="size-4" />
            <span>Visit Store</span>
          </Link>
        </div>
      )}
      <div className="flex w-full flex-1 items-center justify-end gap-2">
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Separator orientation="vertical" className="h-6" />
          <UserAvatarDropdown user={user} />
        </div>
      </div>
      {isImpersonated && (
        <div className="flex w-full flex-1 items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLeaveImpersonation}
            className="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      )}
    </header>
  )
}
