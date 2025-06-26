// Mock database partagé entre tous les endpoints API
export interface User {
  id: string
  email: string
  password: string
  username: string
  profileImage: string | null
  role: string
  createdAt: Date
  isEmailVerified: boolean
  verificationCode?: string
  verificationCodeExpires?: Date
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  bio?: string
  firstName?: string
  lastName?: string
  phone?: string | null
  location?: string | null
  website?: string | null
}

// Variables globales pour persister les données entre les compilations
declare global {
  var __mockUsers: User[] | undefined
  var __mockVerifiedEmails: Map<string, { verifiedAt: Date }> | undefined
}

// Initialisation des données globales
if (!global.__mockUsers) {
  global.__mockUsers = [
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
  console.log('MockDatabase initialized with demo user')
}

if (!global.__mockVerifiedEmails) {
  global.__mockVerifiedEmails = new Map<string, { verifiedAt: Date }>()
}

// Fonctions pour accéder aux données globales
const getUsers = (): User[] => {
  return global.__mockUsers || []
}

const setUsers = (users: User[]): void => {
  global.__mockUsers = users
}

const getVerifiedEmails = (): Map<string, { verifiedAt: Date }> => {
  return global.__mockVerifiedEmails || new Map()
}

const setVerifiedEmail = (email: string, data: { verifiedAt: Date }): void => {
  if (!global.__mockVerifiedEmails) {
    global.__mockVerifiedEmails = new Map()
  }
  global.__mockVerifiedEmails.set(email, data)
}

const deleteVerifiedEmail = (email: string): void => {
  if (global.__mockVerifiedEmails) {
    global.__mockVerifiedEmails.delete(email)
  }
}

// Objet mockDb pour faciliter l'utilisation
export const mockDb = {
  get users() {
    return getUsers()
  },
  get verifiedEmails() {
    return getVerifiedEmails()
  },
  findUserByEmail: (email: string) => {
    const users = getUsers()
    const user = users.find(user => user.email === email)
    console.log(`findUserByEmail(${email}):`, user ? 'found' : 'not found')
    console.log('Current users in findUserByEmail:', users.map(u => u.email))
    return user
  },
  findUserById: (id: string) => {
    const users = getUsers()
    return users.find(user => user.id === id)
  },
  findUserByUsername: (username: string) => {
    const users = getUsers()
    return users.find(user => user.username === username)
  },
  addUser: (user: User) => {
    console.log('Adding user to database:', user.email)
    const users = getUsers()
    users.push(user)
    setUsers(users)
    console.log('Users after adding:', users.map(u => u.email))
  },
  updateUser: (id: string, updates: Partial<User>) => {
    const users = getUsers()
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates } as User
      setUsers(users)
      console.log('Updated user:', users[userIndex].email)
      return users[userIndex]
    }
    console.log('User not found for update:', id)
    return undefined
  },
  deleteUser: (id: string) => {
    const users = getUsers()
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex !== -1) {
      users.splice(userIndex, 1)
      setUsers(users)
      return true
    }
    return false
  }
}

// Fonctions utilitaires pour la base de données (maintenues pour compatibilité)
export const findUserByEmail = (email: string): User | undefined => {
  return mockDb.findUserByEmail(email)
}

export const findUserById = (id: string): User | undefined => {
  return mockDb.findUserById(id)
}

export const findUserByUsername = (username: string): User | undefined => {
  return mockDb.findUserByUsername(username)
}

export const addUser = (user: User): void => {
  mockDb.addUser(user)
}

export const updateUser = (id: string, updates: Partial<User>): User | undefined => {
  return mockDb.updateUser(id, updates)
}

export const deleteUser = (id: string): boolean => {
  return mockDb.deleteUser(id)
} 