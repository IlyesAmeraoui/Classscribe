import { useEffect, useState } from 'react'

export function StatsChart() {
  const [heights, setHeights] = useState([30, 50, 70, 85, 100])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(prev => {
        const newHeights = [...prev]
        // Randomly adjust heights while keeping the increasing trend
        for (let i = 0; i < newHeights.length; i++) {
          const min = i > 0 ? (newHeights[i - 1] ?? 20) : 20
          const max = i < newHeights.length - 1 ? (newHeights[i + 1] ?? 100) : 100
          const currentHeight = newHeights[i] ?? 0
          newHeights[i] = Math.min(max, Math.max(min, currentHeight + (Math.random() - 0.5) * 10))
        }
        return newHeights
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-40">
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-100 to-transparent"></div>
      <div className="relative z-10 h-full flex items-end space-x-2">
        {heights.map((height, index) => (
          <div
            key={index}
            className="w-8 bg-yellow-400 rounded-t-lg transition-all duration-1000 ease-in-out"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  )
} 