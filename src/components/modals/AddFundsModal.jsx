import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { inr } from '../../lib/calculations'
import './Modal.css'

export default function AddFundsModal({ open, onClose, onSave, goal }) {
  const [amt, setAmt]       = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (open) setAmt('') }, [open])

  if (!goal) return null

  const newSaved  = Math.min(goal.target, (goal.saved || 0) + (parseFloat(amt) || 0))
  const stillNeed = Math.max(0, goal.target - newSaved)
  const newPct    = Math.min(100, Math.round(newSaved / goal.target * 100))
  const oldPct    = Math.min(100, Math.round((goal.saved || 0) / goal.target * 100))

  async function handleSave() {
    if (!amt || parseFloat(amt) <= 0) return
    setLoading(true)
    await supabase.from('goals')
      .update({ saved: newSaved })
      .eq('id', goal.id)
    setLoading(false)
    onSave(newSaved >= goal.target ? '🎉 Goal completed!' : `${inr(parseFloat(amt))} added ✓`)
    onClose()
  }

  return (
    <div className={`modal-overlay ${open ? 'open' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title">{goal.icon} {goal.name}</div>

        {/* Current progress */}
        <div style={{background:'var(--surface)',border:'0.5px solid var(--wheat)',borderRadius:16,padding:'14px 16px',marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:11,color:'var(--ink3)',fontWeight:300,marginBottom:3}}>Currently saved</div>
            <div style={{fontFamily:'DM Serif Display, serif',fontSize:22,color:'var(--ink)'}}>{inr(goal.saved || 0)}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:11,color:'var(--ink3)',fontWeight:300,marginBottom:3}}>Target</div>
            <div style={{fontSize:15,fontWeight:500,color:'var(--ink2)'}}>{inr(goal.target)}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{marginBottom:20}}>
          <div style={{height:5,background:'var(--wheat)',borderRadius:100,overflow:'hidden'}}>
            <div style={{
              width: (parseFloat(amt) > 0 ? newPct : oldPct) + '%',
              height:'100%',background:'var(--tan)',borderRadius:100,transition:'width 0.3s'
            }} />
          </div>
        </div>

        <label className="field-lbl">Amount to add</label>
        <input
          className="field-input serif-input"
          type="number" placeholder="0"
          value={amt} onChange={e => setAmt(e.target.value)}
          autoFocus
        />

        {/* Preview */}
        {parseFloat(amt) > 0 && (
          <div style={{background:'var(--surface)',border:'0.5px solid var(--wheat)',borderRadius:14,padding:'12px 16px',marginBottom:16}}>
            {[
              ['New total',     inr(newSaved),                                    'var(--ink)'],
              ['Still needed',  inr(stillNeed),                                   stillNeed===0?'#2a7a48':'var(--ink)'],
              ['Progress',      newPct + '%',                                     'var(--tan)'],
            ].map(([label, val, color]) => (
              <div key={label} style={{display:'flex',justifyContent:'space-between',fontSize:12,padding:'3px 0',borderBottom:'0.5px solid rgba(200,185,160,0.15)'}}>
                <span style={{color:'var(--ink3)',fontWeight:300}}>{label}</span>
                <span style={{fontWeight:500,color}}>{val}</span>
              </div>
            ))}
          </div>
        )}

        <button className="btn-primary" onClick={handleSave} disabled={loading || !amt || parseFloat(amt) <= 0}>
          {loading ? 'Adding...' : 'Add to goal'}
        </button>
      </div>
    </div>
  )
}
