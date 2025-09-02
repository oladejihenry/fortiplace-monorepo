'use client'
import { usePathname } from "next/navigation";
// import { DynamicPagination } from "./DynamicPagination";
// import { useSearchParams } from "next/navigation";
// import { useRouter } from "next/navigation";

interface DashboardFooterProps {
  totalItems?: number
  itemsPerPage?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  startIndex?: number
}

export function DashboardFooter({
//   totalItems = 0,
//   itemsPerPage = 10,
//   currentPage = 1,
//   onPageChange = () => {},
//   startIndex = 0
}: DashboardFooterProps) {
    const pathname = usePathname();
    // const searchParams = useSearchParams()
    // const router = useRouter()

    // const handlePageChange = (page: number) => {
    //     const params = new URLSearchParams(searchParams.toString())
    //     params.set('page', page.toString())
    //     router.push(`${pathname}?${params.toString()}`)
    //     onPageChange(page)
    // }

    if (pathname.includes('/dashboard') 
        || pathname.includes('/settings') 
        || pathname.includes('/support')
        || pathname.includes('/analytics')
        || pathname.includes('/payouts')
        || pathname.includes('/integrations')
        || pathname.includes('/manage-orders')
    ) {
        return null;
    }
    
    return (
        <footer className="sticky bottom-0 border-t border-border bg-background">
            {/* <DynamicPagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                startIndex={startIndex}
            /> */}
        </footer>
    )
}