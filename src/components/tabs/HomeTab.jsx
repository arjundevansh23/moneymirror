import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useInsights } from '../../hooks/useInsights'
import { CATEGORIES } from '../../lib/constants'
import { inr, fmtLakhs, sipFuture, getCatTotals, getSubcatTotals } from '../../lib/calculations'
import DonutChart from '../charts/DonutChart'
import FlipCard   from '../charts/FlipCard'
import './Tab.css'

export default function HomeTab({ expenses, goals, income, peer, profile, setTab }) {
  const { profile: authProfile } = useAuth()
  const ins   = useInsights({ expenses, goals, income, peer })
  const [extraOn, setExtraOn] = useState(false)

  const firstName = (profile?.name || authProfile?.name || 'there').split(' ')[0]
  const ct  = getCatTotals(expenses)
  const sc  = getSubcatTotals(expenses)
  const saved   = ins.saved
  const savePct = income > 0 ? Math.round(saved / income * 100) : 0
  const foodPct = ins.total > 0 ? Math.round((ct['Food'] || 0) / ins.total * 100) : 0

  const grade = ins.overallScore>=90?'A+':ins.overallScore>=80?'A':ins.overallScore>=70?'B+':ins.overallScore>=60?'B':ins.overallScore>=50?'C+':'C'

  const visibleCats = extraOn ? CATEGORIES : CATEGORIES.slice(0, 4)

  return (
    <div className="tab-page">
      {/* Nav bar */}
      <div style={{padding:'22px 22px 0', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{fontFamily:'DM Serif Display, serif', fontSize:21, color:'var(--ink)', lineHeight:1.15}}>
          Good morning,<br /><em style={{fontStyle:'italic', color:'var(--tan)'}}>{firstName}.</em>
        </div>
        <div style={{width:36, height:36, borderRadius:'50%', background:'var(--tan)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:500, color:'var(--surface)'}}>
          {firstName[0].toUpperCase()}
        </div>
      </div>

      {/* Hero */}
      <div className="hero">
        <div className="hero-orb1" /><div className="hero-orb2" />
        <div className="hero-lbl">Total spent · this month</div>
        <div className="hero-amt">{inr(ins.total)}</div>
        <div className="hero-sub">Monthly income {inr(income)} · saved {inr(saved)}</div>
        <div className="hero-pills">
          <div className="pill pill-food">{foodPct}% food</div>
          <div className="pill pill-save">{savePct}% savings</div>
          <div className="pill pill-grade">{grade} grade</div>
        </div>
      </div>

      {/* Spending flip cards */}
      <div className="sec-head">
        <div className="sec-title">Spending</div>
        <button className="sec-link" onClick={() => setExtraOn(x => !x)}>
          {extraOn ? 'See less' : 'See all'}
        </button>
      </div>
      <div style={{padding:'0 20px 8px', fontSize:10, fontWeight:500, letterSpacing:2, textTransform:'uppercase', color:'var(--ink3)'}}>
        This month · tap a card to explore
      </div>
      <div className="cat-grid">
        {visibleCats.map(cat => (
          <FlipCard
            key={cat}
            cat={cat}
            total={ct[cat] || 0}
            income={income}
            subcatTotals={sc[cat] || {}}
          />
        ))}
      </div>

      {/* Breakdown donut */}
      <div className="sec-head"><div className="sec-title">Breakdown</div><div className="sec-link">Details</div></div>
      <div style={{margin:'0 16px', background:'var(--wheat)', borderRadius:20, padding:18}}>
        <DonutChart catTotals={ct} total={ins.total} />
      </div>

      {/* 6-month trend (static for now) */}
      <div className="sec-head"><div className="sec-title">6-month trend</div></div>
      <div className="trend-wrap">
        <div className="trend-bars">
          {[42,55,38,50,46,64].map((h, i) => (
            <div key={i} className="trend-col">
              <div className={`trend-bar ${i===5?'active':''}`} style={{height:h}} />
              <div className={`trend-mo ${i===5?'active':''}`}>
                {['Oct','Nov','Dec','Jan','Feb','Mar'][i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights preview */}
      <div className="sec-head">
        <div className="sec-title">AI insights</div>
        <button className="sec-link" onClick={() => setTab('insights')}>See all</button>
      </div>
      <div className="insight-list">
        {/* Food */}
        <div className="insight-card">
          <div className={`insight-ico ${ins.food > peer.Food ? 'ii-red' : 'ii-sage'}`}>
            {ins.food === 0 ? '🍔' : ins.food > peer.Food ? '🚨' : '✅'}
          </div>
          <div>
            <div className="insight-title">
              {ins.food === 0 ? 'Start tracking food'
                : ins.food > peer.Food ? `Food ${Math.round(ins.food/peer.Food*100)-100}% above peers`
                : 'Food spend under control'}
            </div>
            <div className="insight-desc">
              {ins.food === 0
                ? `Peer avg is ${inr(peer.Food)}/mo. Add your first food expense.`
                : ins.food > peer.Food
                  ? `${inr(ins.food)} spent — ${inr(ins.food-peer.Food)} more than peers. Cutting delivery saves ~${inr(Math.round((ins.food-peer.Food)*12))}/year.`
                  : `${inr(ins.food)} spent — ${inr(peer.Food-ins.food)} below peer avg of ${inr(peer.Food)}.`}
            </div>
            <div className={`insight-tag ${ins.food > peer.Food ? 't-over' : 't-ok'}`}>
              {ins.food === 0 ? 'No data' : ins.food > peer.Food ? 'Overspending' : 'Under budget'}
            </div>
          </div>
        </div>

        {/* Opportunity */}
        <div className="insight-card">
          <div className="insight-ico ii-sky">💸</div>
          <div>
            <div className="insight-title">
              {ins.totalLeak > 0 ? 'Opportunity cost' : 'Within peer spending'}
            </div>
            <div className="insight-desc">
              {ins.totalLeak > 0
                ? `${inr(ins.totalLeak)}/mo overspend invested at 12% becomes ${fmtLakhs(sipFuture(ins.totalLeak, 10))} in 10 years.`
                : `You're spending within peer benchmarks. A ${inr(ins.sipAmt)}/mo SIP grows to ${fmtLakhs(sipFuture(ins.sipAmt, 10))} in 10 years.`}
            </div>
            <div className="insight-tag t-opp">Opportunity cost</div>
          </div>
        </div>

        {/* Weekend habit */}
        {ins.weekendDays > 0 && ins.weekdayDays > 0 && (
          <div className="insight-card">
            <div className={`insight-ico ${ins.weekendOver ? 'ii-wheat' : 'ii-sage'}`}>
              {ins.weekendOver ? '📅' : '🗓️'}
            </div>
            <div>
              <div className="insight-title">Weekend spending pattern</div>
              <div className="insight-desc">
                {ins.weekendOver
                  ? `Weekend avg (${inr(ins.weekendAvg)}/day) is ${ins.wkMultiple}× your weekday avg.`
                  : `Weekend balanced at ${ins.wkMultiple}× weekday average. Good discipline.`}
              </div>
              <div className={`insight-tag ${ins.weekendOver ? 't-habit' : 't-ok'}`}>
                {ins.weekendOver ? 'Habit detected' : 'Balanced'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Future self */}
      <div className="sec-head"><div className="sec-title">Future self</div></div>
      <div className="future-wrap">
        <div className="future-wm">20yr</div>
        <div className="future-lbl">20-year projection · 12% index fund return</div>
        <div className="future-grid">
          <div className="future-box">
            <div className="future-box-lbl">At current savings</div>
            <div className="future-box-val">{fmtLakhs(sipFuture(saved, 20))}</div>
            <div className="future-box-sub">{inr(saved)}/mo invested</div>
          </div>
          <div className="future-box">
            <div className="future-box-lbl">If leaks fixed</div>
            <div className="future-box-val">{fmtLakhs(sipFuture(saved + ins.totalLeak, 20))}</div>
            <div className="future-box-sub">invest overspend too</div>
          </div>
        </div>
      </div>

      {/* Spending personality */}
      <div className="sec-head"><div className="sec-title">Spending personality</div></div>
      <div className="pers-grid">
        {[
          {micro:'Food control',   val:ins.foodScore>=70?'Excellent':ins.foodScore>=45?'Moderate':'High risk',           pct:100-ins.foodScore,     cls:'p1'},
          {micro:'Savings habit',  val:ins.saveScore>=70?'Excellent':ins.saveScore>=40?'Good':'Needs work',              pct:ins.saveScore,          cls:'p2'},
          {micro:'Transport',      val:ins.transportScore>=80?'Excellent':ins.transportScore>=50?'Good':'Watch out',     pct:ins.transportScore,    cls:'p3'},
          {micro:'Overall budget', val:ins.budgetScore>=70?'Excellent':ins.budgetScore>=45?'Fair':'Watch out',           pct:ins.budgetScore,       cls:'p4'},
        ].map(p => (
          <div key={p.micro} className={`pers-card ${p.cls}`}>
            <div className="pers-micro">{p.micro}</div>
            <div className="pers-val">{p.val}</div>
            <div className="pers-track"><div className="pers-fill" style={{width:p.pct+'%'}} /></div>
          </div>
        ))}
      </div>

      {/* Goals preview */}
      <div className="sec-head">
        <div className="sec-title">Goals</div>
        <button className="sec-link" onClick={() => setTab('goals')}>See all</button>
      </div>
      <div className="goals-preview">
        {ins.activeGoals.slice(0,3).map(g => {
          const pct = Math.min(100, Math.round(g.saved/g.target*100))
          return (
            <div key={g.id} className="goal-sm">
              <div className="goal-sm-top">
                <div className="goal-sm-left">
                  <div className="goal-sm-ico">{g.icon}</div>
                  <div>
                    <div className="goal-sm-name">{g.name}</div>
                    <div className="goal-sm-sub">{inr(g.saved)} of {inr(g.target)}</div>
                  </div>
                </div>
                <div className="goal-sm-pct">{pct}%</div>
              </div>
              <div className="goal-track"><div className="goal-fill" style={{width:pct+'%'}} /></div>
            </div>
          )
        })}
        {ins.activeGoals.length === 0 && (
          <div style={{padding:'12px 0', color:'var(--ink3)', fontSize:12, fontWeight:300}}>
            No active goals yet.
          </div>
        )}
      </div>

      {/* Report card */}
      <div className="sec-head"><div className="sec-title">Monthly report card</div></div>
      <div className="report-wrap">
        <div className="report-top">
          <div className="report-grade">{grade}</div>
          <div>
            <div className="report-title">
              {ins.overallScore >= 70 ? `Good progress, ${firstName}!` : `Let's work on this, ${firstName}.`}
            </div>
            <div className="report-hint">
              {ins.overallScore>=80?'Excellent financial health this month!'
              :ins.overallScore>=65?'Good progress. Fix food & subs to push higher.'
              :ins.overallScore>=50?'Room to improve. Focus on biggest overspend.'
              :'Start with savings and food — they move the needle most.'}
            </div>
          </div>
        </div>
        <div className="report-metrics">
          {[
            ['Budgeting',   ins.budgetScore,    'rf-tan'],
            ['Saving rate', ins.saveScore,      'rf-sky'],
            ['Investments', 25,                 'rf-sage'],
            ['Food control',ins.foodScore,      'rf-blush'],
            ['Goal progress',ins.goalScore,     'rf-wheat'],
          ].map(([label, score, cls]) => (
            <div key={label} className="report-row">
              <div className="report-lbl">{label}</div>
              <div className="report-track">
                <div className={`report-fill ${cls}`} style={{width:score+'%'}} />
              </div>
              <div className="report-score">{score}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{height:8}} />
    </div>
  )
}
