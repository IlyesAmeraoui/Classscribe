import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  GraduationCap,
  Bookmark,
  Settings,
  FileQuestion,
  LogOut,
  User,
  Bell,
  ChevronDown,
  Home,
  BookText,
  Lightbulb,
  Layers,
  Sparkles,
  BookOpenCheck,
  BookMarked,
  BookOpenText,
  BookOpenIcon,
  BookOpenCheckIcon,
  BookMarkedIcon,
  BookOpenTextIcon,
  Clock,
  HelpCircle,
  Loader2,
  Download,
  UserPlus,
  Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SettingsDialog } from "@/components/settings-dialog"
import { ProfileDialog } from "@/components/profile-dialog"

interface NavItemProps {
  icon: React.ElementType
  label: string
  href: string
  isActive?: boolean
  badge?: string
  description?: string
  badgeDropdown?: React.ReactNode
}

interface AppSidebarProps {
  activeSection: string
  onSectionChange: (section: string, params?: Record<string, any>) => void
  onProfileClick: () => void
}

function NavItem({ icon: Icon, label, href, isActive, badge, description, badgeDropdown, onClick }: NavItemProps & { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors w-full text-left",
        isActive
          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
          : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
      )}
    >
      <Icon className="h-5 w-5" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{label}</span>
          {badge && !badgeDropdown && (
            <Badge variant="secondary" className="ml-2 bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              {badge}
            </Badge>
          )}
          {badge && badgeDropdown && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Badge 
                  variant="secondary" 
                  className="ml-2 bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 cursor-pointer hover:bg-blue-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {badge}
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                {badgeDropdown}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
    </button>
  )
}

const mainNavigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and quick access"
  },
  {
    label: "My Classes",
    href: "/classes",
    icon: BookOpen,
    badge: "3 New",
    description: "Manage your recorded classes"
  },
  {
    label: "Summaries",
    href: "/summaries",
    icon: BookText,
    description: "AI-generated class notes"
  },
  {
    label: "Flashcards",
    href: "/flashcards",
    icon: Layers,
    badge: "12 Due",
    description: "Review with spaced repetition"
  }
]

const quickActions = [
  {
    label: "Record Class",
    href: "/record",
    icon: BookOpenIcon,
    description: "Start a new recording"
  },
  {
    label: "Upload Recording",
    href: "/upload",
    icon: BookOpenCheckIcon,
    description: "Import existing audio"
  }
]

const toolsNavigation = [
  {
    label: "Study Analytics",
    href: "/analytics",
    icon: BookMarkedIcon,
    description: "Track your progress"
  },
  {
    label: "Library",
    href: "/library",
    icon: BookOpenTextIcon,
    description: "Browse all materials"
  },
  {
    label: "Study Tips",
    href: "/tips",
    icon: Lightbulb,
    description: "Learning techniques"
  }
]

const recentClasses = [
  { 
    name: "Advanced Calculus - Derivatives",
    href: "#",
    date: "2h ago",
    status: "processing"
  },
  { 
    name: "Physics - Quantum Mechanics",
    href: "#",
    date: "Yesterday",
    status: "ready"
  },
  { 
    name: "Chemistry - Organic Compounds",
    href: "#",
    date: "2 days ago",
    status: "ready"
  }
]

const recentSummaries = [
  {
    id: "1",
    name: "Cálculo Diferencial - Límites",
    href: "/summaries/1",
    date: "Hace 2h",
    subject: "Matemáticas"
  },
  {
    id: "2", 
    name: "Álgebra Lineal - Vectores",
    href: "/summaries/2",
    date: "Ayer",
    subject: "Matemáticas"
  },
  {
    id: "3",
    name: "Física Cuántica - Principios",
    href: "/summaries/3", 
    date: "Hace 3 días",
    subject: "Física"
  }
]

const newClasses = [
  {
    id: "new-1",
    name: "Machine Learning Fundamentals - Neural Networks",
    subject: "Computer Science",
    professor: "Prof. Alexandra Chen",
    university: "MIT",
    date: "2h ago",
    type: "shared",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=60&h=40&fit=crop",
    href: "#"
  },
  {
    id: "new-2", 
    name: "Constitutional Law - Supreme Court Cases",
    subject: "Law",
    professor: "Prof. James Rodriguez",
    university: "Harvard",
    date: "5h ago",
    type: "shared",
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=60&h=40&fit=crop",
    href: "#"
  },
  {
    id: "new-3",
    name: "Advanced Statistics - Hypothesis Testing", 
    subject: "Mathematics",
    professor: "Prof. David Kim",
    university: "UC Berkeley",
    date: "1 day ago",
    type: "shared",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=60&h=40&fit=crop",
    href: "#"
  }
]

