import { NextRequest, NextResponse } from 'next/server'
import mux from '@/lib/mux'

export async function GET() {
  try {
    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      return NextResponse.json(
        { error: 'MUX credentials not configured' },
        { status: 500 }
      )
    }

    const liveStreams = await mux.video.liveStreams.list()
    
    return NextResponse.json({
      streams: liveStreams.data || [],
    })
  } catch (error: any) {
    console.error('Error fetching live streams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch live streams', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      return NextResponse.json(
        { error: 'MUX credentials not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { playbackPolicy = 'public', reconnectWindow = 60 } = body

    const liveStream = await mux.video.liveStreams.create({
      playback_policy: playbackPolicy === 'signed' ? 'signed' : 'public',
      reconnect_window: reconnectWindow,
      new_asset_settings: {
        playback_policy: playbackPolicy === 'signed' ? 'signed' : 'public',
      },
    })

    return NextResponse.json({
      stream: liveStream,
    })
  } catch (error: any) {
    console.error('Error creating live stream:', error)
    return NextResponse.json(
      { error: 'Failed to create live stream', details: error.message },
      { status: 500 }
    )
  }
}
