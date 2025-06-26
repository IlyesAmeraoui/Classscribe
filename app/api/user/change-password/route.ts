import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Schéma de validation pour le changement de mot de passe
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
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

// Fonction pour extraire l'ID utilisateur du token (mock)
function getUserIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.replace('Bearer ', '')
  const match = token.match(/mock-jwt-token-(\d+)/)
  return match ? match[1] || null : null
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
    
    const user = users.find(u => u.id === userId)
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }
    
    const body = await request.json()
    
    // Validation des données
    const validatedData = changePasswordSchema.parse(body)
    
    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Mot de passe actuel incorrect' },
        { status: 400 }
      )
    }
    
    // Vérifier que le nouveau mot de passe est différent de l'ancien
    const isNewPasswordSame = await bcrypt.compare(validatedData.newPassword, user.password)
    if (isNewPasswordSame) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit être différent de l\'actuel' },
        { status: 400 }
      )
    }
    
    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12)
    
    // Mettre à jour le mot de passe
    user.password = hashedNewPassword
    
    return NextResponse.json({
      message: 'Mot de passe modifié avec succès',
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erreur lors du changement de mot de passe:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 