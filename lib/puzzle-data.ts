export interface ChessPuzzle {
  id: string
  fen: string
  solution: string[]
  difficulty: "beginner" | "intermediate" | "advanced" | "expert"
  category: "tactics" | "endgame" | "opening" | "middlegame"
  rating: number
  description?: string
}

export interface UserProgress {
  puzzleId: string
  status: "solved" | "failed" | "in-progress"
  timeTaken: number
  hintsUsed: number
  attempts: number
  lastAttempt: Date
}

// Mock puzzle data
export const MOCK_PUZZLES: ChessPuzzle[] = [
  {
    id: "puzzle-1",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    solution: ["f3g5", "d7d5", "g5f7", "e8f7", "c4d5"],
    difficulty: "intermediate",
    category: "tactics",
    rating: 1500,
    description: "Find the winning knight fork",
  },
  {
    id: "puzzle-2",
    fen: "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 6",
    solution: ["c4f7", "e8f7", "c3d5"],
    difficulty: "beginner",
    category: "tactics",
    rating: 1200,
    description: "Classic bishop sacrifice",
  },
  {
    id: "puzzle-3",
    fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    solution: ["e1e8", "g8h7", "e8e7"],
    difficulty: "beginner",
    category: "endgame",
    rating: 1000,
    description: "Rook endgame technique",
  },
  {
    id: "puzzle-4",
    fen: "r2qkb1r/ppp2ppp/2n5/3pP3/3Pn3/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 0 7",
    solution: ["d8h4", "g2g3", "h4g3", "h2g3", "e4f2"],
    difficulty: "advanced",
    category: "tactics",
    rating: 1800,
    description: "Complex tactical sequence",
  },
  {
    id: "puzzle-5",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 5",
    solution: ["c4f7", "e8f7", "d1d5", "f7e8", "d5c5"],
    difficulty: "expert",
    category: "tactics",
    rating: 2000,
    description: "Advanced combination",
  },
]

// Local storage helpers
export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return

  const existing = getProgress()
  const updated = existing.filter((p) => p.puzzleId !== progress.puzzleId)
  updated.push(progress)

  localStorage.setItem("chess-puzzle-progress", JSON.stringify(updated))
}

export function getProgress(): UserProgress[] {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem("chess-puzzle-progress")
  return data ? JSON.parse(data) : []
}

export function getPuzzleProgress(puzzleId: string): UserProgress | null {
  const progress = getProgress()
  return progress.find((p) => p.puzzleId === puzzleId) || null
}
