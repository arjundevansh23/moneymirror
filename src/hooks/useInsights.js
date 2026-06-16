import { useMemo } from 'react'
import { getCatTotals, getSubcatTotals, calcScores, sipFuture, inr, fmtLakhs } from '../lib/calculations'

export function useInsights({ expenses, goals, income, peer }) {
  return useMemo(() => {
    const ct    = getCatTotals(expenses)
    const sc    = getSubcatTotals(expenses)
    const total = expenses.reduce((s, e) => s + e.amount, 0)
    const saved = Math.max(0, income - total)

    const food      = ct['Food']      || 0
    const transport = ct['Transport'] || 0
    const shopping  = ct['Shopping']  || 0

    const scores = calcScores({ total, income, food, transport, shopping, goals, peer })

    // Leaks vs peer benchmarks
    const foodLeak  = Math.max(0, food - peer.Food)
    const shopLeak  = Math.max(0, shopping - peer.Shopping)
    const totalLeak = foodLeak + shopLeak
    const sipAmt    = Math.max(500, Math.round((totalLeak / 2) / 500) * 500)

    // Weekend vs weekday
    const dayMap = {}
    let weekendTotal = 0, weekdayTotal = 0
    let weekendDays  = 0, weekdayDays  = 0
    expenses.forEach(e => {
      const day    = new Date(e.date + 'T00:00:00').getDay()
      const isWknd = day === 6 || day === 0
      if (isWknd) {
        weekendTotal += e.amount
        if (!dayMap['w' + e.date]) { dayMap['w' + e.date] = 1; weekendDays++ }
      } else {
        weekdayTotal += e.amount
        if (!dayMap['d' + e.date]) { dayMap['d' + e.date] = 1; weekdayDays++ }
      }
    })
    const weekdayAvg  = weekdayDays > 0 ? Math.round(weekdayTotal / weekdayDays) : 0
    const weekendAvg  = weekendDays > 0 ? Math.round(weekendTotal / weekendDays) : 0
    const wkMultiple  = weekdayAvg > 0   ? (weekendAvg / weekdayAvg).toFixed(1)  : '—'
    const weekendOver = weekendAvg > weekdayAvg * 1.3

    // Top spending day
    const dayTotals = {}
    expenses.forEach(e => { dayTotals[e.date] = (dayTotals[e.date] || 0) + e.amount })
    const topDay = Object.keys(dayTotals).sort((a, b) => dayTotals[b] - dayTotals[a])[0]

    // Most frequent category
    const catCount = {}
    expenses.forEach(e => { catCount[e.category] = (catCount[e.category] || 0) + 1 })
    const topCat = Object.keys(catCount).sort((a, b) => catCount[b] - catCount[a])[0]

    // Nearest active goal
    const activeGoals  = goals.filter(g => g.saved < g.target)
    const nearestGoal  = activeGoals.sort((a, b) => (a.deadline || '9999').localeCompare(b.deadline || '9999'))[0]

    return {
      ct, sc, total, saved,
      food, transport, shopping,
      ...scores,
      foodLeak, shopLeak, totalLeak, sipAmt,
      weekdayAvg, weekendAvg, wkMultiple, weekendOver, weekendDays, weekdayDays,
      topDay, topDayAmt: topDay ? dayTotals[topDay] : 0,
      topCat, topCatCount: topCat ? catCount[topCat] : 0,
      activeGoals, nearestGoal,
      peer,
    }
  }, [expenses, goals, income, peer])
}
