'use client'

import { useState } from 'react'
import { ArrowLeft, ChevronRight, Mail, Camera, User, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// SVG Icons como componentes
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

const AppleIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87A4.92 4.92 0 0 0 4.69 9.39C2.93 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53 1.3-.05 1.8-.84 3.37-.84s2 .84 3.4.81c1.4-.02 2.29-1.27 3.15-2.47a11 11 0 0 0 1.42-2.91 4.39 4.39 0 0 1-2.64-3.96z" />
  </svg>
)

const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24z" />
    <path fill="currentColor" d="M24 24H12.6V12.6H24V24z" />
    <path fill="currentColor" d="M11.4 11.4H0V0h11.4v11.4z" />
    <path fill="currentColor" d="M24 11.4H12.6V0H24v11.4z" />
  </svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [step, setStep] = useState('email')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 'email') {
      if (isSignUp) {
        setIsCodeSent(true)
        setStep('verify-email')
        console.log('Sending verification code to:', email)
      } else {
        setStep('password')
      }
    } else if (step === 'verify-email') {
      const code = verificationCode.join('')
      if (code.length === 6) {
        console.log('Verifying code:', code)
        setStep('signup-details')
      }
    } else if (step === 'password') {
      try {
        // Por ahora, simplemente redirigimos al dashboard
        window.location.href = '/dashboard'
      } catch (error) {
        console.error('Login failed:', error)
      }
    } else if (step === 'signup-details') {
      try {
        // Por ahora, simplemente redirigimos al dashboard
        window.location.href = '/dashboard'
      } catch (error) {
        console.error('Signup failed:', error)
      }
    }
  }

  const handleBack = () => {
    if (step === 'verify-email') {
      setStep('email')
      setIsCodeSent(false)
      setVerificationCode(['', '', '', '', '', ''])
    } else if (step === 'password' || step === 'signup-details') {
      setStep('email')
      setIsSignUp(false)
    }
  }

  const handleVerificationCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)
      
      // Auto-focus next input
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && verificationCode[index] === '' && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
      
      {/* Background patterns and lights */}
      <div>
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
      </div>

      {/* Content Container */}
      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm">
          {/* Back Button */}
          {step === 'email' ? (
            <Link 
              href="/"
              className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-white/10 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al inicio</span>
            </Link>
          ) : (
            <button
              onClick={handleBack}
              className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-white/10 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{step === 'verify-email' ? 'Volver al email' : 'Volver atrás'}</span>
            </button>
          )}

          {/* Login Form */}
          <form onSubmit={handleContinue} className="relative w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-black/20 dark:border-white/20 overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none"></div>
            
            {/* Content */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform hover:scale-110 transition-transform">
                  <div className="w-5 h-5 bg-white rounded-sm transform rotate-45"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {step === 'email' 
                      ? (isSignUp ? 'Create Account' : 'Welcome back')
                      : step === 'verify-email'
                      ? 'Verify your email'
                      : step === 'signup-details'
                      ? 'Complete your profile'
                      : 'Enter password'}
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                    {step === 'email'
                      ? (isSignUp ? 'Get started with ClassScribe' : 'Sign in to continue to ClassScribe')
                      : step === 'verify-email'
                      ? 'Enter the 6-digit code sent to your email'
                      : step === 'signup-details'
                      ? 'Tell us more about you'
                      : 'Secure login'}
                  </p>
                </div>
              </div>

              {step === 'email' ? (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/40 dark:bg-white/5 border border-slate-400 dark:border-slate-400 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group mt-4"
                  >
                    {isSignUp ? 'Continue with email' : 'Continue'}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <div className="relative my-6 flex items-center">
                    <div className="flex-grow border-t border-slate-400 dark:border-white/10"></div>
                    <span className="mx-4 flex-shrink-0 text-sm text-slate-600 dark:text-gray-400">Or continue with</span>
                    <div className="flex-grow border-t border-slate-400 dark:border-white/10"></div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => window.location.href = '/dashboard'}
                      className="flex items-center justify-center px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:scale-105 hover:border-blue-500/50 group"
                    >
                      <div className="text-slate-700 dark:text-white group-hover:text-blue-500 transition-colors">
                        <GoogleIcon />
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.location.href = '/dashboard'}
                      className="flex items-center justify-center px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:scale-105 hover:border-blue-500/50 group"
                    >
                      <div className="text-slate-700 dark:text-white group-hover:text-blue-500 transition-colors">
                        <AppleIcon />
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.location.href = '/dashboard'}
                      className="flex items-center justify-center px-4 py-3 border border-black/10 dark:border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:scale-105 hover:border-blue-500/50 group"
                    >
                      <div className="text-slate-700 dark:text-white group-hover:text-blue-500 transition-colors">
                        <MicrosoftIcon />
                      </div>
                    </button>
                  </div>
                </>
              ) : step === 'verify-email' ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 border border-slate-400 dark:border-slate-400 rounded-xl bg-white/20 dark:bg-white/5">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-900 dark:text-white">{email}</div>
                      <div className="text-xs text-slate-600 dark:text-gray-400">Verification code sent</div>
                    </div>
                    {isCodeSent && (
                      <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between gap-2">
                      {verificationCode.map((digit, index) => (
                        <input
                          key={index}
                          id={`code-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-12 text-center bg-white/40 dark:bg-white/5 border border-slate-400 dark:border-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white text-xl font-semibold"
                          required
                        />
                      ))}
                    </div>

                    <Button
                      type="submit"
                      disabled={verificationCode.some(digit => digit === '')}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Verify email
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <button
                      type="button"
                      className="w-full text-sm text-blue-500 hover:text-blue-400 transition-colors text-center mt-4"
                      onClick={() => {
                        setIsCodeSent(true)
                        // Here you would make an API call to resend the code
                        console.log('Resending code to:', email)
                      }}
                    >
                      Resend code
                    </button>
                  </div>
                </>
              ) : step === 'signup-details' ? (
                <>
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-white/40 dark:bg-white/5 border-2 border-slate-400 dark:border-slate-400 flex items-center justify-center overflow-hidden">
                          {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <Camera className="w-8 h-8 text-slate-400" />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="profile-image"
                        />
                        <label
                          htmlFor="profile-image"
                          className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
                        >
                          <Camera className="w-4 h-4 text-white" />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white/40 dark:bg-white/5 border border-slate-400 dark:border-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                          placeholder="Choose a username"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-2">
                        Password
                      </label>
                      <input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/40 dark:bg-white/5 border border-slate-400 dark:border-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                        placeholder="Create a password"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group"
                    >
                      Create account
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-4 py-2 border border-slate-400 dark:border-slate-200 dark:border-white/10 rounded-xl bg-white/20 dark:bg-white/5">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-900 dark:text-white">{email}</div>
                      <div className="text-xs text-slate-600 dark:text-gray-400">Personal Account</div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/40 dark:bg-white/5 border border-slate-400 dark:border-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group"
                  >
                    Sign in
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <button
                    type="button"
                    className="w-full text-sm text-blue-500 hover:text-blue-400 transition-colors text-center"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {step === 'email' && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <button 
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)} 
                      className="text-blue-500 hover:text-blue-400 transition-colors font-medium"
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                  <div className="mt-4 flex justify-center items-center gap-2 text-xs text-slate-500">
                    <Link href="/terms" className="hover:text-blue-500 transition-colors">
                      Terms of Service
                    </Link>
                    <span>·</span>
                    <Link href="/privacy" className="hover:text-blue-500 transition-colors">
                      Privacy Policy
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Bottom Back Button - Only visible on mobile */}
          <div className="mt-6 text-center md:hidden">
            {step === 'email' ? (
              <Link 
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white/5 hover:bg-white/10 backdrop-blur-sm w-full"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver al inicio</span>
              </Link>
            ) : (
              <button
                onClick={handleBack}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white/5 hover:bg-white/10 backdrop-blur-sm w-full"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>{step === 'verify-email' ? 'Volver al email' : 'Volver atrás'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 