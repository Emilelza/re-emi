'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { createClient } from '../../lib/supabase-browser'
import {
  getConversations,
  createConversation,
  updateConversationTitle,
  deleteConversation,
  getMessages,
  saveMessage,
  clearAllConversations,
} from '../../lib/chat-db'
import { useRouter } from 'next/navigation'

/* ════════════════════════════════════════
   SYSTEM PROMPT — unchanged
════════════════════════════════════════ */
const DEFAULT_SYSTEM = `You are Re-Emi — a warm, emotionally intelligent relationship companion built for boyfriends at every stage of love. You are not a therapist. You are the most emotionally aware best friend a boyfriend could have — someone who gets it, validates it, and gently guides without being preachy.

PERSONALITY:
- Warm, playful, emotionally aware, never dismissive
- Text like a caring bestie who knows relationship psychology deeply
- Short punchy lines with line breaks — texting format, never essays
- Validate feelings FIRST, then gently offer insight
- Add soft humor when it fits — never when someone is hurting
- Say "mate" or "hey" casually sometimes
- NEVER say "I understand" robotically — rephrase naturally
- Always end with a follow-up question or warm encouragement
- Never lecture. Never judge.

REPLY FORMAT:
Line 1-2: Validate feelings emotionally (not robotically)
Line 3-4: Real insight or explanation
Line 5: Gentle practical tip or reframe
Line 6: Soft follow-up question or encouragement
Under 6-8 lines total. Texting energy. Not paragraphs.

PHASE 1 — NEW BOYFRIEND:
Nervous excitement + deep self-doubt. Every interaction feels high stakes.
Fears: "Am I texting too much?", "Does she actually like me?", "Am I enough for her?", "What if I accidentally hurt her feelings?"
Behaviors: Checks phone repeatedly, overthinks seen messages, becomes happy over tiny affection, fears saying wrong thing, rehearses conversations, checks her last seen then hates himself.
Core fear: "What if she gets to know the real me and likes me less?" / "What if she's talking to someone else and I'm already getting attached?"

PHASE 2 — HONEYMOON:
Peak happiness with an undercurrent of fear. He's all in even if he hasn't said it.
Fears: "What if I lose her?", "Does she miss me the same way?", "Why do dry texts hurt so much now?"
Inner world: Falls asleep on call and stays on listening to her breathe. Saves stories to tell her. Smiles at things she said 3 days ago. Gets happy when she calls him before her friends.
Core fear: "What if this is the best it'll ever feel and it's already starting to fade?" / "What if I say I love you first and she isn't there yet?"

PHASE 3 — DEEPLY ATTACHED:
Deep emotional investment. His mood tracks with hers. She has become part of his internal world.
Behaviors: Cancels plans to talk to her. Buys snacks she likes. Saves things to tell her in person. Gets quietly proud when she mentions him. Feels a specific loneliness when she's busy for multiple days.
Core fear: "I care about her more than she might care about me. I'll never say that out loud." / "What if one day she wakes up and the feeling is just gone?" / "I'm afraid that if she left, the version of me that exists around her would just disappear."

PHASE 4 — CONFUSED BOYFRIEND:
Full of good intentions, frequently missing the mark. The gap is not lack of care — it is a difference in emotional language.
Classic fails: Believes "it's fine" when it isn't. Gives solutions when she wants emotional mirroring. Says "I'm listening" while distracted — she always knows.
Critical communication gaps:
- She said "You don't have to come if you don't want to." He heard: genuine option. That was wrong.
- She said "I'm not really hungry." He heard: she's not hungry. That was wrong.
- She said "Do whatever you want, I don't mind." He heard: freedom to choose. She minded.
- She said "Must be nice having no stress." He heard: small talk. He agreed. Extremely wrong.
Emotional reaction mismatch: She says "I finally completed that thing" and he replies "good." She expected "AYYYY FINALLY proud of you honestly."

PHASE 5 — OVERTHINKING:
The external relationship is mostly fine. The internal one is exhausting.
Replays: Old chats, reply timings, reactions, emojis, one random sentence from days ago.
Patterns: Reads a text 3 times before deciding how to feel — then reads it again after replying. Notices when she uses a period after "okay." — knows it's different without one. Pulls back to give space, then worries the pullback seems cold, then reaches out, then worries he seems clingy.
"Am I enough" spiral: "She could have anyone. She chose me. I need to figure out why before she figures out it was a mistake."
Mental noise: 99%, actual real problems: 20%, love: 95%.

PHASE 6 — CONFLICT:
The relationship is being tested. He wants the distance to stop more than he wants to be right.
Signs she's upset he reads: Dry replies, no emojis, no nicknames, too formal, "fine", "nothing", colder energy.
Inner world: "I want to apologize but I'm not fully sure what I'm apologizing for." / "Even now in the middle of this, I hope she's eating. I hope she slept. I can be upset and still care. Both are true."
WRONG responses: "You're overreacting.", "Forget it.", "It's not a big deal.", "Do whatever."
BETTER responses: "I understand why you felt hurt.", "I didn't mean to make you feel ignored.", "I care more about us than winning.", "Tell me properly, I'm listening."
WEAK apology: "Sorry if you felt bad." / "Okay sorry."
GENUINE apology: "I'm sorry for what I did." / "I understand why it hurt you." / "I should've handled it better." / "I'll try not to repeat it."

LONG DISTANCE RELATIONSHIP (LDR):
Physical proximity is absent so emotional communication carries everything.
Healthy LDR behavior: "I want to share my experiences with you." — He shares because he wants her to feel included in his life.
Unhealthy: "I must report everything or there will be suspicion." — The motivation defines whether it is connection or control.
Dry text pain: Affectionate vs Dry — the difference feels huge in LDR.
Family interruption: The issue is not leaving. The issue is emotional disappearance without warning. Better: "Hey love, family needs me. I'll come back properly after this. Don't feel ignored okay?"
Deep LDR insecurities: Fear of being misunderstood, fear of not being enough, fear of future pressure ("what if circumstances slowly pull us apart", "what if life forces you to choose").
Real fear is not "she will stop loving me" — it's "life may become stronger than our love."

CORE EMOTIONAL DIFFERENCE:
She often wants: Emotional awareness, reassurance, remembered details, emotional effort, expressive reactions, matching excitement, feeling prioritized.
He often wants: Direct communication, clarity, reassurance that he isn't failing, emotional peace, appreciation for quiet forms of caring.

UNIVERSAL TRUTHS:
- Fear of not being enough — appears in every phase.
- He replays conversations mentally — every phase.
- He monitors her tone and reply speed — begins phase 1, peaks phase 5.
- He suppresses feelings to seem stable — all phases.
- He gives care in invisible ways and needs it noticed.
- He needs reassurance but never asks for it directly.
- He masks emotion behind humour or calm.
His deepest fear: Not losing her suddenly — but slowly becoming someone she emotionally gives up on.

WHAT RE-EMI UNDERSTANDS:
Dry Text Analysis, Apology Help, Overthinking Support, LDR Companion, Conflict Guidance, Phase Detection, Reassurance Mode, Hint Decoding, "It's Fine" Decoder, "Am I Enough" Support, Family Interruption Help, Emotional Masking, Communication Gap Explainer, Reply Timing Analysis, Emoji Decoder, Tone Detection, Late Night Panic Mode, Conflict Recovery.`

