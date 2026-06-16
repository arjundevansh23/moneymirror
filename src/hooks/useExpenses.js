import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useExpenses() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading]   = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('time', { ascending: false })
    setExpenses(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  async function addExpense(payload) {
    const { error } = await supabase.from('expenses').insert({ ...payload, user_id: user.id })
    if (!error) fetch()
    return error
  }

  async function updateExpense(id, payload) {
    const { error } = await supabase.from('expenses').update(payload).eq('id', id)
    if (!error) fetch()
    return error
  }

  async function deleteExpense(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) fetch()
    return error
  }

  return { expenses, loading, refetch: fetch, addExpense, updateExpense, deleteExpense }
}
