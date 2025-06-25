'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Hash, 
  Zap, 
  Calculator,
  Copy,
  Plus
} from 'lucide-react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

interface MathTemplate {
  id: string
  type: 'theorem' | 'definition' | 'example' | 'formula'
  title: string
  description: string
  content: string
  latex?: string
  category: string
  tags: string[]
}

const MATH_TEMPLATES: MathTemplate[] = [
  // Teoremas
  {
    id: 'pythagorean',
    type: 'theorem',
    title: 'Teorema de Pitágoras',
    description: 'Relación fundamental en triángulos rectángulos',
    content: 'En un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos.',
    latex: 'a^2 + b^2 = c^2',
    category: 'Geometría',
    tags: ['triángulos', 'geometría', 'fundamental']
  },
  {
    id: 'fundamental_calculus',
    type: 'theorem',
    title: 'Teorema Fundamental del Cálculo',
    description: 'Conecta derivación e integración',
    content: 'Si f es continua en [a,b] y F es una antiderivada de f, entonces:',
    latex: '\\int_a^b f(x)\\,dx = F(b) - F(a)',
    category: 'Cálculo',
    tags: ['integrales', 'derivadas', 'fundamental']
  },
  
  // Definiciones
  {
    id: 'derivative',
    type: 'definition',
    title: 'Definición de Derivada',
    description: 'Límite que define la derivada de una función',
    content: 'La derivada de una función f en un punto x es el límite:',
    latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
    category: 'Cálculo',
    tags: ['derivadas', 'límites', 'definición']
  },
  {
    id: 'limit',
    type: 'definition',
    title: 'Definición de Límite',
    description: 'Definición épsilon-delta de límite',
    content: 'Decimos que el límite de f(x) cuando x tiende a a es L si:',
    latex: '\\forall \\epsilon > 0, \\exists \\delta > 0: |x-a| < \\delta \\Rightarrow |f(x)-L| < \\epsilon',
    category: 'Análisis',
    tags: ['límites', 'análisis', 'épsilon-delta']
  },
  
  // Ejemplos
  {
    id: 'integration_parts',
    type: 'example',
    title: 'Integración por Partes',
    description: 'Ejemplo de integración por partes',
    content: 'Para calcular ∫x·e^x dx, usamos integración por partes:',
    latex: '\\int x e^x \\, dx = x e^x - \\int e^x \\, dx = x e^x - e^x + C = e^x(x-1) + C',
    category: 'Cálculo Integral',
    tags: ['integrales', 'por partes', 'ejemplo']
  },
  {
    id: 'chain_rule',
    type: 'example',
    title: 'Regla de la Cadena',
    description: 'Aplicación de la regla de la cadena',
    content: 'Para derivar f(x) = sin(x²), aplicamos la regla de la cadena:',
    latex: "f'(x) = \\cos(x^2) \\cdot 2x = 2x\\cos(x^2)",
    category: 'Cálculo Diferencial',
    tags: ['derivadas', 'regla cadena', 'ejemplo']
  },
  
  // Fórmulas
  {
    id: 'quadratic_formula',
    type: 'formula',
    title: 'Fórmula Cuadrática',
    description: 'Solución de ecuaciones cuadráticas',
    content: 'Para resolver ax² + bx + c = 0:',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    category: 'Álgebra',
    tags: ['ecuaciones', 'cuadrática', 'fórmula']
  },
  {
    id: 'euler_formula',
    type: 'formula',
    title: 'Fórmula de Euler',
    description: 'Relación entre exponencial compleja y trigonometría',
    content: 'La identidad de Euler relaciona cinco constantes matemáticas fundamentales:',
    latex: 'e^{i\\pi} + 1 = 0',
    category: 'Análisis Complejo',
    tags: ['euler', 'complejo', 'identidad']
  }
]

interface MathTemplatesProps {
  onInsert?: (template: MathTemplate) => void
  className?: string
}

export function MathTemplates({ onInsert, className }: MathTemplatesProps) {
  const getIcon = (type: MathTemplate['type']) => {
    switch (type) {
      case 'theorem': return BookOpen
      case 'definition': return Hash
      case 'example': return Zap
      case 'formula': return Calculator
      default: return BookOpen
    }
  }

  const getColor = (type: MathTemplate['type']) => {
    switch (type) {
      case 'theorem': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      case 'definition': return 'border-green-500 bg-green-50 dark:bg-green-900/20'
      case 'example': return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
      case 'formula': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getTypeLabel = (type: MathTemplate['type']) => {
    switch (type) {
      case 'theorem': return 'Teorema'
      case 'definition': return 'Definición'
      case 'example': return 'Ejemplo'
      case 'formula': return 'Fórmula'
      default: return 'Plantilla'
    }
  }

  const groupedTemplates = MATH_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = []
    }
    acc[template.category].push(template)
    return acc
  }, {} as Record<string, MathTemplate[]>)

  const copyLatexToClipboard = async (latex: string) => {
    try {
      await navigator.clipboard.writeText(latex)
      // Aquí podrías mostrar una notificación de éxito
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Plantillas Matemáticas
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Selecciona una plantilla para insertarla en tu documento
        </p>
      </div>

      {Object.entries(groupedTemplates).map(([category, templates]) => (
        <div key={category} className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            {category}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => {
              const Icon = getIcon(template.type)
              
              return (
                <Card 
                  key={template.id}
                  className={`p-4 hover:shadow-md transition-shadow cursor-pointer group border-l-4 ${getColor(template.type)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <Badge variant="secondary" className="text-xs">
                        {getTypeLabel(template.type)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {template.latex && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyLatexToClipboard(template.latex!)
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onInsert?.(template)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {template.title}
                  </h5>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {template.description}
                  </p>

                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {template.content}
                  </div>

                  {template.latex && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border text-center">
                      <BlockMath math={template.latex} />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          ¿Necesitas más plantillas? Puedes crear las tuyas propias o sugerir nuevas.
        </p>
      </div>
    </div>
  )
} 