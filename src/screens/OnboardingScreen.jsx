import React, { useState } from 'react'
import './OnboardingScreen.css'

const slides = [
  {
    emoji: '🐑',
    title: 'Välkommen till Svarta Fåret',
    body: 'Din personliga AI-mentor för UF-företagande. Vi hjälper dig att gå från idé till framgångsrikt UF-företag — steg för steg.',
  },
  {
    emoji: '🎯',
    title: 'Sätt mål & följ din resa',
    body: 'Håll koll på milstolpar, deadlines och din progress under hela UF-året. Allt på ett och samma ställe.',
  },
  {
    emoji: '💬',
    title: 'Fråga din mentor när du vill',
    body: 'Fastnat? Din AI-mentor finns tillgänglig dygnet runt för att svara på frågor, ge råd och hålla dig motiverad.',
  },
]

export default function OnboardingScreen({ onComplete }) {
  const [index, setIndex] = useState(0)
  const slide = slides[index]
  const isLast = index === slides.length - 1

  const next = () => {
    if (isLast) onComplete()
    else setIndex(i => i + 1)
  }

  return (
    <div className="onboarding">
      <div className="ob-background">
        <div className="ob-glow" />
      </div>

      <div className="ob-content fade-in" key={index}>
        <div className="ob-emoji">{slide.emoji}</div>
        <h1 className="ob-title">{slide.title}</h1>
        <p className="ob-body">{slide.body}</p>
      </div>

      <div className="ob-footer">
        <div className="ob-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`ob-dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button className="btn-primary" onClick={next}>
          {isLast ? 'Välj din mentor →' : 'Nästa'}
        </button>
        {!isLast && (
          <button className="btn-secondary" style={{ marginTop: 12 }} onClick={onComplete}>
            Hoppa över
          </button>
        )}
      </div>
    </div>
  )
}
