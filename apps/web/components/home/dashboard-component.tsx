'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Package, Users, Wallet } from "lucide-react";
import { Order } from "@/types/order";
import DashboardAlert from "../dashboard/alert";
import { useUser } from "@/hooks/useUser";

interface TotalStats {
  total_items_sold: number;
  total_sales_amount_ngn: number;
}

interface DashboardComponentProps {
  totalStats: TotalStats;
  recentOrders: Order[];
  hasSetupPayout: boolean;
  totalViews: number;
  uniqueViews: number;
}

export function DashboardComponent({
  totalStats,
  recentOrders,
  hasSetupPayout,
  totalViews,
  uniqueViews
}: DashboardComponentProps) {
    const {isCustomer, isSeller, isAdmin} = useUser()
  return (
    <>
    {(isSeller || isAdmin) && (
      <>
      {/* Payout Setup Alert */}
      {!hasSetupPayout && <DashboardAlert />}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="h-[160px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.total_items_sold}</div>
            <p className="text-xs text-muted-foreground">
              Total items sold
            </p>
          </CardContent>
        </Card>

        <Card className="h-[160px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Visits</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              {uniqueViews} unique views
            </p>
          </CardContent>
        </Card>

        <Card className="h-[160px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Balance</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalStats.total_sales_amount_ngn.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total sales amount
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col divide-y divide-border overflow-y-auto max-h-[300px]">
            {recentOrders.length > 0 ? (
              recentOrders.map((order: Order) => (
                <div key={order.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Product Name: {order.product_name}</p>
                      <p className="text-sm text-muted-foreground">Order ID: {order.order_id}</p>
                      <p className="text-sm text-muted-foreground">Customer Email: {order.customer_email}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-medium">₦{Number(order.total_price).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4">
                <p className="text-sm text-muted-foreground">No orders yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </>
    )}
    {isCustomer && (
      <>
        <h1>Customer Dashboard</h1>
        <p>Welcome to your customer dashboard</p>
      </>
    )}
    </>
  );
}