import { useState, useEffect } from 'react'
import './App.css'

const ABILITY_KEYS = ['C', 'Q', 'E', 'X']

function AbilityCard({ ability, keyName }) {
  const [showDesc, setShowDesc] = useState(false)

  return (
    <div
      className="ability-card"
      onMouseEnter={() => setShowDesc(true)}
      onMouseLeave={() => setShowDesc(false)}
      title={ability.description}
    >
      <div className="ability-key">{keyName}</div>
      {ability.displayIcon && (
        <img
          src={ability.displayIcon}
          alt={ability.displayName}
          className="ability-icon"
        />
      )}
      <div className="ability-name">{ability.displayName}</div>
      {showDesc && (
        <div className="ability-tooltip">{ability.description}</div>
      )}
    </div>
  )
}

function AgentCard({ agent }) {
  const abilities = agent.abilities.slice(0, 4)

  return (
    <div className="agent-card">
      <div
        className="agent-banner"
        style={{ backgroundColor: `#${agent.backgroundGradientColors?.[0] ?? '1a1a2e'}22` }}
      >
        <img
          src={agent.displayIconSmall}
          alt={agent.displayName}
          className="agent-portrait"
        />
      </div>
      <div className="agent-info">
        <div className="agent-role">
          {agent.role && (
            <>
              <img
                src={agent.role.displayIcon}
                alt={agent.role.displayName}
                className="role-icon"
              />
              <span>{agent.role.displayName}</span>
            </>
          )}
        </div>
        <h2 className="agent-name">{agent.displayName}</h2>
        <div className="abilities-grid">
          {abilities.map((ability, i) => (
            <AbilityCard
              key={ability.slot}
              ability={ability}
              keyName={ABILITY_KEYS[i] ?? ability.slot}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  useEffect(() => {
    fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const sorted = [...data.data].sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        )
        setAgents(sorted)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const roles = ['All', ...new Set(agents.map((a) => a.role?.displayName).filter(Boolean))]

  const filtered = agents.filter((agent) => {
    const matchesSearch = agent.displayName
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesRole =
      roleFilter === 'All' || agent.role?.displayName === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <span className="logo-accent">VALORANT</span> ABILITIES
          </h1>
          <p className="subtitle">Hover over an ability to see its description</p>
        </div>
        <div className="controls">
          <input
            className="search"
            type="search"
            placeholder="Search agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="role-filters">
            {roles.map((role) => (
              <button
                key={role}
                className={`role-btn${roleFilter === role ? ' active' : ''}`}
                onClick={() => setRoleFilter(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="main">
        {loading && <p className="status">Loading agents…</p>}
        {error && <p className="status error">Failed to load agents: {error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="status">No agents found.</p>
        )}
        <div className="agents-grid">
          {filtered.map((agent) => (
            <AgentCard key={agent.uuid} agent={agent} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
