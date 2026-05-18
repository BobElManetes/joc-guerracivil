'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useGameStore } from '@/hooks/use-game-store'

const MORSE_SOLUTION = 'TELEGRAMA'
const MORSE_PATTERN = '- . .-.. . --. .-. .- -- .-'

const MORSE_REFERENCE: Record<string, string> = {
  'T': '-',
  'E': '.',
  'L': '.-..',
  'G': '--.',
  'R': '.-.',
  'A': '.-',
  'M': '--',
}

const HINTS = [
  'El codi Morse es llegeix d\'esquerra a dreta, cada grup de punts i ratlles és una lletra.',
  'La paraula té 9 lletres i descriu el tipus de missatge que has d\'enviar.',
  'La solució és: TELEGRAMA',
]

export function PuzzleMorse() {
  const [userInput, setUserInput] = useState('')
  const [feedback, setFeedback] = useState('')
  const [solved, setSolved] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [hints, setHints] = useState<string[]>([])
  const solvePuzzle = useGameStore((state) => state.solvePuzzle)
  const addToInventory = useGameStore((state) => state.addToInventory)
  const nextScene = useGameStore((state) => state.nextScene)

  const morseGroups = MORSE_PATTERN.split(' ')

  const playMorse = useCallback(() => {
    if (isPlaying) return
    setIsPlaying(true)
    setCurrentIndex(0)
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying || currentIndex < 0) return

    if (currentIndex >= morseGroups.length) {
      setIsPlaying(false)
      setCurrentIndex(-1)
      return
    }

    const timer = setTimeout(() => {
      setCurrentIndex(currentIndex + 1)
    }, 600)

    return () => clearTimeout(timer)
  }, [currentIndex, isPlaying, morseGroups.length])

  // Auto-play on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      playMorse()
    }, 500)
    return () => clearTimeout(timer)
  }, [playMorse])

  const checkSolution = () => {
    if (userInput.toUpperCase() === MORSE_SOLUTION) {
      setFeedback('CORRECTE - Missatge desxifrat!')
      setSolved(true)
      solvePuzzle('morse')
      addToInventory('ordre')
      setShowSuccess(true)
    } else {
      setFeedback('ERROR - Torna a escoltar el senyal')
      setUserInput('')
    }
  }

  const requestHint = () => {
    if (hints.length < HINTS.length) {
      setHints([...hints, HINTS[hints.length]])
    }
  }

  return (
    <div className="relative">
      <div className="bg-black/80 backdrop-blur-sm border-2 border-[#b8a038] p-6">
        {/* Header */}
        <div className="flex gap-6 mb-6">
          <div className="relative w-48 h-32 flex-shrink-0 border-2 border-[#b8a038]/50 overflow-hidden">
            <Image
              src="/images/morse-telegraph.jpg"
              alt="Telègraf Morse"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {isPlaying && (
              <div className="absolute inset-0 bg-[#fbbf24]/10 animate-pulse" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-xl text-[#f5e6d3] mb-2">Tercer Canal Morse</h3>
            <p className="font-mono text-xs text-[#f5e6d3]/70 leading-relaxed">
              Un últim missatge ha arribat en codi Morse. Desxifra&apos;l per completar l&apos;ordre de retirada.
              Cada grup de punts i ratlles representa una lletra.
            </p>
          </div>
        </div>

        {/* Morse Display */}
        <div className="bg-black/60 border border-[#b8a038]/40 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-xs text-[#b8a038] uppercase tracking-widest">Senyal Rebut</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playMorse}
              disabled={isPlaying}
              className="px-3 py-1 border border-[#4ade80] text-[#4ade80] font-mono text-xs uppercase hover:bg-[#4ade80]/10 disabled:opacity-50"
            >
              {isPlaying ? 'Reproduint...' : 'Reproduir'}
            </motion.button>
          </div>

          {/* Morse Pattern Display */}
          <div className="bg-black/40 border border-[#fbbf24]/30 p-4 mb-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {morseGroups.map((group, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: currentIndex === i ? 1.2 : 1,
                    color: currentIndex === i ? '#4ade80' : currentIndex > i ? '#fbbf24' : '#f5e6d3'
                  }}
                  className="font-mono text-2xl tracking-widest"
                >
                  {group}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual Reference */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {Object.entries(MORSE_REFERENCE).map(([letter, code]) => (
              <div key={letter} className="bg-black/30 border border-[#b8a038]/20 p-2 text-center">
                <p className="font-mono text-sm text-[#f5e6d3]">{letter}</p>
                <p className="font-mono text-xs text-[#b8a038]">{code}</p>
              </div>
            ))}
          </div>

          {/* Input */}
          <div>
            <p className="font-mono text-xs text-[#b8a038]/60 mb-2">Introdueix la Paraula Desxifrada</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                disabled={solved}
                placeholder="_ _ _ _ _ _ _ _ _"
                maxLength={9}
                className="flex-1 bg-black/50 border-2 border-[#b8a038]/50 px-4 py-3 text-[#f5e6d3] font-mono text-xl text-center tracking-[0.5em] uppercase focus:border-[#b8a038] focus:outline-none disabled:opacity-50"
              />
            </div>
            <p className="font-mono text-xs text-[#f5e6d3]/40 text-center mt-2">
              {userInput.length}/9 caràcters
            </p>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`font-mono text-sm text-center mb-4 ${
              feedback.includes('CORRECTE') ? 'text-[#4ade80]' : 'text-[#fbbf24]'
            }`}
          >
            {feedback}
          </motion.p>
        )}

        {/* Hints */}
        {hints.length > 0 && (
          <div className="mb-4 bg-black/40 border border-[#b8a038]/30 p-3">
            <p className="font-mono text-xs text-[#b8a038] uppercase mb-2">Pistes del Comissari:</p>
            {hints.map((hint, i) => (
              <p key={i} className="font-mono text-xs text-[#f5e6d3]/70 mb-1">- {hint}</p>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={requestHint}
              disabled={hints.length >= HINTS.length}
              className="px-4 py-2 border border-[#fbbf24] text-[#fbbf24] font-mono text-xs uppercase tracking-widest hover:bg-[#fbbf24]/10 transition-colors disabled:opacity-50"
            >
              Demanar Ajuda
            </motion.button>
          </div>
          <div className="flex gap-3">
            {!solved ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={checkSolution}
                disabled={userInput.length !== 9}
                className="px-6 py-2 bg-[#b8a038] text-black font-bold uppercase text-sm tracking-widest hover:bg-[#4ade80] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verificar
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowSuccess(false); nextScene(); }}
                className="px-6 py-2 bg-[#4ade80] text-black font-bold uppercase text-sm tracking-widest"
              >
                Continuar
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border-2 border-[#4ade80] p-6 max-w-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                <h3 className="font-mono text-sm text-[#4ade80] uppercase tracking-widest">Missatge Desxifrat</h3>
              </div>
              <div className="space-y-3 text-[#f5e6d3]/80 font-mono text-sm leading-relaxed border-l-2 border-[#4ade80]/30 pl-4">
                <p className="text-xl text-[#4ade80] font-bold tracking-wider">
                  {MORSE_SOLUTION}
                </p>
                <p>
                  El codi Morse ha estat desxifrat correctament. La paraula &quot;TELEGRAMA&quot; indica 
                  que has de preparar l&apos;últim comunicat oficial de retirada.
                </p>
                <p>
                  Només queda una prova més: completar l&apos;arxiu de sang amb les dades 
                  dels voluntaris ferits abans d&apos;evacuar el búnquer.
                </p>
                <p className="text-[#fbbf24]">
                  + Ordre de retirada afegida a l&apos;inventari
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccess(false)}
                className="mt-6 w-full px-6 py-2 bg-[#4ade80] text-black font-bold uppercase text-sm tracking-widest"
              >
                Entesos
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
