import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export interface Prompt {
  id: string
  title: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
  is_public: boolean
  tags: string[]
}

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchPrompts = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })

      if (user) {
        // Fetch user's prompts and public prompts
        query = query.or(`user_id.eq.${user.id},is_public.eq.true`)
      } else {
        // Fetch only public prompts for non-authenticated users
        query = query.eq('is_public', true)
      }

      const { data, error } = await query

      if (error) {
        toast.error('Failed to fetch prompts')
        console.error('Error fetching prompts:', error)
        return
      }

      setPrompts(data || [])
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const createPrompt = async (promptData: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) {
      toast.error('You must be logged in to create prompts')
      return { success: false }
    }

    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert({
          ...promptData,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        toast.error('Failed to create prompt')
        console.error('Error creating prompt:', error)
        return { success: false, error }
      }

      toast.success('Prompt created successfully!')
      await fetchPrompts() // Refresh the list
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Error:', error)
      return { success: false, error }
    }
  }

  const updatePrompt = async (id: string, updates: Partial<Omit<Prompt, 'id' | 'created_at' | 'user_id'>>) => {
    if (!user) {
      toast.error('You must be logged in to update prompts')
      return { success: false }
    }

    try {
      const { data, error } = await supabase
        .from('prompts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only update their own prompts
        .select()
        .single()

      if (error) {
        toast.error('Failed to update prompt')
        console.error('Error updating prompt:', error)
        return { success: false, error }
      }

      toast.success('Prompt updated successfully!')
      await fetchPrompts() // Refresh the list
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Error:', error)
      return { success: false, error }
    }
  }

  const deletePrompt = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete prompts')
      return { success: false }
    }

    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only delete their own prompts

      if (error) {
        toast.error('Failed to delete prompt')
        console.error('Error deleting prompt:', error)
        return { success: false, error }
      }

      toast.success('Prompt deleted successfully!')
      await fetchPrompts() // Refresh the list
      return { success: true }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Error:', error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    fetchPrompts()
  }, [user])

  return {
    prompts,
    loading,
    fetchPrompts,
    createPrompt,
    updatePrompt,
    deletePrompt
  }
}