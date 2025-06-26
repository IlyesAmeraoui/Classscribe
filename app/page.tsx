'use client'

import { ArrowRight, Play, BookOpen, Mic, Brain, Sparkles, Users, Clock, ChevronRight, Star, Shield, Menu, Sun, Moon, Twitter, Github, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import './styles.css'

declare global {
  interface Window {
    demoInterval: NodeJS.Timeout | null;
  }
}

export default function HomePage() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeMobileSection, setActiveMobileSection] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Efecto para inicializar el tema desde localStorage y configurar los observadores
  useEffect(() => {
    // Recuperar tema guardado o usar preferencia del sistema
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');

    // Observar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Efecto para cerrar secciones móviles cuando se cierra el menú
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setActiveMobileSection(null);
    }
  }, [isMobileMenuOpen]);

  // Función para cambiar el tema
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  const menuSections = {
    Products: [
      {
        icon: <Users className="w-5 h-5 text-blue-400" />,
        title: "For Students",
        description: "Smart note-taking and study tools",
        color: "from-blue-500/20 to-blue-600/5"
      },
      {
        icon: <BookOpen className="w-5 h-5 text-purple-400" />,
        title: "For Teachers",
        description: "Class management and content creation",
        color: "from-purple-500/20 to-purple-600/5"
      },
      {
        icon: <Brain className="w-5 h-5 text-green-400" />,
        title: "For Schools",
        description: "Institution-wide learning solutions",
        color: "from-green-500/20 to-green-600/5"
      },
      {
        icon: <Sparkles className="w-5 h-5 text-yellow-400" />,
        title: "Mobile App",
        description: "Coming soon to iOS and Android",
        color: "from-yellow-500/20 to-yellow-600/5"
      },
      {
        icon: <Clock className="w-5 h-5 text-pink-400" />,
        title: "Dashboard Overview",
        description: "Manage all your content in one place",
        color: "from-pink-500/20 to-pink-600/5"
      },
      {
        icon: <Star className="w-5 h-5 text-orange-400" />,
        title: "Plans & Pricing",
        description: "Find the perfect plan for you",
        color: "from-orange-500/20 to-orange-600/5"
      }
    ],
    Solutions: [
      {
        icon: <Mic className="w-5 h-5 text-blue-400" />,
        title: "Auto Transcription",
        description: "Real-time class transcription",
        color: "from-blue-500/20 to-blue-600/5"
      },
      {
        icon: <Brain className="w-5 h-5 text-purple-400" />,
        title: "AI Summaries",
        description: "Smart content summarization",
        color: "from-purple-500/20 to-purple-600/5"
      },
      {
        icon: <BookOpen className="w-5 h-5 text-green-400" />,
        title: "STEM Recognition",
        description: "Formula and diagram detection",
        color: "from-green-500/20 to-green-600/5"
      },
      {
        icon: <ArrowRight className="w-5 h-5 text-yellow-400" />,
        title: "Export Options",
        description: "PDF and PowerPoint export",
        color: "from-yellow-500/20 to-yellow-600/5"
      },
      {
        icon: <Sparkles className="w-5 h-5 text-pink-400" />,
        title: "Focus Boost",
        description: "Enhance learning productivity",
        color: "from-pink-500/20 to-pink-600/5"
      },
      {
        icon: <Users className="w-5 h-5 text-orange-400" />,
        title: "Accessibility",
        description: "Support for all learners",
        color: "from-orange-500/20 to-orange-600/5"
      }
    ],
    Resources: [
      {
        icon: <BookOpen className="w-5 h-5 text-blue-400" />,
        title: "Documentation",
        description: "Detailed guides and tutorials",
        color: "from-blue-500/20 to-blue-600/5"
      },
      {
        icon: <Play className="w-5 h-5 text-purple-400" />,
        title: "Quick Start",
        description: "Get started in minutes",
        color: "from-purple-500/20 to-purple-600/5"
      },
      {
        icon: <Brain className="w-5 h-5 text-green-400" />,
        title: "API Reference",
        description: "Developer documentation",
        color: "from-green-500/20 to-green-600/5"
      },
      {
        icon: <Clock className="w-5 h-5 text-yellow-400" />,
        title: "Changelog",
        description: "Latest updates and releases",
        color: "from-yellow-500/20 to-yellow-600/5"
      },
      {
        icon: <Users className="w-5 h-5 text-pink-400" />,
        title: "Community",
        description: "Join our forum and discuss",
        color: "from-pink-500/20 to-pink-600/5"
      },
      {
        icon: <Sparkles className="w-5 h-5 text-orange-400" />,
        title: "Shortcuts",
        description: "Keyboard shortcuts guide",
        color: "from-orange-500/20 to-orange-600/5"
      }
    ],
    Company: [
      {
        icon: <Users className="w-5 h-5 text-blue-400" />,
        title: "About Us",
        description: "Our story and mission",
        color: "from-blue-500/20 to-blue-600/5"
      },
      {
        icon: <Star className="w-5 h-5 text-purple-400" />,
        title: "Meet the Team",
        description: "The people behind ClassScribe",
        color: "from-purple-500/20 to-purple-600/5"
      },
      {
        icon: <ArrowRight className="w-5 h-5 text-green-400" />,
        title: "Press Kit",
        description: "Media resources and assets",
        color: "from-green-500/20 to-green-600/5"
      },
      {
        icon: <BookOpen className="w-5 h-5 text-yellow-400" />,
        title: "Legal",
        description: "Terms, privacy, and policies",
        color: "from-yellow-500/20 to-yellow-600/5"
      },
      {
        icon: <Brain className="w-5 h-5 text-pink-400" />,
        title: "Careers",
        description: "Join our growing team",
        color: "from-pink-500/20 to-pink-600/5"
      },
      {
        icon: <Clock className="w-5 h-5 text-orange-400" />,
        title: "Roadmap",
        description: "Our future plans and vision",
        color: "from-orange-500/20 to-orange-600/5"
      }
    ]
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      alert('Thanks for subscribing! We will keep you updated.');
      setEmail('');
    } else {
      alert('Please enter a valid email address');
    }
  };

  const handleNavigation = (path: string) => {
    const element = document.getElementById(path.toLowerCase().replace(' ', '-'));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleButtonHover = (buttonId: string, isHovered: boolean) => {
    setHoveredButton(isHovered ? buttonId : null);
  };

  const handleBetaClick = () => {
    window.open('/beta-signup', '_blank');
  };

  const handleLearnMoreClick = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Función para inicializar las animaciones
    function initializeAnimations() {
      // Primero, verificar si el script ya existe
      const existingScript = document.getElementById('demo-animation-script');
      if (existingScript) {
        existingScript.remove();
      }

      // Limpiar cualquier intervalo existente
      if (window.demoInterval) {
        clearInterval(window.demoInterval);
      }

      const script = document.createElement('script');
      script.id = 'demo-animation-script';
      script.textContent = `
        window.demoInterval = null;

        function cycleSteps() {
          const steps = ['step1', 'step2', 'step3'];
          let currentStep = parseInt(localStorage.getItem('demoStep') || '0');

          function updateSteps(immediate = false) {
            steps.forEach((stepId, index) => {
              const step = document.getElementById(stepId);
              const indicator = document.querySelectorAll('.flex.justify-center.gap-2.mt-4 > div')[index];
              
              if (step && indicator) {
                if (index === currentStep) {
                  step.style.visibility = 'visible';
                  if (immediate) {
                    step.style.transition = 'none';
                    step.style.opacity = '1';
                    step.style.transform = 'translateX(0)';
                    setTimeout(() => {
                      step.style.transition = 'all 700ms ease-in-out';
                    }, 50);
                  } else {
                    step.style.opacity = '1';
                    step.style.transform = 'translateX(0)';
                  }
                  indicator.className = 'w-2 h-2 rounded-full bg-blue-500 scale-125 transition-all duration-700 ease-in-out';
                } else {
                  const direction = index < currentStep ? '-100%' : '100%';
                  if (immediate) {
                    step.style.transition = 'none';
                    step.style.opacity = '0';
                    step.style.transform = 'translateX(' + direction + ')';
                    step.style.visibility = 'hidden';
                    setTimeout(() => {
                      step.style.transition = 'all 700ms ease-in-out';
                    }, 50);
                  } else {
                    step.style.opacity = '0';
                    step.style.transform = 'translateX(' + direction + ')';
                    setTimeout(() => {
                      if (index !== currentStep) {
                        step.style.visibility = 'hidden';
                      }
                    }, 700);
                  }
                  indicator.className = 'w-2 h-2 rounded-full bg-slate-200 dark:bg-white/20 scale-100 transition-all duration-700 ease-in-out';
                }
              }
            });
          }

          updateSteps(true);

          if (window.demoInterval) {
            clearInterval(window.demoInterval);
          }

          window.demoInterval = setInterval(() => {
            currentStep = (currentStep + 1) % steps.length;
            localStorage.setItem('demoStep', currentStep.toString());
            updateSteps(false);
          }, 4000);
        }

        function startAnimations() {
          if (window.demoInterval) {
            clearInterval(window.demoInterval);
          }
          cycleSteps();
        }

        startAnimations();

        // Reiniciar animaciones cuando la página vuelve a estar visible
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            startAnimations();
          } else if (window.demoInterval) {
            clearInterval(window.demoInterval);
          }
        });
      `;
      document.body.appendChild(script);
    }

    // Inicializar animaciones cuando el componente se monta
    initializeAnimations();

    // Limpiar cuando el componente se desmonta
    return () => {
      const script = document.getElementById('demo-animation-script');
      if (script) {
        script.remove();
      }
      if (window.demoInterval) {
        clearInterval(window.demoInterval);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden transition-colors duration-300">
      {/* Theme-related style */}
      <style jsx>{`
        :root {
          color-scheme: ${theme};
        }
      `}</style>

      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Animated Background Lights */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.1) 70%)',
            animation: 'glowPulse 4s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(147,51,234,0.1) 70%)',
            animation: 'glowPulse 5s ease-in-out infinite',
            animationDelay: '-2s'
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.05) 70%)',
            animation: 'glowPulse 6s ease-in-out infinite',
            animationDelay: '-1s'
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div 
            className="relative bg-white/60 dark:bg-black/60 backdrop-blur-lg rounded-2xl border border-slate-200/20 dark:border-white/10 shadow-2xl shadow-black/5 transition-all duration-300 hover:shadow-blue-500/10 hover:border-blue-500/20 group navbar-container"
            style={{
              transform: 'translateY(0)',
              opacity: 1,
              animation: 'floatNavbar 3s ease-in-out infinite'
            }}
            onMouseLeave={() => {
              setTimeout(() => {
                setActiveSection(null);
              }, 100);
            }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-20"></div>
            <div className="relative flex flex-col">
              {/* Top part - Main navigation */}
              <div 
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group hover:scale-110 transition-transform">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-sm transform rotate-45 group-hover:rotate-90 transition-transform"></div>
                  </div>
                  <span className="hidden sm:inline-block text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    ClassScribe
                  </span>
                </div>

                <nav className="hidden md:flex items-center gap-8 lg:gap-12">
                  {Object.keys(menuSections).map((item) => (
                    <button
                      key={item}
                      className={`text-slate-700 dark:text-white font-medium transition-colors relative group/item ${
                        activeSection === item ? 'text-blue-500 dark:text-blue-400' : ''
                      }`}
                      onMouseEnter={() => setActiveSection(item)}
                    >
                      {item}
                      <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-500 dark:bg-blue-400 transition-all duration-300 ${
                        activeSection === item ? 'w-full' : 'w-0 group-hover/item:w-full'
                      }`}></span>
                    </button>
                  ))}
                </nav>

                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Theme Toggle Button */}
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Moon className="w-5 h-5 text-slate-700" />
                    )}
                  </button>

                  <Button 
                    onClick={() => window.location.href = '/login'}
                    className="login-button bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium flex items-center gap-2 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all shadow-md hover:shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 group text-sm sm:text-base border border-transparent hover:border-blue-400/20"
                  >
                    Login
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Mobile Menu */}
              <div 
                className={`md:hidden overflow-hidden transition-all duration-300 ${
                  isMobileMenuOpen ? 'max-h-[80vh] border-t border-slate-200/20 dark:border-white/10' : 'max-h-0'
                }`}
              >
                <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  {Object.keys(menuSections).map((item) => (
                    <div key={item} className="space-y-2">
                      <button
                        className="w-full text-left text-slate-700 dark:text-white font-medium transition-colors relative group/item flex items-center justify-between"
                        onClick={() => {
                          setActiveMobileSection(activeMobileSection === item ? null : item);
                        }}
                      >
                        <span>{item}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                          activeMobileSection === item ? 'rotate-90' : ''
                        }`} />
                      </button>
                      
                      {/* Section Content */}
                      <div 
                        className={`overflow-hidden transition-all duration-300 ${
                          activeMobileSection === item ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="grid grid-cols-1 gap-2 pt-2">
                          {menuSections[item as keyof typeof menuSections].map((feature, index) => (
                            <button
                              key={index}
                              className="p-3 rounded-xl bg-gradient-to-br hover:scale-105 transition-all duration-200 border border-slate-200/20 dark:border-white/10 text-left"
                              style={{
                                background: `linear-gradient(to bottom right, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[2]})`
                              }}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 rounded-lg bg-white/5">
                                  {feature.icon}
                                </div>
                                <h3 className="text-slate-900 dark:text-white font-medium text-sm">{feature.title}</h3>
                              </div>
                              <p className="text-slate-600 dark:text-gray-300 text-sm">{feature.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom part - Expanded features */}
              <div 
                className={`overflow-hidden transition-all duration-300 px-6 ${
                  activeSection ? 'h-[225px]' : 'h-0'
                }`}
              >
                <div className="grid grid-cols-3 gap-3 py-4 border-t border-slate-200/20 dark:border-white/10">
                  {activeSection && menuSections[activeSection as keyof typeof menuSections].map((feature, index) => (
                    <button
                      key={index}
                      className={`group/feature p-3 rounded-xl bg-gradient-to-br ${feature.color} hover:scale-105 transition-all duration-200 border border-slate-200/20 dark:border-white/10 text-left`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="p-1.5 rounded-lg bg-white/5 group-hover/feature:bg-white/10 transition-colors">
                          {feature.icon}
                        </div>
                        <h3 className="text-slate-900 dark:text-white font-medium group-hover/feature:text-blue-500 transition-colors text-sm">{feature.title}</h3>
                      </div>
                      <p className="text-slate-600 dark:text-gray-300 group-hover/feature:text-blue-500 transition-colors">{feature.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Add scroll behavior script */}
      <script dangerouslySetInnerHTML={{ __html: `
        let lastScrollY = window.scrollY;
        const navbar = document.querySelector('header');
        const navbarContent = navbar.querySelector('div > div');

        window.addEventListener('scroll', () => {
          if (window.scrollY < lastScrollY || window.scrollY < 100) {
            navbarContent.classList.remove('navbar-hidden');
            navbarContent.classList.add('navbar-visible');
          } else {
            navbarContent.classList.add('navbar-hidden');
            navbarContent.classList.remove('navbar-visible');
          }
          lastScrollY = window.scrollY;
        });
      `}} />

      {/* Hero Section */}
      <main className="pt-24 sm:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Side - Main Content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-white/10 rounded-full backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-700 dark:text-white/80 text-sm">Coming Soon - Join the Beta</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 dark:text-white">
                Transform Your{" "}
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-green-400/30 rounded-2xl transform -rotate-2"></span>
                  <span className="relative meow-script text-6xl sm:text-7xl lg:text-8xl">Learning</span>
                </span>
                ,<br />
                Amplify Your Mind!
              </h1>

              <p className="text-slate-600 dark:text-gray-300 text-lg sm:text-xl max-w-md leading-relaxed">
                ClassScribe turns your lectures into smart notes instantly, powered by AI. Focus on understanding while we handle the note-taking.
              </p>

              {/* Hero Section Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                <button
                  onClick={handleBetaClick}
                  onMouseEnter={() => handleButtonHover('beta', true)}
                  onMouseLeave={() => handleButtonHover('beta', false)}
                  className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 sm:px-6 py-2.5 sm:py-3 rounded-full text-base font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 active:scale-100 group w-full sm:w-auto flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-white/10 transform origin-left transition-transform duration-200 scale-x-0 group-hover:scale-x-100"></div>
                  <span className="relative flex items-center gap-2">
                    Join Beta Access
                    <ArrowRight className={`w-4 h-4 transition-transform duration-200 ${hoveredButton === 'beta' ? 'translate-x-2' : ''}`} />
                  </span>
                </button>

                <button
                  onClick={handleLearnMoreClick}
                  onMouseEnter={() => handleButtonHover('learn', true)}
                  onMouseLeave={() => handleButtonHover('learn', false)}
                  className="relative overflow-hidden px-6 sm:px-6 py-2.5 sm:py-3 rounded-full text-base font-medium border border-slate-400 dark:border-white/10 text-slate-700 dark:text-white transition-all duration-200 hover:border-blue-500 hover:text-blue-400 hover:scale-105 active:scale-100 group w-full sm:w-auto flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-white/5 transform origin-left transition-transform duration-200 scale-x-0 group-hover:scale-x-100"></div>
                  <span className="relative flex items-center gap-2">
                    Learn More
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${hoveredButton === 'learn' ? 'translate-x-2' : ''}`} />
                  </span>
                </button>
              </div>

              {/* Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button
                  className="flex items-center gap-2 px-4 py-1.5 bg-white/30 dark:bg-white/5 backdrop-blur-sm rounded-full transition-all duration-200 hover:bg-white/20 dark:hover:bg-white/10 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 group border border-slate-600/20 dark:border-white/10 w-full"
                >
                  <Clock className="w-3.5 h-4.5 text-blue-400 shrink-0 group-hover:text-blue-300 transition-colors duration-200" />
                  <span className="text-slate-700 dark:text-gray-300 text-sm whitespace-nowrap group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">Real-time Transcription</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-1.5 bg-white/30 dark:bg-white/5 backdrop-blur-sm rounded-full transition-all duration-200 hover:bg-white/20 dark:hover:bg-white/10 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 group border border-slate-600/20 dark:border-white/10 w-full"
                >
                  <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0 group-hover:text-purple-300 transition-colors duration-200" />
                  <span className="text-slate-700 dark:text-gray-300 text-sm whitespace-nowrap group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">Smart Summaries</span>
                </button>
              </div>
            </div>

            {/* Right Side - Interactive Demo */}
            <div className="relative w-full max-w-[1200px] mx-auto">
              {/* Live Recording Demo */}
              <div className="bg-white/5 dark:bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200 dark:border-white/10 shadow-xl w-full">
                {/* Header with Step Indicator */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-slate-900 dark:text-white font-medium text-base sm:text-lg">Live Recording Demo</div>
                      <div className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm">Watch the magic happen</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-gray-300">Processing...</span>
                  </div>
                </div>

                {/* Demo Steps Container */}
                <div className="relative h-[200px] sm:h-[250px] lg:h-[300px] bg-slate-100/50 dark:bg-white/5 rounded-xl p-4 sm:p-6 overflow-hidden">
                  {/* Step 1: Audio Recording */}
                  <div 
                    className="step-container absolute inset-0 p-4 flex flex-col transform transition-all duration-700 ease-in-out"
                    data-active="true"
                    id="step1"
                    style={{
                      opacity: 0,
                      transform: 'translateX(0)',
                      visibility: 'hidden'
                    }}
                  >
                    <div className="text-xs text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span>Recording</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 dark:text-gray-400">00:12</span>
                        <div className="w-[100px] h-[2px] bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      {/* Waveform Container */}
                      <div className="flex-1 flex items-end gap-1 w-full px-2 relative">
                        {/* Background Grid */}
                        <div className="absolute inset-0 grid grid-cols-12 gap-4">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="h-full border-l border-slate-200 dark:border-white/10"></div>
                          ))}
                        </div>
                        
                        {/* Time Markers */}
                        <div className="absolute top-2 left-0 right-0 flex justify-between px-4">
                          {['0:00', '0:05', '0:10', '0:15', '0:20'].map((time) => (
                            <span key={time} className="text-[10px] text-slate-500 dark:text-gray-400">{time}</span>
                          ))}
                        </div>

                        {/* Audio Bars */}
                        <div className="flex-1 flex items-end gap-[2px] h-full">
                          {Array.from({ length: 80 }).map((_, i) => {
                            const baseHeight = Math.random() * 60 + 20;
                            return (
                              <div
                                key={i}
                                className="recording-bar flex-1 bg-gradient-to-t from-blue-500/30 to-blue-400/50 dark:from-blue-500/50 dark:to-blue-400/70 rounded-full relative group"
                                style={{ 
                                  height: `${baseHeight}%`,
                                  animation: `barAnimation ${0.8 + Math.random() * 0.4}s ease-in-out infinite`,
                                  animationDelay: `${i * 0.02}s`
                                }}
                              >
                                <div 
                                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{
                                    boxShadow: '0 0 10px rgba(96, 165, 250, 0.5)'
                                  }}
                                ></div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Floating Particles */}
                        <div className="absolute inset-0 pointer-events-none">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-1 h-1 bg-blue-400/30 dark:bg-blue-400/50 rounded-full"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animation: `float ${2 + Math.random() * 2}s ease-in-out infinite`,
                                animationDelay: `${i * 0.2}s`
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Controls */}
                      <div className="mt-4 flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                          <div className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1">
                            <span className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></span>
                            Input Level: 48db
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1">
                            <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                            Quality: High
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Transcription */}
                  <div 
                    className="step-container absolute inset-0 p-4 flex flex-col transform transition-all duration-700 ease-in-out"
                    data-active="false"
                    id="step2"
                    style={{
                      opacity: 0,
                      transform: 'translateX(100%)',
                      visibility: 'hidden'
                    }}
                  >
                    <div className="text-xs text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span>Transcribing</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 dark:text-gray-400">Processing</span>
                        <div className="flex gap-0.5">
                          <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                      {/* Líneas de transcripción con efecto de escritura */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Mic className="w-3 h-3 text-purple-500" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gradient-to-r from-purple-500/20 to-transparent rounded w-[80%] animate-pulse"></div>
                            <div className="h-4 bg-gradient-to-r from-purple-500/20 to-transparent rounded w-[60%] animate-pulse" style={{ animationDelay: '200ms' }}></div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <BookOpen className="w-3 h-3 text-blue-500" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gradient-to-r from-blue-500/20 to-transparent rounded w-[70%] animate-pulse" style={{ animationDelay: '400ms' }}></div>
                            <div className="h-4 bg-gradient-to-r from-blue-500/20 to-transparent rounded w-[50%] animate-pulse" style={{ animationDelay: '600ms' }}></div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Brain className="w-3 h-3 text-green-500" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gradient-to-r from-green-500/20 to-transparent rounded w-[75%] animate-pulse" style={{ animationDelay: '800ms' }}></div>
                            <div className="h-4 bg-gradient-to-r from-green-500/20 to-transparent rounded w-[55%] animate-pulse" style={{ animationDelay: '1000ms' }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Barra de progreso */}
                      <div className="mt-auto">
                        <div className="h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-2/3 animate-pulse"></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-gray-400">
                          <span>Processing text</span>
                          <span>67%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Smart Notes */}
                  <div 
                    className="step-container absolute inset-0 p-4 flex flex-col transform transition-all duration-700 ease-in-out"
                    data-active="false"
                    id="step3"
                    style={{
                      opacity: 0,
                      transform: 'translateX(100%)',
                      visibility: 'hidden'
                    }}
                  >
                    <div className="text-xs text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Generating Smart Notes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 dark:text-gray-400">AI Processing</span>
                        <div className="flex gap-0.5">
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      {/* Tarjetas de notas inteligentes */}
                      <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-3 transform transition-all hover:scale-105">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-slate-700 dark:text-white">Key Points</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-green-500/20 rounded w-[90%] animate-pulse"></div>
                          <div className="h-3 bg-green-500/20 rounded w-[75%] animate-pulse" style={{ animationDelay: '200ms' }}></div>
                          <div className="h-3 bg-green-500/20 rounded w-[85%] animate-pulse" style={{ animationDelay: '400ms' }}></div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-3 transform transition-all hover:scale-105">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-slate-700 dark:text-white">Summary</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-blue-500/20 rounded w-[85%] animate-pulse" style={{ animationDelay: '300ms' }}></div>
                          <div className="h-3 bg-blue-500/20 rounded w-[70%] animate-pulse" style={{ animationDelay: '500ms' }}></div>
                          <div className="h-3 bg-blue-500/20 rounded w-[80%] animate-pulse" style={{ animationDelay: '700ms' }}></div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-3 transform transition-all hover:scale-105">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium text-slate-700 dark:text-white">Insights</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-purple-500/20 rounded w-[80%] animate-pulse" style={{ animationDelay: '400ms' }}></div>
                          <div className="h-3 bg-purple-500/20 rounded w-[95%] animate-pulse" style={{ animationDelay: '600ms' }}></div>
                          <div className="h-3 bg-purple-500/20 rounded w-[75%] animate-pulse" style={{ animationDelay: '800ms' }}></div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl p-3 transform transition-all hover:scale-105">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-slate-700 dark:text-white">Actions</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-yellow-500/20 rounded w-[70%] animate-pulse" style={{ animationDelay: '500ms' }}></div>
                          <div className="h-3 bg-yellow-500/20 rounded w-[85%] animate-pulse" style={{ animationDelay: '700ms' }}></div>
                          <div className="h-3 bg-yellow-500/20 rounded w-[90%] animate-pulse" style={{ animationDelay: '900ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-700 ease-in-out ${
                        i === 0 
                          ? 'bg-blue-500 scale-125' 
                          : 'bg-slate-200 dark:bg-white/20 scale-100'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-4 bg-gradient-to-br from-green-400/20 to-green-500/20 rounded-2xl p-4 backdrop-blur-sm border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-700 dark:text-gray-300 text-sm">Beta Testing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Subject Areas */}
          <div className="mt-24">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                Supported
                <br />
                Subject
                <br />
                Areas
              </h3>
              <div className="h-12 w-px bg-slate-200 dark:bg-white/10"></div>
              <p className="text-slate-600 dark:text-gray-300 max-w-xs">Starting with these key areas during our beta phase</p>
            </div>

            {/* Subject Area Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Computer Science", icon: <Brain className="w-4 h-4" />, count: "2.4k" },
                { name: "Mathematics", icon: <Play className="w-4 h-4" />, count: "1.8k" },
                { name: "Physics", icon: <Sparkles className="w-4 h-4" />, count: "1.2k" },
                { name: "Engineering", icon: <Clock className="w-4 h-4" />, count: "3.1k" }
              ].map((subject) => (
                <button
                  key={subject.name}
                  className="px-6 py-4 bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white hover:text-blue-500 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105 group flex flex-col items-center gap-3"
                >
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                    {subject.icon}
                  </div>
                  <span className="whitespace-nowrap">{subject.name}</span>
                  <span className="text-xs text-slate-500 dark:text-gray-400 group-hover:text-blue-500">{subject.count} Students</span>
                </button>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-[80px] relative">
            <div className="relative inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
            <div className="relative">
              <div className="max-w-2xl mx-auto h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent mb-16"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-medium text-slate-900 dark:text-white mb-12">Featured</h2>
                
                <div className="space-y-6">
                  {[
                    {
                      title: "Advanced AI Note Processing",
                      category: "Product",
                      date: "Mar 27, 2025",
                      href: "/blog/ai-note-processing"
                    },
                    {
                      title: "Introducing Neural Learning Paths",
                      category: "Research",
                      date: "Mar 20, 2025",
                      href: "/blog/neural-learning"
                    },
                    {
                      title: "Real-time Collaboration Updates",
                      category: "Features",
                      date: "Mar 15, 2025",
                      href: "/features/collaboration"
                    },
                    {
                      title: "Global Language Support Release",
                      category: "Updates",
                      date: "Mar 10, 2025",
                      href: "/updates/global-language"
                    }
                  ].map((item) => (
                    <Link 
                      key={item.title} 
                      href={item.href}
                      className="block group cursor-pointer"
                    >
                      <div className="flex items-center justify-between py-6 border-t border-slate-200 dark:border-white/10">
                        <div className="flex-1">
                          <h3 className="text-xl text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors flex items-center gap-2">
                            {item.title}
                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                          </h3>
                        </div>
                        <div className="flex items-center gap-8">
                          <span className="text-slate-500 dark:text-gray-400">{item.category}</span>
                          <span className="text-slate-500 dark:text-gray-400 text-sm">{item.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="mt-24 sm:mt-32 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Side - Video */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden group">
                {/* Video container with custom overlay */}
                <div className="aspect-video bg-slate-800 relative group">
                  <iframe 
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/hJP5GqnTrNo?controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1"
                    title="ClassScribe Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    id="youtube-player"
                  ></iframe>
                  
                  {/* Custom overlay with play button */}
                  <div 
                    onClick={() => {
                      const overlay = document.querySelector('#video-overlay');
                      const iframe = document.querySelector('#youtube-player') as HTMLIFrameElement;
                      if (iframe && overlay) {
                        const src = iframe.src;
                        iframe.src = `${src}&autoplay=1`;
                        overlay.classList.add('opacity-0', 'pointer-events-none');
                        setTimeout(() => {
                          (overlay as HTMLElement).style.display = 'none';
                        }, 300);
                      }
                    }}
                    id="video-overlay"
                    className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 cursor-pointer group/overlay hover:bg-black/40"
                  >
                    {/* Simplified play button */}
                    <div className="relative transform transition-all duration-300 group-hover/overlay:scale-110">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-all duration-300 group-hover/overlay:bg-white/20">
                        <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[16px] border-l-white translate-x-0.5 transition-all duration-300 group-hover/overlay:border-l-[18px] group-hover/overlay:border-y-[9px]"></div>
                      </div>
                      <div className="absolute -inset-2 bg-white/20 rounded-full blur-md opacity-0 transition-opacity duration-300 group-hover/overlay:opacity-100"></div>
                    </div>
                  </div>

                  {/* Video info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/70" />
                        <span className="text-white/70 text-sm">4:32</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-white/70" />
                        <span className="text-white/70 text-sm">HD Quality</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Information */}
              <div className="space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/40 dark:bg-white/10 rounded-full backdrop-blur-sm">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                  <span className="text-slate-700 dark:text-white/80 text-xs sm:text-sm">Product Demo</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">See ClassScribe in Action</h2>
                
                <p className="text-slate-600 dark:text-gray-300 text-base sm:text-lg">Watch how ClassScribe transforms your learning experience with real-time AI-powered note-taking.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    {
                      title: "Smart Recording",
                      description: "Automatic noise cancellation and voice enhancement",
                      icon: <Mic className="w-5 h-5 text-blue-400" />,
                    },
                    {
                      title: "Real-time Notes",
                      description: "Instant transcription with key point extraction",
                      icon: <BookOpen className="w-5 h-5 text-purple-400" />
                    }
                  ].map((feature) => (
                    <div key={feature.title} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        {feature.icon}
                        <h3 className="text-slate-900 dark:text-white font-medium">{feature.title}</h3>
                      </div>
                      <p className="text-slate-600 dark:text-gray-300 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        {/* CTA Section */}
          <div className="mt-32 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl"></div>
            <div className="relative py-16 px-8 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-white/10">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Ready to Transform Your Learning?</h2>
              <p className="text-slate-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">Join thousands of students who are already experiencing the future of note-taking</p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  onClick={() => window.open('/trial-signup', '_blank')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-full text-base font-medium hover:from-blue-600 hover:to-blue-700 transition-all hover:shadow-lg hover:shadow-blue-500/20 group flex items-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  onClick={() => {
                    const demoSection = document.querySelector('#demo-video');
                    if (demoSection) {
                      demoSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  variant="outline" 
                  className="px-6 py-2.5 rounded-full text-base font-medium border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white transition-all group"
                >
                  Watch Demo
                  <Play className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>10k+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Enterprise Ready</span>
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <footer className="mt-24 sm:mt-32 border-t border-slate-200 dark:border-white/10 pt-12 sm:pt-16 pb-6 sm:pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
              {/* Company Info */}
              <div>
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm transform rotate-45"></div>
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">ClassScribe</span>
                </div>
                <p className="text-slate-600 dark:text-gray-300 text-sm mb-4">Transforming education through AI-powered note-taking technology.</p>
                <div className="flex items-center gap-3 sm:gap-4">
                  {[
                    { name: 'twitter', icon: Twitter, url: 'https://twitter.com/classscribe' },
                    { name: 'github', icon: Github, url: 'https://github.com/classscribe' },
                    { name: 'linkedin', icon: Linkedin, url: 'https://linkedin.com/classscribe' }
                  ].map(({ name, icon: Icon, url }) => (
                    <Link
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center w-8 h-8 
                      bg-slate-100 dark:bg-slate-800 
                      hover:bg-blue-100 dark:hover:bg-blue-900/30
                      border border-slate-200 dark:border-slate-700
                      hover:border-blue-300 dark:hover:border-blue-700
                      rounded-lg cursor-pointer
                      transform hover:scale-110 active:scale-95
                      transition-all duration-200 ease-in-out
                      hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <Icon 
                        className="w-4 h-4 text-slate-600 dark:text-slate-400 
                        group-hover:text-blue-600 dark:group-hover:text-blue-400 
                        transition-colors duration-200" 
                      />
                      <span className="sr-only">{name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="text-slate-900 dark:text-white font-medium mb-4">Product</h3>
                <ul className="space-y-3">
                  {['Features', 'Pricing', 'Beta Access', 'Roadmap'].map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => handleNavigation(item)}
                        className="text-slate-600 dark:text-gray-300 transition-all duration-200 text-sm cursor-pointer relative group"
                      >
                        <span className="relative">
                          {item}
                          <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-200"></span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-slate-900 dark:text-white font-medium mb-4">Company</h3>
                <ul className="space-y-3">
                  {['About Us', 'Blog', 'Careers', 'Contact'].map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => handleNavigation(item)}
                        className="text-slate-600 dark:text-gray-300 transition-all duration-200 text-sm cursor-pointer relative group"
                      >
                        <span className="relative">
                          {item}
                          <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-200"></span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="text-slate-900 dark:text-white font-medium mb-4">Stay Updated</h3>
                <p className="text-slate-600 dark:text-gray-300 text-sm mb-4">Get the latest updates and news directly in your inbox.</p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 group cursor-pointer transform hover:translate-y-[-2px] hover:shadow-lg active:translate-y-[0px] border border-transparent hover:border-blue-400/20"
                  >
                    Subscribe
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-slate-200 dark:border-white/10 pt-6 sm:pt-8 mt-8 sm:mt-12">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-slate-600 dark:text-gray-300 text-xs sm:text-sm text-center sm:text-left">
                  © 2024 ClassScribe. All rights reserved.
                </div>
                <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                  <Link 
                    href="/privacy-policy"
                    className="text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 relative group cursor-pointer"
                  >
                    <span className="relative">
                      Privacy Policy
                      <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-200"></span>
                    </span>
                  </Link>
                  <Link 
                    href="/terms-of-service"
                    className="text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 relative group cursor-pointer"
                  >
                    <span className="relative">
                      Terms of Service
                      <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-200"></span>
                    </span>
                  </Link>
                  <Link 
                    href="/cookie-policy"
                    className="text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 relative group cursor-pointer"
                  >
                    <span className="relative">
                      Cookie Policy
                      <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-200"></span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
} 