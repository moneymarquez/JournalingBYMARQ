import { CATEGORIES, wordCount } from '../storage'

const GOAL = 80000

export default function Progress({ entries }) {
  const totalWords = entries.reduce((s, e) => s + wordCount(e.content), 0)
  const pct = Math.min(100, (totalWords / GOAL) * 100)
  const avg = entries.length ? Math.round(totalWords / entries.length) : 0

  return (
    <div className="panel">
      <h1>Progress</h1>
      <p className="sub">Track your writing journey toward {GOAL.toLocaleString()} words</p>

      <div className="card">
        <div className="card-row">
          <strong>Total Word Count</strong>
          <span>{totalWords}</span>
        </div>
        <div className="card-sub">{Math.max(0, GOAL - totalWords).toLocaleString()} words to go</div>
        <div className="card-row"><span>Progress to {GOAL.toLocaleString()} words</span><span>{pct.toFixed(1)}%</span></div>
        <div className="bar"><div className="bar-fill" style={{ width: `${pct}%` }} /></div>
      </div>

      <div className="card">
        <strong>Entries by Category</strong>
        {CATEGORIES.map((c) => {
          const catEntries = entries.filter((e) => e.category === c.id)
          const catWords = catEntries.reduce((s, e) => s + wordCount(e.content), 0)
          const catPct = totalWords ? (catWords / totalWords) * 100 : 0
          return (
            <div key={c.id} className="cat-row">
              <div className="card-row">
                <span><span className="dot" style={{ background: c.color }} /> {c.label}</span>
                <span>{catEntries.length}</span>
              </div>
              <div className="bar small"><div className="bar-fill" style={{ width: `${catPct}%`, background: c.color }} /></div>
            </div>
          )
        })}
      </div>

      <div className="stat-grid">
        <div className="card center"><div className="stat-label">Total Entries</div><div className="stat-value">{entries.length}</div></div>
        <div className="card center"><div className="stat-label">Average Entry Length</div><div className="stat-value">{avg}</div></div>
      </div>
    </div>
  )
}
