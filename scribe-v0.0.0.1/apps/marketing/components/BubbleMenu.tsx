'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Link, 
  Highlight,
  MessageCircle,
  Copy,
  Type,
  Palette
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface BubbleMenuProps {
  position: { x: number, y: number }
  visible: boolean
  isActive: {
    bold: boolean
    italic: boolean
    strike: boolean
    code: boolean
    link: boolean
  }
  onFormat: (format: string, value?: string) => void
  onAddComment?: () => void
  selectedText?: string
}

const TEXT_COLORS = [
  { name: 'Negro', value: '#000000' },
  { name: 'Gris', value: '#6B7280' },
  { name: 'Rojo', value: '#EF4444' },
  { name: 'Naranja', value: '#F97316' },
  { name: 'Amarillo', value: '#EAB308' },
  { name: 'Verde', value: '#22C55E' },
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Morado', value: '#8B5CF6' },
]

const HIGHLIGHT_COLORS = [
  { name: 'Sin resaltado', value: 'transparent' },
  { name: 'Amarillo', value: '#FEF3C7' },
  { name: 'Verde', value: '#D1FAE5' },
  { name: 'Azul', value: '#DBEAFE' },
  { name: 'Morado', value: '#E9D5FF' },
  { name: 'Rosa', value: '#FCE7F3' },
  { name: 'Rojo', value: '#FEE2E2' },
]

export function BubbleMenu({
  position,
  visible,
  isActive,
  onFormat,
  onAddComment,
  selectedText
}: BubbleMenuProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  if (!visible) return null

  const handleLinkSubmit = () => {
    if (linkUrl) {
      onFormat('link', linkUrl)
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const handleCopyText = () => {
    if (selectedText) {
      navigator.clipboard.writeText(selectedText)
    }
  }

  return (
    <div 
      className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex items-center gap-1"
      style={{
        left: position.x,
        top: position.y - 50,
        transform: 'translateX(-50%)'
      }}
    >
      {/* Formato básico */}
      <Button
        variant={isActive.bold ? 'default' : 'ghost'}
        size="sm"
        className="w-8 h-8 p-0"
        onClick={() => onFormat('bold')}
      >
        <Bold className="w-4 h-4" />
      </Button>

      <Button
        variant={isActive.italic ? 'default' : 'ghost'}
        size="sm"
        className="w-8 h-8 p-0"
        onClick={() => onFormat('italic')}
      >
        <Italic className="w-4 h-4" />
      </Button>

      <Button
        variant={isActive.strike ? 'default' : 'ghost'}
        size="sm"
        className="w-8 h-8 p-0"
        onClick={() => onFormat('strikethrough')}
      >
        <Strikethrough className="w-4 h-4" />
      </Button>

      <Button
        variant={isActive.code ? 'default' : 'ghost'}
        size="sm"
        className="w-8 h-8 p-0"
        onClick={() => onFormat('code')}
      >
        <Code className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Color de texto */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <Type className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="grid grid-cols-4 gap-1">
            {TEXT_COLORS.map((color) => (
              <button
                key={color.value}
                className="w-8 h-8 rounded border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color.value }}
                onClick={() => onFormat('textColor', color.value)}
                title={color.name}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Color de fondo */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <Highlight className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="grid grid-cols-4 gap-1">
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color.value}
                className="w-8 h-8 rounded border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color.value }}
                onClick={() => onFormat('highlight', color.value)}
                title={color.name}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Enlace */}
      {showLinkInput ? (
        <div className="flex items-center gap-1">
          <Input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Pegar enlace..."
            className="w-32 h-8"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLinkSubmit()
              } else if (e.key === 'Escape') {
                setShowLinkInput(false)
                setLinkUrl('')
              }
            }}
            autoFocus
          />
          <Button size="sm" onClick={handleLinkSubmit}>
            ✓
          </Button>
        </div>
      ) : (
        <Button
          variant={isActive.link ? 'default' : 'ghost'}
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => setShowLinkInput(true)}
        >
          <Link className="w-4 h-4" />
        </Button>
      )}

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Comentario */}
      {onAddComment && (
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
          onClick={onAddComment}
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
      )}

      {/* Copiar */}
      <Button
        variant="ghost"
        size="sm"
        className="w-8 h-8 p-0"
        onClick={handleCopyText}
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  )
} 