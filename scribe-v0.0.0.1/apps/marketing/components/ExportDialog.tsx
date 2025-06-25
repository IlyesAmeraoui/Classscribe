'use client'

import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Download, 
  Code, 
  Image, 
  Copy,
  Check,
  AlertCircle
} from 'lucide-react'

interface ExportFormat {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  extension: string
  features: string[]
  recommended?: boolean
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Documento PDF con fórmulas renderizadas',
    icon: FileText,
    extension: '.pdf',
    features: ['Fórmulas LaTeX renderizadas', 'Listo para imprimir', 'Compatible universalmente'],
    recommended: true
  },
  {
    id: 'latex',
    name: 'LaTeX',
    description: 'Código LaTeX puro para Overleaf',
    icon: Code,
    extension: '.tex',
    features: ['Código fuente editable', 'Compatible con Overleaf', 'Fórmulas nativas']
  },
  {
    id: 'markdown',
    name: 'Markdown',
    description: 'Formato Markdown con LaTeX inline',
    icon: FileText,
    extension: '.md',
    features: ['Compatible con GitHub', 'Texto plano', 'Fácil de editar']
  },
  {
    id: 'html',
    name: 'HTML',
    description: 'Página web con MathJax',
    icon: Code,
    extension: '.html',
    features: ['Visualización web', 'MathJax integrado', 'Interactivo']
  },
  {
    id: 'image',
    name: 'Imagen',
    description: 'PNG de alta calidad',
    icon: Image,
    extension: '.png',
    features: ['Alta resolución', 'Fácil de compartir', 'Redes sociales']
  }
]

interface ExportDialogProps {
  open: boolean
  onClose: () => void
  title: string
  content: any
}

export function ExportDialog({ open, onClose, title, content }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf')
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const handleExport = async (formatId: string) => {
    setIsExporting(true)
    
    try {
      // Simular proceso de exportación
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      switch (formatId) {
        case 'pdf':
          await exportToPDF()
          break
        case 'latex':
          await exportToLaTeX()
          break
        case 'markdown':
          await exportToMarkdown()
          break
        case 'html':
          await exportToHTML()
          break
        case 'image':
          await exportToImage()
          break
      }
      
      setExportComplete(true)
      setTimeout(() => {
        setExportComplete(false)
        onClose()
      }, 2000)
      
    } catch (error) {
      console.error('Error al exportar:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPDF = async () => {
    // Implementación de exportación a PDF
    console.log('Exportando a PDF...')
    // Aquí usarías una librería como jsPDF con html2canvas
  }

  const exportToLaTeX = async () => {
    // Convertir el contenido del editor a LaTeX
    const latexContent = convertToLaTeX(content)
    downloadFile(latexContent, `${title}.tex`, 'text/plain')
  }

  const exportToMarkdown = async () => {
    // Convertir el contenido del editor a Markdown
    const markdownContent = convertToMarkdown(content)
    downloadFile(markdownContent, `${title}.md`, 'text/plain')
  }

  const exportToHTML = async () => {
    // Crear HTML con MathJax
    const htmlContent = convertToHTML(content)
    downloadFile(htmlContent, `${title}.html`, 'text/html')
  }

  const exportToImage = async () => {
    // Implementación de exportación a imagen
    console.log('Exportando a imagen...')
    // Aquí usarías html2canvas
  }

  const convertToLaTeX = (content: any): string => {
    // Conversión básica - esto se puede expandir
    return `
\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}

\\title{${title}}
\\author{ProjectScribe}
\\date{\\today}

\\begin{document}

\\maketitle

% Contenido convertido del editor
% Aquí iría la lógica de conversión completa

\\section{Resumen}

Este documento fue generado automáticamente desde ProjectScribe.

\\end{document}
    `.trim()
  }

  const convertToMarkdown = (content: any): string => {
    // Conversión básica - esto se puede expandir
    return `# ${title}

> Generado automáticamente por ProjectScribe

## Contenido

Este resumen fue creado con el editor matemático de ProjectScribe.

### Fórmulas

Las fórmulas LaTeX se mantienen en formato inline: $E = mc^2$

Y en formato display:

$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

---

*Exportado el ${new Date().toLocaleDateString()}*
    `.trim()
  }

  const convertToHTML = (content: any): string => {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .math-block { text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <p><em>Generado por ProjectScribe</em></p>
    
    <div id="content">
        <!-- Aquí iría el contenido convertido -->
        <p>Este documento fue exportado desde ProjectScribe.</p>
    </div>
</body>
</html>
    `.trim()
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async (formatId: string) => {
    let content = ''
    
    switch (formatId) {
      case 'latex':
        content = convertToLaTeX(content)
        break
      case 'markdown':
        content = convertToMarkdown(content)
        break
      case 'html':
        content = convertToHTML(content)
        break
    }
    
    try {
      await navigator.clipboard.writeText(content)
      // Mostrar feedback de éxito
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Resumen
          </DialogTitle>
          <DialogDescription>
            Elige el formato de exportación para "{title}"
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {EXPORT_FORMATS.map((format) => {
            const Icon = format.icon
            const isSelected = selectedFormat === format.id
            
            return (
              <Card 
                key={format.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => setSelectedFormat(format.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium">{format.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {format.recommended && (
                      <Badge variant="secondary" className="text-xs">
                        Recomendado
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {format.extension}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {format.description}
                </p>

                <div className="space-y-1">
                  {format.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Check className="w-3 h-3 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleExport(format.id)
                    }}
                    disabled={isExporting}
                    className="flex-1"
                  >
                    {isExporting && selectedFormat === format.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Exportando...
                      </>
                    ) : exportComplete && selectedFormat === format.id ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Completado
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </>
                    )}
                  </Button>
                  
                  {['latex', 'markdown', 'html'].includes(format.id) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(format.id)
                      }}
                      className="px-3"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Consejos de Exportación
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• <strong>PDF:</strong> Mejor para presentaciones y documentos finales</li>
                <li>• <strong>LaTeX:</strong> Ideal para edición posterior en Overleaf</li>
                <li>• <strong>Markdown:</strong> Perfecto para GitHub y documentación</li>
                <li>• <strong>HTML:</strong> Para visualización web interactiva</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 