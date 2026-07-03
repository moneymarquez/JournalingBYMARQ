export default function ClipsBoard({ entries }) {
  const clips = entries
    .filter((e) => e.content && e.content.length > 0)
    .map((e) => ({ id: e.id, title: e.title, snippet: e.content.slice(0, 120) }))

  return (
    <div className="panel">
      <h1>Clips Board</h1>
      <p className="sub">Saved snippets from your entries</p>
      {clips.length === 0 ? (
        <div className="empty">No clips yet<br/><span className="empty-sub">Save 120-character snippets from your entries to build a collection of memorable passages.</span></div>
      ) : (
        <ul className="clips-list">
          {clips.map((c) => (
            <li key={c.id}><strong>{c.title}</strong><p>{c.snippet}...</p></li>
          ))}
        </ul>
      )}
    </div>
  )
}
