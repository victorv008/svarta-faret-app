import React, { useState, useRef } from 'react'
import './CharacterSelectScreen.css'

const characters = [
  {
    id: 'elon',
    name: 'Elton',
    title: 'The Rocket',
    tagline: 'Din charmigt effektiva rådgivare',
    image: '/sheep_rocket.png',
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    basedOn: 'Elon Musk',
    achievements: ['Grundade SpaceX', 'Byggde Tesla', 'Köpte Twitter'],
    style: 'Visionär & Dristig',
    quote: '"Det är omöjligt tills det inte är det längre."',
    description: 'Elton är baserad på Elon Musks sätt att tänka: tänk enormt, misslyckas snabbt och bygg saker som verkar omöjliga. Han pushar dig att sikta högre än du tror är rimligt.',
  },
  {
    id: 'steve',
    name: 'Stevie',
    title: 'The Visionary',
    tagline: 'Innovatören som förändrar spelet',
    image: '/sheep_visionary.png',
    color: '#60a5fa',
    bgColor: 'rgba(96, 165, 250, 0.15)',
    glowColor: 'rgba(96, 165, 250, 0.4)',
    basedOn: 'Steve Jobs',
    achievements: ['Skapade iPhone', 'Räddade Apple', 'Grundlade Pixar'],
    style: 'Perfektionist & Berättare',
    quote: '"De galna nog att tro att de kan förändra världen — de gör det."',
    description: 'Stevie är besatt av design, enkelhet och att skapa produkter som folk älskar. Han lär dig att tänka på användarupplevelsen och berätta din produkts historia.',
  },
  {
    id: 'max',
    name: 'Maxwell',
    title: 'The Executive',
    tagline: 'Din strategiska affärskompis',
    image: '/sheep_executive.png',
    color: '#ecb213',
    bgColor: 'rgba(236, 178, 19, 0.15)',
    glowColor: 'rgba(236, 178, 19, 0.4)',
    basedOn: 'Warren Buffett',
    achievements: ['Byggde Berkshire Hathaway', 'Omtalas som "Oracle of Omaha"', 'Investerat i 60+ år'],
    style: 'Analytisk & Tålmodig',
    quote: '"Pris är vad du betalar. Värde är vad du får."',
    description: 'Maxwell lär dig affärernas grunder — hur man tänker på ekonomi, vinst och långsiktig tillväxt. Han ser igenom hype och fokuserar på vad som faktiskt fungerar.',
  },
  {
    id: 'gary',
    name: 'Garry',
    title: 'The Hustler',
    tagline: 'Energin som håller dig igång',
    image: '/sheep_hustler.png',
    color: '#4ade80',
    bgColor: 'rgba(74, 222, 128, 0.15)',
    glowColor: 'rgba(74, 222, 128, 0.4)',
    basedOn: 'Gary Vaynerchuk',
    achievements: ['Byggde Wine Library TV', 'Grundade VaynerMedia', 'Social media-pionjär'],
    style: 'Energetisk & Ärlig',
    quote: '"Sluta med ursäkter och börja göra."',
    description: 'Garry är rak, energisk och berättar sanningen — även när det svider. Han specialiserar sig på marknadsföring, sociala medier och att bygga ett personligt varumärke.',
  },
]

export default function CharacterSelectScreen({ onSelect }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const touchStartX = useRef(null)
  const char = characters[index]

  const goTo = (i, resetFlip = true) => {
    if (resetFlip) setFlipped(false)
    setIndex((i + characters.length) % characters.length)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) {
      goTo(dx < 0 ? index + 1 : index - 1)
    }
    touchStartX.current = null
  }

  return (
    <div className="cs-screen" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Background glow */}
      <div className="cs-bg-glow" style={{ background: `radial-gradient(ellipse at 50% 40%, ${char.glowColor} 0%, transparent 65%)` }} />

      {/* Header */}
      <div className="cs-header">
        <h1 className="cs-title">Meet Your Mentor</h1>
        <p className="cs-subtitle">Swipe to select your tactical mentor.</p>
      </div>

      {/* Carousel */}
      <div className="cs-carousel">
        {/* Left peek */}
        <div className="cs-peek cs-peek-left" onClick={() => goTo(index - 1)}>
          <img src={characters[(index - 1 + characters.length) % characters.length].image} alt="prev" />
          <div className="cs-peek-overlay" />
        </div>

        {/* Center card (flip) */}
        <div className={`cs-card-scene`} onClick={() => setFlipped(f => !f)}>
          <div className={`cs-card-inner ${flipped ? 'flipped' : ''}`} style={{ '--glow': char.glowColor, '--accent': char.color }}>

            {/* FRONT */}
            <div className="cs-card-face cs-front">
              <div className="cs-card-glow" />
              <img className="cs-card-image" src={char.image} alt={char.name} />
              <div className="cs-card-footer">
                <h2 className="cs-card-name">{char.name}</h2>
                <p className="cs-card-tagline">{char.tagline}</p>
              </div>
              <div className="cs-flip-hint">Tryck för info ↻</div>
            </div>

            {/* BACK */}
            <div className="cs-card-face cs-back">
              <div className="cs-back-header">
                <span className="cs-based-on">Baserad på</span>
                <h2 className="cs-back-name">{char.basedOn}</h2>
              </div>
              <p className="cs-back-quote">{char.quote}</p>
              <div className="cs-achievements">
                {char.achievements.map((a, i) => (
                  <div className="cs-achievement" key={i}>
                    <span className="cs-ach-dot" style={{ background: char.color }} />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
              <p className="cs-back-desc">{char.description}</p>
              <span className="cs-style-chip" style={{ background: char.bgColor, color: char.color }}>
                {char.style}
              </span>
              <div className="cs-flip-hint back-hint">Tryck för att gå tillbaka ↩</div>
            </div>
          </div>
        </div>

        {/* Right peek */}
        <div className="cs-peek cs-peek-right" onClick={() => goTo(index + 1)}>
          <img src={characters[(index + 1) % characters.length].image} alt="next" />
          <div className="cs-peek-overlay" />
        </div>
      </div>

      {/* Dots */}
      <div className="cs-dots">
        {characters.map((_, i) => (
          <button
            key={i}
            className={`cs-dot ${i === index ? 'active' : ''}`}
            style={i === index ? { background: char.color } : {}}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="cs-footer">
        <button
          className="cs-select-btn"
          style={{ background: char.color }}
          onClick={() => onSelect(char)}
        >
          ⚡ VÄLJ {char.name.toUpperCase()}
        </button>
      </div>
    </div>
  )
}
