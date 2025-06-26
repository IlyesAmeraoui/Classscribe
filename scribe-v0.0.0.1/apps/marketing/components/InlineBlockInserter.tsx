'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SlashCommands } from './SlashCommands'

interface InlineBlockInserterProps {
  position: { x: number, y: number }
  visible: boolean
  onInsertBlock: (type: string) => void
}

export function InlineBlockInserter({ 
  position, 
  visible, 
  onInsertBlock 
}: InlineBlockInserterProps) {
  const [showCommands, setShowCommands] = useState(false)

  if (!visible) return null

  const handleClick = () => {
    setShowCommands(true)
  }

  const handleSelectCommand = (commandId: string) => {
    onInsertBlock(commandId)
    setShowCommands(false)
  }

  return (
    <>
      <div 
        className="absolute z-40 flex items-center justify-center"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 rounded-full border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
          onClick={handleClick}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Menú de comandos slash */}
      {showCommands && (
        <SlashCommands
          position={{ x: position.x, y: position.y + 20 }}
          onSelect={handleSelectCommand}
          onClose={() => setShowCommands(false)}
        />
      )}
    </>
  )
} 