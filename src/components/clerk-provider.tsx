"use client"

import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs"
import { type ReactNode } from "react"
import { AlertCircle } from "lucide-react"

import { getIsDemoMode } from "@/lib/auth"

export function ClerkProvider({ children }: { children: ReactNode }) {
  const isDemoMode = getIsDemoMode();
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (isDemoMode) {
    return (
      <>
        {/* Warning Banner for Devs */}
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white text-[10px] py-1 px-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest shadow-lg">
          <AlertCircle className="h-3 w-3" />
          Clerk Authentication is not configured. Using Demo Mode.
        </div>
        {children}
      </>
    );
  }

  return (
    <ClerkProviderBase publishableKey={publishableKey!}>
      {children}
    </ClerkProviderBase>
  )
}