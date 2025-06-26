import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // En production, vous pourriez invalider le token côté serveur
    // ou ajouter le token à une liste noire
    
    return NextResponse.json({
      message: 'Déconnexion réussie',
    })
    
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 