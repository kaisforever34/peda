"use client"

import Link from "next/link"
import { SignOutButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"
import {
  Home,
  BookOpen,
  FileText,
  Mic,
  Award,
  Users,
  Settings,
  BarChart3,
  ClipboardList,
  LogOut,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  Bell,
} from "lucide-react"
import { useState } from "react"
import { useNotifications } from "@/components/notification-provider"
import { ThemeToggle } from "@/components/theme-toggle"

type Role = "STUDENT" | "TEACHER" | "ADMIN"

const getNavItems = (role: Role, t: (key: string) => string) => {
  if (role === "TEACHER") {
    return [
      { href: "/teacher/dashboard", label: t("dashboard"), icon: Home },
      { href: "/teacher/classes", label: t("classes"), icon: Users },
      { href: "/teacher/courses", label: t("courses"), icon: BookOpen },
      { href: "/teacher/assignments", label: t("assignments"), icon: FileText },
      { href: "/teacher/exams", label: t("exams"), icon: ClipboardList },
      { href: "/teacher/submissions", label: t("submissions"), icon: FileText },
      { href: "/teacher/ai-reviews", label: t("ai_reviews"), icon: Mic },
      { href: "/teacher/reports", label: t("reports"), icon: BarChart3 },
    ]
  }
  return [
    { href: "/student/dashboard", label: t("dashboard"), icon: Home },
    { href: "/student/courses", label: t("my_courses"), icon: BookOpen },
    { href: "/student/assignments", label: t("assignments"), icon: FileText },
    { href: "/student/exams", label: t("exams"), icon: ClipboardList },
    { href: "/student/voice-coach", label: t("voice_coach"), icon: Mic },
    { href: "/student/results", label: t("results"), icon: BarChart3 },
    { href: "/student/certificates", label: t("certificates"), icon: Award },
  ]
}

interface AppShellProps {
  children: React.ReactNode
  role?: Role
  userName?: string
}

export function AppShell({ children, role = "STUDENT", userName = "User" }: AppShellProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { t, language, setLanguage, dir } = useLanguage()
  const { unreadCount } = useNotifications()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navItems = getNavItems(role, t)

  const isDemoMode = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("YOUR_KEY_HERE")

  return (
    <div className="flex min-h-screen font-sans" dir={dir}>
      <aside className="w-64 border-e border-border bg-card flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border flex flex-col items-center justify-center gap-2">
          <img src="/logo.jpeg" alt="PEDA Logo" className="h-16 w-auto object-contain rounded-lg shadow-sm" />
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Learning Platform</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/settings" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            {t("settings")}
          </Link>
          
          {isDemoMode ? (
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground mt-1"
              >
                <LogOut className="h-4 w-4 me-3" />
                {t("sign_out")} (Demo)
              </Button>
            </Link>
          ) : (
            <SignOutButton redirectUrl="/">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground mt-1"
              >
                <LogOut className="h-4 w-4 me-3" />
                {t("sign_out")}
              </Button>
            </SignOutButton>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <Button 
               variant="ghost" 
               size="icon" 
               className="md:hidden"
               onClick={() => setIsMobileMenuOpen(true)}
             >
               <Menu className="h-5 w-5" />
             </Button>
             <div className="text-sm font-medium text-foreground bg-secondary px-3 py-1 rounded-full border border-border">
               {role === "TEACHER" ? t("teacher_view") : t("student_view")}
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Language Toggle */}
             <div className="flex bg-secondary rounded-lg p-1">
                {(["en", "fr", "ar"] as const).map((lang) => (
                   <button
                     key={lang}
                     onClick={() => setLanguage(lang)}
                     className={cn(
                       "text-[10px] uppercase font-bold px-2 py-1 rounded-md transition-all",
                       language === lang ? "bg-white text-primary shadow-sm dark:bg-slate-700 dark:text-white" : "text-muted-foreground hover:text-foreground"
                     )}
                   >
                     {lang}
                   </button>
                ))}
             </div>

             {/* Notification Bell */}
             <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-primary/10">
               <Bell className="h-[1.2rem] w-[1.2rem]" />
               {unreadCount > 0 && (
                 <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-card" />
               )}
               <span className="sr-only">View notifications</span>
             </Button>

             <ThemeToggle />

             <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium ms-2 shadow-inner">
               {userName.charAt(0).toUpperCase()}
             </div>
          </div>
        </header>

        <div className="flex-1 p-6 bg-background/50 overflow-auto">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="fixed inset-y-0 start-0 w-64 bg-card border-e border-border shadow-2xl animate-in slide-in-from-start duration-300">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex flex-col items-start gap-1">
                <img src="/logo.jpeg" alt="PEDA Logo" className="h-10 w-auto object-contain rounded-md" />
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Learning Platform</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-border">
               <Link
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === "/settings" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Settings className="h-4 w-4" />
                {t("settings")}
              </Link>
              {isDemoMode ? (
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground mt-1"
                  >
                    <LogOut className="h-4 w-4 me-3" />
                    {t("sign_out")} (Demo)
                  </Button>
                </Link>
              ) : (
                <SignOutButton redirectUrl="/">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground mt-1"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    {t("sign_out")}
                  </Button>
                </SignOutButton>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
