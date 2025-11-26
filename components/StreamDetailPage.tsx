'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MuxPlayer from '@mux/mux-player-react'
import Header from './Header'
import Sidebar from './Sidebar'

interface LiveStream {
  id: string
  status: string
  stream_key: string
  playback_ids: Array<{ id: string; policy: string }>
  created_at: string
  active_asset_id?: string
  username?: string
  title?: string
  description?: string
  viewers?: number
  tags?: string[]
}

interface StreamDetailPageProps {
  streamId: string
}

export default function StreamDetailPage({ streamId }: StreamDetailPageProps) {
  const router = useRouter()
  const [stream, setStream] = useState<LiveStream | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStream()
    // Refresh stream status every 5 seconds
    const interval = setInterval(fetchStream, 5000)
    return () => clearInterval(interval)
  }, [streamId])

  const fetchStream = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/live-streams/${streamId}`)
      const data = await response.json()
      
      if (response.ok) {
        setStream(data.stream)
        setError(null)
      } else {
        setError(data.error || 'Failed to load stream')
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching stream:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = () => {
    if (!stream) return '#6b7280'
    switch (stream.status) {
      case 'active':
        return '#10b981'
      case 'idle':
        return '#f59e0b'
      case 'disconnected':
        return '#ef4444'
      default:
        return '#9333ea'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const playbackId = stream?.playback_ids?.[0]?.id
  const isLive = stream?.status === 'active'

  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <div className="main-layout">
          <Sidebar />
          <main className="main-content">
            <div className="loading-container">
              <p>Loading stream...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error || !stream) {
    return (
      <div className="app-container">
        <Header />
        <div className="main-layout">
          <Sidebar />
          <main className="main-content">
            <div className="error-container">
              <p>Error: {error || 'Stream not found'}</p>
              <button onClick={() => router.push('/')} className="retry-button">
                Go Back Home
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="main-content">
          <div className="stream-detail-page">
            <button 
              onClick={() => router.push('/')}
              className="back-button"
            >
              ← Back to Streams
            </button>

            <div className="stream-detail-header">
              <div className="stream-detail-title-section">
                <h1>{stream.title || `Stream ${stream.id.slice(0, 8)}`}</h1>
                <div className="stream-detail-meta">
                  <div className="status-badge-large" style={{ backgroundColor: getStatusColor() }}>
                    <span className="status-dot-large"></span>
                    <span>{stream.status.toUpperCase()}</span>
                  </div>
                  {stream.viewers !== undefined && (
                    <div className="viewer-count">
                      👁 {stream.viewers} viewers
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="stream-detail-content">
              <div className="stream-player-section">
                {playbackId && isLive ? (
                  <div className="main-stream-player">
                    <MuxPlayer
                      streamType="live"
                      playbackId={playbackId}
                      metadata={{
                        video_id: stream.id,
                        video_title: stream.title || `Live Stream ${stream.id.slice(0, 8)}`,
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        minHeight: '500px',
                      }}
                    />
                  </div>
                ) : (
                  <div className="stream-offline">
                    <div className="offline-icon">📹</div>
                    <h2>Stream is Offline</h2>
                    <p>This stream is currently not broadcasting.</p>
                    <p className="offline-status">Status: {stream.status}</p>
                  </div>
                )}

                {stream.description && (
                  <div className="stream-description-section">
                    <h3>Description</h3>
                    <p>{stream.description}</p>
                  </div>
                )}

                {stream.tags && stream.tags.length > 0 && (
                  <div className="stream-tags-section">
                    {stream.tags.map((tag, index) => (
                      <span key={index} className="tag-large">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="stream-info-sidebar">
                <div className="stream-info-card">
                  <h3>Stream Information</h3>
                  
                  <div className="info-item">
                    <label>Stream ID</label>
                    <code>{stream.id}</code>
                  </div>

                  <div className="info-item">
                    <label>Status</label>
                    <div className="status-value" style={{ color: getStatusColor() }}>
                      {stream.status}
                    </div>
                  </div>

                  {playbackId && (
                    <div className="info-item">
                      <label>Playback ID</label>
                      <code>{playbackId}</code>
                    </div>
                  )}

                  <div className="info-item">
                    <label>Created</label>
                    <span>{formatDate(stream.created_at)}</span>
                  </div>

                  {stream.active_asset_id && (
                    <div className="info-item">
                      <label>Active Asset</label>
                      <code>{stream.active_asset_id}</code>
                    </div>
                  )}
                </div>

                <div className="stream-actions-card">
                  <h3>Actions</h3>
                  <button 
                    onClick={() => router.push(`/stream?streamId=${stream.id}`)}
                    className="action-button"
                  >
                    📹 Go Live
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(stream.stream_key)
                      alert('Stream Key copied to clipboard!')
                    }}
                    className="action-button secondary"
                  >
                    📋 Copy Stream Key
                  </button>
                  {playbackId && (
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(playbackId)
                        alert('Playback ID copied to clipboard!')
                      }}
                      className="action-button secondary"
                    >
                      📋 Copy Playback ID
                    </button>
                  )}
                </div>

                {stream.stream_key && (
                  <div className="stream-broadcast-card">
                    <h3>Broadcast Settings</h3>
                    <div className="broadcast-info">
                      <div className="broadcast-item">
                        <label>RTMP URL</label>
                        <code className="broadcast-code">rtmp://global-live.mux.com:5222/app/</code>
                      </div>
                      <div className="broadcast-item">
                        <label>Stream Key</label>
                        <code className="broadcast-code">{stream.stream_key}</code>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

