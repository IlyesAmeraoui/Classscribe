"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Download,
  Play,
  Pause,
  MoreVertical,
  Calendar,
  Clock,
  FileText,
  Layers,
  BookOpen,
  Eye,
  Edit,
  Trash2,
  Upload,
  Plus,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Loader2,
  Users,
  Share2,
  Crown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ClassRecording {
  id: string
  title: string
  subject: string
  date: string
  duration: string
  status: 'processing' | 'ready' | 'failed' | 'uploading'
  size: string
  transcript: boolean
  summary: boolean
  flashcards: number
  audioUrl?: string
  thumbnailUrl?: string
  type: 'own' | 'shared'
  professor?: {
    name: string
    avatar: string
    university: string
  }
}

export function ClassTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)

  const mockClasses: ClassRecording[] = [
    {
      id: "1",
      title: "Advanced Calculus - Derivatives and Integrals",
      subject: "Mathematics",
      date: "2024-01-15",
      duration: "1h 25m",
      status: "ready",
      size: "145 MB",
      transcript: true,
      summary: true,
      flashcards: 23,
      thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop",
      type: 'own',
      professor: {
        name: "Dr. John Doe",
        avatar: "https://via.placeholder.com/50",
        university: "University of Mathematics"
      }
    },
    {
      id: "2",
      title: "Quantum Mechanics - Wave Functions",
      subject: "Physics",
      date: "2024-01-14",
      duration: "2h 10m",
      status: "processing",
      size: "267 MB",
      transcript: false,
      summary: false,
      flashcards: 0,
      thumbnailUrl: "https://images.unsplash.com/photo-1636953056323-9c09fdd74fa6?w=400&h=225&fit=crop",
      type: 'own',
      professor: {
        name: "Dr. Jane Smith",
        avatar: "https://via.placeholder.com/50",
        university: "University of Physics"
      }
    },
    {
      id: "3",
      title: "Organic Chemistry - Molecular Structures",
      subject: "Chemistry",
      date: "2024-01-13",
      duration: "1h 45m",
      status: "ready",
      size: "198 MB",
      transcript: true,
      summary: true,
      flashcards: 31,
      thumbnailUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=225&fit=crop",
      type: 'own',
      professor: {
        name: "Dr. Emily Johnson",
        avatar: "https://via.placeholder.com/50",
        university: "University of Chemistry"
      }
    },
    {
      id: "4",
      title: "Data Structures - Binary Trees",
      subject: "Computer Science",
      date: "2024-01-12",
      duration: "1h 30m",
      status: "ready",
      size: "156 MB",
      transcript: true,
      summary: true,
      flashcards: 18,
      thumbnailUrl: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=400&h=225&fit=crop",
      type: 'own',
      professor: {
        name: "Dr. Michael Brown",
        avatar: "https://via.placeholder.com/50",
        university: "University of Computer Science"
      }
    },
    {
      id: "5",
      title: "Linear Algebra - Matrix Operations",
      subject: "Mathematics",
      date: "2024-01-11",
      duration: "1h 15m",
      status: "uploading",
      size: "134 MB",
      transcript: false,
      summary: false,
      flashcards: 0,
      thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=225&fit=crop",
      type: 'own',
      professor: {
        name: "Dr. Sarah Wilson",
        avatar: "https://via.placeholder.com/50",
        university: "University of Mathematics"
      }
    },
    {
      id: "6",
      title: "Thermodynamics - Heat Transfer",
      subject: "Physics",
      date: "2024-01-10",
      duration: "1h 55m",
      status: "failed",
      size: "221 MB",
      transcript: false,
      summary: false,
      flashcards: 0,
      thumbnailUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=225&fit=crop",
      type: 'own',
      professor: {
        name: "Dr. Robert Davis",
        avatar: "https://via.placeholder.com/50",
        university: "University of Physics"
      }
    },
    // Clases compartidas por profesores
    {
      id: "7",
      title: "Machine Learning Fundamentals - Neural Networks",
      subject: "Computer Science",
      date: "2024-01-09",
      duration: "2h 30m",
      status: "ready",
      size: "312 MB",
      transcript: true,
      summary: true,
      flashcards: 45,
      thumbnailUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop",
      type: 'shared',
      professor: {
        name: "Prof. Alexandra Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face",
        university: "MIT Computer Science"
      }
    },
    {
      id: "8",
      title: "Constitutional Law - Supreme Court Cases",
      subject: "Law",
      date: "2024-01-08",
      duration: "1h 40m",
      status: "ready",
      size: "187 MB",
      transcript: true,
      summary: true,
      flashcards: 28,
      thumbnailUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=225&fit=crop",
      type: 'shared',
      professor: {
        name: "Prof. James Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        university: "Harvard Law School"
      }
    },
    {
      id: "9",
      title: "Molecular Biology - DNA Replication",
      subject: "Biology",
      date: "2024-01-07",
      duration: "1h 20m",
      status: "ready",
      size: "165 MB",
      transcript: true,
      summary: true,
      flashcards: 22,
      thumbnailUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop",
      type: 'shared',
      professor: {
        name: "Dr. Maria Gonzalez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        university: "Stanford Biology Dept"
      }
    },
    {
      id: "10",
      title: "Advanced Statistics - Hypothesis Testing",
      subject: "Mathematics",
      date: "2024-01-06",
      duration: "2h 15m",
      status: "processing",
      size: "289 MB",
      transcript: false,
      summary: false,
      flashcards: 0,
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
      type: 'shared',
      professor: {
        name: "Prof. David Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        university: "UC Berkeley Statistics"
      }
    }
  ]

  const filteredClasses = mockClasses.filter(classItem => {
    const matchesSearch = classItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || classItem.status === filterStatus
    const matchesType = filterType === "all" || classItem.type === filterType
    return matchesSearch && matchesFilter && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'uploading':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-3 h-3" />
      case 'processing':
      case 'uploading':
        return <Loader2 className="w-3 h-3 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-3 h-3" />
      default:
        return null
    }
  }

  const handlePlayPause = (classId: string) => {
    if (currentlyPlaying === classId) {
      setCurrentlyPlaying(null)
    } else {
      setCurrentlyPlaying(classId)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Classes</h1>
          <p className="text-muted-foreground">
            Manage and review your recorded class sessions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Recording
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Start Recording
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                Type: {filterType === "all" ? "All" : filterType === "own" ? "My Classes" : "Shared"}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType("all")}>
                All Classes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("own")}>
                My Classes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("shared")}>
                Shared Classes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Status: {filterStatus === "all" ? "All" : filterStatus}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("ready")}>
                Ready
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("processing")}>
                Processing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("uploading")}>
                Uploading
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("failed")}>
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClasses.map((classItem) => (
          <Card key={classItem.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
            <div className="relative">
              <img
                src={classItem.thumbnailUrl}
                alt={classItem.title}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  className="gap-2"
                  onClick={() => handlePlayPause(classItem.id)}
                  disabled={classItem.status !== 'ready'}
                >
                  {currentlyPlaying === classItem.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {currentlyPlaying === classItem.id ? 'Pause' : 'Play'}
                </Button>
              </div>
              <div className="absolute top-2 left-2">
                <Badge className={cn("text-xs", getStatusColor(classItem.status))}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(classItem.status)}
                    {classItem.status}
                  </span>
                </Badge>
              </div>
              {/* Shared class indicator */}
              {classItem.type === 'shared' && (
                <div className="absolute top-2 left-2 translate-y-8">
                  <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                    <Share2 className="w-3 h-3 mr-1" />
                    Shared
                  </Badge>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-base line-clamp-2">{classItem.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{classItem.subject}</p>
            </CardHeader>
            
            <CardContent className="pt-0 flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                {/* Professor info for shared classes */}
                {classItem.type === 'shared' && classItem.professor && (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={classItem.professor.avatar} alt={classItem.professor.name} />
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                        {classItem.professor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <Share2 className="w-3 h-3 text-blue-600" />
                        <p className="text-xs font-medium text-blue-700 truncate">
                          {classItem.professor.name}
                        </p>
                      </div>
                      <p className="text-xs text-blue-600 truncate">
                        {classItem.professor.university}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(classItem.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {classItem.duration}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-xs text-muted-foreground">Size: {classItem.size}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      {classItem.transcript ? 'Transcript' : 'Processing...'}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {classItem.summary ? 'Notes' : 'Generating...'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* All buttons at the same level - Always at bottom */}
              <div className="grid grid-cols-3 gap-2 mt-auto pt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-8"
                  disabled={!classItem.summary}
                >
                  Summary
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-8"
                  disabled={classItem.flashcards === 0}
                >
                  Cards
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs h-8 gap-1"
                  onClick={() => handlePlayPause(classItem.id)}
                  disabled={classItem.status !== 'ready'}
                >
                  {currentlyPlaying === classItem.id ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                  {currentlyPlaying === classItem.id ? 'Pause' : 'Play'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No classes found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || filterStatus !== "all" 
              ? "Try adjusting your search or filters"
              : "Start by uploading or recording your first class"
            }
          </p>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Class
          </Button>
        </div>
      )}
    </div>
  )
} 