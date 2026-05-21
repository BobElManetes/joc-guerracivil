'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useGameStore } from '@/hooks/use-game-store'

// Quiz sobre les Brigades Internacionals - cada resposta correcta revela una lletra
const QUIZ_QUESTIONS = [
  {
    question: 'De quants països aproximadament venien els voluntaris de les Brigades Internacionals?',
    options: ['10 països', '30 països', '50 països', '70 països'],
    correct: 2, // 50 països
    letter: 'B',
    explanation: 'Les Brigades Internacionals van rebre voluntaris de més de 50 països diferents.',
  },
  {
    question: 'En quin any es van formar les Brigades Internacionals?',
    options: ['1934', '1936', '1938', '1940'],
    correct: 1, // 1936
    letter: 'R',
    explanation: 'Les Brigades es van formar el 1936, poc després de l\'inici de la Guerra Civil.',
  },
  {
    question: 'Quants voluntaris aproximadament van formar part de les Brigades Internacionals?',
    options: ['5.000', '15.000', '35.000', '100.000'],
    correct: 2, // 35.000
    letter: 'I',
    explanation: 'Es calcula que uns 35.000 voluntaris van servir a les Brigades Internacionals.',
  },
  {
    question: 'Contra quin moviment polític van lluitar les Brigades Internacionals?',
    options: ['Comunisme', 'Feixisme', 'Anarquisme', 'Monarquia'],
    correct: 1, // Feixisme
    letter: 'G',
    explanation: 'Les Brigades van venir a Espanya per lluitar contra l\'avanç del feixisme a Europa.',
  },
  {
    question: 'Quina famosa batalla de l\'Ebre va ser clau per a les Brigades Internacionals?',
    options: ['Batalla de Madrid', 'Batalla de Brunete', 'Batalla de l\'Ebre', 'Batalla de Terol'],
    correct: 2, // Batalla de l'Ebre
    letter: 'A',
    explanation: 'La Batalla de l\'Ebre (1938) va ser una de les últimes grans batalles on van participar.',
  },
  {
    question: 'En quin mes de 1938 es va ordenar la retirada de les Brigades Internacionals?',
    options: ['Gener', 'Abril', 'Setembre', 'Desembre'],
    correct: 2, // Setembre
    letter: 'D',
    explanation: 'El setembre de 1938, el govern republicà va ordenar la retirada dels voluntaris estrangers.',
  },
  {
    question: 'Quin famós escriptor nord-americà va ser voluntari i va escriure sobre la guerra?',
    options: ['F. Scott Fitzgerald', 'Ernest Hemingway', 'John Steinbeck', 'William Faulkner'],
    correct: 1, // Hemingway
    letter: 'A',
    explanation: 'Ernest Hemingway va ser corresponsal i va escriure "Per qui toquen les campanes".',
  },
]

const FINAL_WORD = 'BRIGADA' // La paraula que es forma amb les respostes correctes

const HINTS = [
  'Pensa en el context històric de la Guerra Civil Espanyola (1936-1939).',
  'Les Brigades Internacionals eren voluntaris estrangers que van venir a ajudar la República.',
  'La darrera pista: la paraula final és BRIGADA.',
]

