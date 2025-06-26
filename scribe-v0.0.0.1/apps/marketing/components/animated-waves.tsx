'use client'

export default function AnimatedWaves() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-900">
      {/* Wave 1 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-wave-1" />
      </div>

      {/* Wave 2 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl animate-wave-2" />
      </div>

      {/* Wave 3 */}
      <div className="absolute inset-0">
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-wave-3" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float-1" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float-2" />
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-3" />
      </div>
    </div>
  )
} 