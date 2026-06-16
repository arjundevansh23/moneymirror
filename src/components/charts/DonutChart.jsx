import { CAT_COLOR_DONUT } from '../../lib/constants'
import { inr } from '../../lib/calculations'

const CIRC = 207.3 // 2π × 33

export default function DonutChart({ catTotals, total }) {
  const entries = Object.keys(catTotals)
    .map(k => ({ cat: k, amt: catTotals[k] }))
    .sort((a, b) => b.amt - a.amt)

  const top4      = entries.slice(0, 4)
  const otherAmt  = entries.slice(4).reduce((s, e) => s + e.amt, 0)
  if (otherAmt > 0) top4.push({ cat: 'Other', amt: otherAmt })

  const cLabel = total >= 100000 ? Math.round(total / 1000) + 'k'
               : total >= 1000   ? (total / 1000).toFixed(1) + 'k'
               : total || '0'

  // Build arcs
  let offset = 0
  const arcs = top4.map(e => {
    if (!total || !e.amt) return null
    const color = CAT_COLOR_DONUT[e.cat] || '#e4eabf'
    const dash  = (e.amt / total) * CIRC
    const gap   = CIRC - dash
    const arc   = { color, dash, gap, offset, e }
    offset += dash
    return arc
  }).filter(Boolean)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      {/* SVG donut */}
      <svg width="88" height="88" viewBox="0 0 88 88" style={{ flexShrink: 0 }}>
        <circle cx="44" cy="44" r="33" fill="none" stroke="rgba(44,34,24,0.08)" strokeWidth="13" />
        {arcs.map((a, i) => (
          <circle key={i}
            cx="44" cy="44" r="33"
            fill="none"
            stroke={a.color}
            strokeWidth="13"
            strokeDasharray={`${a.dash.toFixed(1)} ${a.gap.toFixed(1)}`}
            strokeDashoffset={(-a.offset).toFixed(1)}
            transform="rotate(-90 44 44)"
            strokeLinecap="butt"
          />
        ))}
        <text x="44" y="40" textAnchor="middle" fontSize="9" fill="#9a8c78" fontFamily="DM Sans" fontWeight="300">Mar</text>
        <text x="44" y="52" textAnchor="middle" fontSize="11" fill="#2a2218" fontFamily="DM Serif Display">{cLabel}</text>
      </svg>

      {/* Legend */}
      <div style={{ flex: 1 }}>
        {top4.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--ink3)', fontWeight: 300 }}>No expenses yet</div>
        )}
        {top4.map(e => {
          const color = CAT_COLOR_DONUT[e.cat] || '#e4eabf'
          const pct   = total > 0 ? Math.round(e.amt / total * 100) : 0
          return (
            <div key={e.cat} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'3.5px 0', borderBottom:'0.5px solid rgba(90,78,56,0.1)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:color, flexShrink:0 }} />
                <span style={{ fontSize:12, color:'var(--ink2)' }}>{e.cat}</span>
              </div>
              <div style={{ display:'flex', gap:6, fontSize:12 }}>
                <span style={{ fontWeight:500, color:'var(--ink)' }}>{inr(e.amt)}</span>
                <span style={{ color:'var(--ink3)', fontWeight:300 }}>{pct}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
