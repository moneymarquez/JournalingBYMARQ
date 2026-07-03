import { useState } from 'react'

export default function AIChat({ onInsert }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function send() {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError('Could not reach AI. Check that ANTHROPIC_API_KEY is set in your deployment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel aichat">
      <h1>✨ AI Chat</h1>
      <p className="sub">Chat with Claude to generate content for your entries</p>
      <div className="chat-log">
        {messages.length === 0 && !loading && (
          <div className="empty">✨<br/>Start a conversation to generate content<br/>Describe scenes, characters, dialogue, or plot ideas</div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <div className="chat-bubble">{m.content}</div>
            {m.role === 'assistant' && (
              <button className="insert-btn" onClick={() => onInsert(m.content)}>Insert as entry</button>
            )}
          </div>
        ))}
        {loading && <div className="chat-msg assistant"><div className="chat-bubble">Thinking...</div></div>}
        {error && <div className="chat-error">{error}</div>}
      </div>
      <div className="chat-input-row">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe a scene, character, dialogue, or plot idea..."
          onKeyDown={(e) => { if (e.ctrlKey && e.key === 'Enter') send() }}
        />
        <button onClick={send} disabled={loading}>➤</button>
      </div>
      <div className="hint">Press Ctrl+Enter to send</div>
    </div>
  )
}
