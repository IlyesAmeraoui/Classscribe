import { NextRequest, NextResponse } from 'next/server'
import { mockDb } from '@/lib/mockDb'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Vérifier si l'utilisateur existe
    const user = mockDb.findUserByEmail(email)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Générer un nouveau code de vérification
    const newCode = Math.floor(100000 + Math.random() * 900000).toString()
    const updatedUser = mockDb.updateUser(user.id, {
      verificationCode: newCode,
      verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    })

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to generate verification code' },
        { status: 500 }
      )
    }

    // En production, envoyez un vrai email ici
    console.log(`Code de vérification pour ${email}: ${newCode}`)

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully'
    })

  } catch (error) {
    console.error('Resend code error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 