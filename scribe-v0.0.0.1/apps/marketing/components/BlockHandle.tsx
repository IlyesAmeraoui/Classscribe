'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  MoreVertical, 
  GripVertical, 
  Plus, 
  Copy, 
  Trash2, 
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Calculator
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'

interface BlockHandleProps {
  onAddBlock?: (type: string) => void
  onDuplicateBlock?: () => void
  onDeleteBlock?: () => void
  onTransformBlock?: (type: string) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  position: { x: number, y: number }
  visible: boolean
  isActive?: boolean // Nuevo prop para indicar si el bloque está activo
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const BLOCK_TYPES = [
  { id: 'paragraph', label: 'Párrafo', icon: Type },
  { id: 'heading1', label: 'Título 1', icon: Heading1 },
  { id: 'heading2', label: 'Título 2', icon: Heading2 },
  { id: 'heading3', label: 'Título 3', icon: Heading3 },
  { id: 'bulletList', label: 'Lista con viñetas', icon: List },
  { id: 'orderedList', label: 'Lista numerada', icon: ListOrdered },
  { id: 'taskList', label: 'Lista de tareas', icon: CheckSquare },
  { id: 'blockquote', label: 'Cita', icon: Quote },
  { id: 'codeBlock', label: 'Código', icon: Code },
  { id: 'mathBlock', label: 'Fórmula', icon: Calculator },
]

export function BlockHandle({
  onAddBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onTransformBlock,
  onMoveUp,
  onMoveDown,
  position,
  visible,
  isActive = false,
  onMouseEnter,
  onMouseLeave
}: BlockHandleProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  if (!visible) return null

  // Si el handle está visible, los botones también deben estar visibles
  const shouldShowButtons = visible

  const handleMouseEnter = () => {
    setIsHovered(true)
    onMouseEnter?.()
  }

  const handleMouseLeave = () => {
    // Delay para evitar parpadeos
    setTimeout(() => {
      setIsHovered(false)
      onMouseLeave?.()
    }, 50)
  }

  return (
    <>
      {/* Zona de seguridad invisible más amplia */}
      <div 
        className="absolute z-[60]"
        style={{
          left: position.x - 80,
          top: position.y,
          transform: 'translateY(-50%)',
          width: '120px',
          height: '60px',
          pointerEvents: 'auto'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Contenedor de botones visible */}
      <div 
        className="absolute z-[70] flex items-center gap-2 transition-all duration-200 block-handle-container"
        style={{
          left: position.x - 60,
          top: position.y,
          transform: 'translateY(-50%)',
          padding: '4px'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      {/* Botón de añadir bloque */}
      <Button
        variant="ghost"
        size="sm"
        className={`w-7 h-7 p-0 block-handle-button add-button transition-all duration-200 ${
          shouldShowButtons ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => onAddBlock?.('paragraph')}
      >
        <Plus className="w-4 h-4" />
      </Button>

      {/* Handle de arrastrar con menú contextual */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`w-7 h-7 p-0 block-handle-button cursor-grab active:cursor-grabbing transition-all duration-200 ${
              shouldShowButtons ? 'opacity-100' : 'opacity-0'
            }`}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
          >
            <GripVertical className="w-4 h-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={onDuplicateBlock}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicar bloque
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Type className="w-4 h-4 mr-2" />
              Convertir en
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {BLOCK_TYPES.map((type) => {
                const Icon = type.icon
                return (
                  <DropdownMenuItem
                    key={type.id}
                    onClick={() => onTransformBlock?.(type.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {type.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={onMoveUp}>
            Mover arriba
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onMoveDown}>
            Mover abajo
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={onDeleteBlock}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar bloque
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    </>
  )
} 