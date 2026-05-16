import Link from "next/link"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationProps {
  totalPages: number
  currentPage: number
  baseUrl: string
}

export function Pagination({ totalPages, currentPage, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null

  const separator = baseUrl.includes("?") ? "&" : "?"

  const getPageUrl = (page: number) => `${baseUrl}${separator}page=${page}`

  const renderPageLinks = () => {
    const links = []
    const maxVisible = 5
    
    let start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    if (start > 1) {
      links.push(
        <Link key={1} href={getPageUrl(1)} className={`inline-flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-colors ${currentPage === 1 ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent"}`}>
          1
        </Link>
      )
      if (start > 2) links.push(<MoreHorizontal key="start-more" className="h-4 w-4 text-muted-foreground" />)
    }

    for (let i = start; i <= end; i++) {
      links.push(
        <Link key={i} href={getPageUrl(i)} aria-current={i === currentPage ? "page" : undefined} className={`inline-flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-colors ${i === currentPage ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent"}`}>
          {i}
        </Link>
      )
    }

    if (end < totalPages) {
      if (end < totalPages - 1) links.push(<MoreHorizontal key="end-more" className="h-4 w-4 text-muted-foreground" />)
      links.push(
        <Link key={totalPages} href={getPageUrl(totalPages)} className={`inline-flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-colors ${currentPage === totalPages ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent"}`}>
          {totalPages}
        </Link>
      )
    }

    return links
  }

  return (
    <nav role="navigation" aria-label="Pagination" className="flex items-center justify-center gap-2 mt-8">
      {currentPage > 1 ? (
        <Link href={getPageUrl(currentPage - 1)} className="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium border border-border hover:bg-accent transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium border border-border opacity-50 cursor-not-allowed">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </span>
      )}
      
      <div className="flex items-center gap-1 mx-2">
        {renderPageLinks()}
      </div>

      {currentPage < totalPages ? (
        <Link href={getPageUrl(currentPage + 1)} className="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium border border-border hover:bg-accent transition-colors">
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium border border-border opacity-50 cursor-not-allowed">
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  )
}
