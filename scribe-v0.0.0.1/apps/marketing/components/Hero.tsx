'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="relative isolate pt-14">
      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Transform Your Class Notes with{' '}
              <span className="text-primary">AI-Powered</span> Intelligence
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Record your classes, get instant AI transcriptions, and generate
              smart study materials. Never miss a crucial detail again with
              ClassScribe's intelligent note-taking system.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                Get Started
              </Link>
              <Link
                href="/docs"
                className="text-sm font-semibold leading-6 text-foreground"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 flow-root sm:mt-24"
          >
            <div className="relative rounded-xl bg-card p-8 ring-1 ring-ring/10 sm:p-12">
              {/* TODO: Add product screenshot/demo */}
              <div className="aspect-[16/9] rounded-md bg-muted"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 