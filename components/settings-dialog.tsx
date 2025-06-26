"use client"

import * as React from "react"
import { Settings, User, Users, Bell, Moon, Sun, Laptop, Lock, Shield, Globe, Palette, HelpCircle, BookOpen, Sparkles, Database, UserCheck, Plug, CreditCard, Crown, Zap, ChevronDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Custom Toggle Switch Component
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

// Custom Select Component
const CustomSelect = ({ options, defaultValue, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(defaultValue || options[0])
  
  return (
    <div className="relative">
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="text-foreground border border-border inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-background px-3 text-sm leading-none outline-hidden cursor-pointer hover:bg-accent focus-visible:bg-accent"
        {...props}
      >
        <span style={{ pointerEvents: 'none' }}>{selectedValue}</span>
        <span aria-hidden="true">
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-50">
          {options.map((option) => (
            <button
              key={option}
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent first:rounded-t-lg last:rounded-b-lg"
              onClick={() => {
                setSelectedValue(option)
                setIsOpen(false)
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function SettingsDialog() {
  const [activeTab, setActiveTab] = React.useState("general")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <a
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 cursor-pointer"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </a>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] p-0 gap-0 bg-background border border-border overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar - Using website's design system */}
          <div className="w-60 bg-muted/30 border-r border-border flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-3 px-2 min-h-0">
              <div>
                {/* General Section */}
                <div className="text-xs font-semibold text-muted-foreground mb-0.5 flex items-center h-6 px-2">
                  General
                </div>
                
                <button
                  onClick={() => setActiveTab("general")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-all duration-75 min-h-[27px] mb-0.5 mt-0.5",
                    activeTab === "general" 
                      ? "bg-accent text-accent-foreground font-semibold" 
                      : "hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 flex-shrink-0">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div className="text-sm">Configuration</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-all duration-75 min-h-[27px] mb-0.5 mt-0.5",
                    activeTab === "notifications" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 flex-shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="text-sm">Notifications</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab("customization")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-all duration-75 min-h-[27px] mb-0.5 mt-0.5",
                    activeTab === "customization" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 flex-shrink-0">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div className="text-sm">Customization</div>
                  </div>
                </button>
                
                {/* Separator */}
                <div className="flex items-center justify-center w-full h-[18px] flex-shrink-0">
                  <div className="w-full h-px border-b border-border"></div>
                </div>
                
                {/* Privacy & Data Section */}
                <div className="text-xs font-semibold text-muted-foreground mb-0.5 flex items-center h-6 px-2">
                  Privacy & Data
                </div>
                
                <button
                  onClick={() => setActiveTab("data-controls")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-all duration-75 min-h-[27px] mb-0.5 mt-0.5",
                    activeTab === "data-controls" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 flex-shrink-0">
                      <Database className="w-4 h-4" />
                    </div>
                    <div className="text-sm">Data Controls</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab("private-profile")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-all duration-75 min-h-[27px] mb-0.5 mt-0.5",
                    activeTab === "private-profile" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 flex-shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="text-sm">Private Profile</div>
                  </div>
                </button>
                
                {/* Separator */}
                <div className="flex items-center justify-center w-full h-[18px] flex-shrink-0">
                  <div className="w-full h-px border-b border-border"></div>
                </div>
                
                {/* Security Section */}
                <div className="text-xs font-semibold text-muted-foreground mb-0.5 flex items-center h-6 px-2">
                  Security
                </div>
                
                <button
                  onClick={() => setActiveTab("secure-login")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-all duration-75 min-h-[27px] mb-0.5 mt-0.5",
                    activeTab === "secure-login" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 flex-shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="text-sm">Secure Login</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab("advanced-security")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-all duration-75 min-h-[27px] mb-0.5 mt-0.5",
                    activeTab === "advanced-security" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 flex-shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="text-sm">Advanced Security</div>
                  </div>
                </button>
                
                {/* Separator */}
                <div className="flex items-center justify-center w-full h-[18px] flex-shrink-0">
                  <div className="w-full h-px border-b border-border"></div>
                </div>
                
                {/* Integrations & Billing Section */}
                <div className="text-xs font-semibold text-muted-foreground mb-0.5 flex items-center h-6 px-2">
                  Integrations & Billing
                </div>
                
                <button
                  onClick={() => setActiveTab("connectors")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-all duration-75 min-h-[27px] mb-0.5 mt-0.5",
                    activeTab === "connectors" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 flex-shrink-0">
                      <Plug className="w-4 h-4" />
                    </div>
                    <div className="text-sm">Connectors</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab("subscription")}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-all duration-75 min-h-[27px] mb-0.5 mt-0.5",
                    activeTab === "subscription" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 flex-shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="text-sm">Subscription</div>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Promotional Card - Fixed at bottom */}
            <div className="flex-shrink-0 p-2 border-t border-border bg-muted/30">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200/30 dark:border-blue-800/30 rounded-lg p-2.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <Crown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">ProjectScribe Pro</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2 leading-tight">
                  Unlock advanced features and premium tools.
                </p>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-medium py-1.5 px-3 rounded-md transition-all duration-200 flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3" />
                  Upgrade now
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-background">
            {activeTab === "general" && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-medium text-foreground mb-1">General Configuration</h2>
                  <p className="text-sm text-muted-foreground">Basic settings for your account and application</p>
                </div>
                
                <div className="space-y-6">
                  {/* Theme */}
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Application Theme</h3>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="theme" defaultChecked className="w-4 h-4" />
                        <Sun className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Light</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="theme" className="w-4 h-4" />
                        <Moon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Dark</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="theme" className="w-4 h-4" />
                        <Laptop className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">System</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Language */}
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-2">Interface Language</h3>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <CustomSelect 
                        options={["English", "Español", "Français"]}
                        defaultValue="English"
                      />
                    </div>
                  </div>

                  {/* Account Settings */}
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Account Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Email notifications</div>
                          <div className="text-xs text-muted-foreground">Receive important alerts about your account</div>
                        </div>
                        <CustomToggle defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Automatic updates</div>
                          <div className="text-xs text-muted-foreground">Keep the application updated automatically</div>
                        </div>
                        <CustomToggle defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "notifications" && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-medium text-foreground mb-1">Notifications</h2>
                  <p className="text-sm text-muted-foreground">Configure how and when you want to receive notifications</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Study Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">New flashcards</div>
                          <div className="text-xs text-muted-foreground">Notify when new study cards are created</div>
                        </div>
                        <CustomToggle defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Study reminders</div>
                          <div className="text-xs text-muted-foreground">Daily reminders to maintain your study streak</div>
                        </div>
                        <CustomToggle defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Weekly reports</div>
                          <div className="text-xs text-muted-foreground">Weekly summary of your progress and statistics</div>
                        </div>
                        <CustomToggle />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">System Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">App updates</div>
                          <div className="text-xs text-muted-foreground">Notify about new versions and features</div>
                        </div>
                        <CustomToggle defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Scheduled maintenance</div>
                          <div className="text-xs text-muted-foreground">Notices about system maintenance</div>
                        </div>
                        <CustomToggle defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "customization" && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-medium text-foreground mb-1">Customization</h2>
                  <p className="text-sm text-muted-foreground">Customize the appearance and behavior of the application</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Interface</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Sound effects</div>
                          <div className="text-xs text-muted-foreground">Play sounds when interacting with the application</div>
                        </div>
                        <CustomToggle />
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Compact mode</div>
                          <div className="text-xs text-muted-foreground">Show more content in less space</div>
                        </div>
                        <CustomToggle />
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Animations</div>
                          <div className="text-xs text-muted-foreground">Enable animations and transitions</div>
                        </div>
                        <CustomToggle defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Study Experience</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Auto-advance</div>
                          <div className="text-xs text-muted-foreground">Automatically advance to the next flashcard</div>
                        </div>
                        <CustomToggle />
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Focus mode</div>
                          <div className="text-xs text-muted-foreground">Hide distractions during study sessions</div>
                        </div>
                        <CustomToggle defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "data-controls" && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-medium text-foreground mb-1">Data Controls</h2>
                  <p className="text-sm text-muted-foreground">Manage your personal data and privacy settings</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Data Collection</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Usage data</div>
                          <div className="text-xs text-muted-foreground">Allow collecting anonymous data to improve the application</div>
                        </div>
                        <CustomToggle defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Performance analytics</div>
                          <div className="text-xs text-muted-foreground">Help identify and solve technical problems</div>
                        </div>
                        <CustomToggle defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Synchronization</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Automatic sync</div>
                          <div className="text-xs text-muted-foreground">Sync data automatically across devices</div>
                        </div>
                        <CustomToggle defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Cloud backup</div>
                          <div className="text-xs text-muted-foreground">Create automatic backups of your data</div>
                        </div>
                        <CustomToggle defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "private-profile" && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-medium text-foreground mb-1">Private Profile</h2>
                  <p className="text-sm text-muted-foreground">Control the visibility of your profile and activity</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Profile Visibility</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Public profile</div>
                          <div className="text-xs text-muted-foreground">Allow other users to view your profile</div>
                        </div>
                        <CustomToggle />
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Show statistics</div>
                          <div className="text-xs text-muted-foreground">Display your progress and statistics on public profile</div>
                        </div>
                        <CustomToggle />
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Recent activity</div>
                          <div className="text-xs text-muted-foreground">Show your recent study activity</div>
                        </div>
                        <CustomToggle />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Contact</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Allow direct messages</div>
                          <div className="text-xs text-muted-foreground">Other users can send you private messages</div>
                        </div>
                        <CustomToggle />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "connectors" && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-medium text-foreground mb-1">Connectors</h2>
                  <p className="text-sm text-muted-foreground">Connect ProjectScribe with other applications and services</p>
                </div>
                
                <div className="bg-card rounded-lg p-4 border border-border">
                  <div className="text-center py-8">
                    <Plug className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-sm font-medium text-card-foreground mb-2">Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">Integrations with Google Drive, Notion, Anki and more applications will be available soon.</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "secure-login" && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-medium text-foreground mb-1">Secure Login</h2>
                  <p className="text-sm text-muted-foreground">Authentication and secure access configuration</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Two-Factor Authentication</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Enable 2FA</div>
                          <div className="text-xs text-muted-foreground">Add an extra layer of security to your account</div>
                        </div>
                        <CustomToggle />
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Remember devices</div>
                          <div className="text-xs text-muted-foreground">Don't require 2FA on trusted devices</div>
                        </div>
                        <CustomToggle defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Authentication Methods</h3>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Configure additional methods to securely access your account.
                      </div>
                      <button className="w-full text-left p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="text-sm font-medium text-card-foreground">Authenticator app</div>
                        <div className="text-xs text-muted-foreground">Google Authenticator, Authy, etc.</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "advanced-security" && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-medium text-foreground mb-1">Advanced Security</h2>
                  <p className="text-sm text-muted-foreground">General account security configuration</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Sessions</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Auto logout</div>
                          <div className="text-xs text-muted-foreground">Log out automatically after a period of inactivity</div>
                        </div>
                        <CustomToggle />
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-card-foreground">Login notifications</div>
                          <div className="text-xs text-muted-foreground">Receive alerts when someone accesses your account</div>
                        </div>
                        <CustomToggle defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Account Activity</h3>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground mb-3">
                        Review recent activity on your account to detect unauthorized access.
                      </div>
                      <button className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80">
                        View recent activity
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "subscription" && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-medium text-foreground mb-1">Subscription</h2>
                  <p className="text-sm text-muted-foreground">Manage your plan and billing</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Current Plan</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-card-foreground">Free Plan</div>
                        <div className="text-xs text-muted-foreground">Access to basic features</div>
                      </div>
                      <button className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded font-medium">
                        Upgrade plan
                      </button>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-medium text-card-foreground mb-3">Current Usage</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Flashcards created</span>
                        <span className="text-card-foreground">45 / 100</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Active classes</span>
                        <span className="text-card-foreground">3 / 5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 