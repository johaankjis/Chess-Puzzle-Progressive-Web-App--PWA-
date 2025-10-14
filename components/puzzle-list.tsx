"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ChessPuzzle } from "@/lib/puzzle-data"
import { getPuzzleProgress } from "@/lib/puzzle-data"
import { Trophy, Target, BookOpen, Swords, CheckCircle2, Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface PuzzleListProps {
  puzzles: ChessPuzzle[]
  onSelectPuzzle?: (puzzle: ChessPuzzle) => void
  selectedPuzzleId?: string
}

const categoryIcons = {
  tactics: Swords,
  endgame: Trophy,
  opening: BookOpen,
  middlegame: Target,
}

const difficultyColors = {
  beginner: "bg-success/20 text-success border-success/30",
  intermediate: "bg-primary/20 text-primary border-primary/30",
  advanced: "bg-warning/20 text-warning border-warning/30",
  expert: "bg-destructive/20 text-destructive border-destructive/30",
}

export function PuzzleList({ puzzles, onSelectPuzzle, selectedPuzzleId }: PuzzleListProps) {
  const [progressMap, setProgressMap] = useState<Map<string, any>>(new Map())

  useEffect(() => {
    const map = new Map()
    puzzles.forEach((puzzle) => {
      const progress = getPuzzleProgress(puzzle.id)
      if (progress) {
        map.set(puzzle.id, progress)
      }
    })
    setProgressMap(map)
  }, [puzzles])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Available Puzzles</h2>
      <div className="space-y-3">
        {puzzles.map((puzzle) => {
          const Icon = categoryIcons[puzzle.category]
          const progress = progressMap.get(puzzle.id)
          const isSolved = progress?.status === "solved"
          const isSelected = selectedPuzzleId === puzzle.id

          return (
            <Button
              key={puzzle.id}
              onClick={() => onSelectPuzzle?.(puzzle)}
              variant="ghost"
              className={`w-full h-auto p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border ${
                isSelected ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
            >
              <div className="w-full text-left">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-medium text-sm capitalize">{puzzle.category}</span>
                    {isSolved && <CheckCircle2 className="w-4 h-4 text-success" />}
                  </div>
                  <Badge variant="outline" className={difficultyColors[puzzle.difficulty]}>
                    {puzzle.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{puzzle.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Rating: {puzzle.rating}</span>
                  <span>•</span>
                  <span>{puzzle.solution.length} moves</span>
                  {progress && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(progress.timeTaken)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
