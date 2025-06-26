import * as React from "react"
import { motion } from "framer-motion"
import { Users, Link2, Edit, MapPin, Globe, Twitter, Instagram } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProfileViewProps {
  user: {
    name: string
    username: string
    role: string
    avatarUrl?: string
    bannerUrl?: string
    bio?: string
    location?: string
    website?: string
    twitter?: string
    instagram?: string
    followers: number
    following: number
    posts: number
    isCurrentUser?: boolean
  }
}

export function ProfileView({ user }: ProfileViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-800/20"
    >
      {/* Banner with Parallax Effect */}
      <div className="relative h-40 overflow-hidden">
        {user.bannerUrl ? (
          <div className="absolute inset-0 transform hover:scale-105 transition-transform duration-700">
            <img
              src={user.bannerUrl}
              alt="Profile banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
        )}
        
        {/* Avatar Overlay */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-2xl bg-white dark:bg-gray-800">
              <Avatar className="w-full h-full">
                <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            {user.isCurrentUser && (
              <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform">
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-16 px-6 pb-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">@{user.username}</p>
          <Badge variant="secondary" className="bg-blue-100/80 text-blue-800 dark:bg-blue-900/80 dark:text-blue-200 backdrop-blur-sm">
            {user.role}
          </Badge>
          {user.bio && (
            <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {user.bio}
            </p>
          )}
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {user.location && (
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              <MapPin className="w-3 h-3" />
              {user.location}
            </Badge>
          )}
          {user.website && (
            <a 
              href={user.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <Globe className="w-3 h-3" />
              {user.website.replace('https://', '')}
            </a>
          )}
          {user.twitter && (
            <a 
              href={`https://twitter.com/${user.twitter}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Twitter className="w-3 h-3" />
              @{user.twitter}
            </a>
          )}
          {user.instagram && (
            <a 
              href={`https://instagram.com/${user.instagram}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600 transition-colors"
            >
              <Instagram className="w-3 h-3" />
              @{user.instagram}
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.posts}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.followers}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.following}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Following</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          {user.isCurrentUser ? (
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              variant="default"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              variant="default"
            >
              <Users className="w-4 h-4 mr-2" />
              Follow
            </Button>
          )}
          <Button 
            className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
            variant="outline"
          >
            <Link2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
} 