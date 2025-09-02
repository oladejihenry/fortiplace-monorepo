import { getCustomers } from "@/lib/action/customers"
import { CustomersList } from "./customer-list"

interface SearchParams {
  page?: string
  per_page?: string
  search?: string
}

export async function CustomersTable({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams
    const { page, per_page, search } = params
    const customers = await getCustomers({
        page: Number(page) || 1,
        per_page: Number(per_page) || 15,
        search: search || '',
    })
    
    return <CustomersList customers={customers} />
}