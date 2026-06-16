import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CITIES, OCCUPATIONS } from '../lib/constants'
import './Onboarding.css'

const STEPS = [
  { id: 'name',       title: "What should we\ncall you?",         sub: 'This personalises your experience' },
  { id: 'age',        title: "How old are you?",                  sub: 'Used for peer benchmarks' },
  { id: 'city',       title: "Which city\ndo you live in?",       sub: 'Benchmarks are city-specific' },
  { id: 'income',     title: "What's your monthly\nincome?",      sub: 'After tax. Used to calculate savings rate' },
  { id: 'occupation', title: "What do you do?",                   sub: 'Helps us understand your spending context' },
]

export default function Onboarding() {
  const navigate  = useNavigate()
  const [step, setStep]   = useState(0)
  const [loading, setLoading] = useState(false)
  const [data, setData]   = useState({
    name: '', age: '', city: '', income: '', occupation: ''
  })

  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1

  function update(key, val) {
    setData(d => ({ ...d, [key]: val }))
  }

  function canNext() {
    const val = data[current.id]
    if (!val) return false
    if (current.id === 'age' && (Number(val) < 16 || Number(val) > 80)) return false
    if (current.id === 'income' && Number(val) <= 0) return false
    return true
  }

  async function handleNext() {
    if (!canNext()) return
    if (!isLast) { setStep(s => s + 1); return }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').upsert({
        id:         user.id,
        name:       data.name,
        age:        Number(data.age),
        city:       data.city,
        income:     Number(data.income),
        occupation: data.occupation,
        updated_at: new Date().toISOString()
      })
    }
    navigate('/app')
  }

  return (
    <div className="onboard-page">
      {/* Progress dots */}
      <div className="onboard-progress">
        {STEPS.map((_, i) => (
          <div key={i} className={`onboard-dot ${i <= step ? 'on' : ''}`} />
        ))}
      </div>

      <div className="onboard-content">
        <div className="onboard-step-num">Step {step + 1} of {STEPS.length}</div>
        <h1 className="onboard-title">{current.title}</h1>
        <p className="onboard-sub">{current.sub}</p>

        <div className="onboard-input-wrap">
          {current.id === 'name' && (
            <input
              className="onboard-input"
              type="text"
              placeholder="Your name"
              value={data.name}
              onChange={e => update('name', e.target.value)}
              autoFocus
            />
          )}

          {current.id === 'age' && (
            <input
              className="onboard-input"
              type="number"
              placeholder="e.g. 24"
              value={data.age}
              onChange={e => update('age', e.target.value)}
              min={16} max={80}
              autoFocus
            />
          )}

          {current.id === 'city' && (
            <div className="onboard-options">
              {CITIES.map(city => (
                <button
                  key={city}
                  className={`onboard-option ${data.city === city ? 'sel' : ''}`}
                  onClick={() => update('city', city)}
                >
                  {city}
                </button>
              ))}
            </div>
          )}

          {current.id === 'income' && (
            <div className="onboard-income-wrap">
              <span className="onboard-currency">₹</span>
              <input
                className="onboard-input income-input"
                type="number"
                placeholder="0"
                value={data.income}
                onChange={e => update('income', e.target.value)}
                min={0}
                autoFocus
              />
              <span className="onboard-per">/month</span>
            </div>
          )}

          {current.id === 'occupation' && (
            <div className="onboard-options">
              {OCCUPATIONS.map(occ => (
                <button
                  key={occ}
                  className={`onboard-option ${data.occupation === occ ? 'sel' : ''}`}
                  onClick={() => update('occupation', occ)}
                >
                  {occ}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="onboard-footer">
        {step > 0 && (
          <button className="onboard-back" onClick={() => setStep(s => s - 1)}>
            ←
          </button>
        )}
        <button
          className={`onboard-next ${!canNext() ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!canNext() || loading}
        >
          {loading ? 'Setting up...' : isLast ? 'Let\'s go →' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
