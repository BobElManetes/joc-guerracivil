'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/hooks/use-game-store'
import { Clock } from 'lucide-react'

export function Timer() {
  const timeRemaining = useGameStore((state) => state.timeRemaining)
  const decreaseTime = useGameStore((state) => state.decreaseTime)

  useEffect(() => {
    const interval = setInterval(decreaseTime, 1000)
    return () => clearInterval(interval)
  }, [decreaseTime])

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  const isLowTime = timeRemaining < 300 // Menys de 5 minuts
  const isCritical = timeRemaining < 60 // Menys de 1 minut

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-black/90 backdrop-blur-sm border-b-2 px-4 py-2 ${
        isCritical ? 'border-red-500' : 
        isLowTime ? 'border-[#fbbf24]' : 
        'border-[#b8a038]'
      }`}
    >
      <div className="flex items-center gap-3">
        <Clock className={`w-4 h-4 ${
          isCritical ? 'text-red-500' :
          isLowTime ? 'text-[#fbbf24]' : 
          'text-[#b8a038]'
        }`} />
        <p className="font-mono text-xs text-[#b8a038] uppercase tracking-widest">Temps</p>
        <p className={`font-mono text-xl tracking-wider ${
          isCritical ? 'text-red-500 animate-pulse' :
          isLowTime ? 'text-[#fbbf24]' : 
          'text-[#4ade80]'
        }`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
      </div>
    </motion.div>
  )
}
