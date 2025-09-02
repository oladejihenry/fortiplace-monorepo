import {
  Home,
  ShoppingBag,
  BarChart,
  Settings,
  ShoppingCart,
  Users,
  GalleryVerticalEnd,
  PackageOpen,
  HelpCircle,
  // Mail,
  ShoppingBasket,
  ClipboardList,
  PlugZap2,
  CreditCard,
  Percent,
} from 'lucide-react'

export interface SidebarLink {
  title: string
  href: string
  icon: React.ElementType
  submenu?: SidebarLink[]
  requireCustomer?: boolean
  requireAdmin?: boolean
}

const customerLinks: SidebarLink[] = [
  {
    icon: ClipboardList,
    title: 'Orders',
    href: '/orders',
    requireCustomer: true,
  },
  {
    icon: ShoppingBag,
    title: 'Become a Seller',
    href: '/upgrade',
    requireCustomer: true,
  },
  {
    icon: Settings,
    title: 'Settings',
    href: '/settings',
  },
  {
    icon: HelpCircle,
    title: 'Help',
    href: '/support',
  },
]

//admin or seller links
const adminLinks: SidebarLink[] = [
  {
    icon: Home,
    title: 'Home',
    href: '/dashboard',
  },
  {
    icon: PackageOpen,
    title: 'Products',
    href: '/products',
  },
  {
    icon: ShoppingCart,
    title: 'Sales',
    href: '/customers',
  },
  {
    icon: Percent,
    title: 'Coupons',
    href: '/coupons',
  },
  {
    icon: BarChart,
    title: 'Analytics',
    href: '/analytics',
  },
  {
    icon: ShoppingBag,
    title: 'Payouts',
    href: '/payouts',
  },
  {
    icon: ClipboardList,
    title: 'Orders',
    href: '/orders',
  },
  {
    icon: PlugZap2,
    title: 'Integrations',
    href: '/integrations',
  },
  {
    icon: Users,
    title: 'Manage Users',
    href: '/manage-users',
    requireAdmin: true,
  },
  {
    icon: GalleryVerticalEnd,
    title: 'Manage Products',
    href: '/manage-products',
    requireAdmin: true,
  },
  {
    icon: ShoppingBasket,
    title: 'Manage Orders',
    href: '/manage-orders',
    requireAdmin: true,
  },
  {
    icon: CreditCard,
    title: 'Manage Payments',
    href: '/manage-payments',
    requireAdmin: true,
  },
  // {
  //   icon: Mail,
  //   title: "Promotions",
  //   href: "/send-email",
  //   requireAdmin: true
  // },

  // {
  //   icon: ShoppingBasket,
  //   title: "Manage Payouts",
  //   href: "/manage-payouts",
  //   requireAdmin: true
  // },
  {
    icon: Settings,
    title: 'Store Settings',
    href: '/settings',
  },
  {
    icon: HelpCircle,
    title: 'Help',
    href: '/support',
  },
]

export function getMenuItems(role: string = ''): SidebarLink[] {
  if (role === 'customer') {
    return customerLinks
  }
  return adminLinks
}
