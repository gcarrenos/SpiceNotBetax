'use client'

import { useState } from 'react'

interface CreateStreamButtonProps {
  onStreamCreated: () => void
}

export default function CreateStreamButton({
  onStreamCreated,
}: CreateStreamButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateStream = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/live-streams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playbackPolicy: 'public',
          reconnectWindow: 60,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create stream')
      }

      onStreamCreated()
    } catch (err: any) {
      setError(err.message)
      console.error('Error creating stream:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-stream-container">
      <button
        onClick={handleCreateStream}
        disabled={loading}
        className="create-stream-button"
      >
        {loading ? 'Creating...' : '+ Create New Stream'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}
