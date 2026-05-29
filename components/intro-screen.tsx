'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useGameStore } from '@/hooks/use-game-store'

export function IntroScreen() {
  const [displayedTitle, setDisplayedTitle] = useState('')
  const [showContent, setShowContent] = useState(false)
  const [skipTypewriter, setSkipTypewriter] = useState(false)
  const startGame = useGameStore((state) => state.startGame)

  const title = "L'Eco de la Retirada"
  const subtitle = "Batalla de l'Ebre, 1938"

  const skipToEnd = useCallback(() => {
    setDisplayedTitle(title)
    setShowContent(true)
    setSkipTypewriter(true)
  }, [])

  useEffect(() => {
    if (skipTypewriter) return

    if (displayedTitle === title) {
      setTimeout(() => setShowContent(true), 500)
      return
    }

    const timer = setTimeout(() => {
      setDisplayedTitle(title.slice(0, displayedTitle.length + 1))
    }, 80)

    return () => clearTimeout(timer)
  }, [displayedTitle, skipTypewriter])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !showContent) {
        e.preventDefault()
        skipToEnd()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showContent, skipToEnd])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/ebro-battle.jpg"
          alt="Batalla de l'Ebre"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
      </div>

      {/* Film Grain Overlay */}
      <div className="film-grain" />
      <div className="bunker-vignette" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center max-w-2xl"
        >
          {/* Main Title with Typewriter Effect */}
          <h1 className="font-serif text-5xl md:text-7xl text-[#f5e6d3] mb-4 min-h-20 tracking-wide">
            {displayedTitle}
            {displayedTitle.length < title.length && !skipTypewriter && (
              <span className="animate-pulse text-[#b8a038]">|</span>
            )}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-sm tracking-[0.3em] text-[#b8a038] mb-12 uppercase"
          >
            {subtitle}
          </motion.p>

          {/* Skip Button */}
          {!showContent && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              whileHover={{ opacity: 1 }}
              onClick={skipToEnd}
              className="mb-8 px-4 py-1 border border-[#b8a038]/50 text-[#b8a038]/70 font-mono text-xs uppercase tracking-widest hover:border-[#b8a038] hover:text-[#b8a038] transition-colors"
            >
              Ometre [Espai]
            </motion.button>
          )}

          {/* Historical Information Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-black/70 backdrop-blur-sm border-2 border-[#b8a038] p-6 mb-8 text-left"
          >
            <p className="font-mono text-sm leading-relaxed text-[#f5e6d3]/90">
              <span className="text-[#b8a038] font-bold">Agost de 1938. FET per: Marcel, Martí, Asier, Eloi</span> La República Espanyola s&apos;enfronta al seu últim combat decisiu.
              Les Brigades Internacionals i l&apos;Exèrcit Popular tanquen files a la Serra de Pàndols.
            </p>
            <div className="w-16 h-0.5 bg-[#b8a038]/50 my-4" />
            <p className="font-mono text-sm leading-relaxed text-[#f5e6d3]/70">
              La teva missió: coordinar l&apos;ajuda internacional i desxifrar els codis de retirada
              abans que l&apos;ofensiva franquista tanqui totes les vies d&apos;escapament. <span className="text-[#fbbf24]">Tens 30 minuts.</span>
            </p>
          </motion.div>

          {/* Mission Objectives */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center gap-6 mb-10"
          >
            {[
              { num: '01', text: 'Mapa Tàctic' },
              { num: '02', text: 'Ràdio' },
              { num: '03', text: 'Codi Morse' },
              { num: '04', text: 'Arxiu de Sang' },
            ].map((obj, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 border-2 border-[#b8a038]/50 flex items-center justify-center mb-2 mx-auto">
                  <span className="font-mono text-lg text-[#b8a038]">{obj.num}</span>
                </div>
                <p className="font-mono text-xs text-[#f5e6d3]/60">{obj.text}</p>
              </div>
            ))}
          </motion.div>

          {/* Start Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.9 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05, backgroundColor: '#4ade80' }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-10 py-4 bg-[#b8a038] text-black font-bold uppercase text-sm tracking-widest transition-colors"
          >
            Entrar al Búnquer
          </motion.button>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ delay: 1 }}
            className="mt-8 font-mono text-xs text-[#f5e6d3]/40"
          >
            Escape Room Històric - Brigades Internacionals a l&apos;Ebre 1938
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
