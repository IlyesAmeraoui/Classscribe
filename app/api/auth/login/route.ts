import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { mockDb } from '@/lib/mockDb'

// Schéma de validation pour la connexion
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données
    const validatedData = loginSchema.parse(body)
    
    console.log('Login attempt for email:', validatedData.email)
    console.log('Current users:', mockDb.users.map(u => ({ email: u.email, isVerified: u.isEmailVerified })))
    
    // Trouver l'utilisateur
    const user = mockDb.findUserByEmail(validatedData.email)
    if (!user) {
      console.log('User not found for email:', validatedData.email)
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }
    
    console.log('User found:', { id: user.id, email: user.email, isVerified: user.isEmailVerified })
    
    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password)
    console.log('Password validation result:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', user.email)
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }
    
    // Vérifier si l'email est vérifié (optionnel selon vos besoins)
    if (!user.isEmailVerified) {
      console.log('Email not verified for user:', user.email)
      return NextResponse.json(
        { error: 'Veuillez vérifier votre email avant de vous connecter' },
        { status: 403 }
      )
    }
    
    console.log('Login successful for user:', user.email)
    
    // Créer la session utilisateur (sans les informations sensibles)
    const userSession = {
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
    }
    
    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: userSession,
      token: `mock-jwt-token-${user.id}`, // En production, générez un vrai JWT
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erreur lors de la connexion:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 