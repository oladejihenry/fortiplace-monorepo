'use client'

import Link from 'next/link'
import * as Flags from 'country-flag-icons/react/3x2'
import { ChevronDown, Search } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@workspace/ui/components/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { siteMenuItems } from '@/lib/site-links'
import { cn } from '@workspace/ui/lib/utils'
import { CartSheet } from './cart/cart-sheet'
import { toast } from 'sonner'
import { useCurrencyStore } from '@/store/use-currency-store'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from '@workspace/ui/components/dropdown-menu'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { ModeToggle } from '../toggle-mode'

interface SiteNavigationProps {
  domain: string
  storeName?: string
}

const CURRENCIES = [
  { code: 'NGN', name: 'Nigerian Naira', flag: 'NG' },
  { code: 'GHS', name: 'Ghanaian Cedi', flag: 'GH' },
  { code: 'XAF', name: 'Central African CFA', flag: 'CM' },
  // { code: 'XOF', name: 'West African CFA' },
  { code: 'KES', name: 'Kenyan Shilling', flag: 'KE' },
  { code: 'UGX', name: 'Ugandan Shilling', flag: 'UG' },
  { code: 'ZAR', name: 'South African Rand', flag: 'ZA' },
  { code: 'USD', name: 'United States Dollar', flag: 'US' },
  { code: 'GBP', name: 'British Pound', flag: 'GB' },
] as const

export function SiteNavigation({ domain, storeName }: SiteNavigationProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const sitename = decodeURIComponent(domain?.split('.')[0] || '')
  const pathname = usePathname()
  const { selectedCurrency, setSelectedCurrency, isLoading } = useCurrencyStore()

  const handleCurrencyChange = async (currency: string) => {
    try {
      setSelectedCurrency(currency)
      toast.success(`Currency changed to ${currency}`)
    } catch (error) {
      console.log(error)
      toast.error('Failed to change currency')
    }
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  return (
    <header className="dark:bg-background/95 border-b bg-white backdrop-blur">
      <div className="container mx-auto max-w-7xl flex-grow px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left - Site Name */}
          <div className="flex-1">
            <Link href="/" className="text-xl font-bold capitalize">
              {storeName || sitename}
            </Link>
          </div>

          {/* Center - Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {siteMenuItems.map((route) => (
                <NavigationMenuItem key={route.href}>
                  <Link
                    href={route.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive(route.href) && 'bg-accent text-accent-foreground',
                    )}
                  >
                    <span className="capitalize">{route.label}</span>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right - Search & Cart */}
          <div className="flex flex-1 items-center justify-end gap-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex h-8 items-center gap-1.5 px-2 font-medium"
                  disabled={isLoading}
                >
                  <div className="relative size-3">
                    {(() => {
                      const currency = CURRENCIES.find((c) => c.code === selectedCurrency)
                      if (currency && currency.flag) {
                        const FlagComponent = Flags[currency.flag as keyof typeof Flags]
                        return FlagComponent ? (
                          <FlagComponent className="size-full rounded-sm object-cover" />
                        ) : null
                      }
                      return null
                    })()}
                  </div>
                  {selectedCurrency}
                  <ChevronDown className="size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[120px] border-zinc-800 bg-zinc-900">
                {CURRENCIES.map((currency) => {
                  const FlagComponent = Flags[currency.flag as keyof typeof Flags]
                  return (
                    <DropdownMenuItem
                      key={currency.code}
                      onClick={() => handleCurrencyChange(currency.code)}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-white hover:bg-[#00A99D] hover:text-white',
                        selectedCurrency === currency.code && 'bg-[#00A99D] text-white',
                      )}
                    >
                      <div className="relative h-3 w-4">
                        {FlagComponent && (
                          <FlagComponent className="size-full rounded-sm object-cover" />
                        )}
                      </div>
                      {currency.code}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <VisuallyHidden>
                <SheetTitle>Search</SheetTitle>
                <SheetDescription>Search for products</SheetDescription>
              </VisuallyHidden>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Search className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top">
                <div className="mt-4">
                  <Input type="search" placeholder="Search products..." className="w-full" />
                </div>
              </SheetContent>
            </Sheet>

            <CartSheet />
          </div>
        </div>
      </div>
    </header>
  )
}
