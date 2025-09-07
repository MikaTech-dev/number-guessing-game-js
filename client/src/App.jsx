import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

const socket = io(SOCKET_URL)

export default function App() {
  const [connected, setConnected] = useState(socket.connected)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    function onConnect() {
      setConnected(true)
      setMessages(m => [...m, { system: true, text: 'Connected to server' }])
    }
    function onDisconnect() {
      setConnected(false)
      setMessages(m => [...m, { system: true, text: 'Disconnected from server' }])
    }
    function onMessage(payload) {
      setMessages(m => [...m, { system: false, text: payload }])
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('chat', onMessage)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('chat', onMessage)
      socket.close()
    }
  }, [])

  function send() {
    if (!input) return
    socket.emit('chat', input)
    setInput('')
  }

  return (
    <div className="app">
      <header>
        <h1>Guessing Game</h1>
        <div className={`status ${connected ? 'online' : 'offline'}`}>
          {connected ? 'Online' : 'Offline'}
        </div>
      </header>

      <main>
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.system ? 'system' : 'user'}`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="composer">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a guess or chat message"
            inputMode="numeric"
          />
          <button onClick={send}>Send</button>
        </div>
      </main>

      <footer>
        <small>Socket: {socket.id || '—'}</small>
      </footer>
    </div>
  )
}
