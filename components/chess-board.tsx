"use client"

import { useState, useEffect } from "react"
import { Chess } from "chess.js"

interface ChessBoardProps {
  fen: string
  onMove?: (move: { from: string; to: string; promotion?: string }) => void
  highlightSquares?: string[]
  orientation?: "white" | "black"
}

export function ChessBoard({ fen, onMove, highlightSquares = [], orientation = "white" }: ChessBoardProps) {
  const [game, setGame] = useState<Chess | null>(null)
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [legalMoves, setLegalMoves] = useState<string[]>([])

  useEffect(() => {
    const chess = new Chess(fen)
    setGame(chess)
  }, [fen])

  const files =
    orientation === "white" ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"]
  const ranks =
    orientation === "white" ? ["8", "7", "6", "5", "4", "3", "2", "1"] : ["1", "2", "3", "4", "5", "6", "7", "8"]

  const handleSquareClick = (square: string) => {
    if (!game) return

    if (selectedSquare) {
      // Try to make a move
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: "q", // Always promote to queen for simplicity
        })

        if (move) {
          onMove?.({ from: selectedSquare, to: square })
          setGame(new Chess(game.fen()))
        }
      } catch (e) {
        // Invalid move
      }
      setSelectedSquare(null)
      setLegalMoves([])
    } else {
      // Select a piece
      const piece = game.get(square as any)
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square)
        const moves = game.moves({ square: square as any, verbose: true })
        setLegalMoves(moves.map((m) => m.to))
      }
    }
  }

  const getPiece = (square: string) => {
    if (!game) return null
    return game.get(square as any)
  }

  const getPieceSymbol = (piece: { type: string; color: string } | null) => {
    if (!piece) return null

    const symbols: Record<string, Record<string, string>> = {
      w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
      b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" },
    }

    return symbols[piece.color][piece.type]
  }

  const isLightSquare = (file: string, rank: string) => {
    const fileIndex = files.indexOf(file)
    const rankIndex = ranks.indexOf(rank)
    return (fileIndex + rankIndex) % 2 === 0
  }

  return (
    <div className="w-full aspect-square">
      <div className="grid grid-cols-8 gap-0 w-full h-full border-2 border-border rounded-lg overflow-hidden">
        {ranks.map((rank) =>
          files.map((file) => {
            const square = `${file}${rank}`
            const piece = getPiece(square)
            const isLight = isLightSquare(file, rank)
            const isSelected = selectedSquare === square
            const isLegalMove = legalMoves.includes(square)
            const isHighlighted = highlightSquares.includes(square)

            return (
              <button
                key={square}
                onClick={() => handleSquareClick(square)}
                className={`
                  aspect-square flex items-center justify-center text-4xl sm:text-5xl md:text-6xl
                  transition-all duration-200 relative
                  ${isLight ? "bg-[oklch(0.88_0.02_85)]" : "bg-[oklch(0.45_0.08_195)]"}
                  ${isSelected ? "ring-4 ring-primary ring-inset" : ""}
                  ${isHighlighted ? "ring-4 ring-warning ring-inset" : ""}
                  hover:brightness-110
                `}
                aria-label={`${square} ${piece ? `${piece.color} ${piece.type}` : "empty"}`}
              >
                {piece && <span className="select-none">{getPieceSymbol(piece)}</span>}
                {isLegalMove && !piece && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary/40" />
                  </div>
                )}
                {isLegalMove && piece && (
                  <div className="absolute inset-0 border-4 border-primary/40 rounded-full m-1" />
                )}
              </button>
            )
          }),
        )}
      </div>
    </div>
  )
}
