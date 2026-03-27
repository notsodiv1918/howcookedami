'use client'

import { useState, useRef } from 'react'

interface Verdict {
  score: number
  level: string
  survival: number
  verdict: string
  roast: string
  evidence: string[]
  sentence: string
  emoji: string
  category?: string
  categoryEmoji?: string
}

interface MemeResult {
  url: string
  query: string
  title: string
}

const LEVEL_COLORS: Record<string, string> = {
  'Barely Warm':            '#22c55e',
  'Lightly Toasted':        '#84cc16',
  'Medium Cooked':          '#eab308',
  'Well Done':              '#f97316',
  'Extra Crispy':           '#ef4444',
  'Absolutely Incinerated': '#dc2626',
  'BEYOND COOKED':          '#7f1d1d',
}

const CATEGORY_COLORS: Record<string, string> = {
  'Work':          '#6366f1',
  'Academic':      '#3b82f6',
  'Relationship':  '#ec4899',
  'Financial':     '#f59e0b',
  'Life Choices':  '#8b5cf6',
  'Social':        '#14b8a6',
  'Health':        '#22c55e',
  'Family':        '#f97316',
  'Other':         '#94a3b8',
}

const LOADING_LINES = [
  'Summoning Judge Maximus...',
  'Reviewing the evidence...',
  'Jury is deliberating...',
  'Consulting the law books...',
  'Judge is adjusting his wig...',
  'Preparing the verdict...',
  'Sharpening the gavel...',
]

// ── Cooked-o-Meter ─────────────────────────────────
function CookedOMeter({ score, color }: { score: number; color: string }) {
  const flames = ['🌡️','🔥','🔥','💀']
  const flameCount = score < 25 ? 0 : score < 50 ? 1 : score < 75 ? 2 : 3

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <p className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: 'rgba(201,168,76,0.5)' }}>
        🌡 Cooked-o-Meter
      </p>

      {/* Thermometer */}
      <div className="relative flex flex-col items-center">
        {/* Tube */}
        <div className="relative w-8 h-48 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
          {/* Fill — animates from bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000"
            style={{
              height: `${score}%`,
              background: `linear-gradient(to top, ${color}, ${color}99)`,
              boxShadow: `0 0 12px ${color}60`,
            }}
          />
          {/* Tick marks */}
          {[25,50,75].map(tick => (
            <div key={tick} className="absolute left-0 right-0 h-px"
              style={{ bottom: `${tick}%`, background: 'rgba(255,255,255,0.15)' }}
            />
          ))}
        </div>

        {/* Bulb at bottom */}
        <div className="w-10 h-10 rounded-full -mt-1 flex items-center justify-center"
          style={{
            background: color,
            boxShadow: `0 0 20px ${color}80`,
            border: `2px solid ${color}`,
          }}>
          <span className="text-base">{flames[flameCount]}</span>
        </div>

        {/* Tick labels */}
        <div className="absolute right-full mr-2 h-48 top-0 flex flex-col justify-between text-right pb-0">
          {['100', '75', '50', '25', '0'].map(n => (
            <span key={n} className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>{n}</span>
          ))}
        </div>
      </div>

      {/* Score label */}
      <div className="text-center">
        <div className="font-display font-black text-4xl" style={{ color, textShadow: `0 0 20px ${color}60` }}>
          {score}%
        </div>
        <div className="text-xs font-mono mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>COOKED</div>
      </div>
    </div>
  )
}

// ── Category Badge ──────────────────────────────────
function CategoryBadge({ category, emoji }: { category: string; emoji: string }) {
  const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS['Other']
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium animate-fade-in"
      style={{
        background: `${color}15`,
        border: `1px solid ${color}40`,
        color: color,
      }}>
      <span>{emoji}</span>
      <span>{category} Situation</span>
    </div>
  )
}

// ── Gavel ───────────────────────────────────────────
function GavelSVG({ animating }: { animating: boolean }) {
  return (
    <div style={{
      width: 120, height: 120,
      transformOrigin: 'center center',
      animation: animating ? 'gavel-slam 0.7s cubic-bezier(0.16,1,0.3,1) infinite' : 'none',
      filter: 'drop-shadow(0 8px 24px rgba(201,168,76,0.3))',
    }}>
      <img src="/gavel.png" alt="gavel" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  )
}

