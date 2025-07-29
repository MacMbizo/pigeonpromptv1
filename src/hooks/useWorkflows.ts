import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export interface Workflow {
  id: string
  name: string
  description: string
  config: any
  user_id: string
  created_at: string
  updated_at: string
}

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchWorkflows = async () => {
    if (!user) {
      setWorkflows([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Failed to fetch workflows')
        console.error('Error fetching workflows:', error)
        return
      }

      setWorkflows(data || [])
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const createWorkflow = async (workflowData: Omit<Workflow, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) {
      toast.error('You must be logged in to create workflows')
      return { success: false }
    }

    try {
      const { data, error } = await supabase
        .from('workflows')
        .insert({
          ...workflowData,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        toast.error('Failed to create workflow')
        console.error('Error creating workflow:', error)
        return { success: false, error }
      }

      toast.success('Workflow created successfully!')
      await fetchWorkflows() // Refresh the list
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Error:', error)
      return { success: false, error }
    }
  }

  const updateWorkflow = async (id: string, updates: Partial<Omit<Workflow, 'id' | 'created_at' | 'user_id'>>) => {
    if (!user) {
      toast.error('You must be logged in to update workflows')
      return { success: false }
    }

    try {
      const { data, error } = await supabase
        .from('workflows')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only update their own workflows
        .select()
        .single()

      if (error) {
        toast.error('Failed to update workflow')
        console.error('Error updating workflow:', error)
        return { success: false, error }
      }

      toast.success('Workflow updated successfully!')
      await fetchWorkflows() // Refresh the list
      return { success: true, data }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Error:', error)
      return { success: false, error }
    }
  }

  const deleteWorkflow = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete workflows')
      return { success: false }
    }

    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only delete their own workflows

      if (error) {
        toast.error('Failed to delete workflow')
        console.error('Error deleting workflow:', error)
        return { success: false, error }
      }

      toast.success('Workflow deleted successfully!')
      await fetchWorkflows() // Refresh the list
      return { success: true }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Error:', error)
      return { success: false, error }
    }
  }

  const executeWorkflow = async (id: string, inputs: any = {}) => {
    if (!user) {
      toast.error('You must be logged in to execute workflows')
      return { success: false }
    }

    try {
      // Get the workflow
      const { data: workflow, error: fetchError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (fetchError || !workflow) {
        toast.error('Workflow not found')
        return { success: false, error: fetchError }
      }

      // Simulate workflow execution (replace with actual execution logic)
      toast.success(`Executing workflow: ${workflow.name}`)
      
      // Here you would implement the actual workflow execution logic
      // For now, we'll just return a success response
      return { 
        success: true, 
        data: {
          workflowId: id,
          status: 'completed',
          result: 'Workflow executed successfully',
          inputs
        }
      }
    } catch (error) {
      toast.error('Failed to execute workflow')
      console.error('Error executing workflow:', error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    fetchWorkflows()
  }, [user])

  return {
    workflows,
    loading,
    fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow
  }
}