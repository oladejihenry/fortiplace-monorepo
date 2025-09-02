"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { getMenuItems } from "@/lib/sidebar-links"
import { cn } from "@workspace/ui/lib/utils"
import { useCallback } from "react"
import { useUser } from "@/hooks/useUser"

export function DashboardSidebar() {
  const {isAdmin, role} = useUser()
  const menuItems = getMenuItems(role as string);
  const pathname = usePathname()
  const { setOpenMobile, isMobile } = useSidebar()

  const isActiveRoute = useCallback((href: string) => {
    // Special case for home route
    if (href === "/" && pathname === "/") return true
    
    // For dashboard, only match exact
    if (href === "/dashboard" && pathname === "/dashboard") return true
    
    // For other routes, check if pathname starts with href AND next char is '/' or end of string
    if (href !== "/" && href !== "/dashboard" && pathname.startsWith(href)) {
      // Check if the next character after href is '/' or if it's the end of the path
      const nextChar = pathname.charAt(href.length)
      return nextChar === "" || nextChar === "/"
    }
    
    return false
  }, [pathname])
  
  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }
  

  return (

    <Sidebar className="border-r border-border bg-sidebar-background">
      <SidebarHeader className="px-4 border-b border-border pt-[0.85rem] pb-[0.85rem]">
        <div className="inline-flex flex-col items-start">
          <h2 className="text-2xl font-bold text-primary">FortiPlace</h2>
          
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-muted-foreground">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                if (item.requireAdmin && !isAdmin) {
                  return null;
                }
                return(
                <SidebarMenuItem key={item.title} className="px-2 py-1">
                  <SidebarMenuButton
                    asChild
                    isActive={isActiveRoute(item.href)}
                    className={cn(
                      "w-full justify-start gap-4 px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActiveRoute(item.href) && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Link 
                      onClick={handleMenuItemClick}
                      href={item.href} 
                      className="flex items-center"
                    >
                      <item.icon className={`h-5 w-5 ${isActiveRoute(item.href) ? "text-primary" : "text-muted-foreground"}`} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()}, Powered by 
          <Link href="https://fortiplace.com" target="_blank" rel="noopener noreferrer" className="text-primary ml-1">
            FortiPlace
          </Link>
        </p>
      </SidebarFooter>
    </Sidebar>
   
  )
}