export function PuzzleMorse() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUIZ_QUESTIONS.length).fill(null))
  const [showExplanation, setShowExplanation] = useState(false)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null)
  const [solved, setSolved] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [hints, setHints] = useState<string[]>([])
  
  const solvePuzzle = useGameStore((state) => state.solvePuzzle)
  const addToInventory = useGameStore((state) => state.addToInventory)
  const nextScene = useGameStore((state) => state.nextScene)

  const handleAnswer = (optionIndex: number) => {
    if (answers[currentQuestion] !== null) return
    
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
    
    const isCorrect = optionIndex === QUIZ_QUESTIONS[currentQuestion].correct
    setLastAnswerCorrect(isCorrect)
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    setShowExplanation(false)
    setLastAnswerCorrect(null)
    
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Comprovar si totes les respostes són correctes
      const allCorrect = answers.every((ans, i) => ans === QUIZ_QUESTIONS[i].correct)
      if (allCorrect) {
        setSolved(true)
        solvePuzzle('morse')
        addToInventory('ordre')
        setShowSuccess(true)
      }
    }
  }

  const getRevealedWord = () => {
    return QUIZ_QUESTIONS.map((q, i) => {
      if (answers[i] === q.correct) {
        return q.letter
      }
      return '_'
    }).join('')
  }

  const correctAnswersCount = answers.filter((ans, i) => ans === QUIZ_QUESTIONS[i].correct).length
  const allQuestionsAnswered = answers.every(ans => ans !== null)

  const requestHint = () => {
    if (hints.length < HINTS.length) {
      setHints([...hints, HINTS[hints.length]])
    }
  }

  const retryQuiz = () => {
    setCurrentQuestion(0)
    setAnswers(new Array(QUIZ_QUESTIONS.length).fill(null))
    setShowExplanation(false)
    setLastAnswerCorrect(null)
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
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-xl text-[#f5e6d3] mb-2">Missatge de les Brigades</h3>
            <p className="font-mono text-xs text-[#f5e6d3]/70 leading-relaxed">
              Per desxifrar el missatge final, has de demostrar els teus coneixements sobre les 
              Brigades Internacionals. Cada resposta correcta revela una lletra del codi secret.
            </p>
          </div>
        </div>

        {/* Progress & Revealed Word */}
        <div className="bg-black/60 border border-[#b8a038]/40 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-xs text-[#b8a038] uppercase tracking-widest">Codi Secret</p>
            <p className="font-mono text-xs text-[#f5e6d3]/60">
              {correctAnswersCount}/{QUIZ_QUESTIONS.length} lletres
            </p>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {QUIZ_QUESTIONS.map((q, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: answers[i] === q.correct ? [1, 1.2, 1] : 1,
                  borderColor: answers[i] === q.correct ? '#4ade80' : answers[i] !== null ? '#ef4444' : '#b8a038'
                }}
                className={`w-10 h-12 border-2 flex items-center justify-center font-mono text-xl ${
                  answers[i] === q.correct 
                    ? 'bg-[#4ade80]/20 text-[#4ade80]' 
                    : answers[i] !== null 
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-black/40 text-[#f5e6d3]/30'
                }`}
              >
                {answers[i] === q.correct ? q.letter : answers[i] !== null ? 'X' : '_'}
              </motion.div>
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="h-1 bg-black/40 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#4ade80]"
              initial={{ width: 0 }}
              animate={{ width: `${(correctAnswersCount / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Area */}
        {!allQuestionsAnswered ? (
          <div className="bg-black/60 border border-[#b8a038]/40 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-xs text-[#fbbf24] uppercase tracking-widest">
                Pregunta {currentQuestion + 1} de {QUIZ_QUESTIONS.length}
              </p>
            </div>

            <p className="text-[#f5e6d3] font-serif text-lg mb-6">
              {QUIZ_QUESTIONS[currentQuestion].question}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {QUIZ_QUESTIONS[currentQuestion].options.map((option, i) => {
                const isSelected = answers[currentQuestion] === i
                const isCorrect = i === QUIZ_QUESTIONS[currentQuestion].correct
                const showResult = showExplanation && answers[currentQuestion] !== null

                return (
                  <motion.button
                    key={i}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(i)}
                    disabled={answers[currentQuestion] !== null}
                    className={`p-4 border-2 text-left font-mono text-sm transition-all ${
                      showResult
                        ? isCorrect
                          ? 'border-[#4ade80] bg-[#4ade80]/20 text-[#4ade80]'
                          : isSelected
                            ? 'border-red-500 bg-red-500/20 text-red-400'
                            : 'border-[#b8a038]/20 text-[#f5e6d3]/40'
                        : isSelected
                          ? 'border-[#fbbf24] bg-[#fbbf24]/20 text-[#fbbf24]'
                          : 'border-[#b8a038]/40 text-[#f5e6d3]/80 hover:border-[#b8a038] hover:bg-[#b8a038]/10'
                    } disabled:cursor-default`}
                  >
                    <span className="mr-2 text-[#b8a038]">{String.fromCharCode(65 + i)}.</span>
                    {option}
                  </motion.button>
                )
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <div className={`p-4 border-l-4 ${
                    lastAnswerCorrect 
                      ? 'border-[#4ade80] bg-[#4ade80]/10' 
                      : 'border-red-500 bg-red-500/10'
                  }`}>
                    <p className={`font-mono text-sm mb-2 ${
                      lastAnswerCorrect ? 'text-[#4ade80]' : 'text-red-400'
                    }`}>
                      {lastAnswerCorrect ? 'Correcte!' : 'Incorrecte'}
                      {lastAnswerCorrect && (
                        <span className="ml-2">+1 lletra: <strong>{QUIZ_QUESTIONS[currentQuestion].letter}</strong></span>
                      )}
                    </p>
                    <p className="font-mono text-xs text-[#f5e6d3]/70">
                      {QUIZ_QUESTIONS[currentQuestion].explanation}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextQuestion}
                    className="mt-4 w-full py-2 bg-[#b8a038] text-black font-mono text-sm uppercase tracking-widest hover:bg-[#4ade80] transition-colors"
                  >
                    {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Seguent Pregunta' : 'Veure Resultat'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Results */
          <div className="bg-black/60 border border-[#b8a038]/40 p-6 mb-6">
            <div className="text-center">
              {correctAnswersCount === QUIZ_QUESTIONS.length ? (
                <>
                  <p className="font-mono text-xs text-[#4ade80] uppercase tracking-widest mb-2">Missatge Desxifrat</p>
                  <p className="font-serif text-3xl text-[#4ade80] mb-4">{FINAL_WORD}</p>
                  <p className="font-mono text-sm text-[#f5e6d3]/70">
                    Has demostrat un coneixement excel.lent sobre les Brigades Internacionals.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-mono text-xs text-[#fbbf24] uppercase tracking-widest mb-2">Resultat</p>
                  <p className="font-serif text-xl text-[#f5e6d3] mb-2">
                    {correctAnswersCount} de {QUIZ_QUESTIONS.length} correctes
                  </p>
                  <p className="font-mono text-sm text-[#f5e6d3]/70 mb-4">
                    Necessites totes les respostes correctes per desxifrar el missatge.
                  </p>
                  <p className="font-mono text-lg text-[#fbbf24] mb-4">
                    Codi parcial: {getRevealedWord()}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={retryQuiz}
                    className="px-6 py-2 bg-[#fbbf24] text-black font-mono text-sm uppercase tracking-widest hover:bg-[#4ade80] transition-colors"
                  >
                    Tornar a Intentar
                  </motion.button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Hints */}
        {hints.length > 0 && (
          <div className="mb-4 bg-black/40 border border-[#b8a038]/30 p-3">
            <p className="font-mono text-xs text-[#b8a038] uppercase mb-2">Pistes:</p>
            {hints.map((hint, i) => (
              <p key={i} className="font-mono text-xs text-[#f5e6d3]/70 mb-1">- {hint}</p>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          {!solved ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={requestHint}
              disabled={hints.length >= HINTS.length}
              className="px-4 py-2 border border-[#fbbf24] text-[#fbbf24] font-mono text-xs uppercase tracking-widest hover:bg-[#fbbf24]/10 transition-colors disabled:opacity-50"
            >
              Demanar Ajuda
            </motion.button>
          ) : (
            <div />
          )}

          {solved && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(74, 222, 128, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => nextScene()}
              className="px-8 py-3 bg-[#4ade80] text-black font-bold uppercase text-sm tracking-widest border-2 border-[#4ade80] hover:bg-[#4ade80]/90 transition-all"
            >
              Continuar al Seguent Nivell
            </motion.button>
          )}
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
                <p className="text-2xl text-[#4ade80] font-bold tracking-wider">
                  {FINAL_WORD}
                </p>
                <p>
                  Has demostrat un excel.lent coneixement sobre les Brigades Internacionals, 
                  els voluntaris estrangers que van lluitar per la llibertat durant la Guerra Civil Espanyola.
                </p>
                <p className="text-[#f5e6d3]/60 text-xs">
                  Aquests homes i dones van deixar les seves llars per defensar la democracia 
                  contra el feixisme. El seu sacrifici no sera oblidat.
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
