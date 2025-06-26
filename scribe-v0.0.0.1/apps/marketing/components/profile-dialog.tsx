"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Edit, 
  Lock, 
  Phone, 
  Eye, 
  Calendar, 
  Shield, 
  Smartphone,
  Twitter,
  Instagram,
  Users,
  Link2,
  Database,
  UserCheck,
  Settings,
  Activity,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  Share2,
  Camera,
  Upload,
  Trash2
} from "lucide-react"

// Custom Toggle Switch Component (same as settings-dialog)
const CustomToggle = ({ defaultChecked = false, ...props }) => {
  const [checked, setChecked] = React.useState(defaultChecked)
  
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      value={checked ? "on" : "off"}
      onClick={() => setChecked(!checked)}
      className={cn(
        "relative box-content aspect-[7/4] shrink-0 rounded-full p-[2px] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:opacity-50 h-4 transition-colors",
        checked 
          ? "bg-blue-400 dark:bg-blue-500" 
          : "bg-gray-200 dark:bg-gray-600"
      )}
      {...props}
    >
      <span
        data-state={checked ? "checked" : "unchecked"}
        className={cn(
          "flex aspect-square h-full items-center justify-center rounded-full bg-white transition-transform duration-100",
          checked ? "translate-x-[calc(100%*(7/4-1))]" : "translate-x-0"
        )}
      />
    </button>
  )
}

interface ProfileDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProfileDialog({ children, open, onOpenChange }: ProfileDialogProps) {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [showAvatarMenu, setShowAvatarMenu] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const mockUser = {
    name: "Ilyes Ameraoui",
    username: "ilyesam",
    role: "Computer Science Student",
    avatarUrl: "/placeholder.svg",
    bio: "Passionate about learning and technology. Building the future of education with innovative solutions.",
    location: "Madrid, Spain",
    website: "https://ilyes.dev",
    email: "ilyes@projectscribe.com",
    phone: "+34 123 456 789",
    twitter: "ilyesam",
    instagram: "ilyes.ig",
    linkedin: "ilyesameraoui",
    followers: 245,
    following: 180,
    posts: 42,
    joinDate: "January 2024",
    lastActive: "2 hours ago",
    isCurrentUser: true,
    isVerified: true,
    twoFactorEnabled: true
  }

  const navigationItems = [
    {
      section: "Profile",
      items: [
        { id: "overview", label: "Overview", icon: User },
        { id: "personal", label: "Personal Info", icon: Edit },
        { id: "social", label: "Social Links", icon: Users },
      ]
    },
    {
      section: "Security",
      items: [
        { id: "security", label: "Security", icon: Shield },
        { id: "privacy", label: "Privacy", icon: Eye },
      ]
    },
    {
      section: "Activity",
      items: [
        { id: "activity", label: "Recent Activity", icon: Activity },
      ]
    }
  ]

  const profileStats = [
    { label: "Posts", value: mockUser.posts, color: "text-blue-600" },
    { label: "Followers", value: mockUser.followers, color: "text-green-600" },
    { label: "Following", value: mockUser.following, color: "text-purple-600" },
  ]

