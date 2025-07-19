
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import type { User as AuthUserType } from '../types'; // Renamed to avoid conflict with Firebase User
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebase'; // Import Firebase auth and db
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  type User as FirebaseUser // Firebase User type
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

interface AuthContextType {
  user: AuthUserType | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, pass: string, name: string) => Promise<boolean>;
  logout: () => void;
  refreshUserClaims: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setIsLoading(true);
      if (firebaseUser) {
        // Get token result to check for custom claims (like admin role)
        const tokenResult = await firebaseUser.getIdTokenResult(true); // Force refresh
        const authRole = (tokenResult.claims.role as 'user' | 'admin') || 'user';
        
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const firestoreData = userDocSnap.data();
          setUser({ 
            id: firebaseUser.uid, 
            email: firebaseUser.email, 
            name: firestoreData.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            role: authRole, // Use role from Firebase Auth custom claims (takes precedence)
            createdAt: firestoreData.createdAt as Timestamp, // Cast, ensure it exists
            updatedAt: firestoreData.updatedAt as Timestamp | undefined,
          });
        } else {
          // User exists in Firebase Auth but not in Firestore 'users' collection.
          // Create their profile in Firestore.
          const now = serverTimestamp();
          const newUserProfile = {
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "New User",
            role: 'user' as const, // Default role
            createdAt: now,
            updatedAt: now,
          };
          await setDoc(userDocRef, newUserProfile);
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: newUserProfile.name,
            role: newUserProfile.role,
            createdAt: Timestamp.now(), // Approximate client-side timestamp for immediate use
            updatedAt: Timestamp.now(), // Approximate
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting the user state from Firestore
      return true; // No need to setIsLoading(false) here, onAuthStateChanged handles it
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false); // Set loading false only on error
      return false;
    }
  };

  const signup = async (email: string, pass: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;
      
      const now = serverTimestamp();
      const userProfileData = {
        name,
        email: firebaseUser.email, // Store email in Firestore for consistency/convenience
        role: 'user', // Default role
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(doc(db, "users", firebaseUser.uid), userProfileData);
      
      // onAuthStateChanged will set the user state.
      return true; // No need to setIsLoading(false) here
    } catch (error) {
      console.error("Signup error:", error);
      setIsLoading(false); // Set loading false only on error
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting user to null
      router.push('/'); 
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // setIsLoading(false); // onAuthStateChanged will set loading to false
    }
  };

  const refreshUserClaims = async () => {
    if (auth.currentUser) {
      setIsLoading(true);
      try {
        // Force refresh the token to get updated claims
        await auth.currentUser.getIdToken(true);
        // Trigger a re-evaluation by calling the auth state change handler manually
        const tokenResult = await auth.currentUser.getIdTokenResult(true);
        const authRole = (tokenResult.claims.role as 'user' | 'admin') || 'user';
        
        if (user) {
          setUser({
            ...user,
            role: authRole
          });
        }
      } catch (error) {
        console.error("Error refreshing user claims:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refreshUserClaims, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
