import { Bell, Moon, Sun, Check, X, Clock, BookOpen, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Class Processing Complete',
      message: 'Your Advanced Calculus recording has been processed and is ready for review.',
      time: '2 minutes ago',
      read: false,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 2,
      type: 'info',
      title: 'New Study Material Available',
      message: 'Flashcards for Physics - Quantum Mechanics are now available.',
      time: '1 hour ago',
      read: false,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Upload in Progress',
      message: 'Chemistry class recording is being processed. This may take a few minutes.',
      time: '3 hours ago',
      read: false,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50'
    },
    {
      id: 4,
      type: 'info',
      title: 'Study Reminder',
      message: 'You have 12 flashcards due for review today.',
      time: '5 hours ago',
      read: false,
      icon: AlertCircle,
      color: 'text-purple-600 bg-purple-50'
    }
  ])
  
  const notificationRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter(n => !n.read).length

  // Cerrar notificaciones al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between h-10">
        <div className="flex flex-1 items-center gap-4">
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Dropdown de Notificaciones */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        Mark all read
                      </Button>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {notifications.length}
                    </Badge>
                  </div>
                </div>

                {/* Lista de Notificaciones */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {notifications.map((notification) => {
                        const Icon = notification.icon
                        return (
                          <div
                            key={notification.id}
                            className={cn(
                              "p-4 hover:bg-muted/50 transition-colors group",
                              !notification.read && "bg-blue-50/50 dark:bg-blue-950/20"
                            )}
                          >
                                                         <div className="flex gap-3">
                               <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", notification.color)}>
                                 <Icon className="w-4 h-4" />
                               </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground mb-1">
                                      {notification.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {notification.time}
                                    </p>
                                  </div>
                                                                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                     {!notification.read && (
                                       <Button
                                         variant="ghost"
                                         size="sm"
                                         onClick={() => markAsRead(notification.id)}
                                         className="h-8 w-8 p-0 rounded-full hover:bg-green-50 hover:text-green-600"
                                       >
                                         <Check className="w-4 h-4" />
                                       </Button>
                                     )}
                                     <Button
                                       variant="ghost"
                                       size="sm"
                                       onClick={() => deleteNotification(notification.id)}
                                       className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                                     >
                                       <X className="w-4 h-4" />
                                     </Button>
                                   </div>
                                </div>
                                                                 {!notification.read && (
                                   <div className="absolute right-4 top-4 w-2 h-2 bg-blue-600 rounded-full"></div>
                                 )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-border bg-muted/30">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-center text-sm"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all notifications
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 