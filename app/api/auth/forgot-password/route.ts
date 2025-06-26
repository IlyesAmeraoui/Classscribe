import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Schéma de validation pour la demande de réinitialisation
const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
})

// Mock database - En production, utilisez une vraie base de données
let users: any[] = [
  {
    id: '1',
    email: 'demo@classscribe.com',
    password: '$2a$10$demo.hash.for.demo.user',
    username: 'demo_user',
    profileImage: null,
    role: 'student',
    createdAt: new Date(),
    isEmailVerified: true,
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données
    const validatedData = forgotPasswordSchema.parse(body)
    
    // Trouver l'utilisateur
    const user = users.find(u => u.email === validatedData.email)
    if (!user) {
      // Pour des raisons de sécurité, ne pas révéler si l'email existe ou non
      return NextResponse.json({
        message: 'Si un compte avec cet email existe, vous recevrez un email de réinitialisation',
      })
    }
    
    // Générer un token de réinitialisation
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 heure
    
    // Stocker le token de réinitialisation
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetTokenExpires
    
    // En production, envoyez un vrai email ici
    console.log(`Token de réinitialisation pour ${user.email}: ${resetToken}`)
    
    return NextResponse.json({
      message: 'Si un compte avec cet email existe, vous recevrez un email de réinitialisation',
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erreur lors de la demande de réinitialisation:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 