'use client'

import { useState } from 'react'
import { NotionStyleEditor } from '@/components/NotionStyleEditor'
import { ExportDialog } from '@/components/ExportDialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Calculator,
  Clock,
  Star,
  Eye,
  MoreHorizontal,
  ArrowLeft,
  Share,
  Download,
  Calendar,
  Bookmark,
  Users,
  Settings,
  Sparkles,
  ChevronDown,
  GraduationCap
} from 'lucide-react'
import { Input } from '@/components/ui/input'
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

const SAMPLE_SUMMARIES: Summary[] = [
  {
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
  {
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
  },
  {
    id: '3',
    title: 'Física Cuántica - Principios Fundamentales',
    subject: 'Física',
    content: null,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-15',
    tags: ['física', 'cuántica', 'principios'],
    isFavorite: false,
    isBookmarked: false,
    wordCount: 1100,
    readTime: '4',
    author: {
      name: 'Ilyes',
      avatar: '/api/placeholder/32/32'
    }
  },
  {
    id: '4',
    title: 'Estadística - Distribuciones de Probabilidad',
    subject: 'Estadística',
    content: null,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12',
    tags: ['estadística', 'probabilidad', 'distribuciones'],
    isFavorite: true,
    isBookmarked: false,
    wordCount: 950,
    readTime: '4',
    author: {
      name: 'Ilyes',
      avatar: '/api/placeholder/32/32'
    }
  }
]

interface SummariesViewProps {
  initialSummaryId?: string
}

export function SummariesView({ initialSummaryId }: SummariesViewProps = {}) {
  const [summaries, setSummaries] = useState<Summary[]>(SAMPLE_SUMMARIES)
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(() => {
    if (initialSummaryId) {
      return SAMPLE_SUMMARIES.find(s => s.id === initialSummaryId) || null
    }
    return null
  })
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSubject, setFilterSubject] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const createNewSummary = () => {
    const newSummary: Summary = {
      id: Date.now().toString(),
      title: 'Nuevo Resumen',
      subject: 'Matemáticas',
      content: null,
      createdAt: new Date().toISOString().split('T')[0]!,
      updatedAt: new Date().toISOString().split('T')[0]!,
      tags: [],
      isFavorite: false,
      isBookmarked: false,
      wordCount: 0,
      readTime: '0',
      author: {
        name: 'Ilyes',
        avatar: '/api/placeholder/32/32'
      }
    }
    setSummaries(prev => [newSummary, ...prev])
    setSelectedSummary(newSummary)
  }

  const updateSummary = (updates: Partial<Summary>) => {
    if (selectedSummary) {
      const updatedSummary = { 
        ...selectedSummary, 
        ...updates, 
        updatedAt: new Date().toISOString().split('T')[0]! 
      }
      setSelectedSummary(updatedSummary)
      setSummaries(prev => prev.map(s => s.id === selectedSummary.id ? updatedSummary : s))
    }
  }

  const toggleFavorite = (summaryId?: string) => {
    const id = summaryId || selectedSummary?.id
    if (id) {
      setSummaries(prev => prev.map(s => 
        s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
      ))
      if (selectedSummary?.id === id) {
        setSelectedSummary(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null)
      }
    }
  }

  const toggleBookmark = (summaryId?: string) => {
    const id = summaryId || selectedSummary?.id
    if (id) {
      setSummaries(prev => prev.map(s => 
        s.id === id ? { ...s, isBookmarked: !s.isBookmarked } : s
      ))
      if (selectedSummary?.id === id) {
        setSelectedSummary(prev => prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null)
      }
    }
  }

  const filteredSummaries = summaries.filter(summary => {
    const matchesSearch = summary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         summary.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         summary.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSubject = filterSubject === "all" || summary.subject === filterSubject
    return matchesSearch && matchesSubject
  })

  const subjects = [...new Set(summaries.map(s => s.subject))]

  // Vista del editor individual
  if (selectedSummary) {
    return (
      <>
        {/* Editor */}
        <NotionStyleEditor 
          content={selectedSummary.content}
          onUpdate={(content) => updateSummary({ content })}
          title={selectedSummary.title}
          onTitleChange={(title) => updateSummary({ title })}
          className="min-h-full"
        />

        {/* Export Dialog */}
        <ExportDialog
          open={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          title={selectedSummary.title}
          content={selectedSummary.content}
        />
      </>
    )
  }

  // Vista de lista de resúmenes
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resúmenes</h1>
          <p className="text-muted-foreground">
            Resúmenes generados con IA de tus clases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2" onClick={createNewSummary}>
            <Plus className="w-4 h-4" />
            Crear Resumen
          </Button>
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Generar con IA
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summaries.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Resúmenes</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Calculator className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fórmulas LaTeX</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{subjects.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Materias</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summaries.filter(s => s.isFavorite).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Favoritos</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar resúmenes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <GraduationCap className="w-4 h-4" />
              Materia: {filterSubject === "all" ? "Todas" : filterSubject}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterSubject("all")}>
              Todas las Materias
            </DropdownMenuItem>
            {subjects.map((subject) => (
              <DropdownMenuItem key={subject} onClick={() => setFilterSubject(subject)}>
                {subject}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid de resúmenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSummaries.map((summary) => (
          <Card 
            key={summary.id} 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => setSelectedSummary(summary)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {summary.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                {summary.isBookmarked && <Bookmark className="w-4 h-4 text-blue-500 fill-current" />}
              </div>
              <Badge variant="secondary" className="text-xs">
                {summary.subject}
              </Badge>
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
              {summary.title}
            </h3>

            <div className="flex flex-wrap gap-1 mb-4">
              {summary.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(summary.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-3 h-3" />
                <span className="text-xs">Ver resumen</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 