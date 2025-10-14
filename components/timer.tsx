"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface TimerProps {
  isActive: boolean
}

export function Timer({ isActive }: TimerProps) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive])

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg border border-border">
      <Clock className="w-4 h-4 text-primary" />
      <span className="font-mono text-lg font-semibold">{formatTime(seconds)}</span>
    </div>
  )
}
