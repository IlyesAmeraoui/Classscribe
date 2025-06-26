'use client'

import { useState } from 'react'
import { NotionStyleEditor } from '@/components/NotionStyleEditor'

export default function BlockEditorDemo() {
  const [content, setContent] = useState({
    blocks: [
      {
        id: '1',
        type: 'heading1',
        content: 'Bienvenido al Editor de Bloques'
      },
      {
        id: '2',
        type: 'paragraph',
        content: 'Este es un editor modular donde cada línea es un componente independiente.'
      },
      {
        id: '3',
        type: 'heading2',
        content: 'Características principales'
      },
      {
        id: '4',
        type: 'bulletList',
        content: 'Cada línea es un componente independiente'
      },
      {
        id: '5',
        type: 'bulletList',
        content: 'Comandos slash (/) para cambiar tipos de bloque'
      },
      {
        id: '6',
        type: 'bulletList',
        content: 'Arrastrar y soltar bloques'
      },
      {
        id: '7',
        type: 'bulletList',
        content: 'Menús contextuales con opciones'
      },
      {
        id: '8',
        type: 'heading3',
        content: 'Prueba los diferentes tipos'
      },
      {
        id: '9',
        type: 'todo',
        content: 'Esta es una tarea pendiente',
        completed: false
      },
      {
        id: '10',
        type: 'todo',
        content: 'Esta tarea está completada',
        completed: true
      },
      {
        id: '11',
        type: 'quote',
        content: 'Esta es una cita o nota importante'
      },
      {
        id: '12',
        type: 'code',
        content: 'console.log("Hola mundo");'
      },
      {
        id: '13',
        type: 'math',
        content: 'E = mc^2'
      }
    ]
  })
  
  const [title, setTitle] = useState('Mi Documento de Prueba')

  const handleContentUpdate = (newContent: any) => {
    setContent(newContent)
    console.log('Contenido actualizado:', newContent)
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    console.log('Título actualizado:', newTitle)
  }

  return (
    <div className="min-h-screen bg-white">
      <NotionStyleEditor
        content={content}
        onUpdate={handleContentUpdate}
        title={title}
        onTitleChange={handleTitleChange}
      />
      
      {/* Panel de información (opcional) */}
      <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <h3 className="font-semibold mb-2">💡 Consejos:</h3>
        <ul className="text-sm space-y-1">
          <li>• Escribe "/" para comandos</li>
          <li>• Enter para nueva línea</li>
          <li>• Backspace en línea vacía para eliminar</li>
          <li>• Hover para ver controles</li>
          <li>• Usa ↑↓ para navegar</li>
        </ul>
      </div>
    </div>
  )
} 