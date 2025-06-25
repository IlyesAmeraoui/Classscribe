'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Check, X, Copy, Download } from 'lucide-react'
import 'katex/dist/katex.min.css'
import { BlockMath } from 'react-katex'

interface MathBlockProps {
  initialLatex?: string
  onUpdate?: (latex: string) => void
  className?: string
}

export function MathBlock({ initialLatex = '', onUpdate, className }: MathBlockProps) {
  const [latex, setLatex] = useState(initialLatex)
  const [isEditing, setIsEditing] = useState(!initialLatex)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(latex.length, latex.length)
    }
  }, [isEditing, latex])

  const handleSave = () => {
    if (latex.trim()) {
      setIsEditing(false)
      setError(null)
      onUpdate?.(latex)
    }
  }

  const handleCancel = () => {
    setLatex(initialLatex)
    setIsEditing(false)
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(latex)
      // Aquí podrías mostrar una notificación de éxito
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  const downloadAsImage = () => {
    // Implementación futura para descargar como imagen
    console.log('Descargando como imagen...')
  }

  if (isEditing) {
    return (
      <Card className={`p-4 border-2 border-blue-200 dark:border-blue-800 ${className}`}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Bloque matemático LaTeX</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
          </div>
          
          <textarea
            ref={textareaRef}
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu fórmula LaTeX aquí... Ej: \int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}"
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Vista previa en tiempo real */}
          {latex && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                {error ? (
                  <div className="text-red-500 text-sm">
                    Error en LaTeX: {error}
                  </div>
                ) : (
                  <BlockMath 
                    math={latex}
                    errorColor="red"
                    onError={(err) => setError(err.message)}
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs mr-1">Ctrl+Enter</kbd>
              para guardar
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!latex.trim()}>
                <Check className="w-4 h-4 mr-1" />
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`group relative ${className}`}>
      <div className="p-6 text-center">
        <BlockMath 
          math={latex}
          errorColor="red"
          onError={(err) => setError(err.message)}
        />
        
        {error && (
          <div className="mt-2 text-red-500 text-sm">
            Error en LaTeX: {error}
          </div>
        )}
      </div>

      {/* Controles flotantes */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 w-8 p-0"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadAsImage}
            className="h-8 w-8 p-0"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Código LaTeX en pequeño */}
      <div className="px-4 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded border truncate">
          {latex}
        </div>
      </div>
    </Card>
  )
} 