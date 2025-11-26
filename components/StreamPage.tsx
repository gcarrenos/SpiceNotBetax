'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BrowserStream from './BrowserStream'
import WebRTCStream from './WebRTCStream'

interface LiveStream {
  id: string
  status: string
  stream_key: string
  playback_ids: Array<{ id: string; policy: string }>
  created_at: string
  active_asset_id?: string
}

export default function StreamPage() {
  const router = useRouter()
  const [streams, setStreams] = useState<LiveStream[]>([])
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const fetchStreams = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/live-streams')
      const data = await response.json()
      
      if (response.ok) {
        setStreams(data.streams || [])
        if (data.streams && data.streams.length > 0 && !selectedStream) {
          setSelectedStream(data.streams[0])
        }
      }
    } catch (err) {
      console.error('Error fetching streams:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStreams()
  }, [])

  const handleCreateStream = async () => {
    try {
      setCreating(true)
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

      if (response.ok) {
        await fetchStreams()
        if (data.stream) {
          setSelectedStream(data.stream)
        }
      }
    } catch (err) {
      console.error('Error creating stream:', err)
    } finally {
      setCreating(false)
    }
  }

  const rtmpUrl = 'rtmp://global-live.mux.com:5222/app/'

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="stream-page-container">
      <div className="stream-page-header">
        <button 
          onClick={() => router.push('/')}
          className="back-button"
        >
          ← Back to Home
        </button>
        <h1>Go Live</h1>
        <p>Start broadcasting your live stream</p>
      </div>

      <div className="stream-page-content">
        {streams.length === 0 ? (
          <div className="no-streams">
            <div className="no-streams-content">
              <h2>No streams available</h2>
              <p>Create a new stream to start broadcasting</p>
              <button 
                onClick={handleCreateStream}
                disabled={creating}
                className="create-stream-btn"
              >
                {creating ? 'Creating...' : 'Create New Stream'}
              </button>
            </div>
          </div>
        ) : (
          <div className="stream-setup">
            <div className="stream-selector">
              <h2>Select Stream</h2>
              <select
                value={selectedStream?.id || ''}
                onChange={(e) => {
                  const stream = streams.find(s => s.id === e.target.value)
                  setSelectedStream(stream || null)
                }}
                className="stream-select"
              >
                {streams.map((stream) => (
                  <option key={stream.id} value={stream.id}>
                    Stream {stream.id.slice(0, 8)} - {stream.status}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleCreateStream}
                disabled={creating}
                className="create-new-btn"
              >
                {creating ? 'Creating...' : '+ Create New'}
              </button>
            </div>

            {selectedStream && (
              <div className="stream-info-card">
                <div className="stream-info-header">
                  <h2>Stream Information</h2>
                  <div className={`status-badge status-${selectedStream.status}`}>
                    {selectedStream.status}
                  </div>
                </div>

                <div className="stream-details-grid">
                  <div className="stream-detail-item">
                    <label>RTMP URL</label>
                    <div className="copy-field">
                      <code className="stream-value">{rtmpUrl}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(rtmpUrl)
                        }}
                        className="copy-button"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="stream-detail-item">
                    <label>Stream Key</label>
                    <div className="copy-field">
                      <code className="stream-value">{selectedStream.stream_key}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedStream.stream_key)
                        }}
                        className="copy-button"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="stream-detail-item">
                    <label>Stream ID</label>
                    <code className="stream-value">{selectedStream.id}</code>
                  </div>

                  {selectedStream.playback_ids && selectedStream.playback_ids.length > 0 && (
                    <div className="stream-detail-item">
                      <label>Playback ID</label>
                      <code className="stream-value">{selectedStream.playback_ids[0].id}</code>
                    </div>
                  )}
                </div>

                <div className="stream-instructions">
                  <h3>How to Stream</h3>
                  <ol>
                    <li>
                      <strong>Download OBS Studio</strong> (or your preferred streaming software)
                    </li>
                    <li>
                      <strong>Open OBS Settings</strong> → Go to "Stream"
                    </li>
                    <li>
                      <strong>Set Service</strong> to "Custom"
                    </li>
                    <li>
                      <strong>Enter RTMP URL:</strong> <code>{rtmpUrl}</code>
                    </li>
                    <li>
                      <strong>Enter Stream Key:</strong> Copy the stream key above
                    </li>
                    <li>
                      <strong>Click "Start Streaming"</strong> in OBS
                    </li>
                    <li>
                      <strong>View your stream</strong> on the home page once it's active
                    </li>
                  </ol>
                </div>

                <div className="streaming-options">
                  <h3>Streaming Options</h3>
                  
                  <div className="streaming-tabs">
                    <button className="tab-button active" onClick={(e) => {
                      document.querySelector('.browser-stream-section')?.classList.remove('hidden')
                      document.querySelector('.obs-instructions-section')?.classList.add('hidden')
                      e.currentTarget.classList.add('active')
                      e.currentTarget.nextElementSibling?.classList.remove('active')
                    }}>WebRTC Stream</button>
                    <button className="tab-button" onClick={(e) => {
                      document.querySelector('.browser-stream-section')?.classList.add('hidden')
                      document.querySelector('.obs-instructions-section')?.classList.remove('hidden')
                      e.currentTarget.classList.add('active')
                      e.currentTarget.previousElementSibling?.classList.remove('active')
                    }}>OBS Studio</button>
                  </div>

                  <div className="browser-stream-section">
                    <WebRTCStream 
                      streamKey={selectedStream.stream_key}
                      rtmpUrl={rtmpUrl}
                      onStreamStart={() => console.log('WebRTC stream started')}
                      onStreamStop={() => console.log('WebRTC stream stopped')}
                    />
                  </div>

                  <div className="obs-instructions-section hidden">
                    <div className="stream-instructions">
                      <h3>How to Stream with OBS Studio</h3>
                      <ol>
                        <li>
                          <strong>Download OBS Studio</strong> (or your preferred streaming software)
                        </li>
                        <li>
                          <strong>Open OBS Settings</strong> → Go to "Stream"
                        </li>
                        <li>
                          <strong>Set Service</strong> to "Custom"
                        </li>
                        <li>
                          <strong>Enter RTMP URL:</strong> <code>{rtmpUrl}</code>
                        </li>
                        <li>
                          <strong>Enter Stream Key:</strong> Copy the stream key above
                        </li>
                        <li>
                          <strong>Click "Start Streaming"</strong> in OBS
                        </li>
                        <li>
                          <strong>View your stream</strong> on the home page once it's active
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="stream-preview">
                  <h3>Stream Preview</h3>
                  <p className="preview-note">
                    Your stream will appear here once you start broadcasting.
                  </p>
                  {selectedStream.status === 'active' && selectedStream.playback_ids?.[0]?.id ? (
                    <div className="preview-player">
                      <iframe
                        src={`https://stream.mux.com/${selectedStream.playback_ids[0].id}.m3u8`}
                        style={{
                          width: '100%',
                          height: '400px',
                          border: 'none',
                          borderRadius: '8px',
                        }}
                        allow="autoplay; fullscreen"
                      />
                    </div>
                  ) : (
                    <div className="preview-placeholder">
                      <div className="placeholder-icon">📹</div>
                      <p>Waiting for stream to start...</p>
                      <p className="placeholder-status">Status: {selectedStream.status}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

