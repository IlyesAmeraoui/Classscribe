'use client'

import { useState, useEffect } from 'react'
import { 
  Heading1, 
  Heading2, 
  Heading3,
  List, 
  ListOrdered,
  CheckSquare, 
  Quote, 
  Code, 
  Minus,
  Calculator,
  Table,
  FileText,
  Lightbulb,
  BookOpen,
  Type,
  Image as ImageIcon,
  Hash
} from 'lucide-react'

interface SlashCommandsProps {
  position: { x: number; y: number }
  onSelect: (type: string) => void
  onClose: () => void
}

interface Command {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  keywords: string[]
  category: string
}

const commands: Command[] = [
  // Texto básico
  {
    id: 'paragraph',
    title: 'Texto',
    description: 'Párrafo normal',
    icon: Type,
    keywords: ['texto', 'paragraph', 'p'],
    category: 'Básico'
  },
  {
    id: 'heading1',
    title: 'Título 1',
    description: 'Encabezado principal',
    icon: Heading1,
    keywords: ['h1', 'titulo', 'heading', 'encabezado'],
    category: 'Básico'
  },
  {
    id: 'heading2',
    title: 'Título 2',
    description: 'Encabezado secundario',
    icon: Heading2,
    keywords: ['h2', 'titulo', 'heading', 'subtitulo'],
    category: 'Básico'
  },
  {
    id: 'heading3',
    title: 'Título 3',
    description: 'Encabezado terciario',
    icon: Heading3,
    keywords: ['h3', 'titulo', 'heading'],
    category: 'Básico'
  },
  
  // Listas
  {
    id: 'bulletList',
    title: 'Lista con viñetas',
    description: 'Lista simple',
    icon: List,
    keywords: ['lista', 'bullet', 'viñetas', 'ul'],
    category: 'Listas'
  },
  {
    id: 'orderedList',
    title: 'Lista numerada',
    description: 'Lista ordenada',
    icon: ListOrdered,
    keywords: ['lista', 'numerada', 'ordered', 'ol'],
    category: 'Listas'
  },
  {
    id: 'taskList',
    title: 'Lista de tareas',
    description: 'Con checkboxes',
    icon: CheckSquare,
    keywords: ['tareas', 'todo', 'checkbox', 'tasks'],
    category: 'Listas'
  },
  
  // Contenido
  {
    id: 'blockquote',
    title: 'Cita',
    description: 'Bloque de cita',
    icon: Quote,
    keywords: ['cita', 'quote', 'blockquote'],
    category: 'Contenido'
  },
  {
    id: 'codeBlock',
    title: 'Código',
    description: 'Bloque de código',
    icon: Code,
    keywords: ['codigo', 'code', 'programacion'],
    category: 'Contenido'
  },
  {
    id: 'horizontalRule',
    title: 'Separador',
    description: 'Línea divisoria',
    icon: Minus,
    keywords: ['separador', 'linea', 'hr', 'divisor'],
    category: 'Contenido'
  },
  {
    id: 'table',
    title: 'Tabla',
    description: 'Insertar tabla',
    icon: Table,
    keywords: ['tabla', 'table', 'grid'],
    category: 'Contenido'
  },
  
  // Matemáticas
  {
    id: 'mathBlock',
    title: 'Fórmula matemática',
    description: 'Bloque LaTeX',
    icon: Calculator,
    keywords: ['matematica', 'formula', 'latex', 'math'],
    category: 'Matemáticas'
  },
  
  // Plantillas académicas
  {
    id: 'theorem',
    title: 'Teorema',
    description: 'Bloque de teorema',
    icon: FileText,
    keywords: ['teorema', 'theorem', 'matematica'],
    category: 'Académico'
  },
  {
    id: 'definition',
    title: 'Definición',
    description: 'Bloque de definición',
    icon: BookOpen,
    keywords: ['definicion', 'definition', 'concepto'],
    category: 'Académico'
  },
  {
    id: 'example',
    title: 'Ejemplo',
    description: 'Bloque de ejemplo',
    icon: Lightbulb,
    keywords: ['ejemplo', 'example', 'practica'],
    category: 'Académico'
  }
]

export function SlashCommands({ position, onSelect, onClose }: SlashCommandsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [filteredCommands, setFilteredCommands] = useState(commands)

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCommands(commands)
    } else {
      const filtered = commands.filter(command => 
        command.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        command.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        command.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredCommands(filtered)
    }
    setSelectedIndex(0)
  }, [searchQuery])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            onSelect(filteredCommands[selectedIndex].id)
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [filteredCommands, selectedIndex, onSelect, onClose])

  // Agrupar comandos por categoría
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = []
    }
    acc[command.category].push(command)
    return acc
  }, {} as Record<string, Command[]>)

  return (
    <div 
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[320px] max-h-[400px] overflow-hidden"
      style={{
        left: position.x,
        top: position.y + 10,
        boxShadow: '0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2)'
      }}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
        <input
          type="text"
          placeholder="Buscar comandos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-sm bg-transparent border-none outline-none placeholder-gray-500 dark:placeholder-gray-400"
          autoFocus
        />
      </div>

      {/* Commands List */}
      <div className="max-h-[320px] overflow-y-auto">
        {filteredCommands.length === 0 ? (
          <div className="px-3 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
            <Hash className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <div>No se encontraron comandos</div>
            <div className="text-xs mt-1 opacity-70">Intenta con otro término</div>
          </div>
        ) : (
          <div className="py-2">
            {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
              <div key={category} className="mb-1 last:mb-0">
                {/* Categoría */}
                <div className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-750">
                  {category}
                </div>
                
                {/* Comandos de la categoría */}
                {categoryCommands.map((command, categoryIndex) => {
                  const globalIndex = filteredCommands.indexOf(command)
                  const Icon = command.icon
                  const isSelected = globalIndex === selectedIndex
                  
                  return (
                    <button
                      key={command.id}
                      className={`w-full px-3 py-2 text-left flex items-center gap-3 transition-colors ${
                        isSelected 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => onSelect(command.id)}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center rounded ${
                        isSelected 
                          ? 'bg-blue-100 dark:bg-blue-800' 
                          : 'bg-gray-100 dark:bg-gray-600'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          isSelected 
                            ? 'text-blue-600 dark:text-blue-300' 
                            : 'text-gray-600 dark:text-gray-300'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm ${
                          isSelected 
                            ? 'text-blue-900 dark:text-blue-100' 
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {command.title}
                        </div>
                        <div className={`text-xs truncate ${
                          isSelected 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {command.description}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-xs">↑↓</kbd>
            <span>navegar</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-xs">Enter</kbd>
            <span>seleccionar</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-xs">Esc</kbd>
            <span>cerrar</span>
          </div>
        </div>
      </div>
    </div>
  )
} 