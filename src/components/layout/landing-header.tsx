"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

export function LandingHeader() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <img src="/logo.jpeg" alt="PEDA Logo" className="h-10 w-auto object-contain rounded-md shadow-sm transition-transform group-hover:scale-105" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition-colors">{t("features") || "Features"}</Link>
          <Link href="#solutions" className="hover:text-primary transition-colors">{t("solutions") || "Solutions"}</Link>
          <Link href="#about" className="hover:text-primary transition-colors">{t("about") || "About"}</Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <div className="hidden sm:flex bg-secondary rounded-lg p-1 border border-border/50">
            {(["en", "fr", "ar"] as const).map((lang) => (
               <button
                 key={lang}
                 onClick={() => setLanguage(lang)}
                 className={cn(
                   "text-[10px] uppercase font-bold px-3 py-1.5 rounded-md transition-all",
                   language === lang 
                    ? "bg-background text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                 )}
               >
                 {lang}
               </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-bold">{t("sign_in") || "Sign In"}</Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-xl shadow-primary/25 shadow-lg px-6 font-bold">
                {t("get_started") || "Get Started"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
