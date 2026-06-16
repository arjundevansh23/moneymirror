import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useGoals() {
  const { user } = useAuth()
  const [goals, setGoals]     = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    setGoals(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  async function addGoal(payload) {
    const { error } = await supabase.from('goals').insert({ ...payload, user_id: user.id })
    if (!error) fetch()
    return error
  }

  async function updateGoal(id, payload) {
    const { error } = await supabase.from('goals').update(payload).eq('id', id)
    if (!error) fetch()
    return error
  }

  async function deleteGoal(id) {
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (!error) fetch()
    return error
  }

  async function addFunds(id, amount) {
    const goal = goals.find(g => g.id === id)
    if (!goal) return
    const newSaved = Math.min(goal.target, (goal.saved || 0) + amount)
    return updateGoal(id, { saved: newSaved })
  }

  return { goals, loading, refetch: fetch, addGoal, updateGoal, deleteGoal, addFunds }
}
