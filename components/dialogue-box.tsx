'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface DialogueBoxProps {
  text: string
  onComplete?: () => void
  showContinue?: boolean
  onContinue?: () => void
}

export function DialogueBox({ text, onComplete, showContinue = false, onContinue }: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const skipToEnd = useCallback(() => {
    setDisplayedText(text)
    setIsComplete(true)
    onComplete?.()
  }, [text, onComplete])

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('')
    setIsComplete(false)
  }, [text])

  useEffect(() => {
    if (displayedText === text) {
      setIsComplete(true)
      onComplete?.()
      return
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1))
    }, 35)

    return () => clearTimeout(timer)
  }, [displayedText, text, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-6 border-t-2 border-[#b8a038] z-40"
    >
      <div className="max-w-4xl mx-auto">
        <div className="border-2 border-[#b8a038] p-4 bg-black/80">
          <p className="font-mono text-sm leading-relaxed text-[#f5e6d3] min-h-16">
            {displayedText}
            {!isComplete && <span className="animate-pulse text-[#4ade80]">|</span>}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {/* Skip Button */}
          {!isComplete && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={skipToEnd}
              className="px-4 py-1 border border-[#b8a038]/50 text-[#b8a038]/70 font-mono text-xs uppercase tracking-widest hover:border-[#b8a038] hover:text-[#b8a038] transition-colors"
            >
              Ometre [Espai]
            </motion.button>
          )}

          {/* Continue indicator */}
          {showContinue && isComplete && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              onClick={onContinue}
              className="ml-auto font-mono text-xs text-[#4ade80] hover:text-[#4ade80]/80 transition-colors"
            >
              [PREM ESPAI O CLICA PER CONTINUAR]
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
