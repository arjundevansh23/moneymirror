import { useState } from 'react'
import { inr, dayLabel, getCatTotals } from '../../lib/calculations'
import { CAT_BG, CAT_ICON } from '../../lib/constants'
import AddExpenseModal from '../modals/AddExpenseModal'
import './Tab.css'

export default function ExpensesTab({ expenses, income, onExpenseChange, showToast }) {
  const [modalOpen, setModalOpen]   = useState(false)
  const [editExpense, setEditExpense] = useState(null)

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  // Group by date
  const groups = {}
  ;[...expenses].sort((a, b) => {
    const d = b.date.localeCompare(a.date)
    return d !== 0 ? d : (b.time || '').localeCompare(a.time || '')
  }).forEach(e => {
    (groups[e.date] = groups[e.date] || []).push(e)
  })

  function openAdd() { setEditExpense(null); setModalOpen(true) }
  function openEdit(e) { setEditExpense(e); setModalOpen(true) }

  function handleSave(msg) {
    showToast(msg)
    onExpenseChange()
  }

  return (
    <div className="tab-page">
      {/* Header */}
      <div className="page-head">
        <div className="page-title">Expenses</div>
        <button className="add-btn" onClick={openAdd}>＋ Add</button>
      </div>

      {/* Summary */}
      <div className="sum-row">
        <div className="sum-card sum-spent">
          <div className="sum-val">{inr(total)}</div>
          <div className="sum-lbl">Spent</div>
        </div>
        <div className="sum-card sum-income">
          <div className="sum-val">{inr(income)}</div>
          <div className="sum-lbl">Income</div>
        </div>
        <div className="sum-card sum-txns">
          <div className="sum-val">{expenses.length} txns</div>
          <div className="sum-lbl">This month</div>
        </div>
      </div>

      {/* Transaction list */}
      {expenses.length === 0 ? (
        <div className="empty-state">
          No expenses yet.<br />
          <strong>Tap ＋ Add</strong> to get started.
        </div>
      ) : (
        Object.keys(groups).sort((a, b) => b.localeCompare(a)).map(date => (
          <div className="txn-group" key={date}>
            <div className="txn-day">{dayLabel(date)}</div>
            <div className="txn-list">
              {groups[date].map((e, i) => (
                <div
                  key={e.id}
                  className="txn-row"
                  style={i === groups[date].length-1 ? {borderBottom:'none'} : {}}
                  onClick={() => openEdit(e)}
                >
                  <div className="txn-ico" style={{ background: CAT_BG[e.category] || '#f0f0e8' }}>
                    {e.icon || CAT_ICON[e.category] || '💸'}
                  </div>
                  <div className="txn-mid">
                    <div className="txn-name">{e.description}</div>
                    <div className="txn-meta">
                      {e.time ? e.time + ' · ' : ''}{e.category}{e.subcategory ? ' › ' + e.subcategory : ''}
                    </div>
                  </div>
                  <div className="txn-right">
                    <div className="txn-amt">−{inr(e.amount)}</div>
                    <div className="txn-cat">{e.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <AddExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editExpense={editExpense}
      />
    </div>
  )
}
