// Firebase config and services
export { auth, db, storage, functions } from './config'

// Hooks
export { useAuth } from './hooks/useAuth'

// Re-export Firebase types that we commonly use
export type { User as FirebaseUser } from 'firebase/auth'