'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Editor } from '@tiptap/react'
import { List, Eye, EyeOff } from 'lucide-react'

interface TOCItem {
  id: string
  level: number
  text: string
  pos: number
}

interface TableOfContentsProps {
  editor: Editor
}

export function TableOfContents({ editor }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!editor) return

    const updateTOC = () => {
      const items: TOCItem[] = []
      const doc = editor.state.doc

      doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          const level = node.attrs.level
          const text = node.textContent
          const id = `heading-${pos}`
          
          items.push({
            id,
            level,
            text,
            pos
          })
        }
      })

      setTocItems(items)
    }

    // Actualizar TOC cuando cambie el contenido
    editor.on('update', updateTOC)
    editor.on('selectionUpdate', updateTOC)
    
    // Actualización inicial
    updateTOC()

    return () => {
      editor.off('update', updateTOC)
      editor.off('selectionUpdate', updateTOC)
    }
  }, [editor])

  const scrollToHeading = (pos: number) => {
    // Buscar el nodo en la posición y hacer scroll
    editor.commands.setTextSelection(pos)
    editor.commands.focus()
    
    // Scroll suave al elemento
    setTimeout(() => {
      const element = document.querySelector(`[data-pos="${pos}"]`)
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        })
      }
    }, 100)
  }

  const getCurrentHeading = () => {
    const { selection } = editor.state
    const { $from } = selection
    let currentPos = $from.pos

    // Encontrar el heading más cercano hacia arriba
    let closestHeading: TOCItem | null = null
    let minDistance = Infinity

    tocItems.forEach(item => {
      const distance = currentPos - item.pos
      if (distance >= 0 && distance < minDistance) {
        minDistance = distance
        closestHeading = item
      }
    })

    return closestHeading
  }

  const currentHeading = getCurrentHeading()

  if (!isVisible) {
    return (
      <div className="sticky top-24 h-fit">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="w-full"
        >
          <Eye className="w-4 h-4 mr-2" />
          Mostrar índice
        </Button>
      </div>
    )
  }

  return (
    <Card className="sticky top-24 h-fit max-h-[calc(100vh-200px)] overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-sm">Índice</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="p-1 h-auto"
          >
            <EyeOff className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-2 overflow-y-auto max-h-80">
        {tocItems.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <List className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay títulos aún</p>
            <p className="text-xs mt-1">Agrega títulos para ver el índice</p>
          </div>
        ) : (
          <div className="space-y-1">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.pos)}
                className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                  currentHeading?.id === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
                style={{
                  paddingLeft: `${(item.level - 1) * 12 + 8}px`
                }}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1 h-1 rounded-full flex-shrink-0 ${
                    item.level === 1 ? 'bg-blue-500' :
                    item.level === 2 ? 'bg-green-500' :
                    'bg-purple-500'
                  }`} />
                  <span className="truncate">{item.text || 'Título sin texto'}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {tocItems.length > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {tocItems.length} {tocItems.length === 1 ? 'título' : 'títulos'}
          </div>
        </div>
      )}
    </Card>
  )
} 