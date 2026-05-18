'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useGameStore } from '@/hooks/use-game-store'

export function EndingScene() {
  const timeRemaining = useGameStore((state) => state.timeRemaining)
  const inventory = useGameStore((state) => state.inventory)
  const solvedPuzzles = useGameStore((state) => state.solvedPuzzles)
  const resetGame = useGameStore((state) => state.resetGame)

  const escaped = timeRemaining > 0 && solvedPuzzles.length === 4

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

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center max-w-2xl"
        >
          {escaped ? (
            <>
              {/* Success */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="w-20 h-20 border-4 border-[#4ade80] flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-[#4ade80]">V</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl text-[#f5e6d3] tracking-wide">
                  MISSIO COMPLERTA
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-mono text-sm text-[#4ade80] mb-8 tracking-widest"
              >
                TEMPS RESTANT: {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
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
                <div className="w-20 h-20 border-4 border-red-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-red-500">X</span>
                </div>
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
            transition={{ delay: 1.5 }}
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
        </motion.div>
      </div>
    </div>
  )
}
