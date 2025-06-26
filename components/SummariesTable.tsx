'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import dynamic from 'next/dynamic'
import {
  Search, Filter, ChevronDown, MoreVertical, Edit, Download, Trash2,
  Calendar, Clock, FileText, Share2, Star, StarOff, Bookmark, BookmarkCheck,
  Plus, Sparkles, Users, GraduationCap, Bold, Italic, Underline, Code,
  Link, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Type,
  Image, Table, Minus, ChevronRight, Save, Undo, Redo, AlignLeft,
  AlignCenter, AlignRight, Palette, Settings, Copy, Paste, Cut,
  Calculator, BarChart as BarChartIcon, PieChart as PieChartIcon, TrendingUp, Layout, Maximize2,
  Minimize2, ZoomIn, ZoomOut, Pen, Highlighter, MessageSquare,
  Users2, Wand2, Brain, Lightbulb, Target, CheckSquare, ArrowUp,
  ArrowDown, ArrowLeft, ArrowRight, Printer, Smartphone, Monitor,
  Globe, Database, X, Eye, Smile, Hash, AtSign, DollarSign,
  Percent, Ampersand, Asterisk, RotateCcw, RotateCw, Play,
  Pause, Volume2, VolumeX, Mic, Camera, Video, FileImage,
  FileVideo, FileAudio, FilePlus, Folder, FolderOpen, Grid,
  Layers, Move, Resize, Square, Circle, Triangle, Hexagon,
  PaintBucket, Pipette, Ruler, Compass, Scissors, Paperclip,
  Tag, Flag, Bell, Zap, Shield, Lock, Unlock, Key, Mail,
  Phone, MapPin, Home, Building, Car, Plane, Ship, Train,
  Bike, Walk, Sun, Moon, Cloud, CloudRain, CloudSnow, Thermometer
} from "lucide-react"

// Dynamic imports for heavy components
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false })
const InlineMath = dynamic(() => import('react-katex').then(mod => mod.InlineMath), { ssr: false })
const BlockMath = dynamic(() => import('react-katex').then(mod => mod.BlockMath), { ssr: false })
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false })
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false })
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false })

interface Block {
  id: string
  type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'bullet' | 'numbered' | 
        'quote' | 'code' | 'latex' | 'image' | 'table' | 'chart' | 'divider' | 
        'todo' | 'toggle' | 'callout' | 'embed' | 'drawing' | 'audio' | 'video' |
        'database' | 'kanban' | 'gallery' | 'bookmark' | 'template'
  content: string
  properties?: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
    code?: boolean
    highlight?: boolean
    color?: string
    backgroundColor?: string
    align?: 'left' | 'center' | 'right' | 'justify'
    fontSize?: 'small' | 'normal' | 'large' | 'huge'
    url?: string
    checked?: boolean
    collapsed?: boolean
    icon?: string
    emoji?: string
    level?: number
    imageUrl?: string
    imageCaption?: string
    imageSize?: 'small' | 'medium' | 'large' | 'full'
    latexFormula?: string
    chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter'
    chartData?: any[]
    tableData?: {
      headers: string[]
      rows: string[][]
      columnWidths?: number[]
    }
    audioUrl?: string
    videoUrl?: string
    embedUrl?: string
    drawingData?: string
    tags?: string[]
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    dueDate?: string
    assignee?: string
    status?: string
    comments?: any[]
  }
}

interface Summary {
  id: string
  title: string
  subject: string
  date: string
  duration: string
  wordCount: number
  readTime: string
  blocks: Block[]
  tags: string[]
  isFavorite: boolean
  isBookmarked: boolean
  type: 'own' | 'shared'
  professor?: {
    name: string
    avatar: string
    university: string
  }
  thumbnailUrl?: string
}

