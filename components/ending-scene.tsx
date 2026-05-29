'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useGameStore } from '@/hooks/use-game-store'
import { useState, useEffect, useRef } from 'react'

// Confetti component
function Confetti() {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
  }))

  return (
    <>
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ 
            opacity: 1, 
            y: -20,
            x: piece.left,
            rotate: 0,
          }}
          animate={{ 
            opacity: 0, 
            y: window.innerHeight + 100,
            rotate: 360,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeIn',
          }}
          className="fixed w-2 h-2 pointer-events-none"
          style={{
            left: `${piece.left}%`,
            backgroundColor: ['#4ade80', '#fbbf24', '#b8a038'][Math.floor(Math.random() * 3)],
          }}
        />
      ))}
    </>
  )
}

export function EndingScene() {
  const timeRemaining = useGameStore((state) => state.timeRemaining)
  const inventory = useGameStore((state) => state.inventory)
  const solvedPuzzles = useGameStore((state) => state.solvedPuzzles)
  const resetGame = useGameStore((state) => state.resetGame)

  const escaped = timeRemaining > 0 && solvedPuzzles.length === 4
  const [showCelebration, setShowCelebration] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (escaped && audioRef.current) {
      audioRef.current.play()
    }
  }, [escaped])

  useEffect(() => {
    if (escaped) {
      // Mostrar celebració durant 10 segons
      const timer = setTimeout(() => {
        setShowCelebration(false)
        setShowContent(true)
      }, 10000)
      return () => clearTimeout(timer)
    } else {
      setShowCelebration(false)
      setShowContent(true)
    }
  }, [escaped])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/ebro-battle.jpg"
          alt="Batalla de l'Ebre"
          fill
          className={`object-cover ${escaped ? 'sepia-[0.3]' : 'grayscale'}`}
        />
        <div className={`absolute inset-0 ${
          escaped 
            ? 'bg-gradient-to-t from-black via-black/60 to-black/30' 
            : 'bg-gradient-to-t from-black via-black/80 to-black/60'
        }`} />
      </div>

      {/* Film Grain */}
      <div className="film-grain" />
      <div className="bunker-vignette" />

      {/* Celebration Overlay */}
      <AnimatePresence>
        {escaped && showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95"
          >
            {/* Audio de fons */}
            <audio ref={audioRef} src="/audio/mission-passed.mp3" />

            {/* Confetti animat */}
            <Confetti />

            {/* Emojis grans de celebració */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 15 }}
              className="text-9xl mb-12"
            >
              🎉🏆🎉
            </motion.div>

            {/* Text "Enhorabona has guanyat" gran i brillant */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
              className="text-center mb-6"
            >
              <motion.p
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                className="font-serif text-5xl md:text-7xl text-[#4ade80] tracking-wider mb-2"
                style={{ textShadow: '0 0 60px rgba(74, 222, 128, 0.9), 0 0 20px rgba(251, 191, 36, 0.3)' }}
              >
                ENHORABONA
              </motion.p>
              <motion.p
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="font-serif text-6xl md:text-8xl text-[#fbbf24] tracking-wider"
                style={{ textShadow: '0 0 60px rgba(251, 191, 36, 0.9), 0 0 20px rgba(74, 222, 128, 0.3)' }}
              >
                HAS GUANYAT
              </motion.p>
            </motion.div>

            {/* Text principal */}
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="font-serif text-5xl md:text-7xl text-[#4ade80] tracking-wider text-center mb-8"
              style={{ textShadow: '0 0 40px rgba(74, 222, 128, 0.8)' }}
            >
              MISSIÓ COMPLERTA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="font-mono text-2xl text-[#fbbf24] tracking-widest mb-8"
            >
              ✨ HAS ESCAPAT DEL BÚNQUER ✨
            </motion.p>

            {/* Més emojis amb animació */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="text-6xl flex gap-6"
            >
              <motion.span animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}>🌟</motion.span>
              <motion.span animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}>🎊</motion.span>
              <motion.span animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}>🏅</motion.span>
              <motion.span animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }}>🎊</motion.span>
              <motion.span animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.8 }}>🌟</motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-start px-6 py-8 overflow-y-auto"
          >
            <div className="text-center max-w-3xl w-full">
              {escaped ? (
                <>
                  {/* Success Header */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <div className="text-6xl mb-4">🏆</div>
                    <h1 className="font-serif text-4xl md:text-5xl text-[#4ade80] tracking-wide mb-2">
                      MISSIÓ COMPLERTA
                    </h1>
                    <p className="font-mono text-lg text-[#fbbf24] tracking-widest">
                      TEMPS RESTANT: {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                    </p>
                  </motion.div>

                  {/* Video de YouTube */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <div className="relative w-full aspect-video bg-black border-2 border-[#b8a038]">
                      <iframe
                        src="https://www.youtube.com/embed/1LVq6z7t77Q?autoplay=1"
                        title="Vídeo final - Guerra Civil"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </motion.div>

                  {/* Text i detalls */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-black/70 backdrop-blur-sm border-2 border-[#b8a038] p-6 mb-6 text-left"
                  >
                    <p className="font-mono text-sm leading-relaxed text-[#f5e6d3]/90 mb-4">
                      Els codis van ser desxifrats. Les forces republicanes van poder reagrupar-se 
                      al riu. Tot i que la Batalla de l&apos;Ebre seria l&apos;última gran ofensiva de la 
                      República, la teva acció va permetre que milers de combatents i civils poguessin 
                      evacuar cap a la frontera francesa.
                    </p>
                    <div className="w-full h-px bg-[#b8a038]/30 my-4" />
                    
                    {/* Objectes recollits */}
                    <div className="mb-4">
                      <h4 className="font-mono text-xs text-[#b8a038] uppercase tracking-widest mb-2">Objectes Recollits</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {inventory.map((item) => (
                          <div key={item} className="flex items-center gap-2 bg-black/40 border border-[#4ade80]/30 px-2 py-1">
                            <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
                            <span className="font-mono text-xs text-[#f5e6d3]/80 capitalize">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-[#b8a038]/30 my-4" />
                    <p className="font-mono text-xs text-[#f5e6d3]/60">
                      La memòria d&apos;aquells que van lluitar per la llibertat perdura.
                    </p>
                  </motion.div>

                  {/* Context Històric */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-black/50 border border-[#b8a038]/40 p-4 text-left mb-8"
                  >
                    <h3 className="font-mono text-xs text-[#b8a038] uppercase tracking-widest mb-2">Context Històric</h3>
                    <p className="font-mono text-xs leading-relaxed text-[#f5e6d3]/70">
                      La Batalla de l&apos;Ebre (juliol-novembre 1938) va ser la batalla més gran de la Guerra Civil Espanyola. 
                      Les Brigades Internacionals, amb voluntaris de 50 països, van lluitar al costat de l&apos;Exèrcit Popular 
                      en defensa de la República. El setembre de 1938, el govern republicà va ordenar la retirada dels 
                      voluntaris internacionals, que van ser acomiadats a Barcelona el 28 d&apos;octubre.
                    </p>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Failure */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                  >
                    <div className="text-6xl mb-4">💀</div>
                    <h1 className="font-serif text-5xl md:text-6xl text-[#fbbf24] tracking-wide">
                      TEMPS ESGOTAT
                    </h1>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-black/70 backdrop-blur-sm border-2 border-red-500/50 p-6 mb-8 text-left"
                  >
                    <p className="font-mono text-sm leading-relaxed text-[#f5e6d3]/90 mb-4">
                      Sense els codis, la retirada es va convertir en caos. Les línies defensives van col·lapsar 
                      i milers van quedar atrapats. L&apos;ofensiva franquista va ser imparable.
                    </p>
                    <p className="font-mono text-xs text-[#f5e6d3]/60">
                      La història no sempre permet segones oportunitats.
                    </p>
                  </motion.div>
                </>
              )}

              {/* Restart Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: escaped ? 1 : 1.5 }}
                whileHover={{ scale: 1.05, backgroundColor: escaped ? '#4ade80' : '#fbbf24' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  resetGame()
                }}
                className={`px-10 py-4 font-bold uppercase text-sm tracking-widest transition-colors text-black ${
                  escaped ? 'bg-[#b8a038]' : 'bg-[#fbbf24]'
                }`}
              >
                {escaped ? 'Tornar a Jugar' : 'Reintentar'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