  const handleAvatarClick = () => {
    setShowAvatarMenu(!showAvatarMenu)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
    setShowAvatarMenu(false)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Aquí iría la lógica para subir la imagen
      console.log("Archivo seleccionado:", file.name)
      // Podrías usar FormData para enviar al servidor
    }
  }

  const handleRemovePhoto = () => {
    // Lógica para remover la foto de perfil
    console.log("Removiendo foto de perfil")
    setShowAvatarMenu(false)
  }

  // Cerrar menú cuando se hace clic fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showAvatarMenu) {
        setShowAvatarMenu(false)
      }
    }

    if (showAvatarMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAvatarMenu])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] p-0 gap-0 bg-background border border-border overflow-hidden">
        <div className="flex h-full overflow-hidden">
          {/* Sidebar - Using settings design system */}
          <div className="w-60 bg-muted/30 border-r border-border flex flex-col h-full overflow-hidden">
                         {/* Profile Header */}
             <div className="p-4 border-b border-border flex-shrink-0">
                                <div className="flex flex-col items-center text-center">
                   <div className="relative mb-3">
                     <div 
                       className="cursor-pointer group relative"
                       onClick={handleAvatarClick}
                     >
                       <Avatar className="w-12 h-12 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-200">
                         <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                         <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                           {mockUser.name.split(' ').map(n => n[0]).join('')}
                         </AvatarFallback>
                       </Avatar>
                       <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="text-white text-xs font-medium">Change</div>
                       </div>
                     </div>
                     
                     {/* Menu desplegable */}
                     {showAvatarMenu && (
                       <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 min-w-[160px]">
                         <button
                           onClick={handleFileUpload}
                           className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-t-lg transition-colors"
                         >
                           <Upload className="w-4 h-4" />
                           Upload Photo
                         </button>
                         <button
                           onClick={handleRemovePhoto}
                           className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-b-lg transition-colors text-red-600 hover:text-red-700"
                         >
                           <Trash2 className="w-4 h-4" />
                           Remove Photo
                         </button>
                       </div>
                     )}
                   </div>
                   
                   {/* Texto indicativo */}
                   <p className="text-xs text-muted-foreground/80 mb-2 hover:text-primary cursor-pointer transition-colors" onClick={handleAvatarClick}>
                     Click to change photo
                   </p>
                   
                   {/* Input file oculto */}
                   <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/*"
                     onChange={handleFileChange}
                     className="hidden"
                   />
                   
                   <div className="flex items-center gap-1">
                     <h3 className="text-sm font-semibold text-foreground">{mockUser.name}</h3>
                     {mockUser.isVerified && (
                       <CheckCircle className="w-3 h-3 text-blue-500" />
                     )}
                   </div>
                   <p className="text-xs text-muted-foreground">@{mockUser.username}</p>
                   <Badge variant="secondary" className="mt-1 text-xs px-2 py-0">
                     {mockUser.role}
                   </Badge>
                 </div>
             </div>

                         {/* Navigation - Using settings design system */}
             <div className="flex-1 overflow-y-auto py-3 px-2 min-h-0">
               {navigationItems.map((section, sectionIndex) => (
                 <div key={section.section}>
                   {sectionIndex > 0 && (
                     <div className="flex items-center justify-center w-full h-[18px] flex-shrink-0">
                       <div className="w-full h-px border-b border-border"></div>
                     </div>
                   )}
                   
                   <div className="text-xs font-semibold text-muted-foreground mb-0.5 flex items-center h-6 px-2">
                     {section.section}
                   </div>
                   
                   {section.items.map((item) => {
                     const Icon = item.icon
                     return (
                       <button
                         key={item.id}
                         onClick={() => setActiveTab(item.id)}
                         className={cn(
                           "w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-all duration-75 min-h-[27px] mb-0.5 mt-0.5",
                           activeTab === item.id 
                             ? "bg-accent text-accent-foreground font-semibold" 
                             : "hover:bg-accent/50"
                         )}
                       >
                         <div className="flex items-center">
                           <div className="w-4 h-4 mr-2 flex-shrink-0">
                             <Icon className="w-4 h-4" />
                           </div>
                           <div className="text-sm">{item.label}</div>
                         </div>
                       </button>
                     )
                   })}
                 </div>
               ))}
             </div>
          </div>

                     {/* Main Content */}
           <div className="flex-1 h-full overflow-hidden">
             <div className="h-full overflow-y-auto p-6">
               {activeTab === "overview" && (
                 <div className="space-y-6">
                                     <div>
                     <h2 className="text-2xl font-bold text-foreground mb-2">Profile Overview</h2>
                     <p className="text-muted-foreground">Manage your profile and account settings</p>
                   </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-6">
                    {profileStats.map((stat, index) => (
                      <div key={stat.label} className="bg-muted/30 rounded-xl p-6 text-center border border-border/50 hover:border-border transition-colors">
                        <div className={cn("text-3xl font-bold mb-1", stat.color)}>{stat.value}</div>
                        <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* About Section */}
                  <div className="bg-muted/20 rounded-xl p-6 border border-border/50">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold text-foreground">About</h2>
                    </div>
                    <p className="text-foreground mb-6 leading-relaxed">{mockUser.bio}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>{mockUser.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <a href={mockUser.website} target="_blank" rel="noopener noreferrer" 
                           className="hover:text-primary transition-colors flex items-center gap-1">
                          {mockUser.website?.replace('https://', '')}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span>Joined {mockUser.joinDate}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="w-4 h-4 text-purple-500" />
                        <span>{mockUser.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-muted/20 rounded-xl p-6 border border-border/50">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="justify-start gap-2 h-12">
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" className="justify-start gap-2 h-12">
                        <Users className="w-4 h-4" />
                        Manage Connections
                      </Button>
                      <Button variant="outline" className="justify-start gap-2 h-12">
                        <Shield className="w-4 h-4" />
                        Security Settings
                      </Button>
                      <Button variant="outline" className="justify-start gap-2 h-12">
                        <Eye className="w-4 h-4" />
                        Privacy Controls
                      </Button>
                    </div>
                  </div>

                  {/* Recent Activity Preview */}
                  <div className="bg-muted/20 rounded-xl p-6 border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("activity")}>
                        View All
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border/50">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Profile Updated</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border/50">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">New Study Session</p>
                          <p className="text-xs text-muted-foreground">5 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

                             {activeTab === "personal" && (
                 <div className="space-y-6">
                   <div>
                     <h2 className="text-2xl font-bold text-foreground mb-2">Personal Information</h2>
                     <p className="text-muted-foreground">Update your personal details and contact information</p>
                   </div>

                  <div className="bg-muted/20 rounded-xl p-6 border border-border/50">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Basic Information</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">First Name</label>
                          <div className="p-3 bg-background border border-border rounded-lg text-foreground">
                            Ilyes
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Last Name</label>
                          <div className="p-3 bg-background border border-border rounded-lg text-foreground">
                            Ameraoui
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
                        <div className="p-3 bg-background border border-border rounded-lg text-foreground flex items-center gap-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {mockUser.email}
                          <Badge variant="secondary" className="ml-auto">Verified</Badge>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
                        <div className="p-3 bg-background border border-border rounded-lg text-foreground flex items-center gap-3">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {mockUser.phone}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Bio</label>
                        <div className="p-3 bg-background border border-border rounded-lg text-foreground min-h-[80px]">
                          {mockUser.bio}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button className="gap-2">
                        <Edit className="w-4 h-4" />
                        Edit Information
                      </Button>
                    </div>
                  </div>
                </div>
              )}

                             {activeTab === "social" && (
                 <div className="space-y-6">
                   <div>
                     <h2 className="text-2xl font-bold text-foreground mb-2">Social Connections</h2>
                     <p className="text-muted-foreground">Manage your social media accounts and connections</p>
                   </div>

                  <div className="bg-muted/20 rounded-xl p-6 border border-border/50">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Connected Accounts</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Twitter className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">Twitter</p>
                            <p className="text-sm text-muted-foreground">@{mockUser.twitter}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Instagram className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">Instagram</p>
                            <p className="text-sm text-muted-foreground">@{mockUser.instagram}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg opacity-60">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">LinkedIn</p>
                            <p className="text-sm text-muted-foreground">Not connected</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Connect</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

                             {activeTab === "security" && (
                 <div className="space-y-6">
                   <div>
                     <h2 className="text-2xl font-bold text-foreground mb-2">Security Settings</h2>
                     <p className="text-muted-foreground">Protect your account with advanced security features</p>
                   </div>

                  <div className="bg-muted/20 rounded-xl p-6 border border-border/50">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Authentication</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">Extra security for your account</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">Enabled</Badge>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">SMS Authentication</p>
                            <p className="text-sm text-muted-foreground">Receive codes via text message</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Setup</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">Password</p>
                            <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Change</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

                             {activeTab === "privacy" && (
                 <div className="space-y-6">
                   <div>
                     <h2 className="text-2xl font-bold text-foreground mb-2">Privacy Settings</h2>
                     <p className="text-muted-foreground">Control who can see your information and activity</p>
                   </div>

                                     <div className="bg-muted/20 rounded-xl p-6 border border-border/50">
                     <h2 className="text-xl font-semibold text-foreground mb-6">Profile Visibility</h2>
                     <div className="space-y-6">
                       <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                         <div>
                           <p className="font-semibold text-foreground">Public Profile</p>
                           <p className="text-sm text-muted-foreground">Make your profile visible to everyone</p>
                         </div>
                         <CustomToggle defaultChecked />
                       </div>
                       
                       <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                         <div>
                           <p className="font-semibold text-foreground">Show Activity Status</p>
                           <p className="text-sm text-muted-foreground">Let others see when you're active</p>
                         </div>
                         <CustomToggle defaultChecked />
                       </div>
                       
                       <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                         <div>
                           <p className="font-semibold text-foreground">Search Engine Indexing</p>
                           <p className="text-sm text-muted-foreground">Allow search engines to index your profile</p>
                         </div>
                         <CustomToggle />
                       </div>
                     </div>
                   </div>
                </div>
              )}

                             {activeTab === "activity" && (
                 <div className="space-y-6">
                   <div>
                     <h2 className="text-2xl font-bold text-foreground mb-2">Recent Activity</h2>
                     <p className="text-muted-foreground">Track your account activity and login history</p>
                   </div>

                  <div className="bg-muted/20 rounded-xl p-6 border border-border/50">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Activity Log</h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-background border border-border rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-foreground">Profile Updated</p>
                            <span className="text-xs text-muted-foreground">2 hours ago</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Updated profile information and bio</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 bg-background border border-border rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-foreground">Login</p>
                            <span className="text-xs text-muted-foreground">5 hours ago</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Signed in from Chrome on Windows • Madrid, Spain</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 bg-background border border-border rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-foreground">Security Settings Changed</p>
                            <span className="text-xs text-muted-foreground">1 day ago</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Enabled two-factor authentication</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 bg-background border border-border rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-foreground">Account Created</p>
                            <span className="text-xs text-muted-foreground">2 days ago</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Welcome to ProjectScribe! 🎉</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}