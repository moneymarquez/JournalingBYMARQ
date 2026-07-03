import { CATEGORIES, wordCount } from '../storage'

export default function EntryEditor({ entry, onChange, onDelete, onBack }) {
  return (
    <div className="editor">
      <div className="editor-toolbar">
        <button onClick={onBack}>← Back</button>
        <select value={entry.category} onChange={(e) => onChange({ category: e.target.value })}>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
          ))}
        </select>
        <button className="danger" onClick={onDelete}>Delete</button>
      </div>
      <input
        className="editor-title"
        value={entry.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Entry title..."
      />
      <textarea
        className="editor-content"
        value={entry.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="Start writing..."
      />
      <div className="editor-footer">{wordCount(entry.content)} words</div>
    </div>
  )
}
