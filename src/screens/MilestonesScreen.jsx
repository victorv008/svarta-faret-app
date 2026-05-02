import React, { useEffect, useRef, useState, useCallback } from 'react'
import './MilestonesScreen.css'

const W = 370

// Node XP rewards – front-loaded for max early engagement
const ALL_NODES = [
  { id: 12, x: 210, y: 90,   xp: 500, label: 'Presentera på SM',       icon: '🏆', special: true  },
  { id: 11, x: 110, y: 200,  xp: 300, label: 'Årsredovisning',          icon: '📊' },
  { id: 10, x: 255, y: 310,  xp: 280, label: 'Nå 50 000 kr omsättning', icon: '💰' },
  { id: 9,  x: 100, y: 425,  xp: 250, label: 'Sälja första produkten',  icon: '🎉' },
  { id: 8,  x: 255, y: 560,  xp: 220, label: 'Skapa sociala medier',    icon: '📱' },
  { id: 7,  x: 115, y: 670,  xp: 200, label: 'Lansera produkten',       icon: '🚀' },
  { id: 6,  x: 255, y: 785,  xp: 180, label: 'Sätta pris',              icon: '💲' },
  { id: 5,  x: 120, y: 905,  xp: 160, label: 'Marknadsundersökning',    icon: '🔍', chapter: 'TILLVÄXT' },
  { id: 4,  x: 250, y: 1060, xp: 140, label: 'Skriva affärsplan',       icon: '📝' },
  { id: 3,  x: 110, y: 1170, xp: 120, label: 'Utse roller i gruppen',   icon: '👥' },
  { id: 2,  x: 255, y: 1280, xp: 150, label: 'Välja affärsidé',         icon: '💡', chapter: 'FRÖSÅDD' },
  { id: 1,  x: 130, y: 1390, xp: 200, label: 'Registrera UF-företaget', icon: '✍️' },
]

const CONTAINER_H = 1520
const LEVELS = [
  { min: 0,    label: 'Nybörjare',        color: '#9ca3af' },
  { min: 300,  label: 'Lärling',          color: '#60a5fa' },
  { min: 600,  label: 'Praktikant',       color: '#a78bfa' },
  { min: 1000, label: 'Juniorentreprenör',color: '#ecb213' },
  { min: 1500, label: 'Entreprenör',      color: '#f87171' },
  { min: 2500, label: 'Mästare',          color: '#4ade80' },
]

// --- Path helpers ---
function buildPath(nodes) {
  const sorted = [...nodes].sort((a, b) => b.y - a.y)
  if (sorted.length < 2) return ''
  let d = `M ${sorted[0].x} ${sorted[0].y}`
  for (let i = 1; i < sorted.length; i++) {
    const p = sorted[i - 1], c = sorted[i]
    const midY = (p.y + c.y) / 2
    d += ` C ${p.x} ${midY} ${c.x} ${midY} ${c.x} ${c.y}`
  }
  return d
}

// --- Stars ---
const STARS = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  x: (Math.sin(i * 137.5) * 0.5 + 0.5) * 100,
  y: (Math.cos(i * 97.3)  * 0.5 + 0.5) * 100,
  r: Math.random() * 1.5 + 0.4,
  d: (i % 6) * 0.5,
}))

let particleId = 0

