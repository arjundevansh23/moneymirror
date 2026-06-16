import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { CAT_ICON, CAT_SUBS, CATEGORIES } from '../../lib/constants'
import { todayStr, nowTimeStr } from '../../lib/calculations'
import './Modal.css'

const EMOJIS = ['🍔','🚕','🛒','☕','🍛','📺','💪','🎵','👗','🏠','⚡','🎬','🏥','💼','📦','🍕','🛵','💊','✈️','🎮']

export default function AddExpenseModal({ open, onClose, onSave, editExpense }) {
  const { user } = useAuth()
  const isEdit = !!editExpense

  const [amt,    setAmt]    = useState('')
  const [desc,   setDesc]   = useState('')
  const [date,   setDate]   = useState(todayStr())
  const [time,   setTime]   = useState(nowTimeStr())
  const [cat,    setCat]    = useState('Food')
  const [subcat, setSubcat] = useState('')
  const [icon,   setIcon]   = useState('🍔')
  const [loading,setLoading]= useState(false)

  // Pre-fill when editing
  useEffect(() => {
    if (editExpense) {
      setAmt(editExpense.amount)
      setDesc(editExpense.description)
      setDate(editExpense.date)
      setTime(editExpense.time || '')
      setCat(editExpense.category)
      setSubcat(editExpense.subcategory || '')
      setIcon(editExpense.icon || '💸')
    } else {
      setAmt(''); setDesc(''); setDate(todayStr()); setTime(nowTimeStr())
      setCat('Food'); setSubcat(''); setIcon('🍔')
    }
  }, [editExpense, open])

  // Update icon when cat changes
  useEffect(() => {
    if (!isEdit) setIcon(CAT_ICON[cat] || '💸')
    setSubcat('')
  }, [cat])

  async function handleSave() {
    if (!amt || !desc || !date) return
    setLoading(true)
    const payload = {
      user_id: user.id,
      description: desc,
      amount: parseFloat(amt),
      category: cat,
      subcategory: subcat,
      date, time, icon,
    }
    if (isEdit) {
      await supabase.from('expenses').update(payload).eq('id', editExpense.id)
    } else {
      await supabase.from('expenses').insert(payload)
    }
    setLoading(false)
    onSave(isEdit ? 'Expense updated ✓' : 'Expense added ✓')
    onClose()
  }

  async function handleDelete() {
    if (!editExpense) return
    setLoading(true)
    await supabase.from('expenses').delete().eq('id', editExpense.id)
    setLoading(false)
    onSave('Expense deleted')
    onClose()
  }

  const subs = CAT_SUBS[cat] || []

  return (
    <div className={`modal-overlay ${open ? 'open' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title">{isEdit ? 'Edit expense' : 'Add expense'}</div>

        <label className="field-lbl">Amount</label>
        <input className="field-input serif-input" type="number" placeholder="0"
          value={amt} onChange={e => setAmt(e.target.value)} />

        <label className="field-lbl">Description</label>
        <input className="field-input" type="text" placeholder="What did you spend on?"
          value={desc} onChange={e => setDesc(e.target.value)} />

        <div className="field-row-2">
          <div>
            <label className="field-lbl">Date</label>
            <input className="field-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="field-lbl">Time</label>
            <input className="field-input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
        </div>

        <label className="field-lbl" style={{marginBottom:8}}>Category</label>
        <div className="cat-chips" style={{marginBottom:12}}>
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-chip ${cat===c?'sel':''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        {subs.length > 0 && (
          <>
            <label className="field-lbl" style={{marginBottom:8}}>Subcategory</label>
            <div className="cat-chips subcat-chips" style={{marginBottom:12}}>
              {subs.map(([name, color]) => (
                <button
                  key={name}
                  className={`cat-chip ${subcat===name?'sel':''}`}
                  style={{borderLeftColor: color, borderLeftWidth: 3}}
                  onClick={() => setSubcat(name)}
                >{name}</button>
              ))}
            </div>
          </>
        )}

        <label className="field-lbl" style={{marginBottom:8}}>Icon</label>
        <div className="emoji-grid" style={{marginBottom:16}}>
          {EMOJIS.map(e => (
            <button key={e} className={`emoji-opt ${icon===e?'sel':''}`} onClick={() => setIcon(e)}>{e}</button>
          ))}
        </div>

        <div className="btn-row">
          {isEdit && <button className="btn-danger" onClick={handleDelete} disabled={loading}>Delete</button>}
          <button className="btn-primary" onClick={handleSave} disabled={loading || !amt || !desc}>
            {loading ? 'Saving...' : 'Save expense'}
          </button>
        </div>
      </div>
    </div>
  )
}