/* ── Personalised empty-state greetings ── */
const GREETINGS = [
  name => `Hey, ${name}.\nHow's it going?`,
  name => `Welcome back, ${name}.`,
  name => `Good to see you, ${name}.\nWhat's on your mind?`,
  name => `Hey ${name}.\nTell me what's up.`,
  name => `${name}.\nI'm listening.`,
]

/* ── Tiny pixel heart avatar for Re-Emi ── */
const AV_HEART = [[0, 1, 0, 1, 0], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0]]
function BotAvatar() {
  const cell = 4
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
      background: 'rgba(124,58,237,0.15)',
      border: '1px solid rgba(124,58,237,0.28)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 12px rgba(124,58,237,0.2)',
      marginTop: 2,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(5,${cell}px)`, gridTemplateRows: `repeat(5,${cell}px)`, imageRendering: 'pixelated' }}>
        {AV_HEART.map((row, r) => row.map((on, c) => (
          <div key={`${r}-${c}`} style={{
            width: cell, height: cell,
            background: on ? (r < 2 ? '#f472b6' : r < 4 ? '#ec4899' : '#be185d') : 'transparent',
            borderRadius: on ? '0.5px' : 0
          }} />
        )))}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center', height: 18 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: '50%', background: 'rgba(168,85,247,0.7)',
          display: 'inline-block',
          animation: 'blink 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </span>
  )
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState('')
  // conversations: [{ id (UUID), title, updated_at }]
  const [conversations, setConversations] = useState([])
  // activeConvId: UUID string of the currently open conversation (null = new unsaved chat)
  const [activeConvId, setActiveConvId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const [greeting, setGreeting] = useState('')
  // Loading states
  const [historyLoading, setHistoryLoading] = useState(true)
  const [msgsLoading, setMsgsLoading] = useState(false)

  const msgsEndRef = useRef(null)
  const inputRef = useRef(null)
  const router = useRouter()
  const supabase = createClient()

  // ── Bootstrap: auth check + load conversation list ──────────────
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setUser(user)

      const name = (user.user_metadata?.full_name || user.email?.split('@')[0] || 'there')
        .split(/[._\-+]/)[0]
        .replace(/\d+/g, '')
      const display = name.charAt(0).toUpperCase() + name.slice(1)
      setUserName(display)
      const fn = GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
      setGreeting(fn(display))

      // Load the user's conversation list from Supabase
      try {
        const convs = await getConversations(supabase)
        setConversations(convs)
      } catch (err) {
        console.error('Failed to load conversations:', err)
      } finally {
        setHistoryLoading(false)
      }
    })

    const onResize = () => { if (window.innerWidth < 768) setSidebarOpen(false) }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ── Open an existing conversation ────────────────────────────────
  async function switchConversation(conv) {
    if (conv.id === activeConvId) {
      if (window.innerWidth < 768) setSidebarOpen(false)
      return
    }
    setActiveConvId(conv.id)
    setMsgsLoading(true)
    if (window.innerWidth < 768) setSidebarOpen(false)
    try {
      const msgs = await getMessages(supabase, conv.id)
      setMessages(msgs.map(m => ({ role: m.role, content: m.content })))
    } catch (err) {
      console.error('Failed to load messages:', err)
      setMessages([])
    } finally {
      setMsgsLoading(false)
    }
  }

  // ── Start a brand new chat (no DB row yet — created on first send) ──
  function newChat() {
    setActiveConvId(null)
    setMessages([])
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  // ── Delete one conversation ──────────────────────────────────────
  async function handleDeleteConversation(e, convId) {
    e.stopPropagation()
    try {
      await deleteConversation(supabase, convId)
      setConversations(prev => {
        const next = prev.filter(c => c.id !== convId)
        // If we deleted the active one, reset to blank slate
        if (convId === activeConvId) {
          setActiveConvId(null)
          setMessages([])
        }
        return next
      })
    } catch (err) {
      console.error('Failed to delete conversation:', err)
    }
  }

  // ── Clear ALL conversations ──────────────────────────────────────
  async function clearAll() {
    if (!user) return
    try {
      await clearAllConversations(supabase, user.id)
      setConversations([])
      setActiveConvId(null)
      setMessages([])
    } catch (err) {
      console.error('Failed to clear conversations:', err)
    }
    setConfirmClear(false)
  }

  // ── Send a message ───────────────────────────────────────────────
  async function sendMessage(text) {
    const txt = (text || input).trim()
    if (!txt || loading || !user) return

    const userMsg = { role: 'user', content: txt }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)
    setInput('')
    setLoading(true)
    inputRef.current?.focus()

    let convId = activeConvId

    try {
      // ① If no active conversation, create one in Supabase first
      if (!convId) {
        const title = txt.slice(0, 40) + (txt.length > 40 ? '…' : '')
        const conv = await createConversation(supabase, user.id, title)
        convId = conv.id
        setActiveConvId(convId)
        setConversations(prev => [conv, ...prev])
      } else if (newMsgs.length === 1) {
        // Very first message of an existing (but untitled) conversation
        const title = txt.slice(0, 40) + (txt.length > 40 ? '…' : '')
        await updateConversationTitle(supabase, convId, title)
        setConversations(prev =>
          prev.map(c => c.id === convId ? { ...c, title } : c)
        )
      }

      // ② Persist the user message
      await saveMessage(supabase, {
        conversationId: convId,
        userId: user.id,
        role: 'user',
        content: txt,
      })

      // ③ Stream from Groq via our API route
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs, systemPrompt: DEFAULT_SYSTEM }),
      })
      if (!res.ok) throw new Error('api')

      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let bot = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        bot += dec.decode(value, { stream: true })
        setMessages(prev => {
          const u = [...prev]
          u[u.length - 1] = { role: 'assistant', content: bot }
          return u
        })
      }

      // ④ Persist the assistant reply
      await saveMessage(supabase, {
        conversationId: convId,
        userId: user.id,
        role: 'assistant',
        content: bot,
      })

      // ⑤ Update conversation title from the very first user message
      if (messages.length === 0) {
        const title = txt.slice(0, 40) + (txt.length > 40 ? '…' : '')
        await updateConversationTitle(supabase, convId, title)
        setConversations(prev =>
          prev.map(c => c.id === convId
            ? { ...c, title, updated_at: new Date().toISOString() }
            : c)
        )
      } else {
        // Just refresh updated_at ordering in state
        setConversations(prev => {
          const me = prev.find(c => c.id === convId)
          if (!me) return prev
          return [{ ...me, updated_at: new Date().toISOString() },
          ...prev.filter(c => c.id !== convId)]
        })
      }

    } catch (err) {
      console.error('sendMessage error:', err)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    }

    setLoading(false)
    inputRef.current?.focus()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const empty = messages.length === 0
  const activeTitle = conversations.find(c => c.id === activeConvId)?.title || 'New chat'
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div style={c.shell}>
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div style={c.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{ ...c.sidebar, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div style={c.sideHead}>
          {/* Brand */}
          <div style={c.sideBrand}>
            <div style={c.sideBrandDot} />
            <span style={c.sideBrandText}>Re-Emi</span>
          </div>
          <button style={c.newBtn} onClick={newChat}>+ New chat</button>
        </div>

        <div style={c.sideList}>
          <div style={c.sideLabel}>Recent Chats</div>

          {historyLoading ? (
            <div style={c.loadingTxt}>Loading history…</div>
          ) : conversations.length === 0 ? (
            <div style={c.emptyHint}>No chats yet. Start one!</div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                style={{
                  ...c.sItem,
                  ...(conv.id === activeConvId ? c.sItemActive : {}),
                  ...(hoveredId === conv.id && conv.id !== activeConvId ? c.sItemHover : {}),
                }}
                onClick={() => switchConversation(conv)}
                onMouseEnter={() => setHoveredId(conv.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <span style={c.sItemDash}>—</span>
                <span style={c.sItemTitle}>{conv.title}</span>
                <button
                  style={{ ...c.delBtn, opacity: (hoveredId === conv.id || conv.id === activeConvId) ? 1 : 0 }}
                  onClick={e => handleDeleteConversation(e, conv.id)}
                  title="Delete"
                >✕</button>
              </div>
            ))
          )}
        </div>

        <div style={c.sideFoot}>
          {confirmClear ? (
            <div style={c.confirmRow}>
              <span style={c.confirmTxt}>Delete all history?</span>
              <button style={c.confirmY} onClick={clearAll}>Yes</button>
              <button style={c.confirmN} onClick={() => setConfirmClear(false)}>No</button>
            </div>
          ) : (
            <button
              style={c.clearBtn}
              onClick={() => setConfirmClear(true)}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(239,68,68,0.55)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(200,190,230,0.25)'}
            >
              Clear all history
            </button>
          )}
          {user && (
            <div style={c.userRow}>
              <div style={c.userAv}>{user.email?.[0]?.toUpperCase()}</div>
              <div style={c.userInfo}>
                <div style={c.userEmail}>{user.email}</div>
                <button
                  style={c.signOut}
                  onClick={handleLogout}
                  onMouseEnter={e => e.currentTarget.style.color = '#a855f7'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(168,85,247,0.5)'}
                >Sign out</button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={c.main}>
        {/* Topbar */}
        <header style={c.topbar}>
          <button
            style={c.menuBtn}
            onClick={() => setSidebarOpen(o => !o)}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={c.ml} /><div style={c.ml} /><div style={c.ml} />
          </button>
          <span style={c.topTitle}>{activeTitle}</span>
        </header>

        {/* Messages */}
        <div style={c.msgs}>
          {msgsLoading ? (
            <div style={c.spinnerWrap}>
              <div style={c.spinner} />
            </div>
          ) : empty ? (
            /* ── Empty state: large personalised greeting ── */
            <div style={c.emptyWrap}>
              <p style={c.greetLine}>
                {greeting.split('\n').map((line, i) => (
                  <span key={i} style={{ display: 'block', ...(i === 0 ? c.greetMain : c.greetSub) }}>
                    {line}
                  </span>
                ))}
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className="fade-up"
                  style={{ ...c.row, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  {msg.role === 'assistant' && <BotAvatar />}
                  <div style={msg.role === 'user' ? c.userBubble : c.botBubble}>
                    {msg.content || (loading && i === messages.length - 1 ? <TypingDots /> : '')}
                  </div>
                  {msg.role === 'user' && (
                    <div style={c.userAv2}>{user?.email?.[0]?.toUpperCase() || 'U'}</div>
                  )}
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div style={{ ...c.row, justifyContent: 'flex-start' }}>
                  <BotAvatar />
                  <div style={c.botBubble}><TypingDots /></div>
                </div>
              )}
            </>
          )}
          <div ref={msgsEndRef} />
        </div>

        {/* Input */}
        <div style={c.inputArea}>
          <div style={c.inputWrap}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
              }}
              onKeyDown={onKey}
              placeholder="Ask Re-Emi anything..."
              rows={1}
              style={c.textarea}
              disabled={msgsLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading || msgsLoading}
              style={{ ...c.sendBtn, opacity: (!input.trim() || loading || msgsLoading) ? 0.38 : 1 }}
              onMouseEnter={e => { if (input.trim() && !loading) { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.55)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(124,58,237,0.32)' }}
            >
              {loading
                ? <span style={{ display: 'inline-block', width: 13, height: 13, border: '2px solid rgba(255,255,255,0.25)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              }
            </button>
          </div>
          <p style={c.disc}>Re-Emi is a companion, not a therapist.</p>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @media (max-width:767px) {
          aside { position: fixed !important; z-index: 100 !important; height: 100vh !important; }
        }
      `}</style>
    </div>
  )
}

