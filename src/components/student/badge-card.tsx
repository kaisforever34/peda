"use client"

import { Card, CardContent } from "@/components/ui/card"
import * as Icons from "lucide-react"
import { motion } from "framer-motion"

interface BadgeCardProps {
  name: string
  description: string
  iconName: string
  color: string
  awardedAt?: Date
}

export function BadgeCard({ name, description, iconName, color, awardedAt }: BadgeCardProps) {
  // @ts-ignore
  const Icon = Icons[iconName] || Icons.Award

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <Card className={`overflow-hidden border-none bg-gradient-to-br from-card to-secondary/30 shadow-lg ${!awardedAt ? 'opacity-40 grayscale' : ''}`}>
        <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
          <div className={`p-3 rounded-2xl bg-background/50 backdrop-blur-sm shadow-inner ${color}`}>
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-tight">{name}</h4>
            <p className="text-[10px] text-muted-foreground font-medium leading-tight px-2">{description}</p>
          </div>
          {awardedAt && (
            <div className="absolute inset-block-start-2 inset-inline-end-2 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          )}
        </CardContent>
      </Card>
      
      {!awardedAt && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <Icons.Lock className="h-6 w-6 text-muted-foreground/30" />
        </div>
      )}
    </motion.div>
  )
}
