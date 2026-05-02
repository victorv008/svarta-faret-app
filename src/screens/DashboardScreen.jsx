import React from 'react'
import './DashboardScreen.css'

const tasks = [
  { id: 1, text: 'Uppdatera affärsplan', done: false, priority: 'hög' },
  { id: 2, text: 'Boka möte med handledare', done: true, priority: 'medium' },
  { id: 3, text: 'Skicka in budgetrapport', done: false, priority: 'hög' },
  { id: 4, text: 'Förbered presentation', done: false, priority: 'låg' },
]

const stats = [
  { label: 'Dagar kvar', value: '42', icon: '⏳' },
  { label: 'Mål klara', value: '6/14', icon: '🎯' },
  { label: 'Streak', value: '5 🔥', icon: '🔥' },
]

export default function DashboardScreen({ character }) {
  const char = character || { name: 'Svante', emoji: '🐑' }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dash-header">
        <div>
          <p className="dash-greeting">God morgon! 👋</p>
          <h1 className="dash-title">Hur är det med UF-bolaget?</h1>
        </div>
        <div className="dash-avatar">{char.emoji}</div>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Quick action */}
      <div className="dash-mentor-card">
        <div className="mentor-card-left">
          <span className="mentor-emoji">{char.emoji}</span>
          <div>
            <p className="mentor-card-name">{char.name} säger:</p>
            <p className="mentor-card-tip">
              "Kom ihåg att uppdatera din affärsplan inför nästa deadline. Vill du att vi går igenom den?"
            </p>
          </div>
        </div>
        <button className="mentor-chat-btn">Chatta →</button>
      </div>

      {/* Tasks */}
      <div className="dash-section">
        <div className="dash-section-header">
          <h2 className="dash-section-title">Dagens uppgifter</h2>
          <span className="dash-section-badge">
            {tasks.filter(t => !t.done).length} kvar
          </span>
        </div>
        <div className="task-list">
          {tasks.map(task => (
            <div className={`task-item ${task.done ? 'done' : ''}`} key={task.id}>
              <div className={`task-check ${task.done ? 'checked' : ''}`}>
                {task.done && '✓'}
              </div>
              <span className="task-text">{task.text}</span>
              <span className={`task-priority priority-${task.priority}`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 24 }} />
    </div>
  )
}
