"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  User,
  Lock,
  Bell,
  Palette,
  Globe,
  Shield,
  CreditCard,
  HelpCircle,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  Twitter,
  Instagram,
  Github
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

const settingsSections = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    color: "text-blue-500"
  },
  {
    id: "account",
    label: "Account & Security",
    icon: Lock,
    color: "text-green-500"
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    color: "text-purple-500"
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    color: "text-orange-500"
  },
  {
    id: "language",
    label: "Language & Region",
    icon: Globe,
    color: "text-pink-500"
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: Shield,
    color: "text-red-500"
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    color: "text-yellow-500"
  },
  {
    id: "help",
    label: "Help & Support",
    icon: HelpCircle,
    color: "text-indigo-500"
  }
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState("profile")
  const [emailNotifications, setEmailNotifications] = React.useState(true)
  const [pushNotifications, setPushNotifications] = React.useState(true)
  const [darkMode, setDarkMode] = React.useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${section.color}`} />
                    {section.label}
                    <ChevronRight className={`ml-auto h-4 w-4 ${
                      activeSection === section.id ? "opacity-100" : "opacity-0"
                    }`} />
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            {activeSection === "profile" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Update your photo and personal details here.
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>IA</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-4">
                    <Button variant="outline">Change Photo</Button>
                    <Button variant="outline" className="text-red-600 hover:text-red-700">Remove</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Ilyes Ameraoui" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="ilyesameraoui1" className="mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      rows={4}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      defaultValue="Passionate about learning and technology. Building the future of education."
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">Contact Information</h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <Label className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input type="email" className="mt-1" />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </Label>
                      <Input type="tel" className="mt-1" />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </Label>
                      <Input className="mt-1" />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        Website
                      </Label>
                      <Input type="url" className="mt-1" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">Social Links</h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <Label className="flex items-center gap-2">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </Label>
                      <Input className="mt-1" placeholder="@username" />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </Label>
                      <Input className="mt-1" placeholder="@username" />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        GitHub
                      </Label>
                      <Input className="mt-1" placeholder="@username" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage how you want to be notified about activity.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Push Notifications</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications on your device
                      </p>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "appearance" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appearance Settings</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Customize how Scribe looks on your device.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Dark Mode</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Use dark theme across the application
                      </p>
                    </div>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Add more sections as needed */}
          </div>
        </div>
      </div>
    </div>
  )
} 