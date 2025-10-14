"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { ChessPuzzle } from "@/lib/puzzle-data"
import { Lightbulb, EyeOff, ChevronRight } from "lucide-react"

interface HintSystemProps {
  puzzle: ChessPuzzle
  currentMoveIndex: number
  onHintUsed: () => void
}

export function HintSystem({ puzzle, currentMoveIndex, onHintUsed }: HintSystemProps) {
  const [hintLevel, setHintLevel] = useState(0)

  const handleShowHint = () => {
    if (hintLevel === 0) {
      onHintUsed()
    }
    setHintLevel((prev) => Math.min(prev + 1, 3))
  }

  const handleHideHint = () => {
    setHintLevel(0)
  }

  const getHintText = () => {
    if (currentMoveIndex >= puzzle.solution.length) {
      return "No more moves in the solution"
    }

    const move = puzzle.solution[currentMoveIndex]
    const from = move.slice(0, 2)
    const to = move.slice(2, 4)

    switch (hintLevel) {
      case 1:
        return `Look for a move involving the piece on ${from}`
      case 2:
        return `Move the piece from ${from} to somewhere powerful`
      case 3:
        return `Next move: ${from} to ${to}`
      default:
        return ""
    }
  }

  const getHintTitle = () => {
    switch (hintLevel) {
      case 1:
        return "Hint Level 1: Piece Location"
      case 2:
        return "Hint Level 2: Starting Square"
      case 3:
        return "Hint Level 3: Complete Move"
      default:
        return ""
    }
  }

  return (
    <div className="flex-1">
      <div className="flex gap-2">
        <Button
          onClick={handleShowHint}
          variant="outline"
          className="gap-2 flex-1 bg-transparent"
          disabled={hintLevel >= 3}
        >
          <Lightbulb className="w-4 h-4" />
          {hintLevel === 0 ? "Show Hint" : "Next Hint"}
          {hintLevel < 3 && <ChevronRight className="w-4 h-4" />}
        </Button>
        {hintLevel > 0 && (
          <Button onClick={handleHideHint} variant="outline" size="icon" className="bg-transparent">
            <EyeOff className="w-4 h-4" />
          </Button>
        )}
      </div>

      {hintLevel > 0 && (
        <Card className="mt-3 p-3 bg-warning/10 border-warning/30">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-warning mb-1">{getHintTitle()}</p>
              <p className="text-sm text-warning">{getHintText()}</p>
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded-full ${level <= hintLevel ? "bg-warning" : "bg-warning/20"}`}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
