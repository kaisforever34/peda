"use client"

import { useEffect, useState } from "react"

export function SafeDate({ date, className }: { date: Date | string, className?: string }) {
  const [formattedDate, setFormattedDate] = useState<string | null>(null)

  useEffect(() => {
    setFormattedDate(new Date(date).toLocaleDateString())
  }, [date])

  return (
    <span className={className}>
      {formattedDate || "..."}
    </span>
  )
}
