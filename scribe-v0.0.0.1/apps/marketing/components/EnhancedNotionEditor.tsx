'use client'

import { useEditor, EditorContent, BubbleMenu as TiptapBubbleMenu, FloatingMenu } from '@tiptap/react'
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
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Focus from '@tiptap/extension-focus'
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// Importar nuestros componentes personalizados
import { BlockHandle } from './BlockHandle'
import { InlineBlockInserter } from './InlineBlockInserter'
import { BubbleMenu } from './BubbleMenu'
import { SlashCommands } from './SlashCommands'
import { TableOfContents } from './TableOfContents'
import { MathTemplates } from './MathTemplates'

// Iconos
import { 
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Palette,
  Eye,
  EyeOff
} from 'lucide-react'

// Crear instancia de lowlight y registrar lenguajes
const lowlight = createLowlight()
lowlight.register('javascript', javascript)
lowlight.register('python', python)
lowlight.register('html', xml)
lowlight.register('css', css)
lowlight.register('json', json)

interface EnhancedNotionEditorProps {
  content?: any
  onUpdate?: (content: any) => void
  className?: string
}

export function EnhancedNotionEditor({ content, onUpdate, className }: EnhancedNotionEditorProps) {
  // Estados para controlar la UI
  const [showSlashCommands, setShowSlashCommands] = useState(false)
  const [slashPosition, setSlashPosition] = useState({ x: 0, y: 0 })
  const [showTOC, setShowTOC] = useState(true)
  const [showTemplates, setShowTemplates] = useState(false)
  
  // Estados para los elementos interactivos
  const [blockHandlePosition, setBlockHandlePosition] = useState({ x: 0, y: 0 })
  const [showBlockHandle, setShowBlockHandle] = useState(false)
  const [hoveredBlockElement, setHoveredBlockElement] = useState<HTMLElement | null>(null)
  const [activeBlockElement, setActiveBlockElement] = useState<HTMLElement | null>(null)
  const [isHandleHovered, setIsHandleHovered] = useState(false)
  const [forceShowHandle, setForceShowHandle] = useState(false)
  
  const [inlineInserterPosition, setInlineInserterPosition] = useState({ x: 0, y: 0 })
  const [showInlineInserter, setShowInlineInserter] = useState(false)
  
  const [bubbleMenuPosition, setBubbleMenuPosition] = useState({ x: 0, y: 0 })
  const [showBubbleMenu, setShowBubbleMenu] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  
  const editorRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
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
      Color,
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
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

      // Detectar bloque activo (donde está el cursor)
      const pos = selection.from
      const resolvedPos = editor.state.doc.resolve(pos)
      const blockNode = resolvedPos.parent
      
      // Encontrar el elemento DOM del bloque activo
      const domAtPos = editor.view.domAtPos(pos)
      const activeBlock = domAtPos.node?.nodeType === Node.ELEMENT_NODE 
        ? domAtPos.node as HTMLElement
        : (domAtPos.node?.parentElement?.closest('[data-type="paragraph"], [data-type="heading"], [data-type="bulletList"], [data-type="orderedList"], [data-type="blockquote"]') as HTMLElement)
      
      if (activeBlock && activeBlock !== activeBlockElement) {
        setActiveBlockElement(activeBlock)
        updateBlockHandlePosition(activeBlock)
      } else if (!activeBlock) {
        setActiveBlockElement(null)
      }

      // Detectar selección de texto para bubble menu
      const { from, to } = selection
      if (from !== to) {
        const selectedTextContent = editor.state.doc.textBetween(from, to)
        setSelectedText(selectedTextContent)
        
        const coords = editor.view.coordsAtPos(from)
        setBubbleMenuPosition({ x: coords.left, y: coords.top })
        setShowBubbleMenu(true)
      } else {
        setShowBubbleMenu(false)
        setSelectedText('')
      }
    },
  })

  // Función para actualizar la posición del block handle
  const updateBlockHandlePosition = useCallback((blockElement: HTMLElement) => {
    if (!editorRef.current) return
    
    const rect = blockElement.getBoundingClientRect()
    const editorRect = editorRef.current.getBoundingClientRect()
    
    setBlockHandlePosition({ 
      x: rect.left - editorRect.left, 
      y: rect.top - editorRect.top + rect.height / 2 
    })
    setShowBlockHandle(true)
  }, [])





  // Efecto para mostrar/ocultar el block handle basado en el estado activo y hover
  useEffect(() => {
    const shouldShow = hoveredBlockElement || activeBlockElement || isHandleHovered || forceShowHandle
    if (shouldShow) {
      const targetElement = hoveredBlockElement || activeBlockElement
      if (targetElement) {
        updateBlockHandlePosition(targetElement)
        setShowBlockHandle(true)
        setForceShowHandle(true) // Forzar que se mantenga visible
      }
    } else {
      // Solo ocultar después de un pequeño delay
      const timeoutId = setTimeout(() => {
        setShowBlockHandle(false)
        setForceShowHandle(false)
      }, 100)
      
      return () => clearTimeout(timeoutId)
    }
  }, [hoveredBlockElement, activeBlockElement, isHandleHovered, forceShowHandle, updateBlockHandlePosition])

  // Efecto para crear overlays de detección en cada bloque
  useEffect(() => {
    if (!editorRef.current) return

    const createBlockOverlays = () => {
      // Remover overlays existentes
      const existingOverlays = document.querySelectorAll('.block-hover-overlay')
      existingOverlays.forEach(overlay => overlay.remove())

      // Crear overlays para cada bloque
      const blocks = editorRef.current?.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, li, blockquote')
      
      blocks?.forEach((block) => {
        const blockElement = block as HTMLElement
        const rect = blockElement.getBoundingClientRect()
        const editorRect = editorRef.current?.getBoundingClientRect()
        
        if (rect.height > 0 && editorRect) {
          const overlay = document.createElement('div')
          overlay.className = 'block-hover-overlay'
          overlay.style.cssText = `
            position: fixed;
            left: ${editorRect.left - 200}px;
            top: ${rect.top}px;
            width: ${rect.width + 250}px;
            height: ${rect.height}px;
            z-index: 5;
            pointer-events: auto;
            background: transparent;
          `
          
          overlay.addEventListener('mouseenter', () => {
            setHoveredBlockElement(blockElement)
            setForceShowHandle(true)
          })
          
          overlay.addEventListener('mouseleave', () => {
            if (!isHandleHovered) {
              setTimeout(() => {
                setHoveredBlockElement(null)
                setForceShowHandle(false)
              }, 100)
            }
          })
          
          document.body.appendChild(overlay)
        }
      })
    }

    // Crear overlays inicialmente
    createBlockOverlays()

    // Recrear overlays cuando el contenido cambie
    const observer = new MutationObserver(createBlockOverlays)
    if (editorRef.current) {
      observer.observe(editorRef.current, { childList: true, subtree: true })
    }

    // Recrear overlays en scroll y resize
    const handleScrollResize = () => {
      setTimeout(createBlockOverlays, 50)
    }
    
    window.addEventListener('scroll', handleScrollResize)
    window.addEventListener('resize', handleScrollResize)

    return () => {
      // Limpiar overlays
      const overlays = document.querySelectorAll('.block-hover-overlay')
      overlays.forEach(overlay => overlay.remove())
      
      observer.disconnect()
      window.removeEventListener('scroll', handleScrollResize)
      window.removeEventListener('resize', handleScrollResize)
    }
  }, [isHandleHovered])

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
          <div class="theorem-block p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg my-4">
            <div class="font-semibold text-blue-700 dark:text-blue-300 mb-2">Teorema</div>
            <p>Enunciado del teorema...</p>
            <p class="mt-2"><strong>Demostración:</strong> Escribir la demostración aquí...</p>
          </div>
        `).run()
        break
      case 'definition':
        editor.chain().focus().insertContent(`
          <div class="definition-block p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r-lg my-4">
            <div class="font-semibold text-green-700 dark:text-green-300 mb-2">Definición</div>
            <p>Definición del concepto...</p>
          </div>
        `).run()
        break
      case 'example':
        editor.chain().focus().insertContent(`
          <div class="example-block p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded-r-lg my-4">
            <div class="font-semibold text-purple-700 dark:text-purple-300 mb-2">Ejemplo</div>
            <p>Descripción del ejemplo...</p>
          </div>
        `).run()
        break
    }
  }

  const handleBubbleMenuFormat = (format: string, value?: string) => {
    if (!editor) return

    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run()
        break
      case 'italic':
        editor.chain().focus().toggleItalic().run()
        break
      case 'strikethrough':
        editor.chain().focus().toggleStrike().run()
        break
      case 'code':
        editor.chain().focus().toggleCode().run()
        break
      case 'link':
        if (value) {
          editor.chain().focus().setLink({ href: value }).run()
        }
        break
      case 'textColor':
        if (value) {
          editor.chain().focus().setColor(value).run()
        }
        break
      case 'highlight':
        if (value) {
          editor.chain().focus().setHighlight({ color: value }).run()
        }
        break
    }
  }

  if (!editor) {
    return <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-lg" />
  }

  return (
    <div className={cn("relative group", className)}>
      <div className="flex gap-6">
        {/* Editor principal */}
        <div className="flex-1 relative">
          {/* Toolbar flotante simplificado */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => insertBlock('mathInline')}>
                  <span className="text-xs">Fórmula inline</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => insertBlock('mathBlock')}>
                  <span className="text-xs">Fórmula bloque</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowTemplates(!showTemplates)}
                  className={showTemplates ? 'bg-blue-100 dark:bg-blue-900' : ''}
                >
                  <Palette className="w-4 h-4 mr-1" />
                  <span className="text-xs">Plantillas</span>
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTOC(!showTOC)}
                className={showTOC ? 'bg-gray-100 dark:bg-gray-800' : ''}
              >
                {showTOC ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="ml-1 text-xs">TOC</span>
              </Button>
            </div>
          </div>

          {/* Área del editor con elementos interactivos */}
          <div 
            ref={editorRef}
            className="prose prose-lg dark:prose-invert max-w-none focus-within:outline-none focus-within:ring-0 relative bg-white"
          >

            
            <EditorContent 
              editor={editor} 
              className="min-h-[500px] focus:outline-none focus:ring-0 bg-white relative z-20"
            />
            
            {/* Block Handle */}
            <BlockHandle
              position={blockHandlePosition}
              visible={showBlockHandle}
              isActive={!!activeBlockElement}
              onMouseEnter={() => {
                setIsHandleHovered(true)
                setForceShowHandle(true)
              }}
              onMouseLeave={() => {
                setTimeout(() => {
                  setIsHandleHovered(false)
                }, 100)
              }}
              onAddBlock={insertBlock}
              onDuplicateBlock={() => {
                // Implementar duplicación de bloque
                console.log('Duplicar bloque')
              }}
              onDeleteBlock={() => {
                // Implementar eliminación de bloque
                console.log('Eliminar bloque')
              }}
              onTransformBlock={(type) => {
                insertBlock(type)
              }}
              onMoveUp={() => {
                console.log('Mover arriba')
              }}
              onMoveDown={() => {
                console.log('Mover abajo')
              }}
            />

            {/* Inline Block Inserter */}
            <InlineBlockInserter
              position={inlineInserterPosition}
              visible={showInlineInserter}
              onInsertBlock={insertBlock}
            />

            {/* Bubble Menu personalizado */}
            <BubbleMenu
              position={bubbleMenuPosition}
              visible={showBubbleMenu}
              isActive={{
                bold: editor.isActive('bold'),
                italic: editor.isActive('italic'),
                strike: editor.isActive('strike'),
                code: editor.isActive('code'),
                link: editor.isActive('link')
              }}
              onFormat={handleBubbleMenuFormat}
              selectedText={selectedText}
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
                    <div class="${template.type}-block p-4 border-l-4 border-${template.type === 'theorem' ? 'blue' : template.type === 'definition' ? 'green' : 'purple'}-500 bg-${template.type === 'theorem' ? 'blue' : template.type === 'definition' ? 'green' : 'purple'}-50 dark:bg-${template.type === 'theorem' ? 'blue' : template.type === 'definition' ? 'green' : 'purple'}-900/20 rounded-r-lg my-4">
                      <div class="font-semibold text-${template.type === 'theorem' ? 'blue' : template.type === 'definition' ? 'green' : 'purple'}-700 dark:text-${template.type === 'theorem' ? 'blue' : template.type === 'definition' ? 'green' : 'purple'}-300 mb-2">${template.title}</div>
                      <p>${template.content}</p>
                      ${template.latex ? `<div class="math-block mt-2">$$${template.latex}$$</div>` : ''}
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