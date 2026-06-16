// ─── FORMATTING ──────────────────────────

export function inr(n) {
  return '₹' + Number(n).toLocaleString('en-IN')
}

export function fmtLakhs(n) {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(1) + 'Cr'
  if (n >= 100000)   return '₹' + (n / 100000).toFixed(1) + 'L'
  if (n >= 1000)     return '₹' + (n / 1000).toFixed(1) + 'k'
  return inr(n)
}

// ─── SIP COMPOUND INTEREST ───────────────

export function sipFuture(monthly, years, rate = 0.12) {
  if (!monthly || monthly <= 0) return 0
  const r = rate / 12
  const n = years * 12
  return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r))
}

// ─── FINANCIAL HEALTH SCORES ─────────────

export function calcScores({ total, income, food, transport, shopping, goals, peer }) {
  const saved    = Math.max(0, income - total)
  const savePct  = income > 0 ? Math.round(saved / income * 100) : 0

  const budgetScore    = Math.max(0, Math.min(100, Math.round(100 - (total / income - 0.5) * 100)))
  const saveScore      = Math.min(100, Math.round(savePct * 2.5))
  const foodScore      = Math.max(0, Math.min(100, Math.round(100 - Math.max(0, (food - peer.Food) / peer.Food) * 150)))
  const transportScore = Math.max(0, Math.min(100, Math.round(100 - Math.max(0, (transport - peer.Transport) / peer.Transport) * 100)))
  const goalScore      = goals.length > 0
    ? Math.min(100, Math.round(
        goals.reduce((s, g) => s + Math.min(g.saved, g.target), 0) /
        goals.reduce((s, g) => s + g.target, 0) * 100))
    : 0
  const overallScore   = Math.round((budgetScore + saveScore + foodScore + transportScore + goalScore) / 5)

  return { budgetScore, saveScore, foodScore, transportScore, goalScore, overallScore, saved, savePct }
}

export function scoreLabel(score) {
  if (score >= 80) return 'Excellent'
  if (score >= 65) return 'Good'
  if (score >= 45) return 'Fair'
  return 'Needs work'
}

export function gradeFromScore(score) {
  if (score >= 90) return 'A+'
  if (score >= 80) return 'A'
  if (score >= 70) return 'B+'
  if (score >= 60) return 'B'
  if (score >= 50) return 'C+'
  return 'C'
}

// ─── DATE HELPERS ─────────────────────────

export function dayLabel(dateStr) {
  const dt = new Date(dateStr + 'T00:00:00')
  const td = new Date(); td.setHours(0, 0, 0, 0)
  const yd = new Date(td); yd.setDate(td.getDate() - 1)
  const dd = new Date(dt); dd.setHours(0, 0, 0, 0)
  const s  = dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  if (dd.getTime() === td.getTime()) return 'Today · ' + s
  if (dd.getTime() === yd.getTime()) return 'Yesterday · ' + s
  return s
}

export function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export function nowTimeStr() {
  return new Date().toTimeString().slice(0, 5)
}

// ─── CATEGORY TOTALS ─────────────────────

export function getCatTotals(expenses) {
  const ct = {}
  expenses.forEach(e => { ct[e.category] = (ct[e.category] || 0) + e.amount })
  return ct
}

export function getSubcatTotals(expenses) {
  const sc = {}
  expenses.forEach(e => {
    if (e.subcategory) {
      if (!sc[e.category]) sc[e.category] = {}
      sc[e.category][e.subcategory] = (sc[e.category][e.subcategory] || 0) + e.amount
    }
  })
  return sc
}
