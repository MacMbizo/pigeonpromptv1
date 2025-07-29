import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false
      })
    })

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }
      
      toast.success('Successfully signed in!')
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      })
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }
      
      toast.success('Check your email for verification link!')
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }
      
      toast.success('Successfully signed out!')
      return { success: true }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      
      if (error) {
        toast.error(error.message)
        return { success: false, error }
      }
      
      toast.success('Password reset email sent!')
      return { success: true }
    } catch (error) {
      toast.error('An unexpected error occurred')
      return { success: false, error }
    }
  }

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword
  }
}