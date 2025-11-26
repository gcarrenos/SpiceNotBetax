'use client'

import { useEffect, useState, useRef } from 'react'

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: Date
  color: string
}

const FAKE_USERS = [
  'viewer123', 'streamlover', 'livefan99', 'watchtime', 'streamerpro',
  'livestreamer', 'viewmaster', 'streamking', 'watchnow', 'livetime',
  'streamfan', 'viewerpro', 'livestream', 'watchfan', 'streamtime'
]

const FAKE_MESSAGES = [
  'This stream is amazing! 🔥',
  'Love the content!',
  'Can you show that again?',
  'Great quality!',
  'How long have you been streaming?',
  'What equipment are you using?',
  'This is so cool!',
  'Following!',
  'Amazing stream!',
  'Keep it up!',
  'What time do you usually stream?',
  'Love the setup!',
  'This is awesome!',
  'Great job!',
  'Can you answer my question?',
  'What are you showing next?',
  'This is so interesting!',
  'Thanks for streaming!',
  'Best stream ever!',
  'You got a new follower!',
  'How do I get started?',
  'This is helpful!',
  'Great explanation!',
  'Love it! ❤️',
  'Amazing work!',
]

const COLORS = [
  '#9333ea', '#7c3aed', '#a855f7', '#c084fc', '#8b5cf6',
  '#6366f1', '#4f46e5', '#3b82f6', '#2563eb', '#0ea5e9',
  '#06b6d4', '#10b981', '#059669', '#f59e0b', '#f97316',
]

export default function StreamChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add initial messages
    const initialMessages: ChatMessage[] = []
    for (let i = 0; i < 5; i++) {
      initialMessages.push(createFakeMessage())
    }
    setMessages(initialMessages)

    // Add new messages periodically
    const interval = setInterval(() => {
      if (!isPaused) {
        setMessages(prev => {
          const newMessage = createFakeMessage()
          // Keep only last 50 messages
          const updated = [...prev, newMessage].slice(-50)
          return updated
        })
      }
    }, 2000 + Math.random() * 3000) // Random interval between 2-5 seconds

    return () => clearInterval(interval)
  }, [isPaused])

  useEffect(() => {
    // Auto-scroll to bottom when new message arrives
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const createFakeMessage = (): ChatMessage => {
    const username = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)]
    const message = FAKE_MESSAGES[Math.floor(Math.random() * FAKE_MESSAGES.length)]
    const color = COLORS[username.length % COLORS.length]
    
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      username,
      message,
      timestamp: new Date(),
      color,
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  return (
    <div className="stream-chat-container">
      <div className="chat-header">
        <h3>Live Chat</h3>
        <div className="chat-stats">
          <span className="viewer-count-badge">
            👁 {Math.floor(Math.random() * 500) + 50} watching
          </span>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className="chat-message">
            <span 
              className="chat-username"
              style={{ color: msg.color }}
            >
              {msg.username}:
            </span>
            <span className="chat-text">{msg.message}</span>
            <span className="chat-time">{formatTime(msg.timestamp)}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          className="chat-input"
          disabled
        />
        <button className="chat-send-button" disabled>
          Send
        </button>
      </div>
    </div>
  )
}

