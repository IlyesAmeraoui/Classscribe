'use client'

import { BlockEditor } from './BlockEditor'

interface NotionStyleEditorProps {
  content?: any
  onUpdate?: (content: any) => void
  className?: string
  title?: string
  onTitleChange?: (title: string) => void
}

export function NotionStyleEditor({ 
  content, 
  onUpdate, 
  className, 
  title = "Sin título",
  onTitleChange 
}: NotionStyleEditorProps) {
  return (
    <BlockEditor 
      initialBlocks={content || []}
      onUpdate={onUpdate}
      className={className}
      title={title}
      onTitleChange={onTitleChange}
    />
  )
} 