const BLOCK_TYPES = [
  // Text & Headings
  { type: 'paragraph', icon: Type, label: 'Text', category: 'Basic' },
  { type: 'heading1', icon: Heading1, label: 'Heading 1', category: 'Basic' },
  { type: 'heading2', icon: Heading2, label: 'Heading 2', category: 'Basic' },
  { type: 'heading3', icon: Heading3, label: 'Heading 3', category: 'Basic' },
  
  // Lists & Organization
  { type: 'bullet', icon: List, label: 'Bullet List', category: 'Lists' },
  { type: 'numbered', icon: ListOrdered, label: 'Numbered List', category: 'Lists' },
  { type: 'todo', icon: CheckSquare, label: 'To-do List', category: 'Lists' },
  { type: 'toggle', icon: ChevronRight, label: 'Toggle List', category: 'Lists' },
  
  // Content Blocks
  { type: 'quote', icon: Quote, label: 'Quote', category: 'Content' },
  { type: 'callout', icon: Lightbulb, label: 'Callout', category: 'Content' },
  { type: 'code', icon: Code, label: 'Code Block', category: 'Content' },
  { type: 'latex', icon: Calculator, label: 'LaTeX Formula', category: 'Content' },
  
  // Media & Files
  { type: 'image', icon: Image, label: 'Image', category: 'Media' },
  { type: 'video', icon: Video, label: 'Video', category: 'Media' },
  { type: 'audio', icon: Volume2, label: 'Audio', category: 'Media' },
  { type: 'embed', icon: Globe, label: 'Embed', category: 'Media' },
  { type: 'gallery', icon: Grid, label: 'Gallery', category: 'Media' },
  
  // Data & Charts
  { type: 'table', icon: Table, label: 'Table', category: 'Data' },
  { type: 'chart', icon: BarChartIcon, label: 'Chart', category: 'Data' },
  { type: 'database', icon: Database, label: 'Database', category: 'Data' },
  { type: 'kanban', icon: Layers, label: 'Kanban Board', category: 'Data' },
  
  // Advanced
  { type: 'drawing', icon: Pen, label: 'Drawing', category: 'Advanced' },
  { type: 'bookmark', icon: Bookmark, label: 'Web Bookmark', category: 'Advanced' },
  { type: 'template', icon: Layout, label: 'Template', category: 'Advanced' },
  { type: 'divider', icon: Minus, label: 'Divider', category: 'Advanced' }
]

const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰'],
  'Objects': ['📚', '📖', '📝', '✏️', '🖊️', '🖍️', '📐', '📏', '📌', '📍', '🔍', '🔎', '💡', '🔬', '🧪', '⚗️'],
  'Symbols': ['✅', '❌', '⭐', '🌟', '💫', '⚡', '🔥', '💯', '🎯', '🏆', '🥇', '🎖️', '🏅', '🎗️', '🎪', '🎨'],
  'Nature': ['🌱', '🌿', '🍀', '🌳', '🌲', '🌴', '🌵', '🌷', '🌸', '🌺', '🌻', '🌹', '🥀', '🌼', '🌾', '🍄']
}

