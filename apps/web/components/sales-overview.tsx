import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function SalesOverview() {
    const salesStats = [
        { label: "Total Sales", value: "$12,345", change: "+15%" },
        { label: "Conversion Rate", value: "3.2%", change: "+0.8%" },
        { label: "Avg. Session Duration", value: "2m 56s", change: "+12%" },
        { label: "New Customers", value: "156", change: "+12%" },
    ]
    return (
        <>
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
        </>
    )
}