// ── Scales ──────────────────────────────────────────
function ScalesOfJustice() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" opacity="0.6">
      <line x1="10" y1="15" x2="50" y2="15" stroke="#c9a84c" strokeWidth="1.5"/>
      <line x1="30" y1="8" x2="30" y2="50" stroke="#c9a84c" strokeWidth="1.5"/>
      <circle cx="30" cy="8" r="3" fill="#c9a84c"/>
      <line x1="10" y1="15" x2="12" y2="28" stroke="#c9a84c" strokeWidth="1" strokeDasharray="2 2"/>
      <line x1="50" y1="15" x2="48" y2="28" stroke="#c9a84c" strokeWidth="1" strokeDasharray="2 2"/>
      <path d="M6 28 Q12 32 18 28" stroke="#c9a84c" strokeWidth="1.5" fill="none"/>
      <path d="M42 28 Q48 32 54 28" stroke="#c9a84c" strokeWidth="1.5" fill="none"/>
      <line x1="22" y1="50" x2="38" y2="50" stroke="#c9a84c" strokeWidth="2"/>
      <line x1="25" y1="47" x2="35" y2="47" stroke="#c9a84c" strokeWidth="1"/>
    </svg>
  )
}

// ── Share Card Canvas ────────────────────────────────
function generateShareCard(verdict: Verdict, color: string): string {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 900
  const ctx = canvas.getContext('2d')!

  // Background
  const bg = ctx.createLinearGradient(0, 0, 800, 900)
  bg.addColorStop(0, '#1a0e05')
  bg.addColorStop(0.5, '#0d0802')
  bg.addColorStop(1, '#1a0e05')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 800, 900)

  // Top gold bar
  const topBar = ctx.createLinearGradient(0, 0, 800, 0)
  topBar.addColorStop(0, 'transparent')
  topBar.addColorStop(0.5, '#c9a84c')
  topBar.addColorStop(1, 'transparent')
  ctx.fillStyle = topBar
  ctx.fillRect(0, 0, 800, 3)

  // Wood grain lines
  ctx.strokeStyle = 'rgba(139,90,20,0.06)'
  ctx.lineWidth = 1
  for (let i = 0; i < 800; i += 60) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 900); ctx.stroke()
  }

  // Court title
  ctx.font = '700 13px monospace'
  ctx.fillStyle = 'rgba(201,168,76,0.6)'
  ctx.textAlign = 'center'
  ctx.fillText('✦ THE SUPREME COURT OF INTERNET PROBLEMS ✦', 400, 50)

  // Divider
  ctx.strokeStyle = 'rgba(201,168,76,0.3)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(100, 65); ctx.lineTo(700, 65); ctx.stroke()

  // Category badge
  if (verdict.category) {
    const catColor = CATEGORY_COLORS[verdict.category] ?? '#94a3b8'
    const catText = `${verdict.categoryEmoji ?? ''} ${verdict.category} Situation`
    ctx.font = '500 14px monospace'
    const catWidth = ctx.measureText(catText).width + 32
    const catX = 400 - catWidth / 2
    ctx.strokeStyle = catColor + '60'
    ctx.lineWidth = 1
    roundRect(ctx, catX, 80, catWidth, 30, 15)
    ctx.stroke()
    ctx.fillStyle = catColor + '20'
    roundRect(ctx, catX, 80, catWidth, 30, 15)
    ctx.fill()
    ctx.fillStyle = catColor
    ctx.fillText(catText, 400, 100)
  }

  // Big score
  ctx.font = '900 180px serif'
  ctx.fillStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 40
  ctx.textAlign = 'center'
  ctx.fillText(`${verdict.score}%`, 400, 290)
  ctx.shadowBlur = 0

  // Level badge background
  const levelText = verdict.level.toUpperCase()
  ctx.font = '700 22px serif'
  const levelWidth = ctx.measureText(levelText).width + 48
  const levelX = 400 - levelWidth / 2
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  roundRect(ctx, levelX, 310, levelWidth, 44, 22)
  ctx.stroke()
  ctx.fillStyle = color + '20'
  roundRect(ctx, levelX, 310, levelWidth, 44, 22)
  ctx.fill()
  ctx.fillStyle = color
  ctx.fillText(levelText, 400, 340)

  // Emoji
  ctx.font = '52px serif'
  ctx.fillText(verdict.emoji, 400, 410)

  // Survival chance
  ctx.font = '500 14px monospace'
  ctx.fillStyle = 'rgba(245,240,224,0.3)'
  ctx.fillText('SURVIVAL CHANCE', 400, 450)
  ctx.font = '700 28px serif'
  ctx.fillStyle = verdict.survival > 50 ? '#22c55e' : verdict.survival > 20 ? '#eab308' : '#ef4444'
  ctx.fillText(`${verdict.survival}%`, 400, 485)

  // Divider
  ctx.strokeStyle = 'rgba(201,168,76,0.2)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(80, 510); ctx.lineTo(720, 510); ctx.stroke()

  // Roast text — wrapped
  ctx.font = 'italic 16px serif'
  ctx.fillStyle = 'rgba(252,165,165,0.85)'
  ctx.textAlign = 'center'
  wrapText(ctx, `"${verdict.roast}"`, 400, 545, 620, 26)

  // Bottom divider
  ctx.strokeStyle = 'rgba(201,168,76,0.2)'
  ctx.beginPath(); ctx.moveTo(80, 820); ctx.lineTo(720, 820); ctx.stroke()

  // Footer
  ctx.font = '500 13px monospace'
  ctx.fillStyle = 'rgba(201,168,76,0.4)'
  ctx.fillText('howcookedami.vercel.app', 400, 850)
  ctx.font = '400 11px monospace'
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.fillText('Find out how cooked YOU are 🔥', 400, 875)

  // Bottom gold bar
  const botBar = ctx.createLinearGradient(0, 0, 800, 0)
  botBar.addColorStop(0, 'transparent')
  botBar.addColorStop(0.5, '#c9a84c')
  botBar.addColorStop(1, 'transparent')
  ctx.fillStyle = botBar
  ctx.fillRect(0, 897, 800, 3)

  return canvas.toDataURL('image/png')
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  let currentY = y
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY)
      line = words[n] + ' '
      currentY += lineHeight
      if (currentY > y + lineHeight * 5) { ctx.fillText('...', x, currentY); break }
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, currentY)
}

