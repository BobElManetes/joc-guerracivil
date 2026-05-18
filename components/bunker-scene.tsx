'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { DialogueBox } from './dialogue-box'
import { useGameStore } from '@/hooks/use-game-store'
import { PuzzleMap } from './puzzle-map'
import { PuzzleRadio } from './puzzle-radio'
import { PuzzleMorse } from './puzzle-morse'
import { PuzzleBloodArchive } from './puzzle-blood-archive'

const SCENES = [
  {
    id: 'bunker',
    title: 'Centre d\'Operacions',
    subtitle: 'Búnquer de l\'Ebre - Tardor 1938',
    dialogue: 'Sergent, has arribat. L\'ofensiva franquista avança des del sud. Necessitem coordinar la retirada abans que sigui massa tard. Ets l\'enllaç que ha de connectar amb les Brigades Internacionals.',
    image: '/images/bunker-interior.jpg',
  },
  {
    id: 'puzzle1',
    title: 'El Mapa de la Retirada',
    subtitle: 'Assignació Tàctica',
    dialogue: 'Per coordinar la defensa, has d\'assignar cada batalló de les Brigades Internacionals al seu sector corresponent del front. El Batalló Lincoln, el Mackenzie-Papineau i el Thälmann esperen les teves ordres.',
    image: '/images/military-map.jpg',
    component: PuzzleMap,
  },
  {
    id: 'puzzle2',
    title: 'Ràdio de La Pasionaria',
    subtitle: 'Comunicacions',
    dialogue: 'La ràdio està malmesa però funciona. Sintonitza la freqüència 19.38 MHz per contactar amb el comandament de les Brigades a Gandesa. Un cop rebut el missatge, transcriu les tres paraules clau.',
    image: '/images/vintage-radio.jpg',
    component: PuzzleRadio,
  },
  {
    id: 'puzzle3',
    title: 'Tercer Canal Morse',
    subtitle: 'Desxiframent',
    dialogue: 'L\'últim missatge ha arribat en codi Morse. Desxifra\'l per completar l\'ordre de retirada. Cada grup de punts i ratlles representa una lletra.',
    image: '/images/morse-telegraph.jpg',
    component: PuzzleMorse,
  },
  {
    id: 'puzzle4',
    title: 'L\'Arxiu de Sang',
    subtitle: 'Registre Sanitari',
    dialogue: 'Abans d\'evacuar, has de completar les fitxes dels voluntaris ferits amb les dades correctes. Respon les preguntes sobre la batalla per segellar l\'arxiu i enviar l\'últim telegrama.',
    image: '/images/bunker-interior.jpg',
    component: PuzzleBloodArchive,
  },
]

export function BunkerScene() {
  const scene = useGameStore((state) => state.scene)
  const solvedPuzzles = useGameStore((state) => state.solvedPuzzles)
  const nextScene = useGameStore((state) => state.nextScene)
  const [showDialogue, setShowDialogue] = useState(true)
  const [dialogueComplete, setDialogueComplete] = useState(false)

  const currentSceneIndex = ['bunker', 'puzzle1', 'puzzle2', 'puzzle3', 'puzzle4'].indexOf(scene)
  const currentSceneData = SCENES[currentSceneIndex] || SCENES[0]
  const CurrentComponent = currentSceneData.component

  // Reset dialogue state when scene changes
  useEffect(() => {
    setShowDialogue(true)
    setDialogueComplete(false)
  }, [scene])

  const handleDialogueComplete = useCallback(() => {
    setDialogueComplete(true)
  }, [])

  const handleContinue = useCallback(() => {
    setShowDialogue(false)
    if (scene === 'bunker') {
      nextScene()
    }
  }, [scene, nextScene])

  // Handle keyboard events for dialogue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && showDialogue) {
        e.preventDefault()
        if (dialogueComplete) {
          handleContinue()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showDialogue, dialogueComplete, handleContinue])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={currentSceneData.image}
          alt={currentSceneData.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
      </div>

      {/* Film Grain Overlay */}
      <div className="film-grain" />
      <div className="bunker-vignette" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Bar - Scene Info */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-6 px-6 pb-4"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/60 backdrop-blur-sm border-2 border-[#b8a038]/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-[#f5e6d3] tracking-wide">{currentSceneData.title}</h2>
                  <p className="font-mono text-xs text-[#b8a038] mt-1 tracking-widest uppercase">{currentSceneData.subtitle}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-[#f5e6d3]/60">Progrés</p>
                  <div className="flex gap-2 mt-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 border-2 ${
                          solvedPuzzles.length > i
                            ? 'bg-[#4ade80] border-[#4ade80]'
                            : 'border-[#b8a038]/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Scene Content */}
        <div className="flex-1 flex items-center justify-center p-6 pb-32">
          <AnimatePresence mode="wait">
            {CurrentComponent && !showDialogue ? (
              <motion.div
                key={scene}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl"
              >
                <CurrentComponent />
              </motion.div>
            ) : scene === 'bunker' && !showDialogue ? (
              <motion.div
                key="entry"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-2xl"
              >
                <div className="bg-black/70 backdrop-blur-sm border-2 border-[#b8a038] p-8 text-center">
                  <p className="font-mono text-sm text-[#f5e6d3] mb-6">
                    El búnquer està preparat. Procedeix a la següent cambra per començar la teva missió.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#4ade80' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextScene}
                    className="px-8 py-3 bg-[#b8a038] text-black font-bold uppercase text-sm tracking-widest transition-colors"
                  >
                    Començar Missió
                  </motion.button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Dialogue Box */}
        {showDialogue && (
          <DialogueBox
            text={currentSceneData.dialogue}
            onComplete={handleDialogueComplete}
            showContinue
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  )
}
