'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Check, X } from 'lucide-react'
import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'

interface MathInlineProps {
  initialLatex?: string
  onUpdate?: (latex: string) => void
  className?: string
}

export function MathInline({ initialLatex = '', onUpdate, className }: MathInlineProps) {
  const [latex, setLatex] = useState(initialLatex)
  const [isEditing, setIsEditing] = useState(!initialLatex)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(latex.length, latex.length)
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
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <span className={`inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-1 ${className}`}>
        <span className="text-xs text-blue-600 dark:text-blue-400">$</span>
        <input
          ref={inputRef}
          type="text"
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="E = mc^2"
          className="bg-transparent border-none outline-none font-mono text-sm min-w-20 max-w-40"
        />
        <span className="text-xs text-blue-600 dark:text-blue-400">$</span>
        
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={!latex.trim()}
            className="h-6 w-6 p-0"
          >
            <Check className="w-3 h-3" />
          </Button>
        </div>
        
        {/* Vista previa inline */}
        {latex && !error && (
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            →
            <InlineMath 
              math={latex}
              errorColor="red"
              onError={(err) => setError(err.message)}
            />
          </span>
        )}
        
        {error && (
          <span className="ml-2 text-xs text-red-500">Error</span>
        )}
      </span>
    )
  }

  return (
    <span 
      className={`inline-flex items-center group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-1 py-0.5 transition-colors ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {error ? (
        <span className="text-red-500 text-sm">Error LaTeX</span>
      ) : (
        <InlineMath 
          math={latex}
          errorColor="red"
          onError={(err) => setError(err.message)}
        />
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation()
          setIsEditing(true)
        }}
      >
        <Edit className="w-3 h-3" />
      </Button>
    </span>
  )
} 