export function SummariesTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSubject, setFilterSubject] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null)
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)
  const [showBlockMenu, setShowBlockMenu] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'focus'>('edit')
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showOutline, setShowOutline] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  // Helper function to clear text selection
  const clearTextSelection = () => {
    setTimeout(() => {
      if (window.getSelection) {
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
        }
      }
    }, 0)
  }

  const mockSummaries: Summary[] = [
    {
      id: "1",
      title: "Advanced Calculus - Derivatives and Integrals",
      subject: "Mathematics",
      date: "2024-01-15",
      duration: "1h 25m",
      wordCount: 1250,
      readTime: "5 min read",
      blocks: [
        {
          id: "block-1",
          type: 'heading1',
          content: "Advanced Calculus: Derivatives and Integrals",
          properties: { bold: true, icon: '📐' }
        },
        {
          id: "block-2",
          type: 'paragraph',
          content: "This comprehensive summary covers the fundamental concepts of derivatives and integrals in advanced calculus.",
          properties: {}
        },
        {
          id: "block-3",
          type: 'latex',
          content: "The derivative of a function f(x) is defined as:",
          properties: { latexFormula: '\\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}' }
        },
        {
          id: "block-4",
          type: 'callout',
          content: "Key insight: The derivative represents the instantaneous rate of change of a function at any given point.",
          properties: { icon: '💡', backgroundColor: '#fef3c7' }
        },
        {
          id: "block-5",
          type: 'heading2',
          content: "Integration Techniques",
          properties: { bold: true }
        },
        {
          id: "block-6",
          type: 'chart',
          content: "Function behavior visualization",
          properties: {
            chartType: 'line',
            chartData: [
              { x: -2, y: 4 }, { x: -1, y: 1 }, { x: 0, y: 0 }, 
              { x: 1, y: 1 }, { x: 2, y: 4 }
            ]
          }
        }
      ],
      tags: ["Derivatives", "Integrals", "Optimization", "Calculus"],
      isFavorite: true,
      isBookmarked: false,
      type: 'own',
      thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop"
    },
    {
      id: "2",
      title: "Neural Networks & Deep Learning",
      subject: "Computer Science",
      date: "2024-01-14",
      duration: "2h 30m",
      wordCount: 2100,
      readTime: "8 min read",
      blocks: [
        {
          id: "block-8",
          type: 'heading1',
          content: "Neural Networks & Deep Learning",
          properties: { bold: true, icon: '🧠' }
        },
        {
          id: "block-9",
          type: 'paragraph',
          content: "An in-depth exploration of neural networks, from basic perceptrons to multi-layer networks.",
          properties: {}
        },
        {
          id: "block-10",
          type: 'code',
          content: "import numpy as np\n\ndef sigmoid(x):\n    return 1 / (1 + np.exp(-x))",
          properties: {}
        },
        {
          id: "block-11",
          type: 'latex',
          content: "The sigmoid activation function:",
          properties: { latexFormula: '\\sigma(x) = \\frac{1}{1 + e^{-x}}' }
        }
      ],
      tags: ["Neural Networks", "Machine Learning", "Deep Learning", "AI"],
      isFavorite: false,
      isBookmarked: true,
      type: 'shared',
      professor: {
        name: "Prof. Alexandra Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face",
        university: "MIT Computer Science"
      },
      thumbnailUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop"
    },
    {
      id: "3",
      title: "Organic Chemistry - Molecular Structures",
      subject: "Chemistry",
      date: "2024-01-13",
      duration: "1h 45m",
      wordCount: 980,
      readTime: "4 min read",
      blocks: [],
      tags: ["Organic Chemistry", "Molecular Structure", "Stereochemistry", "Bonds"],
      isFavorite: true,
      isBookmarked: true,
      type: 'own',
      thumbnailUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=225&fit=crop"
    },
    {
      id: "4",
      title: "Constitutional Law - Supreme Court Cases",
      subject: "Law",
      date: "2024-01-12",
      duration: "1h 40m",
      wordCount: 1800,
      readTime: "7 min read",
      blocks: [],
      tags: ["Constitutional Law", "Supreme Court", "Legal Precedent", "Civil Rights"],
      isFavorite: false,
      isBookmarked: false,
      type: 'shared',
      professor: {
        name: "Prof. James Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        university: "Harvard Law School"
      },
      thumbnailUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=225&fit=crop"
    },
    {
      id: "5",
      title: "Data Structures - Binary Trees",
      subject: "Computer Science",
      date: "2024-01-11",
      duration: "1h 30m",
      wordCount: 1150,
      readTime: "5 min read",
      blocks: [],
      tags: ["Data Structures", "Binary Trees", "Algorithms", "Programming"],
      isFavorite: false,
      isBookmarked: false,
      type: 'own',
      thumbnailUrl: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=400&h=225&fit=crop"
    },
    {
      id: "6",
      title: "Molecular Biology - DNA Replication",
      subject: "Biology",
      date: "2024-01-10",
      duration: "1h 20m",
      wordCount: 1350,
      readTime: "6 min read",
      blocks: [],
      tags: ["Molecular Biology", "DNA Replication", "Enzymes", "Genetics"],
      isFavorite: true,
      isBookmarked: false,
      type: 'shared',
      professor: {
        name: "Dr. Maria Gonzalez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        university: "Stanford Biology Dept"
      },
      thumbnailUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop"
    }
  ]

  const [summaries, setSummaries] = useState(mockSummaries)

  // Editor functions
  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    if (!selectedSummary) return

    const updatedSummary = {
      ...selectedSummary,
      blocks: selectedSummary.blocks.map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      )
    }

    setSelectedSummary(updatedSummary)
    setSummaries(prev => prev.map(s => s.id === updatedSummary.id ? updatedSummary : s))
    setHasChanges(true)
  }

  const addBlock = (afterBlockId: string, type: Block['type'] = 'paragraph') => {
    if (!selectedSummary) return

    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      properties: getDefaultProperties(type)
    }

    const blockIndex = selectedSummary.blocks.findIndex(b => b.id === afterBlockId)
    const updatedBlocks = [...selectedSummary.blocks]
    updatedBlocks.splice(blockIndex + 1, 0, newBlock)

    const updatedSummary = {
      ...selectedSummary,
      blocks: updatedBlocks
    }

    setSelectedSummary(updatedSummary)
    setSummaries(prev => prev.map(s => s.id === updatedSummary.id ? updatedSummary : s))
    setHasChanges(true)
    setEditingBlockId(newBlock.id)
    
    // Auto-focus the new block
    setTimeout(() => {
      const element = document.querySelector(`[data-block-id="${newBlock.id}"]`)
      if (element) {
        (element as HTMLElement).focus()
      }
    }, 50)
  }

  const deleteBlock = (blockId: string) => {
    if (!selectedSummary || selectedSummary.blocks.length <= 1) return

    const updatedSummary = {
      ...selectedSummary,
      blocks: selectedSummary.blocks.filter(block => block.id !== blockId)
    }

    setSelectedSummary(updatedSummary)
    setSummaries(prev => prev.map(s => s.id === updatedSummary.id ? updatedSummary : s))
    setHasChanges(true)
  }

  const getDefaultContent = (type: Block['type']): string => {
    switch (type) {
      case 'heading1': return 'Heading 1'
      case 'heading2': return 'Heading 2'
      case 'heading3': return 'Heading 3'
      case 'quote': return 'Quote text...'
      case 'code': return '// Your code here'
      case 'latex': return 'LaTeX formula'
      case 'todo': return 'To-do item'
      case 'callout': return 'Important note...'
      case 'divider': return ''
      default: return 'Type something...'
    }
  }

  const getDefaultProperties = (type: Block['type']) => {
    switch (type) {
      case 'latex': return { latexFormula: 'E = mc^2' }
      case 'chart': return { chartType: 'line', chartData: [] }
      case 'image': return { imageSize: 'medium' }
      case 'callout': return { icon: '💡', backgroundColor: '#fef3c7' }
      case 'todo': return { checked: false }
      case 'toggle': return { collapsed: false }
      default: return {}
    }
  }

  const handleImageUpload = (blockId: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      updateBlock(blockId, {
        properties: {
          ...selectedSummary?.blocks.find(b => b.id === blockId)?.properties,
          imageUrl: e.target?.result as string
        }
      })
    }
    reader.readAsDataURL(file)
  }

  const renderBlock = (block: Block, index: number) => {
    const isEditing = editingBlockId === block.id
    const showMenu = showBlockMenu === block.id

    const blockStyle = cn(
      "group relative min-h-[2rem] flex items-start gap-2 px-2 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
      isEditing && "bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-200 dark:ring-blue-700"
    )

    // Render different block types
    switch (block.type) {
      case 'latex':
        return (
          <div key={block.id} className={blockStyle}>
            <BlockControls block={block} onAddBlock={() => addBlock(block.id)} onShowMenu={() => setShowBlockMenu(showMenu ? null : block.id)} />
            <div className="flex-1" data-block-container={block.id}>
              {isEditing ? (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={block.content}
                    onChange={(e) => {
                      e.stopPropagation()
                      updateBlock(block.id, { content: e.target.value })
                    }}
                    placeholder="LaTeX description..."
                    className="mb-2"
                    autoFocus={editingBlockId === block.id}
                    onFocus={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Input
                    value={block.properties?.latexFormula || ''}
                    onChange={(e) => {
                      e.stopPropagation()
                      updateBlock(block.id, { 
                        properties: { ...block.properties, latexFormula: e.target.value }
                      })
                    }}
                    placeholder="Enter LaTeX formula (e.g., E = mc^2)"
                    onFocus={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingBlockId(null)
                        clearTextSelection()
                      }}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => {
                    setEditingBlockId(block.id)
                    setTimeout(() => {
                      const firstInput = document.querySelector(`[data-block-container="${block.id}"] input`)
                      if (firstInput) {
                        (firstInput as HTMLInputElement).focus()
                      }
                    }, 10)
                  }} 
                  className="cursor-pointer"
                >
                  <p className="text-sm text-gray-600 mb-2">{block.content}</p>
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg">
                    {block.properties?.latexFormula && (
                      <BlockMath math={block.properties.latexFormula} />
                    )}
                  </div>
                </div>
              )}
            </div>
            {showMenu && <BlockMenu block={block} onAddBlock={addBlock} onDeleteBlock={deleteBlock} />}
          </div>
        )

      case 'image':
        return (
          <div key={block.id} className={blockStyle}>
            <BlockControls block={block} onAddBlock={() => addBlock(block.id)} onShowMenu={() => setShowBlockMenu(showMenu ? null : block.id)} />
            <div className="flex-1">
              {block.properties?.imageUrl ? (
                <div className="space-y-2">
                  <img 
                    src={block.properties.imageUrl} 
                    alt={block.properties.imageCaption || 'Image'}
                    className={cn(
                      "rounded-lg border",
                      block.properties.imageSize === 'small' && "max-w-xs",
                      block.properties.imageSize === 'medium' && "max-w-md",
                      block.properties.imageSize === 'large' && "max-w-lg",
                      block.properties.imageSize === 'full' && "w-full"
                    )}
                  />
                  {isEditing ? (
                    <Input
                      value={block.properties.imageCaption || ''}
                      onChange={(e) => updateBlock(block.id, {
                        properties: { ...block.properties, imageCaption: e.target.value }
                      })}
                      placeholder="Image caption..."
                      onBlur={() => setEditingBlockId(null)}
                    />
                  ) : block.properties.imageCaption && (
                    <p className="text-sm text-gray-600 italic">{block.properties.imageCaption}</p>
                  )}
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">Click to upload an image</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(block.id, file)
                    }}
                  />
                </div>
              )}
            </div>
            {showMenu && <BlockMenu block={block} onAddBlock={addBlock} onDeleteBlock={deleteBlock} />}
          </div>
        )

      case 'chart':
        return (
          <div key={block.id} className={blockStyle}>
            <BlockControls block={block} onAddBlock={() => addBlock(block.id)} onShowMenu={() => setShowBlockMenu(showMenu ? null : block.id)} />
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                <p className="text-sm font-medium mb-4">{block.content}</p>
                {block.properties?.chartData && block.properties.chartData.length > 0 && (
                  <div className="h-64">
                    {block.properties.chartType === 'line' && (
                      <LineChart width={400} height={200} data={block.properties.chartData}>
                        {/* Chart components would go here */}
                      </LineChart>
                    )}
                  </div>
                )}
              </div>
            </div>
            {showMenu && <BlockMenu block={block} onAddBlock={addBlock} onDeleteBlock={deleteBlock} />}
          </div>
        )

      case 'callout':
        return (
          <div key={block.id} className={blockStyle}>
            <BlockControls block={block} onAddBlock={() => addBlock(block.id)} onShowMenu={() => setShowBlockMenu(showMenu ? null : block.id)} />
            <div className="flex-1">
              <div 
                className="border rounded-lg p-4 flex items-start gap-3 cursor-text"
                style={{ backgroundColor: block.properties?.backgroundColor || '#fef3c7' }}
                onClick={() => {
                  setEditingBlockId(block.id)
                  setTimeout(() => {
                    const element = document.querySelector(`[data-block-id="${block.id}"]`)
                    if (element) {
                      (element as HTMLElement).focus()
                    }
                  }, 10)
                }}
              >
                <span className="text-xl">{block.properties?.icon || '💡'}</span>
                <div
                  className="flex-1 outline-none"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  data-block-id={block.id}
                  onBlur={(e) => {
                    updateBlock(block.id, { content: e.target.textContent || '' })
                    setEditingBlockId(null)
                    clearTextSelection()
                  }}
                  onFocus={() => setEditingBlockId(block.id)}
                >
                  {block.content}
                </div>
              </div>
            </div>
            {showMenu && <BlockMenu block={block} onAddBlock={addBlock} onDeleteBlock={deleteBlock} />}
          </div>
        )

      case 'code':
        return (
          <div key={block.id} className={blockStyle}>
            <BlockControls block={block} onAddBlock={() => addBlock(block.id)} onShowMenu={() => setShowBlockMenu(showMenu ? null : block.id)} />
            <div className="flex-1">
              {isEditing ? (
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  onBlur={() => {
                    setEditingBlockId(null)
                    clearTextSelection()
                  }}
                  className="w-full min-h-[100px] p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-lg border-none outline-none resize-none"
                  placeholder="// Enter your code here..."
                />
              ) : (
                <pre
                  className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto cursor-pointer"
                  onClick={() => {
                    setEditingBlockId(block.id)
                    setTimeout(() => {
                      const textarea = document.querySelector(`textarea[value="${block.content}"]`)
                      if (textarea) {
                        (textarea as HTMLTextAreaElement).focus()
                      }
                    }, 10)
                  }}
                >
                  <code>{block.content}</code>
                </pre>
              )}
            </div>
            {showMenu && <BlockMenu block={block} onAddBlock={addBlock} onDeleteBlock={deleteBlock} />}
          </div>
        )

      case 'todo':
        return (
          <div key={block.id} className={blockStyle}>
            <BlockControls block={block} onAddBlock={() => addBlock(block.id)} onShowMenu={() => setShowBlockMenu(showMenu ? null : block.id)} />
            <div 
              className="flex items-start gap-2 flex-1 cursor-text"
              onClick={() => {
                setEditingBlockId(block.id)
                setTimeout(() => {
                  const element = document.querySelector(`[data-block-id="${block.id}"]`)
                  if (element) {
                    (element as HTMLElement).focus()
                  }
                }, 10)
              }}
            >
              <input
                type="checkbox"
                checked={block.properties?.checked || false}
                onChange={(e) => updateBlock(block.id, { 
                  properties: { ...block.properties, checked: e.target.checked }
                })}
                className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
              <div
                className={cn(
                  "flex-1 outline-none",
                  block.properties?.checked && "line-through text-gray-500"
                )}
                contentEditable={true}
                suppressContentEditableWarning={true}
                data-block-id={block.id}
                onBlur={(e) => {
                  updateBlock(block.id, { content: e.target.textContent || '' })
                  setEditingBlockId(null)
                  clearTextSelection()
                }}
                onFocus={() => setEditingBlockId(block.id)}
              >
                {block.content || 'To-do item'}
              </div>
            </div>
            {showMenu && <BlockMenu block={block} onAddBlock={addBlock} onDeleteBlock={deleteBlock} />}
          </div>
        )

      case 'quote':
        return (
          <div key={block.id} className={blockStyle}>
            <BlockControls block={block} onAddBlock={() => addBlock(block.id)} onShowMenu={() => setShowBlockMenu(showMenu ? null : block.id)} />
            <div className="flex-1">
              <blockquote 
                className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/30 py-2 rounded-r cursor-text"
                onClick={() => {
                  setEditingBlockId(block.id)
                  setTimeout(() => {
                    const element = document.querySelector(`[data-block-id="${block.id}"]`)
                    if (element) {
                      (element as HTMLElement).focus()
                    }
                  }, 10)
                }}
              >
                <div
                  className="outline-none"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  data-block-id={block.id}
                  onBlur={(e) => {
                    updateBlock(block.id, { content: e.target.textContent || '' })
                    setEditingBlockId(null)
                    clearTextSelection()
                  }}
                  onFocus={() => setEditingBlockId(block.id)}
                >
                  {block.content}
                </div>
              </blockquote>
            </div>
            {showMenu && <BlockMenu block={block} onAddBlock={addBlock} onDeleteBlock={deleteBlock} />}
          </div>
        )

      case 'divider':
        return (
          <div key={block.id} className={blockStyle}>
            <BlockControls block={block} onAddBlock={() => addBlock(block.id)} onShowMenu={() => setShowBlockMenu(showMenu ? null : block.id)} />
            <div className="flex-1">
              <hr className="w-full h-px bg-gray-300 dark:bg-gray-600 my-4 border-none" />
            </div>
            {showMenu && <BlockMenu block={block} onAddBlock={addBlock} onDeleteBlock={deleteBlock} />}
          </div>
        )

      case 'heading1':
      case 'heading2':
      case 'heading3':
        const HeadingTag = block.type === 'heading1' ? 'h1' : block.type === 'heading2' ? 'h2' : 'h3'
        const headingClasses = {
          'heading1': 'text-3xl font-bold',
          'heading2': 'text-2xl font-semibold', 
          'heading3': 'text-xl font-medium'
        }
        
        return (
          <div key={block.id} className={blockStyle}>
            <BlockControls block={block} onAddBlock={() => addBlock(block.id)} onShowMenu={() => setShowBlockMenu(showMenu ? null : block.id)} />
            <div 
              className="flex-1 flex items-center gap-2 cursor-text"
              onClick={() => {
                setEditingBlockId(block.id)
                setTimeout(() => {
                  const element = document.querySelector(`[data-block-id="${block.id}"]`)
                  if (element) {
                    (element as HTMLElement).focus()
                  }
                }, 10)
              }}
            >
              {block.properties?.icon && (
                <span className="text-xl">{block.properties.icon}</span>
              )}
              <HeadingTag
                className={cn("outline-none flex-1", headingClasses[block.type])}
                contentEditable={true}
                suppressContentEditableWarning={true}
                data-block-id={block.id}
                onBlur={(e) => {
                  updateBlock(block.id, { content: e.target.textContent || '' })
                  setEditingBlockId(null)
                  clearTextSelection()
                }}
                onFocus={() => setEditingBlockId(block.id)}
              >
                {block.content}
              </HeadingTag>
            </div>
            {showMenu && <BlockMenu block={block} onAddBlock={addBlock} onDeleteBlock={deleteBlock} />}
          </div>
        )

      // Default paragraph and other text blocks
      default:
        return (
          <div key={block.id} className={blockStyle}>
            <BlockControls block={block} onAddBlock={() => addBlock(block.id)} onShowMenu={() => setShowBlockMenu(showMenu ? null : block.id)} />
            <div
              className="flex-1 outline-none resize-none min-h-[1.5rem] bg-transparent cursor-text"
              contentEditable={true}
              suppressContentEditableWarning={true}
              data-block-id={block.id}
              onBlur={(e) => {
                updateBlock(block.id, { content: e.target.textContent || '' })
                setEditingBlockId(null)
                clearTextSelection()
              }}
              onFocus={() => setEditingBlockId(block.id)}
              onClick={() => {
                setEditingBlockId(block.id)
                setTimeout(() => {
                  const element = document.querySelector(`[data-block-id="${block.id}"]`)
                  if (element) {
                    (element as HTMLElement).focus()
                  }
                }, 10)
              }}
            >
              {block.content}
            </div>
            {showMenu && <BlockMenu block={block} onAddBlock={addBlock} onDeleteBlock={deleteBlock} />}
          </div>
        )
    }
  }

  // Calculate word count and reading time
  useEffect(() => {
    if (selectedSummary) {
      const totalWords = selectedSummary.blocks.reduce((count, block) => {
        return count + (block.content?.split(' ').filter(word => word.length > 0).length || 0)
      }, 0)
      setWordCount(totalWords)
      setReadingTime(Math.max(1, Math.ceil(totalWords / 200))) // 200 words per minute
    }
  }, [selectedSummary])

  // Fix text selection bug - clear selection when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
        // Only clear selection if we're not in an input or textarea
        const target = event.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          if (window.getSelection) {
            const selection = window.getSelection()
            if (selection && selection.rangeCount > 0) {
              selection.removeAllRanges()
            }
          }
        }
      }
    }

    const handleSelectionChange = () => {
      // Don't interfere with input/textarea elements
      const activeElement = document.activeElement
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
        return
      }
      
      // Clear selection if no element is focused or if it's a contenteditable div
      if (activeElement?.tagName !== 'DIV' || !activeElement?.hasAttribute('contenteditable')) {
        if (window.getSelection) {
          const selection = window.getSelection()
          if (selection && selection.rangeCount > 0 && selection.toString() === '') {
            selection.removeAllRanges()
          }
        }
      }
    }

    if (selectedSummary) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('selectionchange', handleSelectionChange)
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('selectionchange', handleSelectionChange)
      }
    }
  }, [selectedSummary])

  const filteredSummaries = summaries.filter(summary => {
    const matchesSearch = summary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         summary.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         summary.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSubject = filterSubject === "all" || summary.subject === filterSubject
    const matchesType = filterType === "all" || summary.type === filterType
    return matchesSearch && matchesSubject && matchesType
  })

  const subjects = [...new Set(summaries.map(s => s.subject))]

  const toggleFavorite = (id: string) => {
    setSummaries(prev => prev.map(s => 
      s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
    ))
  }

  const toggleBookmark = (id: string) => {
    setSummaries(prev => prev.map(s => 
      s.id === id ? { ...s, isBookmarked: !s.isBookmarked } : s
    ))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (selectedSummary) {
    return (
      <div className="h-full flex flex-col">
        {/* Advanced Editor Header */}
        <div className="border-b bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSummary(null)}
                className="gap-2"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedSummary.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(selectedSummary.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {wordCount} words
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {readingTime} min read
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Button
                  variant={viewMode === 'edit' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 px-3"
                  onClick={() => setViewMode('edit')}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant={viewMode === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 px-3"
                  onClick={() => setViewMode('preview')}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Toolbar */}
          {viewMode === 'edit' && (
            <div className="flex items-center gap-1 p-2 border-t bg-gray-50 dark:bg-gray-800/50 overflow-x-auto">
              {/* Text Formatting */}
              <div className="flex items-center gap-1 mr-2">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Underline className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Code className="h-4 w-4" />
                </Button>
              </div>

              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

              {/* Insert Elements */}
              <div className="flex items-center gap-1 mx-2">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Calculator className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Table className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                                          <BarChartIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Video className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1" />

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[60px] text-center">{zoomLevel}%</span>
                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-auto">
          <div 
            ref={editorRef}
            className="mx-auto p-8 max-w-4xl"
            style={{ zoom: `${zoomLevel}%` }}
          >
            {/* Document Title */}
            <div className="mb-8">
              <input
                type="text"
                value={selectedSummary.title}
                onChange={(e) => {
                  const updatedSummary = { ...selectedSummary, title: e.target.value }
                  setSelectedSummary(updatedSummary)
                  setSummaries(prev => prev.map(s => s.id === updatedSummary.id ? updatedSummary : s))
                  setHasChanges(true)
                }}
                className="w-full text-4xl font-bold bg-transparent border-none outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Document Title"
                onClick={(e) => (e.target as HTMLInputElement).focus()}
              />
            </div>

            {/* Content Blocks */}
            <div className="space-y-2">
              {selectedSummary.blocks.map((block, index) => (
                <div key={block.id}>
                  {renderBlock(block, index)}
                </div>
              ))}
              
              {/* Add block at the end */}
              <div className="group flex items-center gap-2 px-2 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    const lastBlock = selectedSummary.blocks[selectedSummary.blocks.length - 1]
                    addBlock(lastBlock.id)
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-gray-400 text-sm opacity-0 group-hover:opacity-100">
                  Click to add a block
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Summaries</h1>
          <p className="text-muted-foreground">
            AI-generated summaries of your class sessions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2">
            <Sparkles className="w-4 h-4" />
            Generate Summary
          </Button>
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Manual
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search summaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                Subject: {filterSubject === "all" ? "All" : filterSubject}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterSubject("all")}>
                All Subjects
              </DropdownMenuItem>
              {subjects.map((subject) => (
                <DropdownMenuItem key={subject} onClick={() => setFilterSubject(subject)}>
                  {subject}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Type: {filterType === "all" ? "All" : filterType === "own" ? "My Summaries" : "Shared"}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType("all")}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("own")}>
                My Summaries
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("shared")}>
                Shared Summaries
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSummaries.map((summary) => (
          <Card key={summary.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedSummary(summary)}>
            <div className="relative">
              {summary.thumbnailUrl && (
                <img
                  src={summary.thumbnailUrl}
                  alt={summary.title}
                  className="w-full h-32 object-cover"
                />
              )}
              <div className="absolute top-2 left-2">
                <Badge className="text-xs bg-white/90 text-gray-700">
                  {summary.subject}
                </Badge>
              </div>
              {summary.type === 'shared' && (
                <div className="absolute top-2 right-2">
                  <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                    <Share2 className="w-3 h-3 mr-1" />
                    Shared
                  </Badge>
                </div>
              )}
              <div className="absolute bottom-2 right-2 flex gap-1">
                {summary.isFavorite && (
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-current" />
                  </div>
                )}
                {summary.isBookmarked && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bookmark className="w-3 h-3 text-white fill-current" />
                  </div>
                )}
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-base line-clamp-2">{summary.title}</CardTitle>
              {summary.type === 'shared' && summary.professor && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="w-4 h-4">
                    <AvatarImage src={summary.professor.avatar} alt={summary.professor.name} />
                    <AvatarFallback className="text-xs">
                      {summary.professor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{summary.professor.name}</span>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(summary.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {summary.readTime}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {summary.blocks.map(block => block.content).join(' ')}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {summary.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {summary.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{summary.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">{summary.wordCount} words</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(summary.id)
                      }}
                      className="h-6 w-6 p-0"
                    >
                      {summary.isFavorite ? (
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      ) : (
                        <StarOff className="w-3 h-3 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleBookmark(summary.id)
                      }}
                      className="h-6 w-6 p-0"
                    >
                      {summary.isBookmarked ? (
                        <BookmarkCheck className="w-3 h-3 text-blue-500 fill-current" />
                      ) : (
                        <Bookmark className="w-3 h-3 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSummaries.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No summaries found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || filterSubject !== "all" || filterType !== "all"
              ? "Try adjusting your search or filters"
              : "Start by generating summaries from your class recordings"
            }
          </p>
          <Button className="gap-2">
            <Sparkles className="w-4 h-4" />
            Generate Your First Summary
          </Button>
        </div>
      )}
    </div>
  )
}

// Helper Components
const BlockControls = ({ block, onAddBlock, onShowMenu }: any) => (
  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
      onClick={onAddBlock}
    >
      <Plus className="h-3 w-3" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
      onClick={onShowMenu}
    >
      <MoreVertical className="h-3 w-3" />
    </Button>
  </div>
)

const BlockMenu = ({ block, onAddBlock, onDeleteBlock }: any) => (
  <div className="absolute left-8 top-8 z-50 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-2 min-w-[300px] max-h-96 overflow-y-auto">
    <div className="mb-2">
      <Input placeholder="Search blocks..." className="h-8 text-sm" autoFocus />
    </div>
    
    {['Basic', 'Lists', 'Content', 'Media', 'Data', 'Advanced'].map(category => {
      const categoryBlocks = BLOCK_TYPES.filter(blockType => blockType.category === category)
      if (categoryBlocks.length === 0) return null
      
      return (
        <div key={category} className="mb-3">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 px-2">
            {category}
          </div>
          <div className="space-y-1">
            {categoryBlocks.map(({ type, icon: IconComponent, label }) => (
              <Button
                key={type}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 h-9 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
                onClick={() => {
                  onAddBlock(block.id, type)
                }}
              >
                <IconComponent className="h-4 w-4" />
                <span>{label}</span>
              </Button>
            ))}
          </div>
        </div>
      )
    })}
    
    <div className="border-t pt-2 mt-2">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        onClick={() => onDeleteBlock(block.id)}
      >
        <Trash2 className="h-4 w-4" />
        Delete Block
      </Button>
    </div>
  </div>
) 