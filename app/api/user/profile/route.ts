import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Schéma de validation pour la mise à jour du profil
const updateProfileSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères').optional(),
  profileImage: z.string().optional(),
  bio: z.string().max(500, 'La bio ne peut pas dépasser 500 caractères').optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url('URL invalide').optional(),
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
    bio: 'Étudiant passionné par l\'apprentissage',
    firstName: 'Demo',
    lastName: 'User',
    phone: null,
    location: null,
    website: null,
  }
]

// Fonction pour extraire l'ID utilisateur du token (mock)
function getUserIdFromToken(request: NextRequest): string | null {
  // En production, vérifiez le JWT token
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.replace('Bearer ', '')
  // Mock: extraire l'ID du token mock
  const match = token.match(/mock-jwt-token-(\d+)/)
  return match ? match[1] || null : null
}

// GET - Récupérer le profil utilisateur
export async function GET(request: NextRequest) {
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
    
    // Retourner les informations du profil (sans le mot de passe)
    const profile = {
      id: user.id,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      bio: user.bio,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      location: user.location,
      website: user.website,
      createdAt: user.createdAt,
    }
    
    return NextResponse.json(profile)
    
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour le profil utilisateur
export async function PUT(request: NextRequest) {
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
    const validatedData = updateProfileSchema.parse(body)
    
    // Vérifier si le nouveau nom d'utilisateur est déjà pris
    if (validatedData.username && validatedData.username !== user.username) {
      const existingUsername = users.find(u => u.username === validatedData.username && u.id !== userId)
      if (existingUsername) {
        return NextResponse.json(
          { error: 'Ce nom d\'utilisateur est déjà pris' },
          { status: 409 }
        )
      }
    }
    
    // Mettre à jour les champs
    Object.assign(user, validatedData)
    
    // Retourner le profil mis à jour
    const updatedProfile = {
      id: user.id,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      bio: user.bio,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      location: user.location,
      website: user.website,
      createdAt: user.createdAt,
    }
    
    return NextResponse.json({
      message: 'Profil mis à jour avec succès',
      profile: updatedProfile,
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erreur lors de la mise à jour du profil:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 