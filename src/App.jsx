import React, { useState } from 'react'
import './index.css'
import OnboardingScreen from './screens/OnboardingScreen'
import CharacterSelectScreen from './screens/CharacterSelectScreen'
import DashboardScreen from './screens/DashboardScreen'
import ChatScreen from './screens/ChatScreen'
import MilestonesScreen from './screens/MilestonesScreen'
import CalendarScreen from './screens/CalendarScreen'

function App() {
  // 'onboarding' | 'character-select' | 'app'
  const [phase, setPhase] = useState('onboarding')
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleOnboardingComplete = () => setPhase('character-select')

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character)
    setPhase('app')
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':   return <DashboardScreen character={selectedCharacter} key="dashboard" />
      case 'chat':        return <ChatScreen character={selectedCharacter} key="chat" />
      case 'milestones':  return <MilestonesScreen key="milestones" />
      case 'calendar':    return <CalendarScreen key="calendar" />
      default:            return <DashboardScreen character={selectedCharacter} key="dashboard" />
    }
  }

  if (phase === 'onboarding') {
    return (
      <div className="app-shell">
        <div className="screen">
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        </div>
      </div>
    )
  }

  if (phase === 'character-select') {
    return (
      <div className="app-shell">
        <div className="screen">
          <CharacterSelectScreen onSelect={handleCharacterSelect} />
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="screen page-enter">
        {renderScreen()}
      </div>
      <nav className="bottom-nav">
        {[
          { id: 'dashboard',  icon: '🏠', label: 'Hem' },
          { id: 'chat',       icon: '🐑', label: 'Mentor' },
          { id: 'milestones', icon: '🎯', label: 'Mål' },
          { id: 'calendar',   icon: '📅', label: 'Kalender' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
