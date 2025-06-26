"use client"

import * as React from "react"
import { ProfileView } from "@/components/profile-view"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Edit, MapPin, Globe, ArrowLeft, X, HelpCircle, Palette, Languages, Laptop, Eye, Shield, CheckCircle, AlertTriangle, Bell, ChevronDown, Users, Lock, Calendar, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Smartphone,
  Moon,
  Mail,
  Phone,
  Settings
} from "lucide-react"

interface ProfilePageProps {
  params: {
    username: string
  }
}

interface Author {
  name: string
  username: string
  avatarUrl: string
}

interface Post {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  author: Author
  likes: number
  replies: number
}

interface Media {
  id: number
  type: string
  url: string
  caption: string
  likes: number
  date: string
}

interface Reply {
  id: number
  originalPost: {
    author: string
    username: string
    content: string
    date: string
  }
  reply: string
  date: string
}

interface Like {
  id: number
  type: string
  author: {
    name: string
    username: string
    avatarUrl: string
  }
  content?: string
  mediaUrl?: string
  caption?: string
  likes: number
  date: string
}

const mockPosts: Post[] = [
  {
    id: 1,
    title: "Learning Journey",
    excerpt: "Started a new chapter in my coding journey!",
    content: "Today marks the beginning of an exciting journey into the world of web development. Can't wait to share my progress!",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    date: "2024-06-01",
    author: {
      name: "Ilyes Ameraoui",
      username: "ilyesam",
      avatarUrl: "/placeholder.svg"
    },
    likes: 42,
    replies: 12
  },
  {
    id: 2,
    title: "Project Update",
    excerpt: "Making progress on my latest project",
    content: "Just implemented a new feature in my project. The learning curve has been steep but rewarding!",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    date: "2024-05-30",
    author: {
      name: "Ilyes Ameraoui",
      username: "ilyesam",
      avatarUrl: "/placeholder.svg"
    },
    likes: 38,
    replies: 8
  },
  {
    id: 3,
    title: "Tips for studying for finals",
    excerpt: "How I organize my study sessions for maximum retention.",
    content: "Studying for finals can be tough. Here are my best tips for staying organized and focused.",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80",
    date: "2024-05-20",
    author: {
      name: "Ilyes Ameraoui",
      username: "ilyesam",
      avatarUrl: "/placeholder.svg"
    },
    likes: 27,
    replies: 5
  }
]

// Mock data for replies, media and likes
const mockReplies = [
  {
    id: 1,
    originalPost: {
      author: "Sarah Chen",
      username: "sarahchen",
      content: "What's your favorite note-taking strategy?",
      date: "2024-05-28"
    },
    reply: "I use the Cornell method combined with mind mapping. It helps me connect ideas better!",
    likes: 12,
    date: "2024-05-29"
  },
  {
    id: 2,
    originalPost: {
      author: "Mark Johnson",
      username: "markj",
      content: "Best apps for student productivity?",
      date: "2024-05-25"
    },
    reply: "Scribe has been a game-changer for me. The AI suggestions really help organize my notes.",
    likes: 8,
    date: "2024-05-26"
  }
]

const mockMedia = [
  {
    id: 1,
    type: "image",
    url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=400&q=80",
    caption: "Study session setup 📚✨",
    likes: 45,
    date: "2024-06-01"
  },
  {
    id: 2,
    type: "image",
    url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
    caption: "Morning coffee and planning ☕️",
    likes: 32,
    date: "2024-05-30"
  },
  {
    id: 3,
    type: "image",
    url: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80",
    caption: "Library vibes 📖",
    likes: 28,
    date: "2024-05-28"
  }
]

const mockLikes = [
  {
    id: 1,
    type: "post",
    author: {
      name: "Elena Martinez",
      username: "elenam",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
    },
    content: "Just published my guide on effective digital note-taking! Check it out 📝",
    likes: 156,
    date: "2024-06-01"
  },
  {
    id: 2,
    type: "media",
    author: {
      name: "David Kim",
      username: "davidk",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
    },
    mediaUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=400&q=80",
    caption: "My study corner got an upgrade! 🎨",
    likes: 89,
    date: "2024-05-30"
  }
]