// ── Main Component ───────────────────────────────────
export default function Home() {
  const [statement, setStatement]     = useState('')
  const [verdict, setVerdict]         = useState<Verdict | null>(null)
  const [meme, setMeme]               = useState<MemeResult | null>(null)
  const [memeLoading, setMemeLoading] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [loadingLine, setLoadingLine] = useState(0)
  const [shared, setShared]           = useState(false)
  const [cardSaved, setCardSaved]     = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  async function submitCase() {
    if (!statement.trim() || loading) return
    setVerdict(null); setMeme(null); setError('')
    setLoading(true); setLoadingLine(0)

    intervalRef.current = setInterval(() => {
      setLoadingLine(i => (i + 1) % LOADING_LINES.length)
    }, 900)

    try {
      const res = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Court error')
      clearInterval(intervalRef.current!)

      setTimeout(async () => {
        setVerdict(data)
        setLoading(false)

        setMemeLoading(true)
        try {
          const memeRes = await fetch('/api/meme', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statement, level: data.level, score: data.score }),
          })
          const memeData = await memeRes.json()
          if (memeRes.ok && memeData.url) setMeme(memeData)
        } catch { /* silent */ }
        finally { setMemeLoading(false) }
      }, 900)

    } catch (err) {
      clearInterval(intervalRef.current!)
      setError(err instanceof Error ? err.message : 'The court is in recess')
      setLoading(false)
    }
  }

  function handleShare() {
    if (!verdict) return
    const text = `The AI Court has ruled: I am ${verdict.score}% cooked 🔥\nVerdict: "${verdict.level}"\nSurvival chance: ${verdict.survival}%\n${verdict.category ? `Category: ${verdict.category}\n` : ''}\nFind out how cooked YOU are 👇\nhowcookedami.vercel.app`
    navigator.clipboard.writeText(text).then(() => {
      setShared(true); setTimeout(() => setShared(false), 2500)
    })
  }

  function handleSaveCard() {
    if (!verdict) return
    const color = LEVEL_COLORS[verdict.level] ?? '#ef4444'
    const dataUrl = generateShareCard(verdict, color)
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `how-cooked-${verdict.score}.png`
    a.click()
    setCardSaved(true)
    setTimeout(() => setCardSaved(false), 2500)
  }

  const levelColor = verdict ? (LEVEL_COLORS[verdict.level] ?? '#ef4444') : '#ef4444'

  return (
    <div className="relative z-10 min-h-screen flex flex-col">

      <div className="relative w-full h-2 flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }}
      />

      {/* Header */}
      <div className="relative text-center pt-8 pb-2 px-4">
        <div className="flex justify-center mb-2"><ScalesOfJustice /></div>
        <div className="inline-flex items-center gap-3 px-6 py-1.5 mb-4 animate-flicker"
          style={{ borderTop: '1px solid rgba(201,168,76,0.4)', borderBottom: '1px solid rgba(201,168,76,0.4)' }}>
          <span style={{ color: 'rgba(201,168,76,0.5)', fontSize: 10 }}>✦</span>
          <span className="text-xs font-mono tracking-[0.3em] uppercase" style={{ color: 'rgba(201,168,76,0.7)' }}>
            The Supreme Court of Internet Problems
          </span>
          <span style={{ color: 'rgba(201,168,76,0.5)', fontSize: 10 }}>✦</span>
        </div>
        <h1 className="font-display font-black leading-none tracking-tight mb-3"
          style={{ fontSize: 'clamp(48px,10vw,96px)', color: '#f5f0e0', textShadow: '0 0 80px rgba(201,168,76,0.25), 0 2px 4px rgba(0,0,0,0.8)' }}>
          How Cooked
          <br />
          <span style={{ color: '#c9a84c', fontStyle: 'italic', textShadow: '0 0 40px rgba(201,168,76,0.5)' }}>Am I?</span>
        </h1>
        <p className="text-sm font-body font-light tracking-wider" style={{ color: 'rgba(245,240,224,0.4)' }}>
          Describe your situation. The court will decide your fate.
        </p>
      </div>

      {/* IN SESSION divider */}
      <div className="max-w-3xl mx-auto w-full px-4 my-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3))' }}/>
          <div className="px-4 py-1 rounded text-[10px] font-mono tracking-widest"
            style={{ border: '1px solid rgba(201,168,76,0.25)', color: 'rgba(201,168,76,0.5)' }}>
            IN SESSION
          </div>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)' }}/>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 pb-16 flex flex-col gap-5">

        {/* Input */}
        <div className="relative rounded-2xl p-6 animate-fade-up"
          style={{
            background: 'linear-gradient(135deg, rgba(50,28,10,0.9), rgba(30,16,5,0.95))',
            border: '1px solid rgba(201,168,76,0.22)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,168,76,0.08)',
          }}>
          <div className="absolute top-0 left-8 right-8 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }}/>
          <label className="block text-xs font-mono tracking-[0.2em] uppercase mb-3"
            style={{ color: 'rgba(201,168,76,0.65)' }}>
            📜 Your Statement to the Court
          </label>
          <textarea
            value={statement}
            onChange={e => setStatement(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) submitCase() }}
            placeholder="Describe your situation, Your Honor...&#10;&#10;e.g. I told my boss I'd finish the project by Monday, it's Sunday 11PM and I haven't started yet..."
            className="w-full min-h-[130px] bg-transparent text-sm font-body font-light leading-relaxed outline-none resize-none placeholder:opacity-25"
            style={{ color: '#f5f0e0', caretColor: '#c9a84c' }}
          />
          <div className="flex items-center justify-between mt-4 pt-4"
            style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
            <span className="text-xs font-mono" style={{ color: 'rgba(201,168,76,0.3)' }}>
              {statement.length} chars · ⌘+Enter to submit
            </span>
            <button onClick={submitCase} disabled={!statement.trim() || loading}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-body font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: statement.trim() && !loading ? 'linear-gradient(135deg, #c9a84c, #a8832a)' : 'rgba(201,168,76,0.1)',
                color: statement.trim() && !loading ? '#0a0800' : 'rgba(201,168,76,0.4)',
                boxShadow: statement.trim() && !loading ? '0 4px 20px rgba(201,168,76,0.35)' : 'none',
              }}>
              ⚖️ Submit to the Court
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10 animate-fade-in">
            <div className="flex justify-center mb-5"><GavelSVG animating={true} /></div>
            <p className="text-sm font-mono tracking-wider animate-flicker" style={{ color: 'rgba(201,168,76,0.8)' }}>
              {LOADING_LINES[loadingLine]}
            </p>
            <div className="flex justify-center gap-2 mt-4">
              {[0,1,2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#c9a84c', animation: `fade-in 0.8s ease ${i * 0.25}s infinite alternate` }}/>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-5 rounded-xl animate-fade-in"
            style={{ background: 'rgba(139,0,0,0.2)', border: '1px solid rgba(139,0,0,0.4)' }}>
            <p className="text-sm font-mono text-red-400">⚠ {error}</p>
          </div>
        )}

        {/* ── VERDICT ── */}
        {verdict && !loading && (
          <div className="flex flex-col gap-4">

            {/* Score card with Cooked-o-Meter */}
            <div className="relative rounded-2xl overflow-hidden animate-verdict"
              style={{
                background: 'linear-gradient(135deg, rgba(40,22,5,0.97), rgba(20,10,2,0.99))',
                border: `1px solid ${levelColor}45`,
                boxShadow: `0 0 80px ${levelColor}18, 0 8px 40px rgba(0,0,0,0.7)`,
              }}>
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${levelColor}, transparent)` }}/>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-8">

                {/* Cooked-o-Meter */}
                <div className="flex-shrink-0">
                  <CookedOMeter score={verdict.score} color={levelColor} />
                </div>

                {/* Right side info */}
                <div className="flex flex-col items-center sm:items-start gap-4 flex-1">
                  <div className="flex justify-center sm:justify-start">
                    <GavelSVG animating={false} />
                  </div>

                  {/* Category badge */}
                  {verdict.category && (
                    <CategoryBadge category={verdict.category} emoji={verdict.categoryEmoji ?? '⚖️'} />
                  )}

                  {/* Level stamp */}
                  <div className="inline-block px-6 py-2 rounded-full font-display font-bold text-lg"
                    style={{
                      background: `${levelColor}18`,
                      border: `2px solid ${levelColor}`,
                      color: levelColor,
                      animation: 'stamp 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both',
                    }}>
                    {verdict.level.toUpperCase()}
                  </div>

                  <div className="text-4xl">{verdict.emoji}</div>

                  {/* Survival */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono tracking-widest" style={{ color: 'rgba(245,240,224,0.3)' }}>
                      SURVIVAL CHANCE
                    </span>
                    <span className="text-2xl font-display font-bold"
                      style={{ color: verdict.survival > 50 ? '#22c55e' : verdict.survival > 20 ? '#eab308' : '#ef4444' }}>
                      {verdict.survival}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verdict text */}
            <div className="rounded-xl p-5 animate-fade-up delay-100"
              style={{ background: 'linear-gradient(135deg, rgba(42,26,8,0.85), rgba(25,14,4,0.9))', border: '1px solid rgba(201,168,76,0.15)' }}>
              <p className="text-xs font-mono tracking-[0.15em] uppercase mb-3" style={{ color: 'rgba(201,168,76,0.5)' }}>
                🏛 The Court's Verdict
              </p>
              <p className="font-display italic text-base leading-relaxed" style={{ color: '#f5f0e0' }}>
                "{verdict.verdict}"
              </p>
            </div>

            {/* Roast */}
            <div className="rounded-xl p-5 animate-fade-up delay-200"
              style={{ background: 'rgba(100,0,0,0.2)', border: '1px solid rgba(239,68,68,0.22)' }}>
              <p className="text-xs font-mono tracking-[0.15em] uppercase mb-3" style={{ color: 'rgba(239,68,68,0.6)' }}>
                🔥 The Roast
              </p>
              <p className="text-sm font-body leading-relaxed" style={{ color: '#fca5a5' }}>
                {verdict.roast}
              </p>
            </div>

            {/* Meme */}
            <div className="rounded-xl overflow-hidden animate-fade-up delay-300"
              style={{ background: 'rgba(20,10,2,0.9)', border: '1px solid rgba(201,168,76,0.15)' }}>
              <div className="px-5 pt-5 pb-3">
                <p className="text-xs font-mono tracking-[0.15em] uppercase" style={{ color: 'rgba(201,168,76,0.5)' }}>
                  😂 The Court's Meme Evidence
                </p>
              </div>
              {memeLoading && (
                <div className="flex items-center justify-center py-12 flex-col gap-3">
                  <div className="w-6 h-6 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'rgba(201,168,76,0.3)', borderTopColor: '#c9a84c' }}/>
                  <p className="text-xs font-mono" style={{ color: 'rgba(201,168,76,0.4)' }}>Finding the perfect meme...</p>
                </div>
              )}
              {meme && !memeLoading && (
                <div className="flex flex-col items-center pb-5 px-5">
                  <img src={meme.url} alt={meme.title}
                    className="w-full max-w-sm rounded-xl"
                    style={{ maxHeight: 320, objectFit: 'cover' }}/>
                  <p className="text-xs font-mono mt-3 text-center" style={{ color: 'rgba(201,168,76,0.35)' }}>
                    searched: "{meme.query}"
                  </p>
                </div>
              )}
              {!meme && !memeLoading && (
                <div className="flex items-center justify-center py-8">
                  <p className="text-xs font-mono" style={{ color: 'rgba(245,240,224,0.2)' }}>No meme found 💀</p>
                </div>
              )}
            </div>

            {/* Evidence */}
            <div className="rounded-xl p-5 animate-fade-up delay-400"
              style={{ background: 'linear-gradient(135deg, rgba(42,26,8,0.85), rgba(25,14,4,0.9))', border: '1px solid rgba(201,168,76,0.12)' }}>
              <p className="text-xs font-mono tracking-[0.15em] uppercase mb-3" style={{ color: 'rgba(201,168,76,0.5)' }}>
                📋 Evidence Against You
              </p>
              <div className="flex flex-col gap-2.5">
                {verdict.evidence.map((e, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm font-light" style={{ color: 'rgba(245,240,224,0.65)' }}>
                    <span className="font-mono text-xs mt-0.5 flex-shrink-0" style={{ color: 'rgba(201,168,76,0.5)' }}>{i + 1}.</span>
                    {e}
                  </div>
                ))}
              </div>
            </div>

            {/* Sentence */}
            <div className="rounded-xl p-5 animate-fade-up delay-500"
              style={{ background: 'linear-gradient(135deg, rgba(42,26,8,0.85), rgba(25,14,4,0.9))', border: `1px solid ${levelColor}28` }}>
              <p className="text-xs font-mono tracking-[0.15em] uppercase mb-3" style={{ color: `${levelColor}70` }}>
                ⚖️ Your Sentence
              </p>
              <p className="font-display italic text-base leading-relaxed" style={{ color: levelColor }}>
                "{verdict.sentence}"
              </p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 animate-fade-up delay-600">
              <button onClick={handleShare}
                className="py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: shared ? 'rgba(34,197,94,0.15)' : 'rgba(201,168,76,0.12)',
                  border: shared ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(201,168,76,0.28)',
                  color: shared ? '#86efac' : '#c9a84c',
                }}>
                {shared ? '✓ Copied!' : '📤 Share Sentence'}
              </button>

              <button onClick={handleSaveCard}
                className="py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: cardSaved ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
                  border: cardSaved ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(99,102,241,0.25)',
                  color: cardSaved ? '#a5b4fc' : 'rgba(165,180,252,0.7)',
                }}>
                {cardSaved ? '✓ Saved!' : '🖼 Save as Image'}
              </button>

              <button onClick={() => { setVerdict(null); setMeme(null); setStatement('') }}
                className="col-span-2 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(245,240,224,0.4)',
                }}>
                ↩ New Case
              </button>
            </div>

          </div>
        )}

        <p className="text-center text-xs font-mono mt-4" style={{ color: 'rgba(245,240,224,0.15)' }}>
          COURT OF INTERNET JUSTICE · ALL ROASTS ARE FOR ENTERTAINMENT ONLY · EST. 2025
        </p>

      </div>
    </div>
  )
}
