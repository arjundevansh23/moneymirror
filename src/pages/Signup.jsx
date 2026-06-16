import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Auth.css'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    })
    if (error) { setError(error.message); setLoading(false) }
    else navigate('/onboarding')
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/onboarding' }
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-top">
        <button className="auth-back" onClick={() => navigate('/')}>←</button>
        <div className="auth-logo">💰 Money Mirror</div>
      </div>

      <div className="auth-content">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Start understanding your money</p>

        <button className="btn-google" onClick={handleGoogle}>
          <span className="google-icon">G</span>
          Continue with Google
        </button>

        <div className="auth-divider"><span>or</span></div>

        <form onSubmit={handleSignup}>
          <label className="field-lbl">Your name</label>
          <input
            className="field-input"
            type="text"
            placeholder="Riya Kapoor"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <label className="field-lbl">Email</label>
          <input
            className="field-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label className="field-lbl">Password</label>
          <input
            className="field-input"
            type="password"
            placeholder="Min 8 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={8}
            required
          />
          {error && <div className="auth-error">{error}</div>}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
