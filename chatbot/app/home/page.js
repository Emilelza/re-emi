'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase-browser'

/* ── Pixel heart ── */
const HEART_MAP = [
  [0, 1, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
]
function PixelHeart({ size = 200 }) {
  const cell = size / 8
  return (
    <div style={{
      width: size, height: size,
      display: 'grid',
      gridTemplateColumns: `repeat(8,${cell}px)`,
      gridTemplateRows: `repeat(8,${cell}px)`,
      animation: 'heartPulse 2.6s ease-in-out infinite',
      imageRendering: 'pixelated',
    }}>
      {HEART_MAP.map((row, r) =>
        row.map((on, c) => (
          <div key={`${r}-${c}`} style={{
            width: cell, height: cell,
            background: on ? `linear-gradient(135deg,${r < 3 ? '#f472b6' : r < 5 ? '#ec4899' : '#be185d'},${c < 4 ? '#c084fc' : '#a855f7'})` : 'transparent',
            borderRadius: on ? '1px' : 0,
          }} />
        ))
      )}
    </div>
  )
}

/* ── About cards data ── */
const ABOUT_ITEMS = [
  {
    num: '01',
    title: 'Every phase covered',
    body: 'New boyfriend nerves. Honeymoon highs. Overthinking spirals. Conflict recovery. Re-Emi understands where you are and meets you there — no judgment, no scripts.',
  },
  {
    num: '02',
    title: 'Emotionally real responses',
    body: 'Not a chatbot that echoes keywords back at you. Re-Emi picks up on tone, timing, and what you actually mean — then gives you something real to work with.',
  },
  {
    num: '03',
    title: 'Built for the clueless but caring',
    body: 'You care deeply. You just miss the signals sometimes. Re-Emi bridges the gap between what she feels and what you hear, without making you feel bad about it.',
  },
  {
    num: '04',
    title: 'Always here, always private',
    body: 'No waitlists. No subscriptions. Your conversations exist only in your session — nothing stored, nothing shared. Just you and Re-Emi, whenever you need it.',
  },
]

export default function HomePage() {
  const router = useRouter()
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const aboutRef = useRef(null)
  const [visible, setVisible] = useState({})

  useEffect(() => {
    setReady(true)
    // Intersection observer for about cards fade-in
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.dataset.idx]: true }))
      }),
      { threshold: 0.15 }
    )
    const cards = document.querySelectorAll('[data-idx]')
    cards.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  async function handleStart() {
    const { data: { user } } = await supabase.auth.getUser()
    router.push(user ? '/chat' : '/login')
  }

  function scrollToAbout() {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const heartSize = ready && window.innerWidth < 500 ? 140 : 200

  return (
    <div style={h.root}>
      {/* Fixed grid background */}
      <div style={h.grid} aria-hidden />

      {/* ── STICKY NAV ── */}
      <nav style={h.nav}>
        <span style={h.navBrand}>Re-Emi</span>
        <div style={h.navLinks}>
          <button style={h.navLink}
            onMouseEnter={e => e.currentTarget.style.color = '#f0edf8'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(200,190,230,0.5)'}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
          <button style={h.navLink}
            onMouseEnter={e => e.currentTarget.style.color = '#f0edf8'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(200,190,230,0.5)'}
            onClick={scrollToAbout}>About</button>
          <button style={h.navSignIn}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.18)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.22)' }}
            onClick={() => router.push('/login')}>Sign In</button>
        </div>
      </nav>

      {/* ══════════════════════════
          SECTION 1 — HERO
      ══════════════════════════ */}
      <section style={h.heroSection}>
        {/* Ambient orbs */}
        <div style={{ ...h.orb, top: '12%', left: '8%', width: 440, height: 440, background: 'rgba(124,58,237,0.07)', animationDelay: '0s' }} aria-hidden />
        <div style={{ ...h.orb, bottom: '8%', right: '6%', width: 360, height: 360, background: 'rgba(236,72,153,0.055)', animationDelay: '2.5s' }} aria-hidden />

        <div style={h.heartWrap} className="rise-1">
          <div style={h.heartBloom} aria-hidden />
          {ready && <PixelHeart size={heartSize} />}
        </div>

        <h1 style={h.heading} className="rise-2">
          Connections that<br />
          <span style={h.headingAccent}>feel real</span>
        </h1>

        <p style={h.sub} className="rise-2">
          Your emotionally intelligent relationship companion.
        </p>

        <button style={h.cta} className="rise-3" onClick={handleStart}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(124,58,237,0.55),0 0 0 1px rgba(168,85,247,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.38),0 0 0 1px rgba(139,92,246,0.22)' }}
        >
          Start Your Journey
        </button>

        {/* Scroll hint */}
        <button style={h.scrollHint} onClick={scrollToAbout} aria-label="Scroll to About">
          <div style={h.scrollLine} />
          <span style={h.scrollLabel}>About</span>
        </button>
      </section>

      {/* ══════════════════════════
          SECTION 2 — ABOUT
      ══════════════════════════ */}
      <section style={h.aboutSection} ref={aboutRef}>
        {/* Orb behind about */}
        <div style={{ ...h.orb, top: '20%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, background: 'rgba(124,58,237,0.055)', animationDelay: '1s' }} aria-hidden />

        <div style={h.aboutInner}>
          {/* Section label */}
          <div style={h.aboutLabel}>About Re-Emi</div>

          {/* Big headline */}
          <h2 style={h.aboutHeading}>
            The best friend your<br />
            <span style={h.headingAccent}>relationship needs</span>
          </h2>

          <p style={h.aboutLead}>
            Re-Emi is not a therapist. She is the emotionally aware best friend that every boyfriend deserves — someone who gets it, validates it, and helps you navigate without the lecture.
          </p>

          {/* Cards grid */}
          <div style={h.cardsGrid}>
            {ABOUT_ITEMS.map((item, i) => (
              <div
                key={i}
                data-idx={i}
                style={{
                  ...h.card,
                  opacity: visible[i] ? 1 : 0,
                  transform: visible[i] ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.55s ease ${i * 0.1}s, transform 0.55s ease ${i * 0.1}s`,
                }}
              >
                <span style={h.cardNum}>{item.num}</span>
                <h3 style={h.cardTitle}>{item.title}</h3>
                <p style={h.cardBody}>{item.body}</p>
              </div>
            ))}
          </div>
          {/* Bottom CTA */}

        </div>
      </section>

      {/* Footer */}
      <footer style={h.footer}>
        <span style={{ ...h.navBrand, fontSize: '0.85rem' }}>Re-Emi</span>
        <p style={h.footerSub}>A companion, not a therapist. For serious concerns please seek professional help.</p>
      </footer>

      <style>{`
        @keyframes ambientGlow {
          0%,100% { opacity:0.5; transform:scale(1); }
          50%      { opacity:0.85; transform:scale(1.05); }
        }
        @keyframes scrollBounce {
          0%,100% { transform:translateY(0); opacity:0.5; }
          50%      { transform:translateY(6px); opacity:1; }
        }
        @media(max-width:640px) {
          nav { padding:1rem 1.25rem !important; }
          .cards-grid { grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  )
}

const h = {
  root: {
    background: '#08080f',
    color: '#f0edf8',
    minHeight: '100vh',
    position: 'relative',
  },
  grid: {
    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
    backgroundImage: `linear-gradient(rgba(124,58,237,0.042) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.042) 1px,transparent 1px)`,
    backgroundSize: '48px 48px',
    animation: 'gridScroll 8s linear infinite',
  },
  orb: {
    position: 'absolute', borderRadius: '50%',
    filter: 'blur(88px)', pointerEvents: 'none', zIndex: 0,
    animation: 'ambientGlow 5s ease-in-out infinite',
  },

  /* Nav */
  nav: {
    position: 'sticky', top: 0, zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1.1rem 2.5rem',
    background: 'rgba(8,8,15,0.82)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(139,92,246,0.08)',
  },
  navBrand: {
    fontFamily: "'Pixelify Sans',monospace", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.04em',
    background: 'linear-gradient(135deg,#a855f7,#ec4899)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  },
  navLinks: { display: 'flex', alignItems: 'center', gap: '0.2rem' },
  navLink: {
    background: 'transparent', border: 'none', cursor: 'pointer',
    fontFamily: "'Manrope',sans-serif", fontWeight: 500,
    fontSize: '0.85rem', color: 'rgba(200,190,230,0.5)',
    padding: '0.4rem 0.9rem', borderRadius: '6px',
    transition: 'color 0.15s',
  },
  navSignIn: {
    fontFamily: "'Pixelify Sans',monospace", fontWeight: 600,
    fontSize: '0.78rem', letterSpacing: '0.04em',
    background: 'transparent',
    border: '1px solid rgba(139,92,246,0.22)',
    borderRadius: '7px', padding: '0.4rem 0.9rem',
    color: 'rgba(200,190,230,0.7)', cursor: 'pointer',
    transition: 'background 0.15s, border-color 0.15s',
    marginLeft: '0.3rem',
  },

  /* Hero section */
  heroSection: {
    minHeight: 'calc(100vh - 56px)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: '1.5rem', padding: '2rem 1.5rem 5rem',
    position: 'relative', zIndex: 2, textAlign: 'center',
    overflow: 'hidden',
  },
  heartWrap: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heartBloom: {
    position: 'absolute', inset: '-70px', borderRadius: '50%', pointerEvents: 'none',
    background: 'radial-gradient(circle,rgba(236,72,153,0.18) 0%,rgba(124,58,237,0.12) 45%,transparent 70%)',
    animation: 'ambientGlow 2.6s ease-in-out infinite',
  },
  heading: {
    fontFamily: "'Pixelify Sans',monospace", fontWeight: 700,
    fontSize: 'clamp(2rem,5vw,3.25rem)', lineHeight: 1.15,
    letterSpacing: '0.01em', color: '#f0edf8', marginTop: '0.5rem',
  },
  headingAccent: {
    background: 'linear-gradient(135deg,#c084fc,#ec4899)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  },
  sub: {
    fontFamily: "'Manrope',sans-serif", fontSize: 'clamp(0.85rem,2vw,1rem)',
    color: 'rgba(200,190,230,0.48)', maxWidth: '340px', lineHeight: 1.7,
  },
  cta: {
    fontFamily: "'Pixelify Sans',monospace", fontWeight: 600,
    fontSize: '0.95rem', letterSpacing: '0.06em',
    background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    border: 'none', borderRadius: '10px', padding: '0.9rem 2.4rem',
    color: '#fff', cursor: 'pointer', marginTop: '0.5rem',
    transition: 'transform 0.18s, box-shadow 0.18s',
    boxShadow: '0 4px 24px rgba(124,58,237,0.38),0 0 0 1px rgba(139,92,246,0.22)',
  },
  scrollHint: {
    position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
    background: 'transparent', border: 'none', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
  },
  scrollLine: {
    width: '1px', height: '36px',
    background: 'linear-gradient(to bottom,rgba(139,92,246,0.6),transparent)',
    animation: 'scrollBounce 1.8s ease-in-out infinite',
  },
  scrollLabel: {
    fontFamily: "'Pixelify Sans',monospace", fontSize: '0.62rem',
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'rgba(200,190,230,0.3)',
  },

  /* About section */
  aboutSection: {
    minHeight: '100vh',
    position: 'relative', zIndex: 2,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '5rem 2rem 6rem',
    borderTop: '1px solid rgba(139,92,246,0.08)',
    overflow: 'hidden',
  },
  aboutInner: {
    maxWidth: '900px', width: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center', gap: '1.5rem', position: 'relative', zIndex: 1,
  },
  aboutLabel: {
    fontFamily: "'Pixelify Sans',monospace", fontSize: '0.68rem',
    letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'rgba(168,85,247,0.6)',
    border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '999px', padding: '0.28rem 0.9rem',
  },
  aboutHeading: {
    fontFamily: "'Pixelify Sans',monospace", fontWeight: 700,
    fontSize: 'clamp(1.75rem,4vw,2.75rem)', lineHeight: 1.15,
    letterSpacing: '0.01em', color: '#f0edf8',
  },
  aboutLead: {
    fontFamily: "'Manrope',sans-serif", fontSize: 'clamp(0.88rem,1.8vw,1rem)',
    color: 'rgba(200,190,230,0.52)', lineHeight: 1.78,
    maxWidth: '560px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
    gap: '1rem', width: '100%', marginTop: '1rem',
  },
  card: {
    background: '#0d0d1a',
    border: '1px solid rgba(139,92,246,0.12)',
    borderRadius: '14px',
    padding: '1.75rem 1.5rem',
    textAlign: 'left',
    transition: 'border-color 0.2s',
  },
  cardNum: {
    display: 'block',
    fontFamily: "'Pixelify Sans',monospace", fontSize: '0.68rem',
    letterSpacing: '0.12em', color: 'rgba(168,85,247,0.5)',
    marginBottom: '0.75rem',
  },
  cardTitle: {
    fontFamily: "'Pixelify Sans',monospace", fontWeight: 600,
    fontSize: '1rem', letterSpacing: '0.02em',
    color: '#f0edf8', marginBottom: '0.6rem',
  },
  cardBody: {
    fontFamily: "'Manrope',sans-serif", fontSize: '0.85rem',
    color: 'rgba(200,190,230,0.48)', lineHeight: 1.75,
  },
  aboutCta: { marginTop: '1.5rem' },

  /* Footer */
  footer: {
    borderTop: '1px solid rgba(139,92,246,0.07)',
    padding: '2rem 2.5rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
    position: 'relative', zIndex: 2,
  },
  footerSub: {
    fontFamily: "'Manrope',sans-serif", fontSize: '0.72rem',
    color: 'rgba(200,190,230,0.22)', textAlign: 'center', maxWidth: '400px',
  },
}