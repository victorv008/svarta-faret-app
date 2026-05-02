import React, { useState, useRef, useEffect } from 'react'
import './ChatScreen.css'

const mockResponses = [
  'Det låter som ett bra initiativ! Har du tänkt på hur du ska prissätta det?',
  'Kom ihåg att titta på er konkurrensanalys – vad gör ni annorlunda?',
  'Bra fråga! Jag rekommenderar att ni börjar i liten skala och testar marknaden.',
  'Det viktigaste nu är att ni fokuserar på era kunder. Vad säger de?',
  'Excellent! Glöm inte att dokumentera allt för er årsredovisning.',
]

export default function ChatScreen({ character }) {
  const char = character || { name: 'Svante', emoji: '🐑', color: '#ecb213' }
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'mentor',
      text: `Hej! Jag är ${char.name}, din mentor. Vad kan jag hjälpa dig med idag?`,
    },
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    const text = input.trim()
    if (!text) return

    const userMsg = { id: Date.now(), role: 'user', text }
    setMessages(m => [...m, userMsg])
    setInput('')

    // Simulate mentor response
    setTimeout(() => {
      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)]
      setMessages(m => [...m, { id: Date.now() + 1, role: 'mentor', text: response }])
    }, 1000)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="chat-screen">
      {/* Top bar */}
      <div className="chat-topbar">
        <div className="chat-mentor-info">
          <div className="chat-mentor-avatar">{char.emoji}</div>
          <div>
            <p className="chat-mentor-name">{char.name}</p>
            <p className="chat-mentor-status">
              <span className="status-dot" /> Online nu
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-bubble-wrap ${msg.role}`}>
            {msg.role === 'mentor' && (
              <div className="bubble-avatar">{char.emoji}</div>
            )}
            <div className={`chat-bubble ${msg.role}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-bar">
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={`Skriv till ${char.name}...`}
        />
        <button className="chat-send-btn" onClick={send} disabled={!input.trim()}>
          ↑
        </button>
      </div>
    </div>
  )
}
