'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { NotionStyleEditor } from '@/components/NotionStyleEditor'
import { ExportDialog } from '@/components/ExportDialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Share, 
  Download, 
  MoreHorizontal,
  Star,
  Bookmark,
  Clock,
  Calendar,
  FileText,
  Eye,
  Users,
  Settings
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Summary {
  id: string
  title: string
  subject: string
  content: any
  createdAt: string
  updatedAt: string
  tags: string[]
  isFavorite: boolean
  isBookmarked: boolean
  wordCount: number
  readTime: string
  author: {
    name: string
    avatar: string
  }
  collaborators?: {
    name: string
    avatar: string
  }[]
}

// Datos de ejemplo - en una app real esto vendría de una API
const SAMPLE_SUMMARIES: Record<string, Summary> = {
  '1': {
    id: '1',
    title: 'Cálculo Diferencial - Límites y Continuidad',
    subject: 'Matemáticas',
    content: null,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    tags: ['cálculo', 'límites', 'continuidad'],
    isFavorite: true,
    isBookmarked: false,
    wordCount: 1250,
    readTime: '5',
    author: {
      name: 'Ilyes',
      avatar: '/api/placeholder/32/32'
    },
    collaborators: []
  },
  '2': {
    id: '2',
    title: 'Álgebra Lineal - Espacios Vectoriales',
    subject: 'Matemáticas',
    content: null,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    tags: ['álgebra', 'vectores', 'espacios'],
    isFavorite: false,
    isBookmarked: true,
    wordCount: 890,
    readTime: '4',
    author: {
      name: 'Ilyes',
      avatar: '/api/placeholder/32/32'
    }
  }
}

export default function SummaryPage() {
  const params = useParams()
  const router = useRouter()
  const summaryId = params.id as string

  const [summary, setSummary] = useState<Summary | null>(null)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    const loadSummary = async () => {
      setIsLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const summaryData = SAMPLE_SUMMARIES[summaryId]
      if (summaryData) {
        setSummary(summaryData)
      }
      
      setIsLoading(false)
    }

    if (summaryId) {
      loadSummary()
    }
  }, [summaryId])

  const updateSummary = (updates: Partial<Summary>) => {
    if (summary) {
      setSummary(prev => prev ? { 
        ...prev, 
        ...updates, 
        updatedAt: new Date().toISOString().split('T')[0] 
      } : null)
    }
  }

  const toggleFavorite = () => {
    updateSummary({ isFavorite: !summary?.isFavorite })
  }

  const toggleBookmark = () => {
    updateSummary({ isBookmarked: !summary?.isBookmarked })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando resumen...</p>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Resumen no encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            El resumen que buscas no existe o ha sido eliminado.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Editor */}
      <NotionStyleEditor 
        content={summary.content}
        onUpdate={(content) => updateSummary({ content })}
        title={summary.title}
        onTitleChange={(title) => updateSummary({ title })}
        className="min-h-screen"
      />

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        title={summary.title}
        content={summary.content}
      />
    </>
  )
} 