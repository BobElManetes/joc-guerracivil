'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/hooks/use-game-store'
import { Map, Radio, FileText, Key, Compass } from 'lucide-react'

const ITEM_DATA: Record<string, { icon: React.ReactNode; name: string }> = {
  llave: { icon: <Key className="w-4 h-4" />, name: 'Clau' },
  mapa: { icon: <Map className="w-4 h-4" />, name: 'Mapa Tàctic' },
  document: { icon: <FileText className="w-4 h-4" />, name: 'Document' },
  radio: { icon: <Radio className="w-4 h-4" />, name: 'Ràdio' },
  brujula: { icon: <Compass className="w-4 h-4" />, name: 'Brúixola' },
  ordre: { icon: <FileText className="w-4 h-4" />, name: 'Ordre de Retirada' },
  fitxes: { icon: <FileText className="w-4 h-4" />, name: 'Fitxes Mèdiques' },
}

export function Inventory() {
  const inventory = useGameStore((state) => state.inventory)
  const latestInventoryItem = useGameStore((state) => state.latestInventoryItem)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/90 backdrop-blur-sm border-b-2 border-[#b8a038] px-4 py-2"
    >
      <div className="flex items-center gap-3">
        <h3 className="font-mono text-xs uppercase tracking-widest text-[#b8a038]">
          Inventari
        </h3>
        
        <div className="w-px h-6 bg-[#b8a038]/30" />
        
        {inventory.length === 0 ? (
          <p className="font-mono text-xs text-[#f5e6d3]/40 italic">Buit</p>
        ) : (
          <div className="flex gap-2">
            <AnimatePresence>
              {inventory.map((item) => {
                const data = ITEM_DATA[item] || { icon: <FileText className="w-4 h-4" />, name: item }
                return (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="group relative"
                  >
                    <div className={`w-8 h-8 bg-[#b8a038]/20 border flex items-center justify-center text-[#f5e6d3] hover:bg-[#b8a038]/30 transition-colors cursor-default ${
                      latestInventoryItem === item 
                        ? 'border-[#4ade80] animate-pulse bg-[#4ade80]/20' 
                        : 'border-[#b8a038]'
                    }`}>
                      {data.icon}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black border border-[#b8a038] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      <p className="font-mono text-xs text-[#f5e6d3]">{data.name}</p>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}
