'use client'
import { Eye, ShoppingCart } from "lucide-react"
import { Card, CardTitle, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Sales } from "@/types/sales"
import { Views } from "@/types/views"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faNairaSign } from "@fortawesome/free-solid-svg-icons"
import { JSX } from "react"

interface StatItem {
    title: string
    value: string | number
    icon: React.ComponentType<{ className?: string }> | (() => JSX.Element)
}

export default function SalesCard({ sales, views }: { sales: Sales, views: Views }) {

    if(!sales || !sales.total_stats) {
        return null
    }

    //format total_sales_amount to 2 decimal places
    const totalSalesAmount = sales.total_stats.total_sales_amount_ngn.toLocaleString()
    const stats: StatItem[] = [
        { 
            title: "Sales", 
            value: sales.total_stats.total_items_sold, 
            icon: ShoppingCart 
        },
        { 
            title: "Total", 
            value: totalSalesAmount, 
            icon: () => <FontAwesomeIcon icon={faNairaSign} className="h-4 w-4 text-green-500" />
        },
    ]
    return (
        <>
            <div className="grid gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3">

                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}

                <Card key="views">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Views</CardTitle>
                        <Eye className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{views.stats.reduce((acc, curr) => acc + curr.views, 0)}</div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}