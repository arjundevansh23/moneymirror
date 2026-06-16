import { useNavigate } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <div className="landing-bg">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>

      <div className="landing-content">
        <div className="landing-top">
          <div className="landing-logo">
            <span className="logo-icon">💰</span>
            <span className="logo-text">Money Mirror</span>
          </div>
        </div>

        <div className="landing-hero">
          <div className="landing-tag">Personal Finance · Reimagined</div>
          <h1 className="landing-title">
            See where your<br />
            money actually<br />
            <em>goes.</em>
          </h1>
          <p className="landing-desc">
            Track expenses, compare with peers your age and city,
            and learn what your habits cost you over 10 years.
            Finance education through your own data.
          </p>
        </div>

        <div className="landing-features">
          <div className="feature-pill">📊 Peer benchmarks</div>
          <div className="feature-pill">🎯 Goal tracking</div>
          <div className="feature-pill">💡 Live insights</div>
          <div className="feature-pill">📈 SIP projections</div>
        </div>

        <div className="landing-actions">
          <button className="btn-land-primary" onClick={() => navigate('/signup')}>
            Get started — it's free
          </button>
          <button className="btn-land-secondary" onClick={() => navigate('/login')}>
            Already have an account
          </button>
        </div>

        <p className="landing-fine">
          No bank access needed · Data stays on your device · No ads ever
        </p>
      </div>
    </div>
  )
}
