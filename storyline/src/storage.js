const KEY = 'storyline_entries_v1'

export function loadEntries() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveEntries(entries) {
  localStorage.setItem(KEY, JSON.stringify(entries))
}

export function newEntry({ title, content, category, section }) {
  return {
    id: crypto.randomUUID(),
    title: title || 'Untitled',
    content: content || '',
    category: category || 'character',
    section: section || 'General',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export const CATEGORIES = [
  { id: 'character', label: 'Character', emoji: '👤', color: '#8b5cf6' },
  { id: 'plot', label: 'Plot', emoji: '📖', color: '#f97316' },
  { id: 'setting', label: 'Setting', emoji: '🖼️', color: '#10b981' },
  { id: 'dialogue', label: 'Dialogue', emoji: '💬', color: '#eab308' },
  { id: 'theme', label: 'Theme', emoji: '✨', color: '#ec4899' },
  { id: 'research', label: 'Research', emoji: '🔍', color: '#3b82f6' },
]

export function wordCount(text) {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}
