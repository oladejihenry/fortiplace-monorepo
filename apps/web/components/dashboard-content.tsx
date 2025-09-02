import { Card, CardContent, CardHeader, CardTitle } from  "@workspace/ui/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { BarChart, DollarSign, ShoppingCart, Users } from "lucide-react"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

const stats = [
  { title: "Total Revenue", value: "$45,231.89", icon: DollarSign, change: "+20.1%" },
  { title: "Products Sold", value: "2,345", icon: ShoppingCart, change: "+15.3%" },
  { title: "Active Customers", value: "12,234", icon: Users, change: "+5.7%" },
  { title: "Avg. Order Value", value: "$89.00", icon: BarChart, change: "+10.5%" },
]

const recentSales = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00" },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00" },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00" },
  { name: "William Kim", email: "will@email.com", amount: "+$99.00" },
  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00" },
]

const salesStats = [
  { label: "Total Sales", value: "$12,345", change: "+15%" },
  { label: "Conversion Rate", value: "3.2%", change: "+0.8%" },
  { label: "Avg. Session Duration", value: "2m 56s", change: "+12%" },
  { label: "New Customers", value: "156", change: "+12%" },
]

const recentActivities = [
  { user: "John Doe", action: "Published a new product", time: "2 hours ago" },
  { user: "Jane Smith", action: "Made a sale", time: "4 hours ago" },
  { user: "Mike Johnson", action: "Updated product description", time: "6 hours ago" },
  { user: "Sarah Williams", action: "Responded to a customer inquiry", time: "8 hours ago" },
  { user: "Chris Brown", action: "Added a new product category", time: "10 hours ago" },
]

export function DashboardContent() {
  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button>Download Report</Button>
      </div>

      {/* Stats Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sales Overview */}
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesStats.map((stat) => (
                <div key={stat.label} className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <span className={`text-sm ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                    {stat.change}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-6">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{activity.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Sales Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Sales Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              {/* Replace with actual chart component */}
              <div className="flex h-full items-center justify-center bg-muted">Chart Placeholder</div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map((sale) => (
                    <TableRow key={sale.name}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={sale.name} />
                            <AvatarFallback>
                              {sale.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{sale.name}</p>
                            <p className="text-sm text-muted-foreground">{sale.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{sale.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