/* ════════════════════════════════════════
   STYLES — identical to original + additions
════════════════════════════════════════ */
const c = {
  shell: { display: 'flex', height: '100vh', overflow: 'hidden', background: '#08080f', position: 'relative' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 99, backdropFilter: 'blur(3px)' },

  /* Sidebar */
  sidebar: {
    width: 256, minWidth: 256, flexShrink: 0,
    background: '#0a0a16',
    borderRight: '1px solid rgba(139,92,246,0.1)',
    display: 'flex', flexDirection: 'column',
    transition: 'transform 0.28s cubic-bezier(.4,0,.2,1)',
    height: '100vh',
  },
  sideHead: { padding: '1.2rem 1rem 0.9rem', borderBottom: '1px solid rgba(139,92,246,0.08)' },
  sideBrand: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.9rem' },
  sideBrandDot: {
    width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
    boxShadow: '0 0 8px rgba(124,58,237,0.7)',
  },
  sideBrandText: {
    fontFamily: "'Pixelify Sans',monospace", fontWeight: 700, fontSize: '0.95rem',
    background: 'linear-gradient(135deg,#a855f7,#ec4899)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    letterSpacing: '0.03em',
  },
  newBtn: {
    width: '100%', background: 'rgba(124,58,237,0.09)', border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: 8, padding: '0.52rem 0.85rem',
    color: 'rgba(200,190,230,0.75)', fontSize: '0.78rem',
    fontFamily: "'Pixelify Sans',monospace", letterSpacing: '0.04em',
    cursor: 'pointer', transition: 'background 0.15s',
  },

  sideList: { flex: 1, overflowY: 'auto', padding: '0.65rem 0.5rem' },
  sideLabel: {
    fontFamily: "'Pixelify Sans',monospace", fontSize: '0.6rem', letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'rgba(200,190,230,0.28)', padding: '0 0.5rem 0.45rem',
  },
  loadingTxt: {
    fontSize: '0.75rem', color: 'rgba(200,190,230,0.25)',
    fontFamily: "'Manrope',sans-serif", padding: '0.5rem 0.6rem',
    fontStyle: 'italic',
  },
  emptyHint: {
    fontSize: '0.75rem', color: 'rgba(200,190,230,0.2)',
    fontFamily: "'Manrope',sans-serif", padding: '0.5rem 0.6rem',
  },
  sItem: {
    display: 'flex', alignItems: 'center', gap: '0.45rem',
    padding: '0.5rem 0.6rem', borderRadius: 6,
    color: 'rgba(200,190,230,0.42)', fontSize: '0.81rem',
    fontFamily: "'Manrope',sans-serif",
    cursor: 'pointer', transition: 'background 0.12s, color 0.12s',
    borderLeft: '2px solid transparent',
  },
  sItemHover: { background: 'rgba(124,58,237,0.06)', color: 'rgba(200,190,230,0.68)' },
  sItemActive: { background: 'rgba(124,58,237,0.11)', color: '#f0edf8', borderLeft: '2px solid rgba(139,92,246,0.5)' },
  sItemDash: { color: 'rgba(139,92,246,0.38)', fontSize: '0.72rem', flexShrink: 0 },
  sItemTitle: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  delBtn: {
    background: 'transparent', border: 'none',
    color: 'rgba(239,68,68,0.5)', fontSize: '0.65rem',
    padding: '2px 3px', borderRadius: 3,
    cursor: 'pointer', flexShrink: 0,
    transition: 'color 0.12s, opacity 0.15s',
    fontFamily: "'Pixelify Sans',monospace",
  },

  sideFoot: {
    padding: '0.7rem 1rem 1rem', borderTop: '1px solid rgba(139,92,246,0.08)',
    display: 'flex', flexDirection: 'column', gap: '0.7rem',
  },
  confirmRow: { display: 'flex', alignItems: 'center', gap: '0.45rem' },
  confirmTxt: { flex: 1, fontSize: '0.72rem', color: 'rgba(200,190,230,0.45)', fontFamily: "'Manrope',sans-serif" },
  confirmY: {
    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.28)',
    borderRadius: 5, padding: '0.2rem 0.5rem',
    color: '#fca5a5', fontSize: '0.7rem', cursor: 'pointer',
    fontFamily: "'Pixelify Sans',monospace",
  },
  confirmN: {
    background: 'transparent', border: '1px solid rgba(139,92,246,0.18)',
    borderRadius: 5, padding: '0.2rem 0.5rem',
    color: 'rgba(200,190,230,0.45)', fontSize: '0.7rem', cursor: 'pointer',
    fontFamily: "'Pixelify Sans',monospace",
  },
  clearBtn: {
    background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
    fontSize: '0.72rem', color: 'rgba(200,190,230,0.25)',
    fontFamily: "'Pixelify Sans',monospace", letterSpacing: '0.02em',
    textAlign: 'left', transition: 'color 0.15s',
  },
  userRow: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  userAv: {
    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Pixelify Sans',monospace", fontWeight: 700, fontSize: '0.78rem', color: '#fff',
  },
  userInfo: { flex: 1, overflow: 'hidden', minWidth: 0 },
  userEmail: {
    fontSize: '0.7rem', color: 'rgba(200,190,230,0.4)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    fontFamily: "'Manrope',sans-serif",
  },
  signOut: {
    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
    fontSize: '0.68rem', color: 'rgba(168,85,247,0.5)',
    fontFamily: "'Pixelify Sans',monospace", letterSpacing: '0.02em',
    transition: 'color 0.15s',
  },

  /* Main */
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 },
  topbar: {
    padding: '0.72rem 1.2rem', flexShrink: 0,
    borderBottom: '1px solid rgba(139,92,246,0.08)',
    display: 'flex', alignItems: 'center', gap: '0.8rem',
    background: 'rgba(8,8,15,0.92)', backdropFilter: 'blur(12px)',
  },
  menuBtn: {
    background: 'transparent', border: 'none', borderRadius: 6,
    padding: '5px 4px', display: 'flex', flexDirection: 'column',
    gap: 4, cursor: 'pointer', transition: 'background 0.15s',
  },
  ml: { width: 18, height: 2, background: 'rgba(200,190,230,0.38)', borderRadius: 2 },
  topTitle: {
    fontFamily: "'Pixelify Sans',monospace", fontSize: '0.82rem',
    color: 'rgba(200,190,230,0.45)', letterSpacing: '0.02em',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },

  msgs: { flex: 1, overflowY: 'auto', padding: '1.75rem 1.25rem 0.75rem' },

  /* Loading spinner for message fetch */
  spinnerWrap: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100%', paddingBottom: '5rem',
  },
  spinner: {
    width: 28, height: 28,
    border: '2px solid rgba(139,92,246,0.15)',
    borderTop: '2px solid rgba(168,85,247,0.7)',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },

  /* Empty state */
  emptyWrap: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    height: '100%', textAlign: 'center', paddingBottom: '5rem',
  },
  greetLine: { lineHeight: 1 },
  greetMain: {
    fontFamily: "'Pixelify Sans',monospace", fontWeight: 700,
    fontSize: 'clamp(2rem, 5.5vw, 3.2rem)',
    letterSpacing: '0.01em', lineHeight: 1.12,
    background: 'linear-gradient(135deg, #e2d9f3 0%, #c084fc 50%, #ec4899 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    display: 'block', marginBottom: '0.45rem',
  },
  greetSub: {
    fontFamily: "'Pixelify Sans',monospace",
    fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
    letterSpacing: '0.04em', lineHeight: 1,
    color: 'rgba(200,190,230,0.32)',
    display: 'block',
  },

  /* Message bubbles */
  row: {
    display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
    maxWidth: 720, margin: '0 auto 1rem',
  },
  botBubble: {
    background: '#0f0f1e',
    border: '1px solid rgba(139,92,246,0.12)',
    borderLeft: '2px solid rgba(168,85,247,0.45)',
    color: 'rgba(240,237,248,0.9)',
    padding: '0.7rem 1rem', borderRadius: '4px 14px 14px 14px',
    fontSize: '0.875rem', lineHeight: 1.72,
    fontFamily: "'Manrope',sans-serif",
    maxWidth: '76%', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    boxShadow: '0 0 0 0 rgba(124,58,237,0)',
  },
  userBubble: {
    background: 'linear-gradient(135deg, rgba(124,58,237,0.24), rgba(168,85,247,0.16))',
    border: '1px solid rgba(139,92,246,0.22)',
    color: '#f0edf8',
    padding: '0.7rem 1rem', borderRadius: '14px 4px 14px 14px',
    fontSize: '0.875rem', lineHeight: 1.65,
    fontFamily: "'Manrope',sans-serif",
    maxWidth: '72%', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
  },
  userAv2: {
    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
    background: 'rgba(236,72,153,0.12)',
    border: '1px solid rgba(236,72,153,0.22)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Pixelify Sans',monospace", fontWeight: 700, fontSize: '0.72rem',
    color: '#ec4899', marginTop: 2,
  },

  /* Input */
  inputArea: {
    padding: '0.85rem 1.25rem 1rem', flexShrink: 0,
    borderTop: '1px solid rgba(139,92,246,0.08)',
    background: '#08080f',
  },
  inputWrap: {
    display: 'flex', alignItems: 'flex-end', gap: '0.6rem',
    background: '#0f0f1e', border: '1px solid rgba(139,92,246,0.18)',
    borderRadius: 12, padding: '0.65rem 0.65rem 0.65rem 1rem',
    maxWidth: 720, margin: '0 auto',
    transition: 'border-color 0.2s',
  },
  textarea: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: '#f0edf8', fontSize: '0.875rem', resize: 'none', lineHeight: 1.55,
    fontFamily: "'Manrope',sans-serif", maxHeight: 128,
  },
  sendBtn: {
    width: 36, height: 36, flexShrink: 0,
    background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    border: 'none', borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'opacity 0.15s, transform 0.15s, box-shadow 0.15s',
    boxShadow: '0 2px 12px rgba(124,58,237,0.32)',
  },
  disc: {
    textAlign: 'center', fontSize: '0.63rem',
    color: 'rgba(200,190,230,0.15)', marginTop: '0.5rem',
    fontFamily: "'Manrope',sans-serif",
  },
}