export function AppSidebar({ activeSection, onSectionChange, onProfileClick }: AppSidebarProps) {
  const username = "ilyesameraoui1" // This would come from auth context in a real app
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDropdownOpen(false)
    setIsProfileDialogOpen(true)
  }

  // Dropdown content for new classes
  const newClassesDropdown = (
    <div className="p-2">
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-foreground mb-1">New Classes Available</h4>
        <p className="text-xs text-muted-foreground">Recently shared by professors</p>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {newClasses.map((classItem) => (
          <div
            key={classItem.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <img 
              src={classItem.thumbnail} 
              alt={classItem.name} 
              className="w-12 h-8 rounded object-cover flex-shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-1">
                {classItem.name}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{classItem.professor}</span>
                <span>•</span>
                <span>{classItem.university}</span>
              </div>
              <p className="text-xs text-muted-foreground">{classItem.date}</p>
            </div>
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-600">
              New
            </Badge>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-border">
        <Button 
          size="sm" 
          className="w-full text-xs"
          onClick={() => onSectionChange("classes")}
        >
          View All Classes
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <ProfileDialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <div></div>
      </ProfileDialog>
      
      <div className="flex h-full w-72 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {/* Header with user profile - Fixed */}
        <div className="flex-none border-b border-gray-200 p-4 dark:border-gray-800">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto w-full justify-start gap-3 p-0 hover:bg-transparent"
              >
                <Avatar className="h-10 w-10 rounded-xl border-2 border-white ring-2 ring-blue-500/20 dark:border-gray-800">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="rounded-xl bg-blue-600 text-white">IA</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Ilyes Ameraoui</p>
                    <Badge variant="secondary" className="bg-green-50 hover:bg-green-100 px-0.5 py-0 text-[8px] font-medium text-green-700 h-4 min-w-0">
                      PRO
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">Computer Science Student</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Academic Progress
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Saved Items
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Another Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Create Work Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download Windows App
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-4">
            {/* Quick Actions */}
            <div>
              <h3 className="mb-2 px-3 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="justify-start gap-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  size="sm"
                >
                  <BookOpenIcon className="h-4 w-4" />
                  Record
                </Button>
                <Button
                  className="justify-start gap-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                  size="sm"
                >
                  <BookOpenCheckIcon className="h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>

            {/* Main Navigation */}
            <nav className="space-y-1">
              {mainNavigation.map((item) => (
                <NavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={
                    (item.href === "/dashboard" && activeSection === "dashboard") ||
                    (item.href === "/classes" && activeSection === "classes") ||
                    (item.href === "/summaries" && activeSection === "summaries") ||
                    (item.href === "/flashcards" && activeSection === "flashcards")
                  }
                  badge={item.badge}
                  description={item.description}
                  badgeDropdown={item.href === "/classes" ? newClassesDropdown : undefined}
                  onClick={() => {
                    if (item.href === "/dashboard") onSectionChange("dashboard")
                    else if (item.href === "/classes") onSectionChange("classes")
                    else if (item.href === "/summaries") onSectionChange("summaries")
                    else if (item.href === "/flashcards") onSectionChange("flashcards")
                  }}
                />
              ))}
            </nav>

            {/* Recent Classes */}
            <div>
              <h3 className="mb-2 px-3 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Recent Classes
              </h3>
              <div className="space-y-1">
                {recentClasses.map((classItem) => (
                  <a
                    key={classItem.name}
                    href={classItem.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <BookMarkedIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-gray-900 dark:text-white">
                        {classItem.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{classItem.date}</span>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "px-1 py-0 text-[10px] font-medium",
                            classItem.status === "ready" 
                              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          )}
                        >
                          {classItem.status === "ready" ? "Ready" : "Processing"}
                        </Badge>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Recent Summaries */}
            <div>
              <h3 className="mb-2 px-3 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Recent Summaries
              </h3>
              <div className="space-y-1">
                {recentSummaries.map((summary) => (
                  <button
                    key={summary.id}
                    onClick={() => onSectionChange("summaries", { summaryId: summary.id })}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 w-full text-left"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      <BookText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-gray-900 dark:text-white">
                        {summary.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{summary.subject}</span>
                        <span>•</span>
                        <span>{summary.date}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <h3 className="mb-2 px-3 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                Study Tools
              </h3>
              <nav className="space-y-1">
                {toolsNavigation.map((item) => (
                  <NavItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    description={item.description}
                  />
                ))}
              </nav>
            </div>

            {/* AI Assistant */}
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                  <BookOpenIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">AI Study Assistant</h4>
                  <p className="text-xs text-blue-100">Powered by GPT-4</p>
                </div>
              </div>
              <p className="mb-3 text-sm text-blue-50">
                Get help with your studies, generate summaries, and create flashcards automatically.
              </p>
              <Button
                className="w-full justify-center gap-2 rounded-lg text-white bg-white/20 backdrop-blur-sm hover:bg-white/30"
                size="sm"
              >
                <Sparkles className="h-4 w-4" />
                Try it now
              </Button>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-none border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="space-y-1">
            <SettingsDialog />
            <a
              href="/help"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help & Support</span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
} 