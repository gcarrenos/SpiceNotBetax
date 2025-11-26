'use client'

import { useEffect, useState } from 'react'
import StreamCard from './StreamCard'
import CreateStreamButton from './CreateStreamButton'

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

// Fake streams data
const fakeStreams: Omit<LiveStream, 'id' | 'stream_key' | 'playback_ids' | 'created_at' | 'status'>[] = [
  {
    username: 'toolpro',
    title: 'ACCESSORIES SHOW',
    description: 'All Tool Accessories Showdown! GIVEAWAYS ALL SHOW!',
    viewers: 116,
    tags: ['Tools'],
    isComingSoon: true,
  },
  {
    username: 'torquex',
    title: 'TORQUE X',
    description: 'Milwaukee, Dewalt & more starting @$1',
    viewers: 62,
    tags: ['Tools'],
    isComingSoon: true,
  },
  {
    username: 'greendepot',
    title: 'RYOBI BOXES',
    description: 'Huge collection of green tool boxes',
    viewers: 58,
    tags: ['Tools'],
    isComingSoon: true,
  },
  {
    username: 'turbodepot',
    title: 'TURBO DEPOT',
    description: 'HD DEALS GIVEAWAY EVERY 5 MINUTES',
    viewers: 76,
    tags: ['Electronics'],
    isComingSoon: true,
  },
  {
    username: 'familybaby',
    title: 'KIDS AND BABY CLOTHING',
    description: 'Kids and baby clothing TARGET reduced shipping',
    viewers: 65,
    tags: ['Baby & Kids'],
    isComingSoon: true,
  },
  {
    username: 'homedecor',
    title: 'HOME DECOR SALE',
    description: 'Crazy home decor sale NONSTOP GIVEAWAY',
    viewers: 85,
    tags: ['Home'],
    isComingSoon: true,
  },
  {
    username: 'edcknives',
    title: 'KNIVES FOR SALE',
    description: 'Best EDC knives starting at $1',
    viewers: 104,
    tags: ['Knives & EDC'],
    isComingSoon: true,
  },
  {
    username: 'exclusivewatches',
    title: 'EXCLUSIVE WATCHES',
    description: 'EXCLUSIVES ONLY ON SPICENOT STARTING AT $1',
    viewers: 355,
    tags: ['Accessories'],
    isComingSoon: true,
  },
  {
    username: 'dailytech',
    title: 'DAILY ELECTRONICS',
    description: 'Amazing deals on electronics every day',
    viewers: 92,
    tags: ['Electronics'],
    isComingSoon: true,
  },
  {
    username: 'wholesalepallets',
    title: 'WHOLESALE PALLETS',
    description: 'Amazon liquidation pallets starting at $50',
    viewers: 128,
    tags: ['Pallets', 'Wholesale'],
    isComingSoon: true,
  },
  {
    username: 'outdoorhunt',
    title: 'HUNTING & OUTDOOR',
    description: 'Hunting gear and outdoor activities',
    viewers: 73,
    tags: ['Knives & Hunting'],
    isComingSoon: true,
  },
  {
    username: 'techdeals',
    title: 'TECH DEALS',
    description: 'Best deals on technology and gadgets',
    viewers: 201,
    tags: ['Electronics'],
    isComingSoon: true,
  },
]

export default function LiveStreamsGrid() {
  const [streams, setStreams] = useState<LiveStream[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStreams = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/live-streams')
      const data = await response.json()
      
      if (response.ok) {
        const realStreams = (data.streams || []).map((stream: LiveStream) => ({
          ...stream,
          isComingSoon: false,
        }))
        
        // Combine real streams with fake "coming soon" streams
        const fakeStreamsWithIds = fakeStreams.map((fake, index) => ({
          ...fake,
          id: `fake-${index}`,
          stream_key: '',
          playback_ids: [],
          created_at: new Date().toISOString(),
          status: 'coming_soon',
        }))
        
        setStreams([...realStreams, ...fakeStreamsWithIds])
      } else {
        // If API fails, just show fake streams
        const fakeStreamsWithIds = fakeStreams.map((fake, index) => ({
          ...fake,
          id: `fake-${index}`,
          stream_key: '',
          playback_ids: [],
          created_at: new Date().toISOString(),
          status: 'coming_soon',
        }))
        setStreams(fakeStreamsWithIds)
      }
    } catch (err) {
      // On error, show fake streams
      const fakeStreamsWithIds = fakeStreams.map((fake, index) => ({
        ...fake,
        id: `fake-${index}`,
        stream_key: '',
        playback_ids: [],
        created_at: new Date().toISOString(),
        status: 'coming_soon',
      }))
      setStreams(fakeStreamsWithIds)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStreams()
    const interval = setInterval(fetchStreams, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleStreamCreated = () => {
    fetchStreams()
  }

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading streams...</p>
      </div>
    )
  }

  return (
    <div className="streams-container">
      <div className="streams-header">
        <h2 className="streams-title">Live Streams</h2>
        <div className="streams-header-actions">
          <a href="/stream" className="go-live-button">
            📹 Go Live
          </a>
          <CreateStreamButton onStreamCreated={handleStreamCreated} />
        </div>
      </div>
      
      <div className="streams-grid">
        {streams.map((stream) => (
          <StreamCard key={stream.id} stream={stream} />
        ))}
      </div>
    </div>
  )
}
