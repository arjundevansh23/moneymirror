import './BottomNav.css'

const TABS = [
  { id: 'home',     ico: '🏠', label: 'Home'     },
  { id: 'expenses', ico: '💳', label: 'Expenses'  },
  { id: 'insights', ico: '✦',  label: 'Insights'  },
  { id: 'invest',   ico: '📈', label: 'Invest'    },
  { id: 'goals',    ico: '🎯', label: 'Goals'     },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bnav">
      {TABS.map(t => (
        <button
          key={t.id}
          className={`ni ${active === t.id ? 'on' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <span className="ni-ico">{t.ico}</span>
          {active === t.id
            ? <span className="ni-dot" />
            : <span className="ni-lbl">{t.label}</span>
          }
        </button>
      ))}
    </nav>
  )
}
