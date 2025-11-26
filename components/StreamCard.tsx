'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MuxPlayer from '@mux/mux-player-react'

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
  thumbnail?: string
  tags?: string[]
  isComingSoon?: boolean
}

interface StreamCardProps {
  stream: LiveStream
}

export default function StreamCard({ stream }: StreamCardProps) {
  const router = useRouter()
  const playbackId = stream.playback_ids?.[0]?.id
  const isLive = stream.status === 'active' && !stream.isComingSoon
  const isComingSoon = stream.isComingSoon || stream.status === 'coming_soon'
  
  // Generate purple gradient backgrounds
  const getGradient = (username?: string) => {
    if (!username) return 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)'
    const purpleGradients = [
      'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
      'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
      'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)',
      'linear-gradient(135deg, #d8b4fe 0%, #c084fc 100%)',
      'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
      'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)',
    ]
    const index = username.length % purpleGradients.length
    return purpleGradients[index]
  }

  const handleCardClick = () => {
    if (!isComingSoon) {
      router.push(`/stream/${stream.id}`)
    }
  }

  return (
    <div 
      className="stream-card-whatnot"
      onClick={handleCardClick}
      style={{ cursor: isComingSoon ? 'default' : 'pointer' }}
    >
      <div className="stream-card-header-whatnot">
        <div className="stream-user-info">
          <div 
            className="user-avatar"
            style={{ background: getGradient(stream.username) }}
          >
            {stream.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="username">{stream.username || 'user'}</span>
        </div>
        {isLive && (
          <div className="live-badge">
            <span className="live-dot"></span>
            <span>Live - {stream.viewers || 0}</span>
          </div>
        )}
        {isComingSoon && (
          <div className="coming-soon-badge">
            <span>Coming Soon</span>
          </div>
        )}
      </div>

      <div className="stream-thumbnail">
        {playbackId && isLive ? (
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
              minHeight: '250px',
            }}
          />
        ) : (
          <div 
            className="thumbnail-placeholder"
            style={{ background: getGradient(stream.username) }}
          >
            <div className="thumbnail-content">
              <div className="thumbnail-icon">▶</div>
              {stream.title && (
                <div className="thumbnail-title">{stream.title}</div>
              )}
              {isComingSoon && (
                <div className="coming-soon-overlay">
                  <span>Coming Soon</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="stream-info">
        {stream.title && (
          <h3 className="stream-title">{stream.title}</h3>
        )}
        {stream.description && (
          <p className="stream-description">{stream.description}</p>
        )}
        {stream.tags && stream.tags.length > 0 && (
          <div className="stream-tags">
            {stream.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
