'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase-browser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/* ── Tiny pixel heart for branding ── */
const MINI_HEART = [
  [0,1,0,1,0],
  [1,1,1,1,1],
  [1,1,1,1,1],
  [0,1,1,1,0],
  [0,0,1,0,0],
]
function MiniHeart() {
  const cell = 5
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(5,${cell}px)`, gridTemplateRows:`repeat(5,${cell}px)`, imageRendering:'pixelated' }}>
      {MINI_HEART.map((row,r) => row.map((on,c) => (
        <div key={`${r}-${c}`} style={{ width:cell, height:cell, background: on ? '#ec4899' : 'transparent', borderRadius: on ? '0.5px' : 0 }} />
      )))}
    </div>
  )
}

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/chat')
  }

  return (
    <div style={p.page}>
      <div style={p.grid} aria-hidden />
      {/* glow orb */}
      <div style={p.orb} aria-hidden />

      <div style={p.card}>
        {/* Logo */}
        <div style={p.logoRow}>
          <MiniHeart />
          <span style={p.logoText}>Re-Emi</span>
        </div>
        <h1 style={p.heading}>Your Relationship<br />Companion</h1>
        <p style={p.sub}>Sign in to continue</p>

        <form onSubmit={handleLogin} style={p.form}>
          <div style={p.field}>
            <label style={p.label}>Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required
              style={p.input}
              onFocus={e  => { e.target.style.borderColor = 'rgba(168,85,247,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)' }}
              onBlur={e   => { e.target.style.borderColor = 'rgba(139,92,246,0.2)'; e.target.style.boxShadow = 'none' }}
            />
          </div>
          <div style={p.field}>
            <label style={p.label}>Password</label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              style={p.input}
              onFocus={e  => { e.target.style.borderColor = 'rgba(168,85,247,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)' }}
              onBlur={e   => { e.target.style.borderColor = 'rgba(139,92,246,0.2)'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          {error && <div style={p.err}>{error}</div>}

          <button
            type="submit" disabled={loading}
            style={{ ...p.btn, opacity: loading ? 0.65 : 1 }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.5)' }}}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.32)' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={p.footer}>
          No account?{' '}
          <Link href="/signup" style={p.link}>Create one free</Link>
        </p>

        <Link href="/home" style={p.back}>← Back to home</Link>
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
    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
    backgroundImage: `linear-gradient(rgba(124,58,237,0.042) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.042) 1px,transparent 1px)`,
    backgroundSize: '48px 48px',
  },
  orb: {
    position: 'fixed', top: '-120px', left: '50%', transform: 'translateX(-50%)',
    width: 480, height: 480, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
    filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0,
  },
  card: {
    position: 'relative', zIndex: 1,
    width: '100%', maxWidth: '400px',
    background: '#0d0d18',
    border: '1px solid rgba(139,92,246,0.18)',
    borderRadius: '18px',
    padding: '2.5rem 2.25rem',
    boxShadow: '0 0 60px rgba(124,58,237,0.08)',
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.6rem',
  },
  logoText: {
    fontFamily: "'Pixelify Sans', monospace", fontWeight: 700, fontSize: '1.15rem',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    letterSpacing: '0.04em',
  },
  heading: {
    fontFamily: "'Pixelify Sans', monospace", fontWeight: 700,
    fontSize: '1.55rem', lineHeight: 1.2, letterSpacing: '0.01em',
    color: '#f0edf8', marginBottom: '0.55rem',
  },
  sub: {
    fontFamily: "'Manrope', sans-serif", fontSize: '0.85rem',
    color: 'rgba(200,190,230,0.42)', marginBottom: '2rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.15rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.38rem' },
  label: {
    fontFamily: "'Pixelify Sans', monospace", fontSize: '0.7rem',
    letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(200,190,230,0.5)',
  },
  input: {
    background: 'rgba(139,92,246,0.055)', border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '9px', padding: '0.75rem 1rem', color: '#f0edf8',
    fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.18s, box-shadow 0.18s', width: '100%',
  },
  err: {
    background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '8px', padding: '0.58rem 0.9rem',
    fontSize: '0.82rem', color: '#fca5a5', fontFamily: "'Manrope', sans-serif",
  },
  btn: {
    fontFamily: "'Pixelify Sans', monospace", fontWeight: 600,
    fontSize: '0.9rem', letterSpacing: '0.06em',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    border: 'none', borderRadius: '9px', padding: '0.85rem',
    color: '#fff', marginTop: '0.35rem', cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    boxShadow: '0 4px 20px rgba(124,58,237,0.32)',
  },
  footer: {
    textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem',
    color: 'rgba(200,190,230,0.38)', fontFamily: "'Manrope', sans-serif",
  },
  link: { color: '#a855f7', fontWeight: 600 },
  back: {
    display: 'block', textAlign: 'center', marginTop: '1rem',
    fontSize: '0.75rem', color: 'rgba(200,190,230,0.28)',
    fontFamily: "'Pixelify Sans', monospace", letterSpacing: '0.04em',
    transition: 'color 0.15s',
  },
}
