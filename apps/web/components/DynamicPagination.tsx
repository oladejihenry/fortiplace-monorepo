"use client"

import { Button } from "@/components/ui/button"

interface DynamicPaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  startIndex: number
}

export function DynamicPagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  startIndex
}: DynamicPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

//   if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-8 py-4">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{totalItems > 0 ? startIndex + 1 : 0}</span> to{" "}
        <span className="font-medium">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{" "}
        <span className="font-medium">{totalItems}</span> items
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="sr-only">Previous Page</span>
        </Button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNumber = i + 1;
          return (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              className="w-8 h-8 p-0"
            >
              {pageNumber}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span className="sr-only">Next Page</span>
        </Button>
      </div>
    </div>
  )
}