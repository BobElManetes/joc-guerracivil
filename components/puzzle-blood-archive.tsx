'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useGameStore } from '@/hooks/use-game-store'

interface Question {
  id: number
  question: string
  options: string[]
  correctIndex: number
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Quin riu va ser l\'escenari principal de la batalla?',
    options: ['Segre', 'Ebre', 'Llobregat', 'Ter'],
    correctIndex: 1,
  },
  {
    id: 2,
    question: 'En quin any va tenir lloc la Batalla de l\'Ebre?',
    options: ['1936', '1937', '1938', '1939'],
    correctIndex: 2,
  },
  {
    id: 3,
    question: 'Quina era la destinació sanitària prioritària per als ferits?',
    options: ['Madrid', 'València', 'Barcelona', 'Saragossa'],
    correctIndex: 2,
  },
]

const HINTS = [
  'El riu que dona nom a la batalla és el més cabalós d\'Espanya.',
  'La batalla va ser la més llarga i sagnant de tota la Guerra Civil.',
  'La capital catalana era el centre logístic i hospitalari de la República.',
]

export function PuzzleBloodArchive() {
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null])
  const [feedback, setFeedback] = useState('')
  const [solved, setSolved] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [hints, setHints] = useState<string[]>([])
  const solvePuzzle = useGameStore((state) => state.solvePuzzle)
  const addToInventory = useGameStore((state) => state.addToInventory)
  const setScene = useGameStore((state) => state.setScene)

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (solved) return
    const newAnswers = [...answers]
    newAnswers[questionIndex] = optionIndex
    setAnswers(newAnswers)
    setFeedback('')
  }

  const checkSolution = () => {
    const allCorrect = QUESTIONS.every(
      (q, i) => answers[i] === q.correctIndex
    )

    if (allCorrect) {
      setFeedback('')
      setSolved(true)
      solvePuzzle('blood-archive')
      addToInventory('fitxes')
      setShowSuccess(true)
    } else {
      setFeedback('Algunes respostes no són correctes. Revisa les dades.')
    }
  }

  const requestHint = () => {
    if (hints.length < HINTS.length) {
      setHints([...hints, HINTS[hints.length]])
    }
  }

  const allAnswered = answers.every(a => a !== null)

  return (
    <div className="relative">
      <div className="bg-black/80 backdrop-blur-sm border-2 border-[#b8a038] p-6">
        {/* Header */}
        <div className="flex gap-6 mb-6">
          <div className="relative w-48 h-32 flex-shrink-0 border-2 border-[#b8a038]/50 overflow-hidden">
            <Image
              src="/images/bunker-interior.jpg"
              alt="Arxiu del búnquer"
              fill
              className="object-cover sepia"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-xl text-[#f5e6d3] mb-2">L&apos;Arxiu de Sang</h3>
            <p className="font-mono text-xs text-[#f5e6d3]/70 leading-relaxed">
              Abans d&apos;evacuar, has de completar les fitxes dels voluntaris ferits amb les dades correctes.
              Respon les preguntes per segellar l&apos;arxiu i enviar l&apos;últim telegrama.
            </p>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-6">
          {QUESTIONS.map((q, qIndex) => (
            <div key={q.id} className="bg-black/50 border border-[#b8a038]/40 p-4">
              <p className="font-mono text-xs text-[#b8a038] uppercase tracking-widest mb-2">
                Pregunta {q.id}
              </p>
              <p className="font-serif text-lg text-[#f5e6d3] mb-4">{q.question}</p>
              
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((option, oIndex) => {
                  const isSelected = answers[qIndex] === oIndex
                  const isCorrect = solved && oIndex === q.correctIndex
                  const isWrong = solved && isSelected && oIndex !== q.correctIndex
                  
                  return (
                    <motion.button
                      key={oIndex}
                      whileHover={{ scale: solved ? 1 : 1.02 }}
                      whileTap={{ scale: solved ? 1 : 0.98 }}
                      onClick={() => handleAnswer(qIndex, oIndex)}
                      disabled={solved}
                      className={`p-3 border-2 text-left font-mono text-sm transition-all ${
                        isCorrect
                          ? 'border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80]'
                          : isWrong
                          ? 'border-red-500 bg-red-500/10 text-red-400'
                          : isSelected
                          ? 'border-[#b8a038] bg-[#b8a038]/20 text-[#f5e6d3]'
                          : 'border-[#b8a038]/30 text-[#f5e6d3]/70 hover:border-[#b8a038]/60'
                      } ${solved ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span className="text-[#b8a038] mr-2">
                        {String.fromCharCode(65 + oIndex)}.
                      </span>
                      {option}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-sm text-center text-[#fbbf24] mb-4"
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={requestHint}
            disabled={hints.length >= HINTS.length}
            className="px-4 py-2 border border-[#fbbf24] text-[#fbbf24] font-mono text-xs uppercase tracking-widest hover:bg-[#fbbf24]/10 transition-colors disabled:opacity-50"
          >
            Demanar Ajuda
          </motion.button>
          
          <div className="flex gap-3">
            {!solved ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={checkSolution}
                disabled={!allAnswered}
                className="px-6 py-2 bg-[#b8a038] text-black font-bold uppercase text-sm tracking-widest hover:bg-[#4ade80] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Segellar Arxiu
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setScene('ending')}
                className="px-6 py-2 bg-[#4ade80] text-black font-bold uppercase text-sm tracking-widest"
              >
                Enviar Últim Telegrama
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
                <h3 className="font-mono text-sm text-[#4ade80] uppercase tracking-widest">Arxiu Segellat</h3>
              </div>
              <div className="space-y-3 text-[#f5e6d3]/80 font-mono text-sm leading-relaxed border-l-2 border-[#4ade80]/30 pl-4">
                <p>
                  L&apos;arxiu de sang ha estat completat correctament amb les dades dels voluntaris ferits.
                </p>
                <p>
                  Les fitxes seran enviades a <span className="text-[#4ade80]">Barcelona</span> per garantir 
                  l&apos;atenció mèdica dels combatents de l&apos;<span className="text-[#4ade80]">Ebre</span> durant 
                  la retirada de <span className="text-[#4ade80]">1938</span>.
                </p>
                <p>
                  Ara pots enviar l&apos;últim telegrama i completar la missió d&apos;evacuació.
                </p>
                <p className="text-[#fbbf24]">
                  + Fitxes mèdiques afegides a l&apos;inventari
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
