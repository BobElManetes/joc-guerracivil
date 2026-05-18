import { create } from 'zustand'

export interface GameState {
  scene: 'intro' | 'bunker' | 'puzzle1' | 'puzzle2' | 'puzzle3' | 'puzzle4' | 'ending'
  inventory: string[]
  solvedPuzzles: string[]
  latestInventoryItem: string | null
  timeRemaining: number
  dialogueIndex: number
  startGame: () => void
  nextScene: () => void
  setScene: (scene: GameState['scene']) => void
  addToInventory: (item: string) => void
  solvePuzzle: (puzzleId: string) => void
  updateDialogue: (index: number) => void
  decreaseTime: () => void
  resetGame: () => void
}

export const useGameStore = create<GameState>((set) => ({
  scene: 'intro',
  inventory: [],
  solvedPuzzles: [],
  latestInventoryItem: null,
  timeRemaining: 1800, // 30 minutes
  dialogueIndex: 0,

  startGame: () => set({ scene: 'bunker' }),
  
  nextScene: () =>
    set((state) => {
      const scenes: Array<GameState['scene']> = ['intro', 'bunker', 'puzzle1', 'puzzle2', 'puzzle3', 'puzzle4', 'ending']
      const currentIndex = scenes.indexOf(state.scene)
      return {
        scene: currentIndex < scenes.length - 1 ? scenes[currentIndex + 1] : 'ending',
      }
    }),

  setScene: (scene) => set({ scene }),

  addToInventory: (item: string) =>
    set((state) => {
      if (state.inventory.includes(item)) return state
      // Clear latestInventoryItem highlight after 3 seconds
      setTimeout(() => {
        set({ latestInventoryItem: null })
      }, 3000)
      return {
        inventory: [...state.inventory, item],
        latestInventoryItem: item,
      }
    }),

  solvePuzzle: (puzzleId: string) =>
    set((state) => ({
      solvedPuzzles: Array.from(new Set([...state.solvedPuzzles, puzzleId])),
    })),

  updateDialogue: (index: number) => set({ dialogueIndex: index }),

  decreaseTime: () =>
    set((state) => ({
      timeRemaining: Math.max(0, state.timeRemaining - 1),
    })),

  resetGame: () =>
    set({
      scene: 'intro',
      inventory: [],
      solvedPuzzles: [],
      latestInventoryItem: null,
      timeRemaining: 1800,
      dialogueIndex: 0,
    }),
}))
