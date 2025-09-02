import { DollarSign } from 'lucide-react'
import { ShoppingCart, Users } from 'lucide-react'
import { BarChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'

export default function StatsSection() {
  const stats = [
    { title: 'Total Revenue', value: '$45,231.89', icon: DollarSign, change: '+20.1%' },
    { title: 'Products Sold', value: '2,345', icon: ShoppingCart, change: '+15.3%' },
    { title: 'Active Customers', value: '12,234', icon: Users, change: '+5.7%' },
    { title: 'Avg. Order Value', value: '$89.00', icon: BarChart, change: '+10.5%' },
  ]

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-xs">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
