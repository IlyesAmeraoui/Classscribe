'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Type, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Minus,
  Code,
  Table as TableIcon,
  Image as ImageIcon,
  Calculator,
  Plus,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Strikethrough,
  Link as LinkIcon
} from 'lucide-react'
import { MathBlock } from './MathBlock'
import { MathInline } from './MathInline'
import { SlashCommands } from './SlashCommands'
import { TableOfContents } from './TableOfContents'
import { MathTemplates } from './MathTemplates'

// Crear instancia de lowlight y registrar lenguajes
const lowlight = createLowlight()
lowlight.register('javascript', javascript)
lowlight.register('python', python)
lowlight.register('html', xml)
lowlight.register('css', css)
lowlight.register('json', json)

interface NotionEditorProps {
  content?: any
  onUpdate?: (content: any) => void
  className?: string
}

export function NotionEditor({ content, onUpdate, className }: NotionEditorProps) {
  const [showSlashCommands, setShowSlashCommands] = useState(false)
  const [slashPosition, setSlashPosition] = useState({ x: 0, y: 0 })
  const [showTOC, setShowTOC] = useState(true)
  const [showTemplates, setShowTemplates] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Usaremos CodeBlockLowlight en su lugar
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Título ${node.attrs.level}`
          }
          return "Escribe '/' para ver comandos o comienza a escribir..."
        },
      }),
    ],
    content: content || `
      <h1>Nuevo Resumen Matemático</h1>
      <p>Comienza escribiendo tu resumen. Puedes usar:</p>
      <ul>
        <li><strong>Fórmulas inline:</strong> Escribe $\\LaTeX$ para matemáticas en línea</li>
        <li><strong>Bloques matemáticos:</strong> Usa $$ para fórmulas centradas</li>
        <li><strong>Comandos rápidos:</strong> Escribe '/' para ver todas las opciones</li>
      </ul>
      <h2>Ejemplo de fórmula</h2>
      <p>La fórmula cuadrática es: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$</p>
    `,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getJSON())
    },
    onSelectionUpdate: ({ editor }) => {
      // Detectar comando slash
      const { selection } = editor.state
      const { $from } = selection
      const textBefore = $from.nodeBefore?.text || ''
      
      if (textBefore.endsWith('/')) {
        const coords = editor.view.coordsAtPos($from.pos)
        setSlashPosition({ x: coords.left, y: coords.bottom })
        setShowSlashCommands(true)
      } else {
        setShowSlashCommands(false)
      }
    },
  })

  const insertBlock = (type: string) => {
    if (!editor) return

    setShowSlashCommands(false)
    
    // Eliminar el '/' antes de insertar el bloque
    const { selection } = editor.state
    const { $from } = selection
    if ($from.nodeBefore?.text?.endsWith('/')) {
      editor.chain().focus().deleteRange({
        from: $from.pos - 1,
        to: $from.pos
      }).run()
    }

    switch (type) {
      case 'heading1':
        editor.chain().focus().toggleHeading({ level: 1 }).run()
        break
      case 'heading2':
        editor.chain().focus().toggleHeading({ level: 2 }).run()
        break
      case 'heading3':
        editor.chain().focus().toggleHeading({ level: 3 }).run()
        break
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run()
        break
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run()
        break
      case 'taskList':
        editor.chain().focus().toggleTaskList().run()
        break
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run()
        break
      case 'horizontalRule':
        editor.chain().focus().setHorizontalRule().run()
        break
      case 'codeBlock':
        editor.chain().focus().toggleCodeBlock().run()
        break
      case 'table':
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        break
      case 'mathBlock':
        editor.chain().focus().insertContent('<div class="math-block">$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$</div>').run()
        break
      case 'mathInline':
        editor.chain().focus().insertContent('<span class="math-inline">$E = mc^2$</span>').run()
        break
      case 'theorem':
        editor.chain().focus().insertContent(`
          <div class="theorem-block">
            <div class="theorem-title">Teorema</div>
            <p>Enunciado del teorema...</p>
            <p><strong>Demostración:</strong> Escribir la demostración aquí...</p>
          </div>
        `).run()
        break
      case 'definition':
        editor.chain().focus().insertContent(`
          <div class="definition-block">
            <div class="definition-title">Definición</div>
            <p>Definición del concepto...</p>
          </div>
        `).run()
        break
      case 'example':
        editor.chain().focus().insertContent(`
          <div class="example-block">
            <div class="example-title">Ejemplo</div>
            <p>Descripción del ejemplo...</p>
          </div>
        `).run()
        break
    }
  }

  const toggleFormat = (format: string) => {
    if (!editor) return

    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run()
        break
      case 'italic':
        editor.chain().focus().toggleItalic().run()
        break

      case 'strike':
        editor.chain().focus().toggleStrike().run()
        break
      case 'code':
        editor.chain().focus().toggleCode().run()
        break
      case 'link':
        const url = window.prompt('URL del enlace:')
        if (url) {
          editor.chain().focus().setLink({ href: url }).run()
        }
        break
    }
  }

  const setAlignment = (alignment: string) => {
    if (!editor) return
    // Aquí implementarías la lógica de alineación
    // Por simplicidad, solo mostramos el concepto
    console.log(`Setting alignment to: ${alignment}`)
  }

  if (!editor) {
    return <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-lg" />
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex gap-6">
        {/* Editor principal */}
        <div className="flex-1">
          {/* Toolbar flotante */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Formato de texto */}
              <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
                <Button
                  variant={editor.isActive('bold') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => toggleFormat('bold')}
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor.isActive('italic') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => toggleFormat('italic')}
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor.isActive('strike') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => toggleFormat('strike')}
                >
                  <Strikethrough className="w-4 h-4" />
                </Button>
                <Button
                  variant={editor.isActive('code') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => toggleFormat('code')}
                >
                  <Code className="w-4 h-4" />
                </Button>
              </div>

              {/* Alineación */}
              <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
                <Button variant="ghost" size="sm" onClick={() => setAlignment('left')}>
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setAlignment('center')}>
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setAlignment('right')}>
                  <AlignRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Bloques rápidos */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => insertBlock('mathInline')}>
                  <Calculator className="w-4 h-4" />
                  <span className="ml-1 text-xs">Inline</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => insertBlock('mathBlock')}>
                  <Calculator className="w-4 h-4" />
                  <span className="ml-1 text-xs">Block</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => insertBlock('table')}>
                  <TableIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleFormat('link')}>
                  <LinkIcon className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowTemplates(!showTemplates)}
                  className={showTemplates ? 'bg-blue-100 dark:bg-blue-900' : ''}
                >
                  <Palette className="w-4 h-4" />
                  <span className="ml-1 text-xs">Plantillas</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Área del editor */}
          <div 
            ref={editorRef}
            className="prose prose-lg dark:prose-invert max-w-none focus-within:outline-none focus-within:ring-0 bg-white"
          >
            <EditorContent 
              editor={editor} 
              className="min-h-[500px] focus:outline-none focus:ring-0 bg-white"
            />
          </div>

          {/* Comandos slash */}
          {showSlashCommands && (
            <SlashCommands
              position={slashPosition}
              onSelect={insertBlock}
              onClose={() => setShowSlashCommands(false)}
            />
          )}

          {/* Plantillas matemáticas */}
          {showTemplates && (
            <div className="mt-8 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <MathTemplates
                onInsert={(template) => {
                  const content = `
                    <div class="${template.type}-block">
                      <div class="${template.type}-title">${template.title}</div>
                      <p>${template.content}</p>
                      ${template.latex ? `<div class="math-block">$$${template.latex}$$</div>` : ''}
                    </div>
                  `
                  editor?.chain().focus().insertContent(content).run()
                  setShowTemplates(false)
                }}
              />
            </div>
          )}
        </div>

        {/* Tabla de contenidos */}
        {showTOC && (
          <div className="w-64 sticky top-24 h-fit">
            <TableOfContents editor={editor} />
          </div>
        )}
      </div>
    </div>
  )
} 