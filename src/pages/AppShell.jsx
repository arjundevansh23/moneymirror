import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { getPeerBenchmark } from '../lib/constants'
import BottomNav  from '../components/nav/BottomNav'
import HomeTab    from '../components/tabs/HomeTab'
import ExpensesTab from '../components/tabs/ExpensesTab'
import InsightsTab from '../components/tabs/InsightsTab'
import InvestTab  from '../components/tabs/InvestTab'
import GoalsTab   from '../components/tabs/GoalsTab'
import Toast      from '../components/ui/Toast'
import './AppShell.css'

export default function AppShell() {
  const { user, profile } = useAuth()
  const [tab, setTab]           = useState('home')
  const [expenses, setExpenses] = useState([])
  const [goals, setGoals]       = useState([])
  const [toast, setToast]       = useState('')
  const [loading, setLoading]   = useState(true)

  // Derived: income and peer benchmarks from profile
  const income = profile?.income || 55000
  const peer   = profile
    ? getPeerBenchmark(profile.city, profile.age, profile.income)
    : getPeerBenchmark('Mumbai', 25, 55000)

  // Load data
  useEffect(() => {
    if (!user) return
    Promise.all([fetchExpenses(), fetchGoals()]).finally(() => setLoading(false))
  }, [user])

  async function fetchExpenses() {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
    setExpenses(data || [])
  }

  async function fetchGoals() {
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    setGoals(data || [])
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  // Shared props passed to every tab
  const sharedProps = {
    expenses, goals, income, peer, profile,
    onExpenseChange: fetchExpenses,
    onGoalChange: fetchGoals,
    showToast,
    setTab,
  }

  if (loading) return (
    <div className="app-loading">
      <div className="app-loading-icon">💰</div>
      <div className="app-loading-text">Loading your mirror...</div>
    </div>
  )

  return (
    <div className="app-shell">
      <div className={`app-tab ${tab === 'home'     ? 'on' : ''}`}><HomeTab     {...sharedProps} /></div>
      <div className={`app-tab ${tab === 'expenses' ? 'on' : ''}`}><ExpensesTab {...sharedProps} /></div>
      <div className={`app-tab ${tab === 'insights' ? 'on' : ''}`}><InsightsTab {...sharedProps} /></div>
      <div className={`app-tab ${tab === 'invest'   ? 'on' : ''}`}><InvestTab   {...sharedProps} /></div>
      <div className={`app-tab ${tab === 'goals'    ? 'on' : ''}`}><GoalsTab    {...sharedProps} /></div>
      <BottomNav active={tab} onChange={setTab} />
      <Toast message={toast} />
    </div>
  )
}
