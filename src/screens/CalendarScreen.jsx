import React, { useState } from 'react'
import './CalendarScreen.css'

const MONTHS = ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec']
const DAYS = ['Mån','Tis','Ons','Tor','Fre','Lör','Sön']

const events = {
  '2024-11-05': [{ title: 'Deadline affärsplan', type: 'deadline' }],
  '2024-11-12': [{ title: 'Möte med handledare', type: 'meeting' }],
  '2024-11-18': [{ title: 'Marknadsdag på skolan', type: 'event' }],
  '2024-11-25': [{ title: 'Inlämning budgetrapport', type: 'deadline' }],
  '2024-11-28': [{ title: 'UF-mässa Göteborg', type: 'event' }],
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  // Monday = 0
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

const today = new Date()

export default function CalendarScreen() {
  const [year, setYear] = useState(2024)
  const [month, setMonth] = useState(10) // November

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  )

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const getEventKey = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const upcomingEvents = Object.entries(events)
    .filter(([d]) => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
    .sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className="calendar-screen">
      <div className="cal-header">
        <h1 className="cal-title">Kalender</h1>
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
          <span className="cal-month-label">{MONTHS[month]} {year}</span>
          <button className="cal-nav-btn" onClick={nextMonth}>›</button>
        </div>
      </div>

      {/* Grid */}
      <div className="cal-grid-wrap">
        <div className="cal-weekdays">
          {DAYS.map(d => <span key={d} className="cal-weekday">{d}</span>)}
        </div>
        <div className="cal-grid">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="cal-cell empty" />
            const key = getEventKey(day)
            const hasEvent = events[key]
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            return (
              <div key={key} className={`cal-cell ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}`}>
                <span className="cal-day">{day}</span>
                {hasEvent && <div className={`cal-dot type-${hasEvent[0].type}`} />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="cal-legend">
        <span><span className="legend-dot type-deadline" />Deadline</span>
        <span><span className="legend-dot type-meeting" />Möte</span>
        <span><span className="legend-dot type-event" />Event</span>
      </div>

      {/* Events list */}
      <div className="cal-events-section">
        <h2 className="cal-events-title">Kommande händelser</h2>
        <div className="cal-events-list">
          {upcomingEvents.length === 0 ? (
            <p className="cal-no-events">Inga händelser denna månad</p>
          ) : upcomingEvents.map(([date, evts]) => (
            <div className="cal-event-item" key={date}>
              <div className={`cal-event-dot type-${evts[0].type}`} />
              <div className="cal-event-info">
                <p className="cal-event-title">{evts[0].title}</p>
                <p className="cal-event-date">{date.split('-').reverse().join('/')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 24 }} />
    </div>
  )
}