export default function MilestonesScreen() {
  // ── State ──────────────────────────────────────────
  const [completedIds, setCompletedIds] = useState(new Set([1, 2, 3]))
  const [particles, setParticles]       = useState([])
  const [xpToasts, setXpToasts]         = useState([])
  const [celebration, setCelebration]   = useState(null)   // { type, message }
  const [hintPulse, setHintPulse]       = useState(true)   // "tap here" hint
  const [firstTap, setFirstTap]         = useState(true)   // first ever interaction?
  const [undoConfirm, setUndoConfirm]   = useState(null)   // node to potentially undo

  const scrollRef  = useRef(null)
  const currentRef = useRef(null)

  // ── Derived values ─────────────────────────────────
  const maxDone   = completedIds.size ? Math.max(...completedIds) : 0
  const currentId = maxDone < 12 ? maxDone + 1 : null

  const totalXP = ALL_NODES
    .filter(n => completedIds.has(n.id))
    .reduce((sum, n) => sum + n.xp, 0)

  const level = [...LEVELS].reverse().find(l => totalXP >= l.min) || LEVELS[0]
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1]
  const xpIntoLevel = totalXP - level.min
  const xpToNextLevel = nextLevel ? nextLevel.min - level.min : 500
  const levelPct = Math.min((xpIntoLevel / xpToNextLevel) * 100, 100)

  const currentNode = ALL_NODES.find(n => n.id === currentId)

  const getStatus = (id) => {
    if (completedIds.has(id)) return 'done'
    if (id === currentId)     return 'current'
    return 'locked'
  }

  const goldNodes    = ALL_NODES.filter(n => completedIds.has(n.id) || n.id === currentId)
  const lockedNodes  = ALL_NODES.filter(n => n.id !== currentId && !completedIds.has(n.id))
  const goldPath     = buildPath(goldNodes)
  const greyPath     = buildPath(currentNode ? [...lockedNodes, currentNode] : lockedNodes)

  // ── Auto-scroll to current ─────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      if (currentRef.current && scrollRef.current) {
        const y = currentRef.current.offsetTop
        scrollRef.current.scrollTo({ top: y - scrollRef.current.clientHeight / 2 + 30, behavior: 'smooth' })
      }
    }, 300)
    return () => clearTimeout(t)
  }, [currentId])

  // ── Spawn particles ────────────────────────────────
  const spawnParticles = useCallback((node, count, colors) => {
    const newParticles = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 360 + Math.random() * 20
      const dist  = 40 + Math.random() * 60
      const rad   = (angle * Math.PI) / 180
      return {
        id:    ++particleId,
        x:     node.x,
        y:     node.y,
        tx:    Math.cos(rad) * dist,
        ty:    Math.sin(rad) * dist,
        color: colors[i % colors.length],
        size:  4 + Math.random() * 6,
        delay: i * 25,
      }
    })
    setParticles(p => [...p, ...newParticles])
    setTimeout(() => setParticles(p => p.filter(x => !newParticles.find(n => n.id === x.id))), 900)
  }, [])

  // ── Spawn XP toast ─────────────────────────────────
  const spawnXPToast = useCallback((node, xp) => {
    const id = ++particleId
    setXpToasts(t => [...t, { id, x: node.x, y: node.y, xp }])
    setTimeout(() => setXpToasts(t => t.filter(x => x.id !== id)), 1200)
  }, [])

  // ── Main tap handler ───────────────────────────────
  const handleNodeTap = useCallback((node) => {
    if (node.id !== currentId) return

    // 1) Complete node
    setCompletedIds(prev => new Set([...prev, node.id]))
    setHintPulse(false)

    const isFirst = firstTap
    if (isFirst) setFirstTap(false)

    // 2) Particle burst (front-loaded: more particles for early nodes)
    const earlyBoost = Math.max(1, (5 - node.id) * 0.4)  // more sparks for lower ids
    const count  = Math.round((isFirst ? 28 : 18) + earlyBoost * 8)
    const colors = node.chapter
      ? ['#ecb213','#fff','#f5d060','#fbbf24','#fde68a']
      : node.id <= 4
        ? ['#ecb213','#f5d060','#fff']
        : ['#ecb213','#a78bfa','#60a5fa']
    spawnParticles(node, count, colors)

    // 3) XP toast
    spawnXPToast(node, node.xp)

    // 4) Celebration type
    if (isFirst) {
      setCelebration({ type: 'first', message: '🎉 Du är igång! Fantastisk start!' })
    } else if (node.chapter) {
      setCelebration({ type: 'chapter', message: `⭐ ${node.chapter} klar!` })
    } else if (node.id === 12) {
      setCelebration({ type: 'master', message: '🏆 MÄSTARE! Du klarade allt!' })
    } else {
      // Minor toast
      setCelebration({ type: 'minor', message: `+${node.xp} XP  •  ${node.icon} ${node.label}` })
    }
    setTimeout(() => setCelebration(null), celebration?.type === 'first' ? 2200 : 1800)

  }, [currentId, firstTap, spawnParticles, spawnXPToast])

  // ── Undo: tap a done node ─────────────────────────
  const handleDoneNodeTap = useCallback((node) => {
    setUndoConfirm(node)
  }, [])

  const confirmUndo = useCallback(() => {
    if (!undoConfirm) return
    // Remove this node AND all nodes completed after it (higher IDs)
    setCompletedIds(prev => {
      const next = new Set(prev)
      for (const id of prev) {
        if (id >= undoConfirm.id) next.delete(id)
      }
      return next
    })
    setUndoConfirm(null)
  }, [undoConfirm])

  const cancelUndo = useCallback(() => setUndoConfirm(null), [])

  // ── Render ─────────────────────────────────────────
  return (
    <div className="ms-screen">

      {/* ── Header ── */}
      <div className="ms-header">
        <div className="ms-header-left">
          <h1 className="ms-title">THE PATH</h1>
          <span className="ms-level-badge" style={{ color: level.color }}>
            {level.label}
          </span>
        </div>
        <div className="ms-header-right">
          <span className="ms-xp-count">{totalXP.toLocaleString()} XP</span>
          <div className="ms-xp-bar-wrap">
            <div className="ms-xp-bar-fill" style={{ width: `${levelPct}%`, background: level.color }} />
          </div>
        </div>
      </div>

      {/* ── Celebration toast ── */}
      {celebration && (
        <div className={`ms-celebration ms-cel-${celebration.type}`}>
          {celebration.message}
        </div>
      )}

      {/* ── Scrollable map ── */}
      <div className="ms-scroll" ref={scrollRef}>
        <div className="ms-map" style={{ height: CONTAINER_H }}>

          {/* Stars */}
          {STARS.map(s => (
            <div key={s.id} className="ms-star" style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.r, height: s.r,
              animationDelay: `${s.d}s`,
            }} />
          ))}

          {/* Paths */}
          <svg className="ms-svg" width={W} height={CONTAINER_H} viewBox={`0 0 ${W} ${CONTAINER_H}`}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-sm">
                <feGaussianBlur stdDeviation="2" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <path d={greyPath} fill="none" stroke="#282828" strokeWidth="5"
              strokeDasharray="12 9" strokeLinecap="round" />
            <path d={goldPath} fill="none" stroke="rgba(236,178,19,0.18)"
              strokeWidth="16" strokeLinecap="round" />
            <path d={goldPath} fill="none" stroke="#ecb213"
              strokeWidth="5" strokeLinecap="round" filter="url(#glow)" />
          </svg>

          {/* Particles */}
          {particles.map(p => (
            <div key={p.id} className="ms-particle" style={{
              left: p.x,
              top:  p.y,
              width:  p.size,
              height: p.size,
              background: p.color,
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
              animationDelay: `${p.delay}ms`,
            }} />
          ))}

          {/* XP Toasts */}
          {xpToasts.map(t => (
            <div key={t.id} className="ms-xp-toast" style={{ left: t.x, top: t.y }}>
              +{t.xp} XP
            </div>
          ))}

          {/* Chapter labels */}
          {ALL_NODES.filter(n => n.chapter).map(n => (
            <div key={`ch-${n.id}`} className="ms-chapter-label"
              style={{ top: n.y - 80, left: W / 2 }}>
              <span className="ms-chapter-pill"
                style={{ opacity: completedIds.has(n.id) ? 1 : 0.35 }}>
                {n.chapter}
              </span>
            </div>
          ))}

          {/* Nodes */}
          {ALL_NODES.map(node => {
            const status     = getStatus(node.id)
            const labelRight = node.x <= W / 2
            const isCurrent  = status === 'current'

            return (
              <div
                key={node.id}
                ref={isCurrent ? currentRef : null}
                className={`ms-node ms-node--${status}`}
                style={{ left: node.x, top: node.y }}
                onClick={() =>
                  status === 'current' ? handleNodeTap(node)
                  : status === 'done'  ? handleDoneNodeTap(node)
                  : undefined
                }
              >
                {/* Pulse rings for current */}
                {isCurrent && <>
                  <div className="ms-ring ms-ring-1" />
                  <div className="ms-ring ms-ring-2" />
                  {hintPulse && <div className="ms-hint-arrow">Tryck! 👇</div>}
                </>}

                {/* Circle */}
                <div className="ms-node-circle">
                  {status === 'done'    && <span className="ms-node-check">✓</span>}
                  {status === 'current' && <span className="ms-node-num">{node.id}</span>}
                  {status === 'locked'  && <span className="ms-node-num ms-num-locked">{node.id}</span>}
                </div>

                {/* Label */}
                <div className={`ms-node-tip ${labelRight ? 'tip-right' : 'tip-left'}`}>
                  <span className="ms-node-tip-icon">{node.icon}</span>
                  <span className="ms-node-tip-text">{node.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* ── Undo confirmation modal ── */}
      {undoConfirm && (
        <div className="ms-modal-backdrop" onClick={cancelUndo}>
          <div className="ms-modal" onClick={e => e.stopPropagation()}>
            <div className="ms-modal-icon">↩️</div>
            <h3 className="ms-modal-title">Ångra steg?</h3>
            <p className="ms-modal-body">
              Vill du markera <strong>{undoConfirm.icon} {undoConfirm.label}</strong> som ej klar?
              {completedIds.size > undoConfirm.id &&
                <span className="ms-modal-warning">
                  {' '}OBS: Alla steg du gjort efter detta nollställs också.
                </span>
              }
            </p>
            <div className="ms-modal-actions">
              <button className="ms-modal-btn ms-modal-cancel" onClick={cancelUndo}>Avbryt</button>
              <button className="ms-modal-btn ms-modal-confirm" onClick={confirmUndo}>Ja, ångra</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
