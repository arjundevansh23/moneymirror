import { useState } from 'react'
import { CAT_ICON, CAT_CLS, CAT_SUBS } from '../../lib/constants'
import { inr } from '../../lib/calculations'
import './FlipCard.css'

export default function FlipCard({ cat, total, income, subcatTotals }) {
  const [flipped, setFlipped] = useState(false)
  const pct     = income > 0 ? Math.round(total / income * 100) : 0
  const subs    = CAT_SUBS[cat] || []
  const numSubs = Object.keys(subcatTotals || {}).length
  const badge   = total > 0 ? (numSubs > 0 ? `${numSubs} subcats` : 'tracked') : '₹0'

  return (
    <div className="flip-card" onClick={() => setFlipped(f => !f)}>
      <div className={`flip-inner ${flipped ? 'flipped' : ''}`}>

        {/* FRONT */}
        <div className={`flip-front ${CAT_CLS[cat] || 'cat-living'}`}>
          <div className="fc-top">
            <span className="fc-emoji">{CAT_ICON[cat]}</span>
            <span className="fc-badge">{badge}</span>
          </div>
          <div>
            <div className="fc-lbl">{cat}</div>
            <div className="fc-amt">{inr(total)}</div>
            <div className="fc-sub">{pct}% of income</div>
          </div>
        </div>

        {/* BACK */}
        <div className="flip-back">
          <div className="fb-head">
            <span style={{ fontSize: 14 }}>{CAT_ICON[cat]}</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{cat}</span>
            <span style={{ marginLeft: 'auto', color: 'var(--ink4)', fontSize: 16 }}>×</span>
          </div>
          <div className="fb-list">
            {subs.map(([name, color]) => {
              const v = subcatTotals?.[name] || 0
              return (
                <div key={name} className="fb-row">
                  <div className="fb-left">
                    <div className="fb-dot" style={{ background: color }} />
                    <span className="fb-name">{name}</span>
                  </div>
                  <span className="fb-val">{inr(v)}</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
