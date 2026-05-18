'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useGameStore } from '@/hooks/use-game-store'

const TARGET_FREQUENCY = 19.38
const KEYWORDS = ['LLEGENDA', 'EXEMPLE', 'SOLIDARITAT']

const HINTS = [
  'La freqüència objectiu coincideix amb l\'any de la batalla: 19.38 MHz.',
  'El missatge conté tres paraules clau que descriuen l\'esperit dels voluntaris.',
  'Les paraules són: LLEGENDA, EXEMPLE i SOLIDARITAT.',
]

export function PuzzleRadio() {
  const [frequency, setFrequency] = useState(10)
  const [feedback, setFeedback] = useState<string>('')
  const [isLocked, setIsLocked] = useState(false)
  const [showTranscription, setShowTranscription] = useState(false)
  const [keywords, setKeywords] = useState(['', '', ''])
  const [keywordsFeedback, setKeywordsFeedback] = useState('')
  const [solved, setSolved] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [hints, setHints] = useState<string[]>([])
  const solvePuzzle = useGameStore((state) => state.solvePuzzle)
  const addToInventory = useGameStore((state) => state.addToInventory)
  const nextScene = useGameStore((state) => state.nextScene)

  const isInRange = Math.abs(frequency - TARGET_FREQUENCY) < 0.5
  const isVeryClose = Math.abs(frequency - TARGET_FREQUENCY) < 0.2

  const handleTune = (value: number) => {
    if (!isLocked) {
      setFrequency(parseFloat(value.toFixed(2)))
      setFeedback('')
    }
  }

  const checkFrequency = () => {
    if (Math.abs(frequency - TARGET_FREQUENCY) < 0.1) {
      setFeedback('SENYAL ESTABLE - Missatge rebut')
      setIsLocked(true)
      setShowTranscription(true)
    } else if (isInRange) {
      setFeedback('GAIREBÉ - Afina una mica més')
    } else {
      setFeedback('NOMÉS SOROLL - Continua buscant')
    }
  }

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...keywords]
    newKeywords[index] = value.toUpperCase()
    setKeywords(newKeywords)
    setKeywordsFeedback('')
  }

  const checkKeywords = () => {
    const allCorrect = keywords.every((kw, i) => kw === KEYWORDS[i])
    
    if (allCorrect) {
      setKeywordsFeedback('CORRECTE - Missatge transcrit!')
      setSolved(true)
      solvePuzzle('radio')
      addToInventory('radio')
      setShowMessage(true)
    } else {
      setKeywordsFeedback('ERROR - Alguna paraula no és correcta')
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
        {/* Header with Radio Image */}
        <div className="flex gap-6 mb-6">
          <div className="relative w-48 h-32 flex-shrink-0 border-2 border-[#b8a038]/50 overflow-hidden">
            <Image
              src="/images/vintage-radio.jpg"
              alt="Ràdio militar"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {isInRange && !isLocked && (
              <div className="absolute inset-0 bg-[#4ade80]/10 animate-pulse" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-xl text-[#f5e6d3] mb-2">Ràdio de La Pasionaria</h3>
            <p className="font-mono text-xs text-[#f5e6d3]/70 leading-relaxed">
              Sintonitza la freqüència 19.38 MHz per rebre el missatge de les Brigades Internacionals.
              Un cop rebut, transcriu les tres paraules clau del missatge.
            </p>
          </div>
        </div>

        {!showTranscription ? (
          <>
            {/* Radio Panel - Tuning Phase */}
            <div className="grid grid-cols-3 gap-4">
              {/* Frequency Display */}
              <div className="col-span-2 bg-black/60 border border-[#b8a038]/40 p-6">
                <div className="mb-4">
                  <p className="font-mono text-xs text-[#b8a038] uppercase tracking-widest mb-2">Freqüència Actual</p>
                  <div className={`font-mono text-5xl tracking-wider text-center py-4 border-2 ${
                    isLocked ? 'text-[#4ade80] border-[#4ade80] bg-[#4ade80]/5' : 
                    isVeryClose ? 'text-[#4ade80] border-[#4ade80]/50 animate-pulse' :
                    isInRange ? 'text-[#fbbf24] border-[#fbbf24]/50' : 
                    'text-[#f5e6d3] border-[#b8a038]/30'
                  }`}>
                    {frequency.toFixed(2)}
                    <span className="text-lg ml-2 opacity-60">MHz</span>
                  </div>
                </div>

                {/* Signal Indicator */}
                <div className="mb-4">
                  <p className="font-mono text-xs text-[#b8a038]/60 mb-2">Intensitat del Senyal</p>
                  <div className="flex gap-1">
                    {[...Array(20)].map((_, i) => {
                      const threshold = (Math.abs(frequency - TARGET_FREQUENCY) / 15) * 20
                      const isActive = i >= threshold
                      return (
                        <motion.div
                          key={i}
                          animate={{ opacity: isActive ? 1 : 0.2 }}
                          className={`flex-1 h-6 ${
                            isActive 
                              ? i > 15 ? 'bg-[#4ade80]' : i > 10 ? 'bg-[#fbbf24]' : 'bg-[#f5e6d3]/50'
                              : 'bg-[#f5e6d3]/10'
                          }`}
                        />
                      )
                    })}
                  </div>
                </div>

                {/* Dial */}
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.01"
                    value={frequency}
                    onChange={(e) => handleTune(Number(e.target.value))}
                    disabled={isLocked}
                    className="w-full h-3 appearance-none bg-[#b8a038]/20 rounded cursor-pointer disabled:cursor-not-allowed
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-10 
                      [&::-webkit-slider-thumb]:bg-[#b8a038] [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:cursor-grab
                      [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#f5e6d3]"
                  />
                  <div className="flex justify-between text-xs text-[#f5e6d3]/40 mt-2 font-mono">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                    <span>15</span>
                    <span>20</span>
                    <span>25</span>
                    <span>30</span>
                  </div>
                  {/* Target marker */}
                  <div 
                    className="absolute top-0 w-0.5 h-3 bg-[#4ade80]"
                    style={{ left: `${(19.38 / 30) * 100}%` }}
                  />
                </div>
              </div>

              {/* Info Panel */}
              <div className="bg-black/60 border border-[#b8a038]/40 p-4 flex flex-col">
                <p className="font-mono text-xs text-[#b8a038] uppercase tracking-widest mb-3">Objectiu</p>
                <div className="flex-1 flex flex-col justify-center items-center border border-dashed border-[#b8a038]/30 p-4">
                  <p className="font-mono text-3xl text-[#4ade80]">19.38</p>
                  <p className="font-mono text-xs text-[#f5e6d3]/50">MHz</p>
                </div>
                <p className="font-mono text-xs text-[#f5e6d3]/50 mt-3 text-center">
                  Brigades Internacionals
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Transcription Phase */}
            <div className="bg-black/60 border border-[#b8a038]/40 p-6">
              <div className="mb-6">
                <p className="font-mono text-xs text-[#4ade80] uppercase tracking-widest mb-2">Missatge Rebut</p>
                <div className="bg-black/40 border border-[#4ade80]/30 p-4 text-[#f5e6d3]/80 font-mono text-sm leading-relaxed">
                  <p className="mb-2">&quot;Aquí Brigades Internacionals, sector Gandesa.&quot;</p>
                  <p className="mb-2">
                    &quot;Els voluntaris que van venir a lluitar per la República seran sempre una <span className="text-[#fbbf24]">______</span>.&quot;
                  </p>
                  <p className="mb-2">
                    &quot;El seu sacrifici és un <span className="text-[#fbbf24]">______</span> per a tota la humanitat.&quot;
                  </p>
                  <p>
                    &quot;Van venir per <span className="text-[#fbbf24]">______</span> amb el poble espanyol. Fi del missatge.&quot;
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-mono text-xs text-[#b8a038] uppercase tracking-widest mb-3">Transcriu les Paraules Clau</p>
                <div className="grid grid-cols-3 gap-4">
                  {KEYWORDS.map((_, i) => (
                    <div key={i}>
                      <p className="font-mono text-xs text-[#f5e6d3]/50 mb-1">Paraula {i + 1}</p>
                      <input
                        type="text"
                        value={keywords[i]}
                        onChange={(e) => handleKeywordChange(i, e.target.value)}
                        disabled={solved}
                        className="w-full bg-black/50 border-2 border-[#b8a038]/50 px-3 py-2 text-[#f5e6d3] font-mono text-center uppercase tracking-widest focus:border-[#b8a038] focus:outline-none disabled:opacity-50"
                        placeholder="______"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {keywordsFeedback && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`font-mono text-sm text-center mb-4 ${
                    keywordsFeedback.includes('CORRECTE') ? 'text-[#4ade80]' : 'text-[#fbbf24]'
                  }`}
                >
                  {keywordsFeedback}
                </motion.p>
              )}
            </div>
          </>
        )}

        {/* Hints */}
        {hints.length > 0 && (
          <div className="mt-4 bg-black/40 border border-[#b8a038]/30 p-3">
            <p className="font-mono text-xs text-[#b8a038] uppercase mb-2">Pistes del Comissari:</p>
            {hints.map((hint, i) => (
              <p key={i} className="font-mono text-xs text-[#f5e6d3]/70 mb-1">- {hint}</p>
            ))}
          </div>
        )}

        {/* Feedback & Actions */}
        <div className="mt-6 flex items-center justify-between">
          {feedback && !showTranscription && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-2 font-mono text-sm ${
                feedback.includes('ESTABLE') ? 'text-[#4ade80]' : 
                feedback.includes('GAIREBÉ') ? 'text-[#fbbf24]' : 'text-[#f5e6d3]/60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                feedback.includes('ESTABLE') ? 'bg-[#4ade80] animate-pulse' : 
                feedback.includes('GAIREBÉ') ? 'bg-[#fbbf24]' : 'bg-[#f5e6d3]/30'
              }`} />
              {feedback}
            </motion.div>
          )}
          <div className="flex gap-3 ml-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={requestHint}
              disabled={hints.length >= HINTS.length}
              className="px-4 py-2 border border-[#fbbf24] text-[#fbbf24] font-mono text-xs uppercase tracking-widest hover:bg-[#fbbf24]/10 transition-colors disabled:opacity-50"
            >
              Demanar Ajuda
            </motion.button>
            {!showTranscription ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={checkFrequency}
                className="px-6 py-2 bg-[#b8a038] text-black font-bold uppercase text-sm tracking-widest hover:bg-[#4ade80] transition-colors"
              >
                Sintonitzar
              </motion.button>
            ) : !solved ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={checkKeywords}
                disabled={keywords.some(k => k === '')}
                className="px-6 py-2 bg-[#b8a038] text-black font-bold uppercase text-sm tracking-widest hover:bg-[#4ade80] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verificar Paraules
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowMessage(false); nextScene(); }}
                className="px-6 py-2 bg-[#4ade80] text-black font-bold uppercase text-sm tracking-widest"
              >
                Continuar
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMessage(false)}
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
                <h3 className="font-mono text-sm text-[#4ade80] uppercase tracking-widest">Comunicat Complet</h3>
              </div>
              <div className="space-y-3 text-[#f5e6d3]/80 font-mono text-sm leading-relaxed border-l-2 border-[#4ade80]/30 pl-4">
                <p>
                  El missatge de les Brigades Internacionals ha estat transcrit correctament.
                </p>
                <p>
                  Les paraules <span className="text-[#4ade80]">LLEGENDA</span>, <span className="text-[#4ade80]">EXEMPLE</span> i <span className="text-[#4ade80]">SOLIDARITAT</span> 
                  {' '}resumeixen l&apos;esperit dels voluntaris internacionals que van venir a lluitar per la República.
                </p>
                <p className="text-[#fbbf24]">
                  + Ràdio de comunicacions afegida a l&apos;inventari
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMessage(false)}
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
