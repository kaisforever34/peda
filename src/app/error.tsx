'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to our central logger
    console.error('Runtime Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-10 w-10" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground font-medium px-4">
            A runtime error occurred. Our team has been notified.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-muted-foreground/50 mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            onClick={() => reset()} 
            className="flex-1 rounded-xl h-12 gap-2 shadow-lg shadow-primary/20"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full rounded-xl h-12 gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
        
        <p className="text-xs text-muted-foreground pt-8">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  )
}
