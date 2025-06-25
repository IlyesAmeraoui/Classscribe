'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  MoreHorizontal
} from 'lucide-react'

interface Summary {
  id: string
  title: string
  subject: string
  content: any
  createdAt: string
  updatedAt: string
  tags: string[]
  isFavorite: boolean
}

export default function SummariesPage() {
  const router = useRouter()
  
  const [summaries, setSummaries] = useState<Summary[]>([
    {
      id: '1',
      title: 'Cálculo Diferencial - Límites y Continuidad',
      subject: 'Matemáticas',
      content: null,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      tags: ['cálculo', 'límites', 'continuidad'],
      isFavorite: true
    },
    {
      id: '2',
      title: 'Álgebra Lineal - Espacios Vectoriales',
      subject: 'Matemáticas',
      content: null,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      tags: ['álgebra', 'vectores', 'espacios'],
      isFavorite: false
    },
    {
      id: '3',
      title: 'Física Cuántica - Principios Fundamentales',
      subject: 'Física',
      content: null,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-15',
      tags: ['física', 'cuántica', 'principios'],
      isFavorite: false
    },
    {
      id: '4',
      title: 'Estadística - Distribuciones de Probabilidad',
      subject: 'Estadística',
      content: null,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-12',
      tags: ['estadística', 'probabilidad', 'distribuciones'],
      isFavorite: true
    }
  ])

  const createNewSummary = () => {
    const newSummary: Summary = {
      id: Date.now().toString(),
      title: 'Nuevo Resumen',
      subject: 'Matemáticas',
      content: null,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      tags: [],
      isFavorite: false
    }
    setSummaries(prev => [newSummary, ...prev])
    // Navegar al nuevo resumen
    router.push(`/summaries/${newSummary.id}`)
  }

  const openSummary = (summaryId: string) => {
    router.push(`/summaries/${summaryId}`)
  }



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Resúmenes Matemáticos
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Crea y organiza tus resúmenes con soporte completo para LaTeX y matemáticas
              </p>
            </div>
            <Button onClick={createNewSummary} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Resumen
            </Button>
          </div>

          {/* Filtros y búsqueda */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar resúmenes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Stats rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
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
        </div>

        {/* Grid de resúmenes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaries.map((summary) => (
            <Card 
              key={summary.id} 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => openSummary(summary.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {summary.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
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

        {summaries.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No hay resúmenes aún
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Crea tu primer resumen matemático con nuestro editor avanzado
            </p>
            <Button onClick={createNewSummary} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Resumen
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 