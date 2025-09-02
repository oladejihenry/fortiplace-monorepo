import { ViewsStats } from "./view-stats"
import { getSales } from "@/lib/action/sales"
import { getViews } from "@/lib/action/views"
import SalesCard from "../sales/sales-card"

interface Props {
    searchParams: Promise<{period?: string}>
}

export async function AnalyticsContent({ searchParams }: Props) {
  const params = await searchParams
  const period = params.period || 'daily'
  const sales = await getSales()
  const views = await getViews(period)

  return (
    <>
      <SalesCard sales={sales} views={views} />
      <ViewsStats stats={views.stats} period={period} />
    </>
  )
}