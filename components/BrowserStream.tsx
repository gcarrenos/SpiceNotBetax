'use client'

import { useState, useRef, useEffect } from 'react'

interface BrowserStreamProps {
  streamKey: string
  onStreamStart?: () => void
  onStreamStop?: () => void
}

export default function BrowserStream({ streamKey, onStreamStart, onStreamStop }: BrowserStreamProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>('')
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const websocketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Get available devices
    navigator.mediaDevices.enumerateDevices().then((deviceList) => {
      setDevices(deviceList)
      const cameras = deviceList.filter(d => d.kind === 'videoinput')
      const mics = deviceList.filter(d => d.kind === 'audioinput')
      if (cameras.length > 0) setSelectedCamera(cameras[0].deviceId)
      if (mics.length > 0) setSelectedMicrophone(mics[0].deviceId)
    })
  }, [])

  const startStream = async () => {
    try {
      setError(null)
      
      // Get user media with selected devices
      const constraints: MediaStreamConstraints = {
        video: selectedCamera 
          ? { deviceId: { exact: selectedCamera } }
          : true,
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

      // For browser streaming to MUX RTMP, we need to use WebRTC or a service
      // Since direct RTMP from browser isn't possible, we'll use a WebSocket approach
      // or use MUX's WebRTC ingest if available
      
      // Alternative: Use MediaRecorder to record and send chunks
      // For now, we'll show a message that browser streaming requires WebRTC setup
      
      setIsStreaming(true)
      onStreamStart?.()

      // Note: Direct browser-to-RTMP streaming requires a WebRTC gateway
      // For production, you'd need to set up a WebRTC-to-RTMP bridge service
      setError('Browser streaming requires WebRTC setup. Please use OBS Studio for RTMP streaming, or we can implement WebRTC streaming.')
      
    } catch (err: any) {
      setError(`Failed to start stream: ${err.message}`)
      console.error('Error starting stream:', err)
    }
  }

  const stopStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }

    if (websocketRef.current) {
      websocketRef.current.close()
      websocketRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsStreaming(false)
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
              🎥 Start Streaming
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
      </div>

      <div className="stream-settings">
        <h3>Stream Settings</h3>
        
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
            {error}
          </div>
        )}

        <div className="stream-info-note">
          <h4>Note about Browser Streaming</h4>
          <p>
            Direct browser-to-RTMP streaming requires additional infrastructure. 
            For now, please use OBS Studio with the RTMP URL and Stream Key provided above.
          </p>
          <p>
            We can implement WebRTC streaming if you'd like - this would allow direct browser streaming
            but requires setting up a WebRTC-to-RTMP bridge service.
          </p>
        </div>
      </div>
    </div>
  )
}


