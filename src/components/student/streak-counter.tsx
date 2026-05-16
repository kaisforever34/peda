"use client"

import { Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"

interface StreakCounterProps {
  streak: number
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const { t } = useLanguage()
  
  if (streak === 0) return null

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-sm"
    >
      <Zap className={`h-4 w-4 fill-current ${streak > 2 ? 'animate-pulse' : ''}`} />
      <span className="text-sm font-black uppercase tracking-wider">
        {streak} {t("day_streak")}
      </span>
    </motion.div>
  )
}
