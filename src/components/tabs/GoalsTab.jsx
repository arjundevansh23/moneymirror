import { useState } from 'react'
import { inr, fmtLakhs, sipFuture } from '../../lib/calculations'
import AddGoalModal  from '../modals/AddGoalModal'
import AddFundsModal from '../modals/AddFundsModal'
import { supabase }  from '../../lib/supabase'
import { useAuth }   from '../../hooks/useAuth'
import './Tab.css'

export default function GoalsTab({ goals, income, expenses, onGoalChange, showToast }) {
  const { user }   = useAuth()
  const [goalModal,  setGoalModal]  = useState(false)
  const [fundsModal, setFundsModal] = useState(false)
  const [editGoal,   setEditGoal]   = useState(null)
  const [fundsGoal,  setFundsGoal]  = useState(null)

  const active = goals.filter(g => g.saved < g.target)
  const done   = goals.filter(g => g.saved >= g.target)

  const totSaved  = goals.reduce((s, g) => s + Math.min(g.saved, g.target), 0)
  const totTarget = goals.reduce((s, g) => s + g.target, 0)
  const pctAll    = totTarget > 0 ? Math.round(totSaved / totTarget * 100) : 0
  const nearest   = active.slice().sort((a, b) => (a.deadline || '9999').localeCompare(b.deadline || '9999'))[0]
  const saved     = Math.max(0, income - expenses.reduce((s, e) => s + e.amount, 0))

  function openAdd()      { setEditGoal(null); setGoalModal(true) }
  function openEdit(g)    { setEditGoal(g);    setGoalModal(true) }
  function openFunds(g)   { setFundsGoal(g);   setFundsModal(true) }

  function handleGoalSave(msg) { showToast(msg); onGoalChange() }

  return (
    <div className="tab-page">
      {/* Header */}
      <div className="page-head">
        <div className="page-title">Goals</div>
        <button className="add-btn" onClick={openAdd}>＋ Add goal</button>
      </div>

      {/* Hero */}
      <div style={{margin:'16px 16px 0', background:'var(--ink)', borderRadius:24, padding:20, position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', top:-40, right:-40, width:130, height:130, borderRadius:'50%', background:'rgba(196,154,108,0.15)'}} />
        <div style={{position:'absolute', bottom:-30, left:-20, width:90, height:90, borderRadius:'50%', background:'rgba(189,216,240,0.08)'}} />
        <div style={{fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'var(--ink3)', marginBottom:6, position:'relative'}}>Total saved towards goals</div>
        <div style={{display:'flex', alignItems:'baseline', gap:10, marginBottom:4, position:'relative'}}>
          <div style={{fontFamily:'DM Serif Display, serif', fontSize:38, color:'var(--surface)', lineHeight:1}}>{inr(totSaved)}</div>
          <div style={{fontSize:14, color:'var(--ink3)', fontWeight:300}}>of {inr(totTarget)}</div>
        </div>
        <div style={{fontSize:12, color:'var(--tan)', fontWeight:300, marginBottom:18, position:'relative'}}>{active.length} active goals · {pctAll}% overall</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:7, position:'relative'}}>
          {[
            [inr(totSaved), 'Saved total'],
            [nearest?.deadline ? new Date(nearest.deadline+'-01').toLocaleDateString('en-IN',{month:'short',year:'2-digit'}) : '—', 'Nearest goal'],
            [active.length, 'Active'],
          ].map(([val, lbl]) => (
            <div key={lbl} style={{background:'rgba(250,247,242,0.07)', borderRadius:12, padding:10, textAlign:'center'}}>
              <div style={{fontFamily:'DM Serif Display, serif', fontSize:17, color:'var(--surface)', lineHeight:1, marginBottom:3}}>{val}</div>
              <div style={{fontSize:10, color:'var(--ink3)', fontWeight:300}}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active goals */}
      <div className="sec-head">
        <div className="sec-title">Active goals</div>
        <div style={{fontSize:11, color:'var(--ink3)', fontWeight:300}}>tap to edit</div>
      </div>

      {active.length === 0 && (
        <div className="empty-state">No active goals yet.<br /><strong>Tap ＋ Add goal</strong> to start.</div>
      )}

      {active.map(g => {
        const pct   = Math.min(100, Math.round(g.saved / g.target * 100))
        const toGo  = g.target - g.saved
        const tc    = pct>=75?'tg-close':pct>=40?'tg-ok':'tg-warn'
        const tt    = pct>=75?'Almost there!':pct>=40?'On track':'Needs more'
        const ds    = g.deadline ? new Date(g.deadline+'-01').toLocaleDateString('en-IN',{month:'short',year:'numeric'}) : '—'
        const moNeeded = saved > 0 ? Math.ceil(toGo / saved) : '?'

        return (
          <div key={g.id} className="goal-full">
            <div className="gc-top">
              <div className="gc-emoji">{g.icon}</div>
              <div className="gc-info">
                <div className="gc-name">{g.name}</div>
                <div className="gc-deadline">Target · {inr(g.target)} by {ds}</div>
              </div>
              <div className="gc-pct">{pct}%</div>
            </div>
            <div className="gc-bar-wrap">
              <div className="gc-bar-track">
                <div className="gc-bar-fill" style={{width:pct+'%'}} />
              </div>
              <div className="gc-bar-labels">
                <div className="gc-saved">{inr(g.saved)} saved</div>
                <div className="gc-to-go">{inr(toGo)} to go</div>
              </div>
            </div>

            {/* Insight row */}
            {saved > 0 && (
              <div style={{background:'var(--surface)', border:'0.5px solid var(--wheat)', borderRadius:14, padding:'11px 13px', display:'flex', gap:10, alignItems:'flex-start', marginBottom:12}}>
                <span style={{fontSize:14, flexShrink:0}}>💡</span>
                <div style={{fontSize:11, color:'var(--ink2)', fontWeight:300, lineHeight:1.5}}>
                  At your current savings rate of <strong>{inr(saved)}/mo</strong>, you need <strong>{moNeeded} months</strong> to hit this goal.
                </div>
              </div>
            )}

            <div className="gc-divider" />
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div className={`gcm-tag ${tc}`}>{tt}</div>
              <div style={{display:'flex', gap:8}}>
                <button
                  onClick={() => openFunds(g)}
                  style={{background:'var(--tan)', color:'var(--surface)', border:'none', borderRadius:100, padding:'6px 14px', fontSize:11, fontWeight:500, fontFamily:'DM Sans, sans-serif', cursor:'pointer'}}
                >＋ Add funds</button>
                <button
                  onClick={() => openEdit(g)}
                  style={{background:'var(--surface)', border:'0.5px solid var(--wheat)', borderRadius:100, padding:'6px 14px', fontSize:11, fontWeight:500, fontFamily:'DM Sans, sans-serif', cursor:'pointer', color:'var(--ink2)'}}
                >Edit</button>
              </div>
            </div>
          </div>
        )
      })}

      {/* Add goal card */}
      <div className="add-goal-card" onClick={openAdd}>
        <div className="ag-ico">+</div>
        <div className="ag-title">Add a new goal</div>
        <div className="ag-sub">Laptop, house, vacation, anything</div>
      </div>

      {/* Completed */}
      {done.length > 0 && (
        <>
          <div style={{padding:'22px 20px 12px', fontFamily:'DM Serif Display, serif', fontSize:18, color:'var(--ink)'}}>Completed</div>
          {done.map(g => (
            <div key={g.id} className="completed-card">
              <div className="cc-ico">{g.icon}</div>
              <div className="cc-mid">
                <div className="cc-name">{g.name}</div>
                <div className="cc-date">Completed · {inr(g.target)}</div>
              </div>
              <div className="cc-done">Done ✓</div>
            </div>
          ))}
        </>
      )}

      <div style={{height:8}} />

      <AddGoalModal
        open={goalModal}
        onClose={() => setGoalModal(false)}
        onSave={handleGoalSave}
        editGoal={editGoal}
      />
      <AddFundsModal
        open={fundsModal}
        onClose={() => setFundsModal(false)}
        onSave={handleGoalSave}
        goal={fundsGoal}
      />
    </div>
  )
}
