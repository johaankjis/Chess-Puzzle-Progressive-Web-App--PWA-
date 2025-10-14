"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getProgress } from "@/lib/puzzle-data"
import { Trophy, Target, Clock, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export function StatisticsPanel() {
  const [stats, setStats] = useState({
    totalSolved: 0,
    totalAttempts: 0,
    averageTime: 0,
    totalHints: 0,
    successRate: 0,
  })

  useEffect(() => {
    const progress = getProgress()
    const solved = progress.filter((p) => p.status === "solved")

    const totalSolved = solved.length
    const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0)
    const averageTime =
      solved.length > 0 ? Math.round(solved.reduce((sum, p) => sum + p.timeTaken, 0) / solved.length) : 0
    const totalHints = solved.reduce((sum, p) => sum + p.hintsUsed, 0)
    const successRate = totalAttempts > 0 ? Math.round((totalSolved / totalAttempts) * 100) : 0

    setStats({
      totalSolved,
      totalAttempts,
      averageTime,
      totalHints,
      successRate,
    })
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        Your Statistics
      </h2>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Puzzles Solved</span>
            </div>
            <span className="text-2xl font-bold text-primary">{stats.totalSolved}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Success Rate</span>
            </div>
            <span className="text-lg font-semibold">{stats.successRate}%</span>
          </div>
          <Progress value={stats.successRate} className="h-2" />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Average Time</span>
            </div>
            <span className="text-lg font-semibold">{formatTime(stats.averageTime)}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Attempts</span>
            <span className="font-medium">{stats.totalAttempts}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Hints Used</span>
            <span className="font-medium">{stats.totalHints}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
