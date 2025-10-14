"use client"

import { Card } from "@/components/ui/card"
import { Trophy, Target, Clock, Lightbulb, TrendingUp } from "lucide-react"

interface ScoringDisplayProps {
  timeTaken: number
  hintsUsed: number
  difficulty: string
  rating: number
}

export function ScoringDisplay({ timeTaken, hintsUsed, difficulty, rating }: ScoringDisplayProps) {
  const calculateScore = () => {
    let baseScore = rating

    // Time bonus (faster = more points)
    const timeBonus = Math.max(0, 300 - timeTaken) * 2
    baseScore += timeBonus

    // Hint penalty
    const hintPenalty = hintsUsed * 50
    baseScore -= hintPenalty

    // Difficulty multiplier
    const difficultyMultipliers: Record<string, number> = {
      beginner: 1.0,
      intermediate: 1.5,
      advanced: 2.0,
      expert: 2.5,
    }
    baseScore *= difficultyMultipliers[difficulty] || 1.0

    return Math.max(0, Math.round(baseScore))
  }

  const score = calculateScore()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-bold">Puzzle Complete!</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <Target className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Score</p>
            <p className="text-xl font-bold text-primary">{score}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <Clock className="w-5 h-5 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">Time</p>
            <p className="text-xl font-bold">{formatTime(timeTaken)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <Lightbulb className="w-5 h-5 text-warning" />
          <div>
            <p className="text-xs text-muted-foreground">Hints Used</p>
            <p className="text-xl font-bold">{hintsUsed}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-success" />
          <div>
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="text-xl font-bold">{rating}</p>
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>• Base rating: {rating} points</p>
        <p>• Time bonus: +{Math.max(0, (300 - timeTaken) * 2)} points</p>
        {hintsUsed > 0 && <p>• Hint penalty: -{hintsUsed * 50} points</p>}
        <p>
          • Difficulty multiplier: ×
          {difficulty === "beginner"
            ? "1.0"
            : difficulty === "intermediate"
              ? "1.5"
              : difficulty === "advanced"
                ? "2.0"
                : "2.5"}
        </p>
      </div>
    </Card>
  )
}
