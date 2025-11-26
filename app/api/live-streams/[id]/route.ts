import { NextRequest, NextResponse } from 'next/server'
import mux from '@/lib/mux'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      return NextResponse.json(
        { error: 'MUX credentials not configured' },
        { status: 500 }
      )
    }

    const liveStream = await mux.video.liveStreams.retrieve(params.id)
    
    return NextResponse.json({
      stream: liveStream,
    })
  } catch (error: any) {
    console.error('Error fetching live stream:', error)
    return NextResponse.json(
      { error: 'Failed to fetch live stream', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      return NextResponse.json(
        { error: 'MUX credentials not configured' },
        { status: 500 }
      )
    }

    await mux.video.liveStreams.delete(params.id)
    
    return NextResponse.json({
      success: true,
      message: 'Live stream deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting live stream:', error)
    return NextResponse.json(
      { error: 'Failed to delete live stream', details: error.message },
      { status: 500 }
    )
  }
}
