import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  FileText,
  Clock,
  Upload,
  Mic,
  ChevronRight,
  Layers,
  Trophy,
  BookMarked,
  Brain,
  Wand2,
  Sparkles,
  Play,
  FileAudio,
  PenTool,
  Settings,
} from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function DashboardOverview() {
  const [isRecording, setIsRecording] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [audioVisualization, setAudioVisualization] = useState<number[]>([]);
  const animationRef = useRef<number | null>(null);
  
  // For audio wave visualization
  useEffect(() => {
    if (isRecording) {
      // Generate random audio waves
      const generateWaves = () => {
        const waves = Array.from({ length: 30 }, () => 
          Math.random() * 0.8 + 0.2
        );
        setAudioVisualization(waves);
        animationRef.current = requestAnimationFrame(generateWaves);
      };
      
      generateWaves();
      
      // Auto-stop recording after 3 seconds for demo purposes
      const timeout = setTimeout(() => setIsRecording(false), 3000);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        clearTimeout(timeout);
      };
    } else {
      // Reset waves when not recording
      setAudioVisualization([]);
    }
  }, [isRecording]);

  // Pulse animation for the recording button
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-6"
    >
      {/* Welcome Section */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full"
          >
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, Ilyes</h1>
            <p className="text-gray-600 dark:text-gray-400">Ready to capture your next lecture?</p>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Recording Banner */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 mb-8 shadow-xl"
      >
        {/* Background elements with enhanced animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          
          {/* Neural network nodes effect */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${15 + (i * 10)}%`,
                top: `${20 + (Math.sin(i) * 20)}%`
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
                y: [0, 10, 0]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
          
          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.path
              d="M 0,50 Q 100,100 200,50 T 400,50"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              fill="none"
              animate={{
                d: [
                  "M 0,50 Q 100,100 200,50 T 400,50",
                  "M 0,60 Q 100,80 200,60 T 400,60",
                  "M 0,50 Q 100,100 200,50 T 400,50"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </svg>
          
          {/* Floating text elements */}
          {["AI", "ML", "NLP"].map((text, i) => (
            <motion.div
              key={text}
              className="absolute text-white/10 text-5xl font-bold"
              style={{
                left: `${20 + (i * 30)}%`,
                top: `${60 + (i * 10)}%`
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: i * 1
              }}
            >
              {text}
            </motion.div>
          ))}
          
          {/* Glowing orbs */}
          <motion.div
            className="absolute right-1/4 top-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          <motion.div
            className="absolute left-1/4 bottom-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
          
          {/* Educational paper elements */}
          {/* Notebook paper */}
          <motion.div 
            className="absolute left-[15%] top-[20%] w-28 h-36 bg-white/10 backdrop-blur-sm rounded-sm shadow-md"
            style={{ 
              backgroundImage: "linear-gradient(transparent 0px, transparent 23px, rgba(255,255,255,0.2) 24px)",
              backgroundSize: "100% 24px",
              transform: "rotate(-5deg)"
            }}
            animate={{ 
              y: [0, -10, 0],
              rotate: [-5, -3, -5],
              opacity: [0.4, 0.5, 0.4]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Blue lines */}
            <div className="absolute left-0 top-0 w-full h-full opacity-30 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute left-5 right-0 h-px bg-blue-300/40"
                  style={{ top: `${(i + 1) * 24 - 12}px` }}
                />
              ))}
            </div>
            {/* Red margin line */}
            <div className="absolute top-0 bottom-0 left-4 w-px bg-red-400/40" />
          </motion.div>

          {/* Graph paper */}
          <motion.div 
            className="absolute right-[20%] top-[60%] w-32 h-32 bg-white/10 backdrop-blur-sm rounded-sm shadow-md overflow-hidden"
            style={{ 
              transform: "rotate(8deg)"
            }}
            animate={{ 
              y: [0, 8, 0],
              rotate: [8, 10, 8],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-30" 
              style={{ 
                backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                backgroundSize: "8px 8px"
              }} 
            />
          </motion.div>

          {/* Note card */}
          <motion.div 
            className="absolute left-[60%] top-[15%] w-20 h-16 bg-yellow-100/10 backdrop-blur-sm rounded-sm shadow-md"
            animate={{ 
              y: [0, 5, 0],
              rotate: [2, 0, 2],
              opacity: [0.4, 0.5, 0.4]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ transform: "rotate(2deg)" }}
          >
            {/* Content lines */}
            <div className="absolute inset-0 flex flex-col justify-center items-center opacity-50">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="w-2/3 h-0.5 bg-white/20 rounded-full my-1"
                />
              ))}
            </div>
          </motion.div>

          {/* Folded page corner */}
          <motion.div 
            className="absolute right-[10%] top-[25%] w-24 h-28 bg-white/10 backdrop-blur-sm rounded-sm shadow-md overflow-hidden"
            animate={{ 
              y: [0, -8, 0],
              rotate: [-3, -5, -3],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            style={{ transform: "rotate(-3deg)" }}
          >
            {/* Folded corner effect */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-white/20" style={{ 
              clipPath: "polygon(100% 0, 0 0, 100% 100%)" 
            }} />
            
            {/* Content lines */}
            <div className="absolute inset-0 flex flex-col justify-center opacity-50 pt-3 px-3">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className="w-full h-0.5 bg-white/20 rounded-full my-1.5"
                />
              ))}
            </div>
          </motion.div>
          
          {/* Particle effects */}
          <div className="absolute inset-0">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * 100, 
                  y: Math.random() * 100,
                  opacity: 0
                }}
                animate={{ 
                  x: Math.random() * 100, 
                  y: Math.random() * 100,
                  opacity: [0, 0.3, 0],
                }}
                transition={{ 
                  duration: 3 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative p-8 flex flex-col md:flex-row items-center md:items-stretch justify-between backdrop-blur-sm">
          <div className="md:max-w-lg mb-6 md:mb-0">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Badge className="bg-white/20 text-white mb-4 backdrop-blur-sm hover:bg-white/30">
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-2"
                >
                  <Wand2 className="w-3 h-3" />
                </motion.div>
                AI-Powered Recording
              </Badge>
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Transform your lectures into 
              <span className="relative">
                <span className="relative z-10"> - smart notes</span>
                <motion.span 
                  className="absolute bottom-1 left-0 right-0 h-2 bg-indigo-400/30 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
              </span>
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="text-indigo-100 text-lg mb-4"
            >
              Real-time AI transcription and summarization
            </motion.p>
            
            {/* Feature list */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-3 mt-4 "
            >
              {[
                { icon: <FileAudio className="w-3.5 h-3.5 text-white" />, text: "High-quality transcription" },
                { icon: <PenTool className="w-3.5 h-3.5 text-white" />, text: "AI-generated summaries" },
                { icon: <Sparkles className="w-3.5 h-3.5 text-white" />, text: "Smart formatting" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm flex items-center gap-1.5"
                >
                  {feature.icon}
                  <span className="text-xs font-medium text-white">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Right side - Recording controls */}
          <div className="flex flex-col space-y-4 md:min-w-[250px]">
            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.div
                  key="recording"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="relative">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-10 h-10 bg-red-600/50 absolute inset-0 rounded-full"
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        className="w-10 h-10 bg-red-600/20 absolute inset-0 rounded-full"
                      />
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative z-10">
                        <div className="w-4 h-4 bg-red-600 rounded-full" />
                      </div>
                    </div>
                    <span className="font-medium">Recording...</span>
                    
                    {/* Audio wave visualization */}
                    <div className="h-12 w-full flex items-center justify-center">
                      <div className="flex items-end space-x-[2px] h-full">
                        {audioVisualization.map((height, index) => (
                          <motion.div
                            key={index}
                            className="w-1 bg-white/80"
                            animate={{
                              height: `${height * 100}%`,
                            }}
                            transition={{
                              duration: 0.2
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsRecording(false)}
                      className="mt-2 text-xs text-white/80 hover:text-white font-medium flex items-center"
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Options
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="startButton"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col space-y-3"
                >
                  <motion.button
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" 
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsRecording(true)}
                    className="relative overflow-hidden backdrop-blur-md bg-white/40 border border-white/20 text-indigo-700 transition-all duration-300 hover:text-black hover:bg-white/40 px-7 py-4 rounded-xl text-lg font-medium shadow-xl flex items-center justify-center gap-3"
                  >
                    <motion.div
                      animate={{ 
                        scale: pulseAnimation ? 1.2 : 1,
                        rotate: pulseAnimation ? 5 : 0
                      }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      <div className="relative z-10 bg-indigo-600 text-white rounded-full p-2.5 shadow-inner">
                        <Mic className="w-5 h-5" />
                      </div>
                      <motion.div 
                        animate={{ 
                          scale: pulseAnimation ? 1.8 : 1,
                          opacity: pulseAnimation ? 0 : 0.5,
                        }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 bg-indigo-400 rounded-full -z-10"
                      />
                    </motion.div>
                    <span>Start Recording</span>
                    
                    {/* Glass effect shimmer */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{
                        backgroundSize: "200% 200%"
                      }}
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "mirror"
                      }}
                    />
                    
                    {/* Shimmering border effect */}
                    <motion.div 
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        border: "1px solid transparent",
                        backgroundImage: "linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.5), rgba(255,255,255,0))",
                        backgroundSize: "300% 100%",
                        maskImage: "linear-gradient(to right, transparent, black, transparent)"
                      }}
                      animate={{
                        backgroundPosition: ['100% 0%', '0% 0%', '100% 0%']
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    {/* Side decoration */}
                    <div className="absolute right-0 inset-y-0 w-1.5 bg-gradient-to-b from-indigo-500 via-blue-500 to-purple-500" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ 
                      scale: 1.03, 
                      backgroundColor: "rgba(255,255,255,0.15)",
                      y: -2
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="relative overflow-hidden border border-purple-400/30 text-white hover:text-indigo-100 px-6 py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 backdrop-blur-lg bg-gradient-to-r from-purple-600/20 to-indigo-600/20 shadow-lg"
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      animate={{ 
                        y: [0, -3, 0],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                      className="relative bg-gradient-to-tr from-purple-500 to-indigo-500 p-1.5 rounded-full"
                    >
                      <Upload className="w-4 h-4" />
                    </motion.div>
                    
                    <span className="relative">
                      Upload Audio File
                      <motion.span 
                        className="absolute -bottom-1 left-0 right-0 h-[1px] bg-purple-300/50"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      />
                    </span>
                    
                    {/* Animated particles */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white/70"
                        style={{ 
                          left: `${10 + (i * 15)}%`,
                          top: '50%'
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0, 0.7, 0],
                          scale: [0.5, 1.2, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                    
                    {/* Edge glow effect */}
                    <motion.div 
                      className="absolute inset-0 rounded-xl"
                      style={{
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
                      }}
                      animate={{
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.button>
                  
                  {/* Quick start guide */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-xs text-white/70 mt-2 bg-white/10 backdrop-blur-sm p-2 rounded-lg"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <Play className="w-3 h-3" />
                      <span className="font-medium text-white/90">Quick Start</span>
                    </div>
                    <p>Press record and speak clearly for best results. AI processing begins instantly.</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="grid grid-cols-4 gap-6 mb-8"
      >
        {[
          { 
            icon: <Clock className="w-5 h-5 dark:text-blue-400 text-blue-600" />, 
            value: "24.5h", 
            label: "Study Time", 
            color: "dark:from-blue-500/20 dark:to-blue-600/20 from-blue-100 to-blue-200",
            iconBg: "dark:bg-blue-500 bg-blue-600",
            accentColor: "dark:bg-blue-500/20 bg-blue-500/10",
            borderColor: "dark:border-blue-200/20 border-blue-200",
            progressValue: 65
          },
          { 
            icon: <BookOpen className="w-5 h-5 dark:text-purple-400 text-purple-600" />, 
            value: "12", 
            label: "Classes", 
            color: "dark:from-purple-500/20 dark:to-purple-600/20 from-purple-100 to-purple-200",
            iconBg: "dark:bg-purple-500 bg-purple-600",
            accentColor: "dark:bg-purple-500/20 bg-purple-500/10",
            borderColor: "dark:border-purple-200/20 border-purple-200",
            progressValue: 40
          },
          { 
            icon: <Trophy className="w-5 h-5 dark:text-green-400 text-green-600" />, 
            value: "85%", 
            label: "Completion", 
            color: "dark:from-green-500/20 dark:to-green-600/20 from-green-100 to-green-200",
            iconBg: "dark:bg-green-500 bg-green-600",
            accentColor: "dark:bg-green-500/20 bg-green-500/10",
            borderColor: "dark:border-green-200/20 border-green-200",
            progressValue: 85
          },
          { 
            icon: <Layers className="w-5 h-5 dark:text-amber-400 text-amber-600" />, 
            value: "250", 
            label: "Flashcards", 
            color: "dark:from-amber-500/20 dark:to-amber-600/20 from-amber-100 to-amber-200",
            iconBg: "dark:bg-amber-500 bg-amber-600",
            accentColor: "dark:bg-amber-500/20 bg-amber-500/10",
            borderColor: "dark:border-amber-200/20 border-amber-200",
            progressValue: 55
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
            whileHover={{ 
              y: -5, 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className="overflow-hidden group"
          >
            <Card className={`relative border ${item.borderColor} bg-gradient-to-br ${item.color} backdrop-blur-xl hover:shadow-2xl transition-all duration-300`}>
              <CardContent className="p-6">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-30">
                  <motion.div 
                    className={`absolute inset-0 ${item.accentColor} rounded-full blur-2xl`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>

                <div className="relative">
                  {/* Icon and value section */}
                  <div className="flex items-center justify-between mb-4">
                    <motion.div 
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className={`p-2.5 rounded-xl ${item.iconBg} dark:bg-opacity-10 bg-opacity-10 backdrop-blur-sm border dark:border-white/10 border-gray-400/20 shadow-inner group-hover:shadow-lg transition-all duration-300`}
                    >
                      {item.icon}
                    </motion.div>
                    
                    {/* Progress indicator */}
                    <div className="relative w-12 h-12">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          strokeWidth="3"
                          fill="none"
                          stroke="currentColor"
                          className="dark:text-white/10 text-gray-200"
                        />
                        <motion.circle
                          cx="24"
                          cy="24"
                          r="20"
                          strokeWidth="3"
                          fill="none"
                          stroke="currentColor"
                          className={`dark:text-${item.iconBg.split('-')[1]}-400 text-${item.iconBg.split('-')[1]}-600`}
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - item.progressValue / 100)}`}
                          initial={{ strokeDashoffset: `${2 * Math.PI * 20}` }}
                          animate={{ strokeDashoffset: `${2 * Math.PI * 20 * (1 - item.progressValue / 100)}` }}
                          transition={{ duration: 1.5, delay: 0.5 + (index * 0.1) }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium dark:text-white text-gray-900">
                        {item.progressValue}%
                      </div>
                    </div>
                  </div>

                  {/* Value and label */}
                  <div className="relative">
                    <h3 className="text-3xl font-bold dark:text-white text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-300">
                      {item.value}
                    </h3>
                    <p className="dark:text-white/70 text-gray-600">{item.label}</p>
                    
                    {/* Decorative line */}
                    <motion.div 
                      className={`absolute -bottom-2 left-0 h-0.5 ${item.iconBg} dark:bg-opacity-20 bg-opacity-20`}
                      initial={{ width: "0%" }}
                      animate={{ width: "40%" }}
                      transition={{ duration: 0.8, delay: 0.6 + (index * 0.1) }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Classes */}
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl backdrop-blur-sm border border-blue-200/20"
            >
              <BookOpen className="w-5 h-5 text-blue-600" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">Recent Classes</h2>
              <p className="text-sm text-gray-500">Continue where you left off</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative group px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800"
          >
            <span className="relative z-10">View All</span>
            <motion.div
              className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
              transition={{ duration: 0.2 }}
            />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { 
              title: "Advanced Calculus", 
              subject: "Mathematics", 
              time: "1h 20m", 
              ago: "2h ago", 
              color: "from-blue-500/20 to-blue-600/20",
              iconBg: "bg-blue-500",
              progress: 75,
              icon: <Play className="w-4 h-4" />
            },
            { 
              title: "Quantum Mechanics", 
              subject: "Physics", 
              time: "2h 15m", 
              ago: "Yesterday", 
              color: "from-purple-500/20 to-purple-600/20",
              iconBg: "bg-purple-500",
              progress: 45,
              icon: <BookOpen className="w-4 h-4" />
            },
            { 
              title: "Organic Chemistry", 
              subject: "Chemistry", 
              time: "1h 45m", 
              ago: "2 days ago", 
              color: "from-green-500/20 to-green-600/20",
              iconBg: "bg-green-500",
              progress: 60,
              icon: <FileText className="w-4 h-4" />
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
              whileHover={{ 
                y: -5,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group"
            >
              <Card className={`relative overflow-hidden border border-white/10 bg-gradient-to-br ${item.color} backdrop-blur-xl hover:shadow-2xl transition-all duration-300`}>
                <CardContent className="p-6">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-30">
                    <motion.div 
                      className={`absolute inset-0 ${item.iconBg} rounded-full blur-2xl`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>

                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`dark:bg-white/10 bg-black/10 hover:bg-black/20 dark:hover:bg-white/20 backdrop-blur-sm text-dark dark:text-white border-none px-3 py-1 text-xs font-medium`}>
                        {item.subject}
                      </Badge>
                      <Badge variant="outline" className="text-xs dark:text-white/70 text-gray-500 border-gray-500/40 dark:border-white/20">
                        {item.ago}
                      </Badge>
                    </div>

                    {/* Title and description */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg dark:text-white text-gray-900 group-hover:scale-105 transition-transform duration-300 mb-2">{item.title}</h3>
                      <p className="dark:text-white/70 text-gray-500 text-sm">
                        {item.subject === "Mathematics" ? "Differential Equations" : 
                         item.subject === "Physics" ? "Wave Functions" : "Carbon Compounds"}
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="dark:text-white/70 text-gray-500">Progress</span>
                        <span className="dark:text-white text-black font-medium">{item.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${item.iconBg}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 1, delay: 0.8 + (index * 0.1) }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm dark:text-white/70 text-black">
                        <Clock className="w-4 h-4" />
                        <span>{item.time}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, x: 3 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 ${item.iconBg} dark:bg-opacity-10 bg-opacity-10 rounded-lg backdrop-blur-sm border border-gray-500/40 dark:border-white/10 dark:text-white text-black group-hover:bg-opacity-20 transition-all duration-300`}
                      >
                        {item.icon}
                      </motion.button>
                    </div>

                    {/* Decorative line */}
                    <motion.div 
                      className={`absolute -bottom-6 left-0 h-0.5 ${item.iconBg} bg-opacity-20`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 1 + (index * 0.1) }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
} 