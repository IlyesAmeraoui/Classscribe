import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Schéma de validation pour la réinitialisation de mot de passe
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Le token est requis'),
  newPassword: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
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
    const validatedData = resetPasswordSchema.parse(body)
    
    // Trouver l'utilisateur avec le token de réinitialisation
    const user = users.find(u => u.resetPasswordToken === validatedData.token)
    if (!user) {
      return NextResponse.json(
        { error: 'Token de réinitialisation invalide ou expiré' },
        { status: 400 }
      )
    }
    
    // Vérifier si le token a expiré
    if (user.resetPasswordExpires && new Date() > new Date(user.resetPasswordExpires)) {
      return NextResponse.json(
        { error: 'Token de réinitialisation expiré' },
        { status: 400 }
      )
    }
    
    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12)
    
    // Mettre à jour le mot de passe et supprimer le token
    user.password = hashedNewPassword
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    
    return NextResponse.json({
      message: 'Mot de passe réinitialisé avec succès',
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erreur lors de la réinitialisation du mot de passe:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 