function PostCard({ post, onClick }: { post: typeof mockPosts[0], onClick: () => void }) {
  return (
    <button onClick={onClick} className="group bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col hover:scale-[1.02] hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400">
      <div className="relative h-48 w-full overflow-hidden">
        <img src={post.image} alt={post.title} className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">{post.date}</span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 flex-1 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Read more
          </span>
        </div>
      </div>
    </button>
  )
}

function PostModal({ post, onClose }: { post: typeof mockPosts[0], onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 relative overflow-hidden animate-fadeInUp" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors focus:outline-none z-10"
        >
          &times;
        </button>
        <img src={post.image} alt={post.title} className="w-full h-64 object-cover" />
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{post.title}</h2>
            <span className="text-sm px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{post.date}</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{post.content}</p>
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-4">
            <button className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Share</button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Read full post</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReplyCard({ reply }: { reply: typeof mockReplies[0] }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-4 hover:shadow-lg transition-shadow duration-300">
      {/* Original post reference */}
      <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white">{reply.originalPost.author}</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">@{reply.originalPost.username}</span>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">{reply.originalPost.date}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{reply.originalPost.content}</p>
      </div>
      
      {/* Reply content */}
      <p className="text-gray-800 dark:text-gray-200 mb-3">{reply.reply}</p>
      
      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {reply.likes}
          </button>
          <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
        <span className="text-gray-400 dark:text-gray-500">{reply.date}</span>
      </div>
    </div>
  )
}

function MediaCard({ media }: { media: typeof mockMedia[0] }) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300">
      <div className="aspect-square overflow-hidden">
        <img 
          src={media.url} 
          alt={media.caption} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="mb-2 text-sm font-medium">{media.caption}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {media.likes}
            </button>
            <button className="hover:text-blue-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
          <span className="text-sm">{media.date}</span>
        </div>
      </div>
    </div>
  )
}

