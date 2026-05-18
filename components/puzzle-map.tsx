'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useGameStore } from '@/hooks/use-game-store'

const UNITS = [
  { id: 'lincoln', name: 'Batalló Lincoln', sector: 'gandesa-sud' },
  { id: 'mackenzie', name: 'Batalló Mackenzie-Papineau', sector: 'mora-ebre' },
  { id: 'thalmann', name: 'Batalló Thälmann', sector: 'pandols' },
]

const SECTORS = [
  { id: 'gandesa-sud', name: 'Gandesa Sud', description: 'Sector sud del front' },
  { id: 'pandols', name: 'Serra de Pàndols', description: 'Posició elevada estratègica' },
  { id: 'mora-ebre', name: 'Móra d\'Ebre', description: 'Punt de creuament del riu' },
]

const HINTS = [
  'El Batalló Lincoln va ser assignat al sector més meridional del front.',
  'Els canadencs del Mackenzie-Papineau van defensar el punt de creuament del riu.',
  'Els alemanys del Thälmann van ocupar les posicions elevades a la serra.',
]

export function PuzzleMap() {
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState('')
  const [solved, setSolved] = useState(false)
  const [showHistoryCard, setShowHistoryCard] = useState(false)
  const [hints, setHints] = useState<string[]>([])
  const solvePuzzle = useGameStore((state) => state.solvePuzzle)
  const addToInventory = useGameStore((state) => state.addToInventory)
  const nextScene = useGameStore((state) => state.nextScene)

  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)

  const handleUnitClick = (unitId: string) => {
    if (solved) return
    setSelectedUnit(unitId)
    setFeedback('')
  }

  const handleSectorClick = (sectorId: string) => {
    if (solved || !selectedUnit) return
    
    // Remove any previous assignment to this sector
    const newAssignments = { ...assignments }
    Object.keys(newAssignments).forEach(key => {
      if (newAssignments[key] === sectorId) {
        delete newAssignments[key]
      }
    })
    
    newAssignments[selectedUnit] = sectorId
    setAssignments(newAssignments)
    setSelectedUnit(null)
  }

  const checkSolution = () => {
    const allCorrect = UNITS.every(
      unit => assignments[unit.id] === unit.sector
    )

    if (allCorrect) {
      setFeedback('')
      setSolved(true)
      solvePuzzle('map')
      addToInventory('mapa')
      setShowHistoryCard(true)
    } else {
      setFeedback('Les assignacions no són correctes. Revisa el mapa tàctic.')
    }
  }

  const clearAssignments = () => {
    setAssignments({})
    setSelectedUnit(null)
    setFeedback('')
  }

  const requestHint = () => {
    if (hints.length < HINTS.length) {
      setHints([...hints, HINTS[hints.length]])
    }
  }

  const getUnitForSector = (sectorId: string) => {
    const entry = Object.entries(assignments).find(([, sid]) => sid === sectorId)
    return entry ? UNITS.find(u => u.id === entry[0]) : null
  }

  return (
    <div className="relative">
      {/* Main Puzzle */}
      <div className="bg-black/80 backdrop-blur-sm border-2 border-[#b8a038] p-6">
        {/* Header */}
        <div className="flex gap-6 mb-6">
          <div className="relative w-48 h-32 flex-shrink-0 border-2 border-[#b8a038]/50 overflow-hidden">
            <Image
              src="/images/military-map.jpg"
              alt="Mapa tàctic de l'Ebre"
              fill
              className="object-cover sepia"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-xl text-[#f5e6d3] mb-2">El Mapa de la Retirada</h3>
            <p className="font-mono text-xs text-[#f5e6d3]/70 leading-relaxed">
              Assigna cada batalló de les Brigades Internacionals al seu sector corresponent.
              Selecciona una unitat i després fes clic al sector on ha de ser desplegada.
            </p>
          </div>
        </div>

        {/* Matching Game */}
        <div className="grid grid-cols-2 gap-8">
          {/* Units */}
          <div className="bg-black/50 border border-[#b8a038]/40 p-4">
            <h4 className="font-mono text-xs uppercase text-[#b8a038] mb-4 tracking-widest">
              Unitats Disponibles
            </h4>
            <div className="space-y-3">
              {UNITS.map((unit) => {
                const isAssigned = assignments[unit.id] !== undefined
                const assignedSector = SECTORS.find(s => s.id === assignments[unit.id])
                
                return (
                  <motion.button
                    key={unit.id}
                    whileHover={{ scale: solved ? 1 : 1.02 }}
                    whileTap={{ scale: solved ? 1 : 0.98 }}
                    onClick={() => handleUnitClick(unit.id)}
                    disabled={solved}
                    className={`w-full p-4 border-2 text-left transition-all ${
                      selectedUnit === unit.id
                        ? 'border-[#4ade80] bg-[#4ade80]/10'
                        : isAssigned
                        ? 'border-[#b8a038]/70 bg-[#b8a038]/10'
                        : 'border-[#b8a038]/30 hover:border-[#b8a038]/60'
                    } ${solved ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <p className="font-mono text-sm text-[#f5e6d3] font-bold">{unit.name}</p>
                    {isAssigned && assignedSector && (
                      <p className="font-mono text-xs text-[#4ade80] mt-1">
                        Desplegat a: {assignedSector.name}
                      </p>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Sectors */}
          <div className="bg-black/50 border border-[#b8a038]/40 p-4">
            <h4 className="font-mono text-xs uppercase text-[#b8a038] mb-4 tracking-widest">
              Sectors del Front
            </h4>
            <div className="space-y-3">
              {SECTORS.map((sector) => {
                const assignedUnit = getUnitForSector(sector.id)
                
                return (
                  <motion.button
                    key={sector.id}
                    whileHover={{ scale: solved ? 1 : 1.02 }}
                    whileTap={{ scale: solved ? 1 : 0.98 }}
                    onClick={() => handleSectorClick(sector.id)}
                    disabled={solved || !selectedUnit}
                    className={`w-full p-4 border-2 text-left transition-all ${
                      assignedUnit
                        ? 'border-[#b8a038]/70 bg-[#b8a038]/10'
                        : selectedUnit
                        ? 'border-[#4ade80]/50 hover:border-[#4ade80] cursor-pointer'
                        : 'border-[#b8a038]/30'
                    } ${solved || !selectedUnit ? 'cursor-default' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#b8a038]/20 border border-[#b8a038]/50 flex items-center justify-center font-mono text-xs text-[#f5e6d3]">
                        {sector.id === 'gandesa-sud' ? 'S' : sector.id === 'pandols' ? 'P' : 'M'}
                      </div>
                      <div>
                        <p className="font-mono text-sm text-[#f5e6d3] font-bold">{sector.name}</p>
                        <p className="font-mono text-xs text-[#f5e6d3]/50">{sector.description}</p>
                        {assignedUnit && (
                          <p className="font-mono text-xs text-[#4ade80] mt-1">
                            {assignedUnit.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

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
          {feedback && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-mono text-sm text-[#fbbf24]"
            >
              {feedback}
            </motion.p>
          )}
          
          {selectedUnit && (
            <p className="font-mono text-xs text-[#4ade80]">
              Selecciona el sector per a {UNITS.find(u => u.id === selectedUnit)?.name}
            </p>
          )}
          
          <div className="flex gap-3 ml-auto">
            {!solved ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={requestHint}
                  disabled={hints.length >= HINTS.length}
                  className="px-4 py-2 border border-[#fbbf24] text-[#fbbf24] font-mono text-xs uppercase tracking-widest hover:bg-[#fbbf24]/10 transition-colors disabled:opacity-50"
                >
                  Demanar Ajuda
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAssignments}
                  className="px-4 py-2 border border-[#b8a038] text-[#b8a038] font-mono text-xs uppercase tracking-widest hover:bg-[#b8a038]/10 transition-colors"
                >
                  Esborrar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={checkSolution}
                  disabled={Object.keys(assignments).length !== 3}
                  className="px-6 py-2 bg-[#b8a038] text-black font-bold uppercase text-sm tracking-widest hover:bg-[#4ade80] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verificar
                </motion.button>
              </>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowHistoryCard(false); nextScene(); }}
                className="px-6 py-2 bg-[#4ade80] text-black font-bold uppercase text-sm tracking-widest"
              >
                Continuar
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* History Card Overlay */}
      <AnimatePresence>
        {showHistoryCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowHistoryCard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border-2 border-[#b8a038] p-6 max-w-lg"
            >
              <h3 className="font-serif text-xl text-[#b8a038] mb-4">Fitxa Històrica</h3>
              <div className="space-y-3 text-[#f5e6d3]/80 font-mono text-sm leading-relaxed">
                <p>
                  Durant la Batalla de l&apos;Ebre, les Brigades Internacionals van ser desplegades 
                  estratègicament per defensar posicions clau del front republicà.
                </p>
                <p>
                  El <strong className="text-[#f5e6d3]">Batalló Lincoln</strong> va defensar 
                  el sector sud de Gandesa, una posició crítica per contenir l&apos;avanç franquista.
                </p>
                <p>
                  El <strong className="text-[#f5e6d3]">Batalló Thälmann</strong> va ocupar 
                  la Serra de Pàndols, aprofitant l&apos;avantatge tàctic de les posicions elevades.
                </p>
                <p>
                  El <strong className="text-[#f5e6d3]">Batalló Mackenzie-Papineau</strong> va 
                  ser assignat a Móra d&apos;Ebre, controlant el punt de creuament del riu.
                </p>
                <p className="text-[#4ade80] pt-2 border-t border-[#b8a038]/30">
                  + Mapa tàctic afegit a l&apos;inventari
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHistoryCard(false)}
                className="mt-6 w-full px-6 py-2 bg-[#b8a038] text-black font-bold uppercase text-sm tracking-widest hover:bg-[#4ade80] transition-colors"
              >
                Tancar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
