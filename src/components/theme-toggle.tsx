"use client"

import * as React from "react"
import { Sun, Moon, Sparkles, Snowflake, Flame, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

const themes = [
  { id: 'light', name: 'Light', icon: Sun, color: 'text-orange-500' },
  { id: 'dark', name: 'Dark', icon: Moon, color: 'text-indigo-400' },
  { id: 'obsidian', name: 'Obsidian', icon: Sparkles, color: 'text-purple-400' },
  { id: 'arctic', name: 'Arctic', icon: Snowflake, color: 'text-blue-400' },
  { id: 'terra', name: 'Terra', icon: Flame, color: 'text-amber-600' },
  { id: 'signal', name: 'Signal', icon: Zap, color: 'text-emerald-400' },
] as const

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
        <div className="h-4 w-4 rounded-full bg-muted animate-pulse" />
      </Button>
    )
  }

  const current = themes.find(t => t.id === theme)
  const ThemeIcon = current?.icon || PaletteIcon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-primary/10 relative overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ThemeIcon className="h-[1.2rem] w-[1.2rem] transition-all group-hover:scale-110" />
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 border bg-card shadow-lg">
        <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 py-1.5">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-1" />
        {themes.map((t) => {
          const Icon = t.icon
          return (
            <DropdownMenuItem
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center gap-3 rounded-lg cursor-pointer transition-all ${theme === t.id ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-accent'}`}
            >
              <Icon className={`h-4 w-4 ${t.color}`} />
              <span className="flex-1 text-sm">{t.name}</span>
              {theme === t.id && (
                <motion.div layoutId="active-theme" className="h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" />
      <circle cx="17.5" cy="10.5" r="0.5" />
      <circle cx="8.5" cy="7.5" r="0.5" />
      <circle cx="6.5" cy="12.5" r="0.5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.6 1.5-1.5 0-.4-.15-.7-.4-1-.25-.3-.4-.6-.4-1 0-.9.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5.5-4.5-10-10-10z" />
    </svg>
  )
}
