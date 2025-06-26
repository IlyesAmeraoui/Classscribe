'use client'

import * as React from "react"
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardOverview } from '@/components/dashboard-overview'
import { ClassTable } from '@/components/ClassTable'
import { SummariesView } from '@/components/SummariesView'
import { ProfileView } from "@/components/profile-view"

// Animated wrapper component for sections
const AnimatedSection = ({ children, isActive, sectionKey }: {
  children: React.ReactNode
  isActive: boolean
  sectionKey: string
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setMounted(true), 50)
      return () => clearTimeout(timer)
    } else {
      setMounted(false)
    }
  }, [isActive])

  // Different animation styles for different sections
  const getAnimationClass = () => {
    switch (sectionKey) {
      case 'dashboard':
        return 'animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out'
      case 'classes':
        return 'animate-in fade-in slide-in-from-left-4 duration-600 ease-out'
      case 'summaries':
        return 'animate-in fade-in slide-in-from-right-4 duration-600 ease-out'
      case 'flashcards':
        return 'animate-in fade-in slide-in-from-top-4 duration-600 ease-out'
      default:
        return 'animate-in fade-in duration-500 ease-out'
    }
  }

  if (!isActive) return null

  return (
    <div className={mounted ? getAnimationClass() : 'opacity-0'}>
      {children}
    </div>
  )
}

const getSectionComponent = (section: string, params: Record<string, any>) => {
  switch (section) {
    case 'dashboard':
      return <DashboardOverview />
    case 'classes':
      return <ClassTable />
    case 'summaries':
      return <SummariesView initialSummaryId={params.summaryId} />
    case 'flashcards':
      return <div className="rounded-lg border p-6">Flashcards content coming soon...</div>
    default:
      return <DashboardOverview />
  }
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [showProfile, setShowProfile] = React.useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sectionParams, setSectionParams] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login'
    }
  }, [user, authLoading])

  // Handle section changes with animation
  const handleSectionChange = (newSection: string, params: Record<string, any> = {}) => {
    if (newSection === activeSection && Object.keys(params).length === 0) return
    
    setIsLoading(true)
    
    // Quick transition between sections
    setTimeout(() => {
      setActiveSection(newSection)
      setSectionParams(params)
      setIsLoading(false)
    }, 150)
  }

  // Create user object for ProfileView from auth data
  const userProfile = user ? {
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
    username: user.username,
    role: user.role === 'student' ? 'Student' : user.role,
    avatarUrl: user.profileImage || "/placeholder.svg",
    bannerUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    bio: user.bio || "Passionate about learning and technology. Building the future of education.",
    location: user.location || "Not specified",
    website: user.website || "",
    twitter: "",
    instagram: "",
    followers: 0,
    following: 0,
    posts: 0,
    isCurrentUser: true
  } : null

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    )
  }

  // Show loading if no user
  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AppSidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        onProfileClick={() => setShowProfile(true)}
        user={user}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-6">
              <div className={`flex-1 rounded-3xl bg-white/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-800/60 shadow-2xl p-6 md:p-10 transition-all duration-300 ${showProfile ? 'max-w-[calc(100%-384px)]' : ''}`}>
                <AnimatedSection isActive={!isLoading} sectionKey={activeSection}>
                  {getSectionComponent(activeSection, sectionParams)}
                </AnimatedSection>
                
                {isLoading && (
                  <div className="flex items-center justify-center py-12 animate-in fade-in duration-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
                  </div>
                )}
              </div>
              
              {showProfile && userProfile && (
                <div className="w-96 animate-in slide-in-from-right duration-300">
                  <ProfileView user={userProfile} />
                  <button
                    onClick={() => setShowProfile(false)}
                    className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Hide Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 