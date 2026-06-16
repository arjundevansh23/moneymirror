import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { inr } from '../../lib/calculations'
import './Modal.css'

const GOAL_EMOJIS = ['🌴','🏠','💻','🚗','💍','🎓','📱','🏋️','🎸','🐶','✈️','🌟','🛡️','📈','🏖️','🎯','💰','🚀']

export default function AddGoalModal({ open, onClose, onSave, editGoal }) {
  const { user } = useAuth()
  const isEdit = !!editGoal

  const [name,   setName]   = useState('')
  const [target, setTarget] = useState('')
  const [saved,  setSaved]  = useState('')
  const [date,   setDate]   = useState('')
  const [icon,   setIcon]   = useState('🌴')
  const [loading,setLoading]= useState(false)

  useEffect(() => {
    if (editGoal) {
      setName(editGoal.name); setTarget(editGoal.target)
      setSaved(editGoal.saved); setDate(editGoal.deadline || '')
      setIcon(editGoal.icon || '🎯')
    } else {
      setName(''); setTarget(''); setSaved(''); setDate(''); setIcon('🌴')
    }
  }, [editGoal, open])

  async function handleSave() {
    if (!name || !target) return
    setLoading(true)
    const payload = {
      user_id: user.id,
      name, icon,
      target: parseFloat(target),
      saved: parseFloat(saved) || 0,
      deadline: date || null,
    }
    if (isEdit) {
      await supabase.from('goals').update(payload).eq('id', editGoal.id)
    } else {
      await supabase.from('goals').insert(payload)
    }
    setLoading(false)
    onSave(isEdit ? 'Goal updated ✓' : 'Goal created ✓')
    onClose()
  }

  async function handleDelete() {
    if (!editGoal) return
    setLoading(true)
    await supabase.from('goals').delete().eq('id', editGoal.id)
    setLoading(false)
    onSave('Goal deleted')
    onClose()
  }

  const pct = target && saved ? Math.min(100, Math.round(parseFloat(saved)/parseFloat(target)*100)) : 0

  return (
    <div className={`modal-overlay ${open ? 'open' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title">{isEdit ? 'Edit goal' : 'New goal'}</div>

        <label className="field-lbl">Goal name</label>
        <input className="field-input" type="text" placeholder="e.g. Trip to Japan"
          value={name} onChange={e => setName(e.target.value)} />

        <label className="field-lbl">Target amount</label>
        <input className="field-input serif-input" type="number" placeholder="0"
          value={target} onChange={e => setTarget(e.target.value)} />

        <label className="field-lbl">Saved so far</label>
        <input className="field-input" type="number" placeholder="0"
          value={saved} onChange={e => setSaved(e.target.value)} />

        {target && saved && (
          <div style={{marginBottom:16}}>
            <div style={{height:4,background:'var(--wheat)',borderRadius:100,overflow:'hidden',marginBottom:6}}>
              <div style={{width:pct+'%',height:'100%',background:'var(--tan)',borderRadius:100,transition:'width 0.3s'}} />
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--ink3)',fontWeight:300}}>
              <span>{inr(parseFloat(saved)||0)} saved</span>
              <span>{pct}% of {inr(parseFloat(target)||0)}</span>
            </div>
          </div>
        )}

        <label className="field-lbl">Target date</label>
        <input className="field-input" type="month" value={date}
          onChange={e => setDate(e.target.value)} style={{marginBottom:12}} />

        <label className="field-lbl" style={{marginBottom:8}}>Pick an icon</label>
        <div className="emoji-grid" style={{marginBottom:16}}>
          {GOAL_EMOJIS.map(e => (
            <button key={e} className={`emoji-opt ${icon===e?'sel':''}`} onClick={() => setIcon(e)}>{e}</button>
          ))}
        </div>

        <div className="btn-row">
          {isEdit && <button className="btn-danger" onClick={handleDelete} disabled={loading}>Delete</button>}
          <button className="btn-primary" onClick={handleSave} disabled={loading || !name || !target}>
            {loading ? 'Saving...' : 'Save goal'}
          </button>
        </div>
      </div>
    </div>
  )
}
