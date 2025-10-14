"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProgress } from "@/lib/puzzle-data"
import { Clock, Lightbulb, Calendar, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

export function ProgressHistory() {
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const progress = getProgress()
    const sorted = progress.sort((a, b) => new Date(b.lastAttempt).getTime() - new Date(a.lastAttempt).getTime())
    setHistory(sorted.slice(0, 10))
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString()
  }

  if (history.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Recent Activity
        </h2>
        <p className="text-sm text-muted-foreground text-center py-8">
          No puzzles solved yet. Start solving to see your progress here!
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Recent Activity
      </h2>
      <div className="space-y-3">
        {history.map((item, index) => (
          <div key={`${item.puzzleId}-${index}`} className="p-3 bg-secondary rounded-lg border border-border">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">{item.puzzleId}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.lastAttempt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(item.timeTaken)}</span>
                  </div>
                  {item.hintsUsed > 0 && (
                    <div className="flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      <span>{item.hintsUsed}</span>
                    </div>
                  )}
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  item.status === "solved"
                    ? "bg-success/20 text-success border-success/30"
                    : "bg-muted text-muted-foreground"
                }
              >
                {item.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
