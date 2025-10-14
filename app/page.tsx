"use client"

import { useState } from "react"
import { PuzzleBoard } from "@/components/puzzle-board"
import { PuzzleList } from "@/components/puzzle-list"
import { StatisticsPanel } from "@/components/statistics-panel"
import { ProgressHistory } from "@/components/progress-history"
import { ServiceWorkerRegister } from "@/components/service-worker-register"
import { MOCK_PUZZLES, type ChessPuzzle } from "@/lib/puzzle-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [selectedPuzzle, setSelectedPuzzle] = useState<ChessPuzzle>(MOCK_PUZZLES[0])

  return (
    <>
      <ServiceWorkerRegister />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Chess Puzzle PWA</h1>
            <p className="text-muted-foreground">Solve chess puzzles offline with performance optimizations</p>
          </header>

          <div className="grid lg:grid-cols-[1fr_400px] gap-6">
            <div>
              <PuzzleBoard key={selectedPuzzle.id} puzzle={selectedPuzzle} />
            </div>
            <div className="space-y-6">
              <Tabs defaultValue="puzzles" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="puzzles">Puzzles</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="puzzles" className="mt-4">
                  <PuzzleList
                    puzzles={MOCK_PUZZLES}
                    onSelectPuzzle={setSelectedPuzzle}
                    selectedPuzzleId={selectedPuzzle.id}
                  />
                </TabsContent>
                <TabsContent value="stats" className="mt-4">
                  <StatisticsPanel />
                </TabsContent>
                <TabsContent value="history" className="mt-4">
                  <ProgressHistory />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
