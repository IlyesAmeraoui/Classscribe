# API Documentation - ClassScribe

Cette documentation décrit toutes les APIs disponibles pour l'authentification et la gestion des utilisateurs.

## Base URL
```
http://localhost:3000/api
```

## Authentification

### 1. Inscription (Register)
**POST** `/api/auth/register`

Crée un nouveau compte utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username",
  "profileImage": "data:image/jpeg;base64,..." // optionnel
}
```

**Réponse (201):**
```json
{
  "message": "Compte créé avec succès. Vérifiez votre email pour confirmer votre compte.",
  "userId": "2",
  "email": "user@example.com"
}
```

**Erreurs:**
- `400` - Données invalides
- `409` - Email ou nom d'utilisateur déjà pris
- `500` - Erreur serveur

### 2. Vérification d'Email
**POST** `/api/auth/verify-email`

Vérifie l'email avec le code reçu.

**Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Réponse (200):**
```json
{
  "message": "Email vérifié avec succès",
  "userId": "2",
  "email": "user@example.com"
}
```

**Erreurs:**
- `400` - Code incorrect ou expiré
- `404` - Utilisateur non trouvé
- `500` - Erreur serveur

### 3. Connexion (Login)
**POST** `/api/auth/login`

Connecte un utilisateur existant.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse (200):**
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": "2",
    "email": "user@example.com",
    "username": "username",
    "profileImage": null,
    "role": "student",
    "isEmailVerified": true
  },
  "token": "mock-jwt-token-2"
}
```

**Erreurs:**
- `400` - Données invalides
- `401` - Identifiants incorrects
- `403` - Email non vérifié
- `500` - Erreur serveur

### 4. Renvoi de Code de Vérification
**POST** `/api/auth/resend-code`

Renvoye le code de vérification par email.

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Réponse (200):**
```json
{
  "message": "Code de vérification renvoyé avec succès",
  "email": "user@example.com"
}
```

### 5. Mot de Passe Oublié
**POST** `/api/auth/forgot-password`

Demande une réinitialisation de mot de passe.

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Réponse (200):**
```json
{
  "message": "Si un compte avec cet email existe, vous recevrez un email de réinitialisation"
}
```

### 6. Réinitialisation de Mot de Passe
**POST** `/api/auth/reset-password`

Réinitialise le mot de passe avec le token reçu.

**Body:**
```json
{
  "token": "reset_token_here",
  "newPassword": "newpassword123"
}
```

**Réponse (200):**
```json
{
  "message": "Mot de passe réinitialisé avec succès"
}
```

### 7. Déconnexion
**POST** `/api/auth/logout`

Déconnecte l'utilisateur.

**Headers:**
```
Authorization: Bearer mock-jwt-token-2
```

**Réponse (200):**
```json
{
  "message": "Déconnexion réussie"
}
```

## Gestion du Profil Utilisateur

### 8. Récupérer le Profil
**GET** `/api/user/profile`

Récupère les informations du profil utilisateur.

**Headers:**
```
Authorization: Bearer mock-jwt-token-2
```

**Réponse (200):**
```json
{
  "id": "2",
  "email": "user@example.com",
  "username": "username",
  "profileImage": null,
  "role": "student",
  "isEmailVerified": true,
  "bio": "Étudiant passionné par l'apprentissage",
  "firstName": "John",
  "lastName": "Doe",
  "phone": null,
  "location": null,
  "website": null,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 9. Mettre à Jour le Profil
**PUT** `/api/user/profile`

Met à jour les informations du profil utilisateur.

**Headers:**
```
Authorization: Bearer mock-jwt-token-2
```

**Body:**
```json
{
  "username": "new_username",
  "bio": "Nouvelle bio",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "location": "Paris, France",
  "website": "https://example.com"
}
```

**Réponse (200):**
```json
{
  "message": "Profil mis à jour avec succès",
  "profile": {
    // Profil mis à jour
  }
}
```

### 10. Changer le Mot de Passe
**POST** `/api/user/change-password`

Change le mot de passe de l'utilisateur connecté.

**Headers:**
```
Authorization: Bearer mock-jwt-token-2
```

**Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Réponse (200):**
```json
{
  "message": "Mot de passe modifié avec succès"
}
```

## Codes d'Erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Données invalides |
| 401 | Non autorisé |
| 403 | Accès interdit |
| 404 | Ressource non trouvée |
| 409 | Conflit (ressource déjà existante) |
| 500 | Erreur interne du serveur |

## Authentification

Toutes les routes protégées nécessitent un header d'autorisation :
```
Authorization: Bearer <token>
```

Le token est retourné lors de la connexion et doit être inclus dans toutes les requêtes aux endpoints protégés.

## Notes Importantes

1. **Base de données mock** : Cette implémentation utilise une base de données en mémoire. En production, remplacez par une vraie base de données.

2. **Tokens JWT** : Les tokens actuels sont mockés. En production, implémentez de vrais JWT tokens.

3. **Envoi d'emails** : Les emails ne sont pas réellement envoyés. En production, intégrez un service d'envoi d'emails.

4. **Validation** : Toutes les données sont validées avec Zod pour assurer la sécurité.

5. **Hachage des mots de passe** : Les mots de passe sont hachés avec bcrypt pour la sécurité.

## Exemples d'Utilisation

### Inscription et Vérification
```javascript
// 1. Inscription
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    username: 'username'
  })
});

// 2. Vérification (utilisez le code affiché dans la console)
const verifyResponse = await fetch('/api/auth/verify-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    code: '123456' // Code affiché dans la console
  })
});
```

### Connexion et Utilisation du Profil
```javascript
// 1. Connexion
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await loginResponse.json();

// 2. Récupérer le profil
const profileResponse = await fetch('/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// 3. Mettre à jour le profil
const updateResponse = await fetch('/api/user/profile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    bio: 'Nouvelle bio',
    firstName: 'John',
    lastName: 'Doe'
  })
});
``` 