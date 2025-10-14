"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type ChessPuzzle, saveProgress, getPuzzleProgress } from "@/lib/puzzle-data"
import { Timer } from "@/components/timer"
import { HintSystem } from "@/components/hint-system"
import { ChessBoard } from "@/components/chess-board"
import { ScoringDisplay } from "@/components/scoring-display"
import { MoveFeedback } from "@/components/move-feedback"
import { RotateCcw } from "lucide-react"
import { Chess } from "chess.js"

interface PuzzleBoardProps {
  puzzle: ChessPuzzle
}

export function PuzzleBoard({ puzzle }: PuzzleBoardProps) {
  const [game, setGame] = useState<Chess | null>(null)
  const [moveIndex, setMoveIndex] = useState(0)
  const [status, setStatus] = useState<"playing" | "solved" | "failed">("playing")
  const [hintsUsed, setHintsUsed] = useState(0)
  const [startTime] = useState(Date.now())
  const [timeTaken, setTimeTaken] = useState(0)
  const [highlightSquares, setHighlightSquares] = useState<string[]>([])
  const [feedback, setFeedback] = useState<{
    type: "correct" | "incorrect" | "excellent" | "good"
    message: string
    details?: string
  } | null>(null)

  useEffect(() => {
    const chess = new Chess(puzzle.fen)
    setGame(chess)
    const progress = getPuzzleProgress(puzzle.id)
    if (progress) {
      setHintsUsed(progress.hintsUsed)
    }
  }, [puzzle.id, puzzle.fen])

  const handleMove = (move: { from: string; to: string }) => {
    if (!game || status !== "playing") return

    const moveNotation = `${move.from}${move.to}`
    const expectedMove = puzzle.solution[moveIndex]

    setHighlightSquares([move.from, move.to])

    if (moveNotation === expectedMove || moveNotation === expectedMove.slice(0, 4)) {
      const isFirstMove = moveIndex === 0
      const isLastMove = moveIndex === puzzle.solution.length - 1

      if (isLastMove) {
        setFeedback({
          type: "excellent",
          message: "Puzzle Solved!",
          details: "You found all the correct moves!",
        })
      } else if (isFirstMove) {
        setFeedback({
          type: "correct",
          message: "Great start!",
          details: "Keep going to complete the puzzle.",
        })
      } else {
        setFeedback({
          type: "good",
          message: "Correct move!",
          details: "Continue with the combination.",
        })
      }

      const newMoveIndex = moveIndex + 1

      if (newMoveIndex >= puzzle.solution.length) {
        const finalTime = Math.floor((Date.now() - startTime) / 1000)
        setTimeTaken(finalTime)
        setStatus("solved")
        saveProgress({
          puzzleId: puzzle.id,
          status: "solved",
          timeTaken: finalTime,
          hintsUsed,
          attempts: 1,
          lastAttempt: new Date(),
        })
      } else {
        setMoveIndex(newMoveIndex)
        setTimeout(() => {
          setFeedback(null)
          if (newMoveIndex < puzzle.solution.length) {
            const opponentMove = puzzle.solution[newMoveIndex]
            try {
              game.move({
                from: opponentMove.slice(0, 2),
                to: opponentMove.slice(2, 4),
                promotion: opponentMove.length > 4 ? opponentMove[4] : undefined,
              })
              setGame(new Chess(game.fen()))
              setMoveIndex(newMoveIndex + 1)
              setHighlightSquares([opponentMove.slice(0, 2), opponentMove.slice(2, 4)])
            } catch (e) {
              console.error("[v0] Error making opponent move:", e)
            }
          }
        }, 1500)
      }
    } else {
      setFeedback({
        type: "incorrect",
        message: "Incorrect Move",
        details: "That's not the right move. Try again!",
      })
      setStatus("failed")
      setTimeout(() => {
        setStatus("playing")
        setFeedback(null)
        setHighlightSquares([])
      }, 2000)
    }
  }

  const handleReset = () => {
    const chess = new Chess(puzzle.fen)
    setGame(chess)
    setMoveIndex(0)
    setStatus("playing")
    setHighlightSquares([])
    setFeedback(null)
  }

  const handleHintUsed = () => {
    setHintsUsed((prev) => prev + 1)
  }

  if (!game) return null

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">{puzzle.description}</h2>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="capitalize">{puzzle.difficulty}</span>
            <span>•</span>
            <span className="capitalize">{puzzle.category}</span>
            <span>•</span>
            <span>Rating: {puzzle.rating}</span>
          </div>
        </div>
        <Timer isActive={status === "playing"} />
      </div>

      <div className="mb-6">
        <ChessBoard fen={game.fen()} onMove={handleMove} highlightSquares={highlightSquares} orientation="white" />
      </div>

      {feedback && status !== "solved" && (
        <div className="mb-4">
          <MoveFeedback type={feedback.type} message={feedback.message} details={feedback.details} />
        </div>
      )}

      {status === "solved" && (
        <div className="mb-4">
          <ScoringDisplay
            timeTaken={timeTaken}
            hintsUsed={hintsUsed}
            difficulty={puzzle.difficulty}
            rating={puzzle.rating}
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={handleReset} variant="outline" className="gap-2 bg-transparent">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <HintSystem puzzle={puzzle} currentMoveIndex={moveIndex} onHintUsed={handleHintUsed} />
      </div>
    </Card>
  )
}