function LikeCard({ like }: { like: typeof mockLikes[0] }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start gap-3 mb-3">
        <img 
          src={like.author.avatarUrl} 
          alt={like.author.name} 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white">{like.author.name}</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">@{like.author.username}</span>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">{like.date}</span>
        </div>
      </div>

      {like.type === 'media' ? (
        <div className="relative rounded-lg overflow-hidden mb-3">
          <img 
            src={like.mediaUrl} 
            alt={like.caption} 
            className="w-full h-48 object-cover"
          />
          <p className="mt-2 text-gray-800 dark:text-gray-200 text-sm">{like.caption}</p>
        </div>
      ) : (
        <p className="text-gray-800 dark:text-gray-200 mb-3">{like.content}</p>
      )}

      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {like.likes}
        </button>
        <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [selectedPost, setSelectedPost] = React.useState<typeof mockPosts[0] | null>(null)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("overview")
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedTheme, setSelectedTheme] = React.useState('system')

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const user = {
    name: "Ilyes Ameraoui",
    username: params.username,
    role: "Computer Science Student",
    avatarUrl: "/placeholder.svg",
    bannerUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80",
    bio: "Passionate about learning and technology. Building the future of education.",
    location: "Madrid, Spain",
    website: "https://ilyes.dev",
    twitter: "ilyesam",
    instagram: "ilyes.ig",
    followers: 245,
    following: 180,
    posts: mockPosts.length,
    isCurrentUser: true
  }

  return (
    <div className="min-h-screen pb-8 relative overflow-x-hidden">
      {/* Background Pattern & Glow Effects */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-gray-900/5 dark:bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        {/* Glow Top */}
        <div className="absolute inset-x-0 -top-40 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-1/2 -translate-x-1/2 aspect-[1155/678] w-[36.125rem] rotate-[30deg] bg-gradient-to-tr from-blue-500 to-purple-500 opacity-20 sm:w-[72.1875rem]" />
        </div>
        {/* Glow Bottom */}
        <div className="absolute inset-x-0 bottom-0 transform-gpu overflow-hidden blur-3xl">
          <div className="relative left-1/2 -translate-x-1/2 aspect-[1155/678] w-[36.125rem] bg-gradient-to-tr from-purple-500 to-blue-500 opacity-20 sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Floating Back to Dashboard Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
        </Link>
      </div>

      {/* Banner Section */}
      <div className="relative h-64 w-full overflow-hidden z-10">
        <img 
          src={user.bannerUrl} 
          alt="Profile Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
        {/* Profile Header */}
        <Card className="mb-8 overflow-visible shadow-xl border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
          <CardContent className="flex flex-col md:flex-row items-center md:items-start gap-6 pt-8 pb-8">
            <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-lg">
              <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl font-semibold">IA</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <CheckCircle className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{user.username}</p>
              <Badge className="bg-purple-100 text-purple-700 mb-4">{user.role}</Badge>
              
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mb-4">{user.bio}</p>
              
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Globe className="w-4 h-4" />
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">
                    {user.website.replace('https://', '')}
                  </a>
                </div>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Edit className="w-4 h-4" /> Edit Profile
                </Button>
              </div>
            </div>

            <div className="flex gap-6 items-center md:self-start">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.followers}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.following}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.posts}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Details */}
              <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Personal Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-blue-500" />
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Nombre</label>
                        <p className="text-gray-900 dark:text-white font-medium">Ilyes Ameraoui</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Correo electrónico</label>
                        <p className="text-gray-900 dark:text-white font-medium">il.ameraoui@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Ubicación actual</label>
                        <p className="text-gray-900 dark:text-white font-medium">Badalona, ES-B, ES-CT, Spain</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="justify-start hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <Mail className="w-4 h-4 mr-2" />
                      Update Email
                    </Button>
                    <Button variant="outline" className="justify-start hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <Phone className="w-4 h-4 mr-2" />
                      Update Phone
                    </Button>
                    <Button variant="outline" className="justify-start hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <Eye className="w-4 h-4 mr-2" />
                      Privacy Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Stats */}
              <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center transform hover:scale-105 transition-transform">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">127</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total Logins</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center transform hover:scale-105 transition-transform">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">45</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Updates</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center transform hover:scale-105 transition-transform">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">3</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Devices</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 text-center transform hover:scale-105 transition-transform">
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">98%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Security</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Overview */}
              <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Security Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">Password</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Strong</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">2FA</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Not enabled</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">Active Sessions</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">3 devices</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">View All</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Account Security */}
              <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span>Account Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Lock className="w-4 h-4 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Password</label>
                        <p className="text-gray-900 dark:text-white font-medium">Change your password to access your account.</p>
                        <Button size="sm" variant="outline" className="mt-2">Change password</Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Two-factor authentication</label>
                        <p className="text-gray-900 dark:text-white font-medium">Add an extra layer of security to your account during login.</p>
                        <Button size="sm" variant="outline" className="mt-2">Set up 2FA</Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Smartphone className="w-4 h-4 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Passkeys</label>
                        <p className="text-gray-900 dark:text-white font-medium">Log in securely with biometric authentication on your device.</p>
                        <Button size="sm" variant="outline" className="mt-2">Manage Passkeys</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5" />
                    <span>Active Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">Windows PC</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Chrome • Madrid, Spain</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Current</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">iPhone 13</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Safari • Madrid, Spain</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Sign out</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">MacBook Pro</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Safari • Madrid, Spain</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Sign out</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Activity Timeline */}
              <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Activity Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">Password changed</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">30 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">Email updated</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">45 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">New device login</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">60 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Events */}
              <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Security Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">Failed login attempt</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">From unknown location</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">Security check completed</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">All systems secure</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">5 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 