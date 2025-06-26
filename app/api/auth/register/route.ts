import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { mockDb } from '@/lib/mockDb'

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, profileImage } = await request.json()

    console.log('Registering user:', { email, username })

    // Vérifier que l'utilisateur n'existe pas déjà
    const existingUser = mockDb.findUserByEmail(email)
    if (existingUser) {
      console.log('User already exists:', email)
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Vérifier qu'un autre utilisateur n'a pas déjà ce nom d'utilisateur
    const userWithUsername = mockDb.findUserByUsername(username)
    if (userWithUsername) {
      console.log('Username already taken:', username)
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer le nouvel utilisateur (non vérifié)
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      username,
      profileImage,
      role: 'user',
      createdAt: new Date(),
      isEmailVerified: false,
      verificationCode: undefined,
      verificationCodeExpires: undefined
    }

    mockDb.addUser(newUser)
    console.log('User created successfully:', newUser.email)
    console.log('All users after creation:', mockDb.users.map(u => u.email))

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 