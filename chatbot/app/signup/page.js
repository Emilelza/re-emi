'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase-browser'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [done, setDone]         = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const supabase = createClient()

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    })
    if (error) { setError(error.message); setLoading(false) }
    else setDone(true)
  }

  if (done) return (
    <div style={p.page}>
      <div style={p.grid} aria-hidden />
      <div style={{ ...p.card, textAlign: 'center' }}>
        <div style={p.confirmIcon}>_</div>
        <h2 style={{ ...p.heading, marginBottom: '0.5rem' }}>Check your inbox</h2>
        <p style={{ ...p.sub, marginBottom: '1.5rem' }}>
          Confirmation sent to <strong style={{ color: '#a855f7' }}>{email}</strong>.<br />
          Click the link to activate your account.
        </p>
        <Link href="/login" style={p.btn}>Back to Sign In</Link>
      </div>
    </div>
  )

  return (
    <div style={p.page}>
      <div style={p.grid} aria-hidden />
      <div style={p.card}>
        <div style={p.brand}>
          <span style={p.brandDot} />
          <span style={p.brandName}>Re-Emi</span>
        </div>
        <h1 style={p.heading}>Create account</h1>
        <p style={p.sub}>Free forever. No credit card needed.</p>

        <form onSubmit={handleSignup} style={p.form}>
          <div style={p.field}>
            <label style={p.label}>Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required
              style={p.input}
              onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(139,92,246,0.2)'}
            />
          </div>
          <div style={p.field}>
            <label style={p.label}>Password <span style={{ color: 'rgba(200,190,230,0.35)', fontFamily: 'Manrope' }}>(min 6 chars)</span></label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required minLength={6}
              style={p.input}
              onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(139,92,246,0.2)'}
            />
          </div>
          {error && <div style={p.errorBox}>{error}</div>}
          <button
            type="submit" disabled={loading}
            style={{ ...p.btn, opacity: loading ? 0.6 : 1, display: 'block', width: '100%', marginTop: '0.4rem' }}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={p.footer}>
          Already have an account?{' '}
          <Link href="/login" style={p.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const p = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1.5rem', background: '#08080f', position: 'relative', overflow: 'hidden',
  },
  grid: {
    position: 'fixed', inset: 0,
    backgroundImage: `linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)`,
    backgroundSize: '48px 48px', pointerEvents: 'none', zIndex: 0,
  },
  card: {
    position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px',
    background: '#0d0d18', border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '16px', padding: '2.5rem 2rem',
  },
  confirmIcon: {
    fontFamily: "'Pixelify Sans', monospace", fontSize: '2.5rem',
    color: '#a855f7', marginBottom: '1rem',
    textShadow: '0 0 20px rgba(168,85,247,0.5)',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.75rem' },
  brandDot: {
    display: 'block', width: '8px', height: '8px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    boxShadow: '0 0 10px rgba(124,58,237,0.6)',
  },
  brandName: {
    fontFamily: "'Pixelify Sans', monospace", fontWeight: 700, fontSize: '1.1rem',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    letterSpacing: '0.02em',
  },
  heading: {
    fontFamily: "'Pixelify Sans', monospace", fontWeight: 600, fontSize: '1.6rem',
    color: '#f0edf8', marginBottom: '0.4rem', letterSpacing: '0.01em',
  },
  sub: { fontSize: '0.85rem', color: 'rgba(200,190,230,0.45)', marginBottom: '2rem', fontFamily: "'Manrope', sans-serif" },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: {
    fontFamily: "'Pixelify Sans', monospace", fontSize: '0.72rem',
    letterSpacing: '0.08em', color: 'rgba(200,190,230,0.55)', textTransform: 'uppercase',
  },
  input: {
    background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '8px', padding: '0.72rem 1rem', color: '#f0edf8',
    fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s', width: '100%',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
    borderRadius: '8px', padding: '0.6rem 0.9rem', fontSize: '0.82rem', color: '#fca5a5',
    fontFamily: "'Manrope', sans-serif",
  },
  btn: {
    fontFamily: "'Pixelify Sans', monospace", fontWeight: 600, fontSize: '0.9rem',
    letterSpacing: '0.04em', background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    border: 'none', borderRadius: '8px', padding: '0.82rem', color: '#fff',
    transition: 'transform 0.15s, box-shadow 0.15s',
    boxShadow: '0 4px 20px rgba(124,58,237,0.3)', cursor: 'pointer', textAlign: 'center',
    display: 'inline-block',
  },
  footer: {
    textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem',
    color: 'rgba(200,190,230,0.42)', fontFamily: "'Manrope', sans-serif",
  },
  link: { color: '#a855f7', fontWeight: 600 },
}
