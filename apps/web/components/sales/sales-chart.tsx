"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Tabs,  TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatPrice } from "@/lib/utils"
import { format } from "date-fns"
import { useState } from "react"
import axios from "@/lib/axios"
import { LoadingSpinner } from "../custom-ui/loader"

interface SaleStats {
  year: string
  month: string
  items_sold: number
  sales_amount: string
  total_commission: string
  earnings: string
}

interface SalesChartProps {
  monthlyStats: SaleStats[]
}

export function SalesChart({ monthlyStats }: SalesChartProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [isLoading, setIsLoading] = useState(false)
  const [chartData, setChartData] = useState(() => monthlyStats.map((stat) => ({
    date: `${stat.year}-${stat.month}`,
    sales: parseFloat(stat.sales_amount),
    earnings: parseFloat(stat.earnings),
    commission: parseFloat(stat.total_commission),
  })))

  const handlePeriodChange = async (newPeriod: 'week' | 'month' | 'year') => {
    try {
      setIsLoading(true)
      setPeriod(newPeriod)
      
      const response = await axios.get('/api/sales/stats/', {
        params: {
          period: newPeriod
        }
      })
      
      if (response.data.stats) {
        setChartData(response.data.stats.map((stat: SaleStats) => ({
          date: `${stat.year}-${stat.month}`,
          sales: parseFloat(stat.sales_amount),
          earnings: parseFloat(stat.earnings),
          commission: parseFloat(stat.total_commission),
        })))
      }
    } catch (error) {
      console.error('Failed to fetch period stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Your sales performance</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="month" 
          className="space-y-4"
          onValueChange={(value) => handlePeriodChange(value as 'week' | 'month' | 'year')}
        >
          <TabsList>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
          <div className="h-[300px] relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      switch (period) {
                        case 'week':
                          return format(date, 'EEE')
                        case 'month':
                          return format(date, 'dd MMM')
                        case 'year':
                          return format(date, 'MMM')
                        default:
                          return format(date, 'MMM yyyy')
                      }
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₦${value}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const date = new Date(payload[0].payload.date)
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  {format(date, period === 'week' ? 'EEEE' : 'MMMM dd, yyyy')}
                                </span>
                                <span className="font-bold">
                                  Sales: {formatPrice(payload[0].value as number, 'NGN')}
                                </span>
                                <span className="font-bold">
                                  Earnings: {formatPrice(payload[1].value as number, 'NGN')}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#00A99D"
                    fill="#00A99D"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}