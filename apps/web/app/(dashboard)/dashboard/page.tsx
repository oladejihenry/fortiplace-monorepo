import { Metadata } from "next"
import { getCurrentUser } from "@/lib/auth/currentUser"
import { getViews } from "@/lib/action/views"
import { getSales } from "@/lib/action/sales"
import { Order } from "@/types/order"
import { DashboardComponent } from "@/components/home/dashboard-component"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const viewsData = await getViews('daily')
  const salesData = await getSales()

  const hasSetupPayout = user?.data?.bank_account_number && user?.data?.bank_code


  // Get total views from stats
  const totalViews = viewsData?.stats?.[0]?.views || 0
  const uniqueViews = viewsData?.stats?.[0]?.unique_views || 0

  // Get sales statistics
  const totalStats = salesData?.total_stats || {
    total_items_sold: 0,
    total_sales_amount_ngn: 0,
  }

  // Get recent orders from sales data
  const recentOrders: Order[] = salesData?.sales
    ?.reverse()
    ?.slice(0, 5) || []  

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">

      <DashboardComponent 
        totalStats={totalStats} 
        recentOrders={recentOrders} 
        hasSetupPayout={hasSetupPayout} 
        totalViews={totalViews} 
        uniqueViews={uniqueViews} 
      />
    </div>
  )
}