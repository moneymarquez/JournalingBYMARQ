import { useState, useEffect, useMemo } from 'react'
import { loadEntries, saveEntries, newEntry, CATEGORIES, wordCount } from './storage'
import EntryEditor from './components/EntryEditor'
import AIChat from './components/AIChat'
import Progress from './components/Progress'
import ClipsBoard from './components/ClipsBoard'

const VIEWS = ['entries', 'timeline', 'clips', 'progress', 'aichat', 'book']

export default function App() {
  const [entries, setEntries] = useState([])
  const [view, setView] = useState('entries')
  const [activeCategory, setActiveCategory] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setEntries(loadEntries())
  }, [])

  useEffect(() => {
    saveEntries(entries)
  }, [entries])

  const filtered = useMemo(() => {
    return entries
      .filter((e) => !activeCategory || e.category === activeCategory)
      .filter((e) =>
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.content.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }, [entries, activeCategory, search])

  const totalWords = useMemo(
    () => entries.reduce((sum, e) => sum + wordCount(e.content), 0),
    [entries]
  )

  function addEntry() {
    const e = newEntry({ category: activeCategory || 'character' })
    setEntries((prev) => [e, ...prev])
    setSelectedId(e.id)
    setView('entries')
  }

  function updateEntry(id, patch) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e))
    )
  }

  function deleteEntry(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const selected = entries.find((e) => e.id === selectedId)

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">📖</div>
          <div>
            <div className="logo-title">Storyline</div>
            <div className="logo-sub">BOOK JOURNALING</div>
          </div>
        </div>

        <nav className="nav">
          <button className={view === 'entries' && !activeCategory ? 'active' : ''} onClick={() => { setView('entries'); setActiveCategory(null) }}>📚 All Entries</button>
          <button className={view === 'timeline' ? 'active' : ''} onClick={() => setView('timeline')}>🗓️ Timeline</button>
          <button className={view === 'clips' ? 'active' : ''} onClick={() => setView('clips')}>📌 Clips Board</button>
          <button className={view === 'progress' ? 'active' : ''} onClick={() => setView('progress')}>📊 Progress</button>
          <button className={view === 'aichat' ? 'active' : ''} onClick={() => setView('aichat')}>✨ AI Chat</button>
          <button className={view === 'book' ? 'active' : ''} onClick={() => setView('book')}>📖 Your Book</button>
        </nav>

        <div className="section-title">Categories</div>
        <div className="categories">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={activeCategory === c.id ? 'active' : ''}
              style={{ '--dot': c.color }}
              onClick={() => { setActiveCategory(c.id); setView('entries') }}
            >
              <span className="dot" /> {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <div className="total-words">
          <div className="label">Total Words</div>
          <div className="value">{totalWords}</div>
        </div>
      </aside>

      <main className="main">
        {view === 'entries' && !selected && (
          <div className="entries-view">
            <div className="entries-header">
              <input
                placeholder="Search entries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="add-btn" onClick={addEntry}>+</button>
            </div>
            {filtered.length === 0 ? (
              <div className="empty">No entries found</div>
            ) : (
              <ul className="entry-list">
                {filtered.map((e) => (
                  <li key={e.id} onClick={() => setSelectedId(e.id)}>
                    <div className="entry-title">{e.title}</div>
                    <div className="entry-meta">{CATEGORIES.find(c => c.id === e.category)?.label} · {wordCount(e.content)} words</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {view === 'entries' && selected && (
          <EntryEditor
            entry={selected}
            onChange={(patch) => updateEntry(selected.id, patch)}
            onDelete={() => deleteEntry(selected.id)}
            onBack={() => setSelectedId(null)}
          />
        )}

        {view === 'timeline' && (
          <div className="panel">
            <h1>Timeline</h1>
            {entries.length === 0 ? <div className="empty">No entries yet</div> : (
              <ul className="timeline-list">
                {[...entries].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)).map(e => (
                  <li key={e.id}>
                    <div className="timeline-date">{new Date(e.createdAt).toLocaleDateString()}</div>
                    <div className="timeline-title" onClick={() => { setSelectedId(e.id); setView('entries') }}>{e.title}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {view === 'clips' && <ClipsBoard entries={entries} />}
        {view === 'progress' && <Progress entries={entries} />}
        {view === 'aichat' && <AIChat onInsert={(text) => {
          const e = newEntry({ title: 'AI Generated', content: text, category: activeCategory || 'plot' })
          setEntries((prev) => [e, ...prev])
        }} />}

        {view === 'book' && (
          <div className="panel">
            {entries.length === 0 ? (
              <div className="empty book-empty">📖<br/>No entries yet. Create some entries to view your book.</div>
            ) : (
              <div className="book-view">
                {[...entries].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)).map(e => (
                  <div key={e.id} className="book-entry">
                    <h2>{e.title}</h2>
                    <p>{e.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
