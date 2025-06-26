'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export function MarketingNavbar() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">ClassScribe</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/pricing" className="text-sm font-medium hover:text-primary">
            Pricing
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-primary">
            Blog
          </Link>
          <Link href="/docs" className="text-sm font-medium hover:text-primary">
            Docs
          </Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-md p-2.5 hover:bg-accent"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </button>
          <Link
            href="/dashboard"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  )
} 