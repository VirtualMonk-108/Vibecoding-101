import { useState, useEffect } from 'react'
import { 
  User as FirebaseUser, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../config'
import type { User } from '@eventza/shared'

interface AuthState {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user document from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User
            setState({
              user: userData,
              firebaseUser,
              loading: false,
              error: null,
            })
          } else {
            // Create new user document if it doesn't exist
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              phoneNumber: firebaseUser.phoneNumber,
              role: 'attendee',
              preferences: {
                language: 'en',
                currency: 'ZAR',
                notifications: {
                  email: true,
                  sms: false,
                  push: true,
                },
                location: {
                  city: '',
                  province: '',
                },
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            }

            await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
            
            setState({
              user: newUser,
              firebaseUser,
              loading: false,
              error: null,
            })
          }
        } catch (error) {
          setState({
            user: null,
            firebaseUser: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Authentication error',
          })
        }
      } else {
        setState({
          user: null,
          firebaseUser: null,
          loading: false,
          error: null,
        })
      }
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      }))
      throw error
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update the user's profile
      await updateProfile(result.user, { displayName })
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      }))
      throw error
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign out failed',
      }))
    }
  }

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!state.user) return

    try {
      const updatedUser = { ...state.user, ...updates, updatedAt: new Date() }
      await setDoc(doc(db, 'users', state.user.id), updatedUser)
      
      setState(prev => ({ ...prev, user: updatedUser }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Profile update failed',
      }))
      throw error
    }
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut: signOutUser,
    updateProfile: updateUserProfile,
  }
}