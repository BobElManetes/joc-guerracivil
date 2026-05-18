'use client'

import { useGameStore } from '@/hooks/use-game-store'
import { IntroScreen } from '@/components/intro-screen'
import { BunkerScene } from '@/components/bunker-scene'
import { EndingScene } from '@/components/ending-scene'
import { Inventory } from '@/components/inventory'
import { Timer } from '@/components/timer'

export default function Home() {
  const scene = useGameStore((state) => state.scene)

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {scene === 'intro' && <IntroScreen />}
      
      {['bunker', 'puzzle1', 'puzzle2', 'puzzle3', 'puzzle4'].includes(scene) && (
        <div className="flex flex-col min-h-screen">
          {/* Fixed Top Bar with Inventory and Timer */}
          <header className="fixed top-0 left-0 right-0 z-50 flex items-stretch">
            <div className="flex-1">
              <Inventory />
            </div>
            <div className="flex-shrink-0">
              <Timer />
            </div>
          </header>
          
          {/* Main Content with top padding for header */}
          <main className="pt-14">
            <BunkerScene />
          </main>
        </div>
      )}

      {scene === 'ending' && <EndingScene />}
    </div>
  )
}
