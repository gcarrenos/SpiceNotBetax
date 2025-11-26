'use client'

import { useState, useRef, useEffect } from 'react'

interface WebRTCStreamProps {
  streamKey: string
  rtmpUrl: string
  onStreamStart?: () => void
  onStreamStop?: () => void
}

export default function WebRTCStream({ streamKey, rtmpUrl, onStreamStart, onStreamStop }: WebRTCStreamProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('Ready')
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>('')
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const websocketRef = useRef<WebSocket | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    // Get available devices
    navigator.mediaDevices.enumerateDevices().then((deviceList) => {
      setDevices(deviceList)
      const cameras = deviceList.filter(d => d.kind === 'videoinput')
      const mics = deviceList.filter(d => d.kind === 'audioinput')
      if (cameras.length > 0) setSelectedCamera(cameras[0].deviceId)
      if (mics.length > 0) setSelectedMicrophone(mics[0].deviceId)
    })

    return () => {
      stopStream()
    }
  }, [])

  const startStream = async () => {
    try {
      setError(null)
      setStatus('Requesting camera and microphone...')
      
      // Get user media with selected devices
      const constraints: MediaStreamConstraints = {
        video: selectedCamera 
          ? { 
              deviceId: { exact: selectedCamera },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            }
          : {
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
        audio: selectedMicrophone
          ? { deviceId: { exact: selectedMicrophone } }
          : true,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      mediaStreamRef.current = stream

      // Display preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      setStatus('Setting up WebRTC connection...')

      // For WebRTC streaming, we need to:
      // 1. Create a WebSocket connection for signaling
      // 2. Create RTCPeerConnection
      // 3. Send offer to server
      // 4. Handle answer and ICE candidates
      // 5. Server forwards to MUX RTMP

      // Simplified approach: Use MediaRecorder to capture and send via WebSocket
      // In production, you'd use proper WebRTC with a media server

      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${wsProtocol}//${window.location.host}/api/webrtc/ws`
      
      // Note: Next.js doesn't support WebSocket servers directly
      // You'd need a separate WebSocket server or use a service like Pusher, Ably, etc.
      
      setStatus('WebRTC requires a WebSocket server')
      setError(
        'Full WebRTC implementation requires:\n' +
        '1. A WebSocket server (Socket.io, ws, or external service)\n' +
        '2. A media server (Janus, Kurento, or custom Node.js with ffmpeg)\n' +
        '3. The media server converts WebRTC to RTMP and forwards to MUX\n\n' +
        'For now, please use OBS Studio with the RTMP URL and Stream Key.'
      )

      // Alternative: Use MediaRecorder API to record and upload chunks
      // This is a simpler approach but not true WebRTC
      const options = {
        mimeType: 'video/webm;codecs=vp8,opus',
        videoBitsPerSecond: 2500000, // 2.5 Mbps
      }

      if (MediaRecorder.isTypeSupported(options.mimeType)) {
        const recorder = new MediaRecorder(stream, options)
        mediaRecorderRef.current = recorder

        recorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            // In production, send chunks to server via WebSocket
            // Server would convert to RTMP and forward to MUX
            console.log('Media chunk received:', event.data.size, 'bytes')
          }
        }

        recorder.onerror = (event) => {
          setError('Recording error: ' + event)
        }

        // Start recording in chunks
        recorder.start(1000) // 1 second chunks
        setIsStreaming(true)
        setStatus('Streaming (MediaRecorder mode - requires server conversion)')
        onStreamStart?.()
      } else {
        setError('MediaRecorder with WebM codec not supported in this browser')
      }
      
    } catch (err: any) {
      setError(`Failed to start stream: ${err.message}`)
      setStatus('Error')
      console.error('Error starting stream:', err)
    }
  }

  const stopStream = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }

    if (websocketRef.current) {
      websocketRef.current.close()
      websocketRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsStreaming(false)
    setStatus('Stopped')
    onStreamStop?.()
  }

  const cameras = devices.filter(d => d.kind === 'videoinput')
  const microphones = devices.filter(d => d.kind === 'audioinput')

  return (
    <div className="browser-stream-container">
      <div className="stream-preview-section">
        <div className="video-preview">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="preview-video"
          />
          {!isStreaming && (
            <div className="preview-overlay">
              <p>Preview will appear here</p>
            </div>
          )}
        </div>

        <div className="stream-controls">
          {!isStreaming ? (
            <button
              onClick={startStream}
              className="start-stream-btn"
            >
              🎥 Start WebRTC Stream
            </button>
          ) : (
            <button
              onClick={stopStream}
              className="stop-stream-btn"
            >
              ⏹ Stop Streaming
            </button>
          )}
        </div>

        <div className="stream-status">
          <strong>Status:</strong> {status}
        </div>
      </div>

      <div className="stream-settings">
        <h3>WebRTC Stream Settings</h3>
        
        <div className="setting-group">
          <label>Camera</label>
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            disabled={isStreaming}
            className="device-select"
          >
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
              </option>
            ))}
          </select>
        </div>

        <div className="setting-group">
          <label>Microphone</label>
          <select
            value={selectedMicrophone}
            onChange={(e) => setSelectedMicrophone(e.target.value)}
            disabled={isStreaming}
            className="device-select"
          >
            {microphones.map((mic) => (
              <option key={mic.deviceId} value={mic.deviceId}>
                {mic.label || `Microphone ${microphones.indexOf(mic) + 1}`}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="error-message">
            <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
          </div>
        )}

        <div className="stream-info-note">
          <h4>WebRTC Implementation Requirements</h4>
          <p><strong>To enable full WebRTC streaming, you need:</strong></p>
          <ol>
            <li>
              <strong>WebSocket Server:</strong> For signaling (Socket.io, ws library, or external service)
            </li>
            <li>
              <strong>Media Server:</strong> To receive WebRTC and convert to RTMP:
              <ul>
                <li>Janus Gateway (recommended)</li>
                <li>Kurento Media Server</li>
                <li>Custom Node.js server with ffmpeg</li>
                <li>Or use MUX's Wocket approach (WebSocket-based)</li>
              </ul>
            </li>
            <li>
              <strong>STUN/TURN Servers:</strong> For NAT traversal (Google STUN is free)
            </li>
          </ol>
          
          <h4>Quick Start Options:</h4>
          <p>
            <strong>Option 1:</strong> Use OBS Studio (works now) - No additional setup needed
          </p>
          <p>
            <strong>Option 2:</strong> Set up Janus Gateway + WebSocket server (full WebRTC)
          </p>
          <p>
            <strong>Option 3:</strong> Use MUX Wocket approach (WebSocket + server-side conversion)
          </p>
        </div>
      </div>
    </div>
  )
}


