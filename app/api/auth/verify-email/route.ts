import { NextRequest, NextResponse } from 'next/server'
import { mockDb } from '@/lib/mockDb'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    console.log('Verifying email:', email, 'with code:', code)
    console.log('Current users:', mockDb.users.map(u => ({ email: u.email, hasCode: !!u.verificationCode })))

    // Vérifier que le code correspond à l'email
    const user = mockDb.findUserByEmail(email)
    
    if (!user) {
      console.log('User not found for email:', email)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('Found user:', { id: user.id, email: user.email, hasCode: !!user.verificationCode })

    if (!user.verificationCode || !user.verificationCodeExpires) {
      console.log('No verification code found for user:', user.id)
      return NextResponse.json(
        { error: 'No verification code found' },
        { status: 400 }
      )
    }

    if (user.verificationCode !== code) {
      console.log('Invalid code. Expected:', user.verificationCode, 'Got:', code)
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    if (new Date() > user.verificationCodeExpires) {
      console.log('Code expired for user:', user.id)
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      )
    }

    // Marquer l'utilisateur comme vérifié
    const updatedUser = mockDb.updateUser(user.id, {
      isEmailVerified: true,
      verificationCode: undefined,
      verificationCodeExpires: undefined
    })

    if (!updatedUser) {
      console.log('Failed to update user:', user.id)
      return NextResponse.json(
        { error: 'Failed to verify email' },
        { status: 500 }
      )
    }

    console.log('Email verified successfully for user:', updatedUser.email)

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 