"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { useRouter, useSearchParams } from "next/navigation"
import { EmptyAnalytics } from "./EmptyAnalytics"
interface ViewStats {
  period_date: string
  views: number
  unique_views: number
}

interface ViewsStatsProps {
  stats: ViewStats[]
  period?: string
}

export function ViewsStats({ stats, period = 'daily' }: ViewsStatsProps) {
  const router = useRouter()
  
  const searchParams = useSearchParams()

  if(!stats || stats.length === 0) {
    return <EmptyAnalytics />
  }

  const sortedStats = [...stats].sort((a, b) => 
    new Date(a.period_date).getTime() - new Date(b.period_date).getTime()
  )

  const chartData = sortedStats.map((stat) => ({
    date: new Date(stat.period_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    }),
    views: stat.views,
    uniqueViews: stat.unique_views,
  }))

  const handlePeriodChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('period', value)
    router.push(`?${params.toString()}`)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Views Over Time</CardTitle>
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A99D" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00A99D" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="uniqueViewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#888888" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#888888" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={50}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                width={30}
                domain={[0, 'dataMax + 1']}
                allowDecimals={false}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#00A99D"
                strokeWidth={2}
                fill="url(#viewsGradient)"
                dot={{ r: 4, fill: "#00A99D", strokeWidth: 0 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="flex flex-col gap-1">
                          <span className="text-[0.70rem] text-muted-foreground">
                            {payload[0].payload.date}
                          </span>
                          <span className="font-bold">
                            {payload[0].value} views
                          </span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}