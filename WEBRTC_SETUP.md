# WebRTC Streaming Setup Guide

## Overview

To enable WebRTC streaming from the browser to MUX, you need to set up a media bridge that converts WebRTC streams to RTMP format that MUX accepts.

## Architecture

```
Browser (WebRTC) → Media Server → RTMP → MUX
```

## Option 1: Janus Gateway (Recommended)

### Requirements
- Node.js server
- Janus Gateway (C/C++ media server)
- WebSocket server for signaling

### Setup Steps

1. **Install Janus Gateway**
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install janus janus-dev
   
   # Or build from source
   git clone https://github.com/meetecho/janus-gateway.git
   cd janus-gateway
   ./configure --prefix=/opt/janus
   make && sudo make install
   ```

2. **Configure Janus for RTMP**
   - Edit Janus configuration to enable RTMP plugin
   - Set up RTMP forwarding to MUX endpoint

3. **Create WebSocket Server**
   ```bash
   npm install ws
   ```
   
   Create a WebSocket server that:
   - Handles WebRTC signaling
   - Connects to Janus Gateway
   - Manages peer connections

4. **Update Frontend**
   - Use RTCPeerConnection API
   - Connect to WebSocket server
   - Handle offer/answer exchange

## Option 2: Custom Node.js + FFmpeg

### Requirements
- Node.js server
- FFmpeg installed
- WebSocket library (ws or Socket.io)

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install ws fluent-ffmpeg @ffmpeg-installer/ffmpeg
   ```

2. **Create WebSocket Server**
   ```javascript
   // server/webrtc-server.js
   const WebSocket = require('ws');
   const ffmpeg = require('fluent-ffmpeg');
   const { spawn } = require('child_process');
   
   const wss = new WebSocket.Server({ port: 8080 });
   
   wss.on('connection', (ws) => {
     // Handle WebRTC signaling
     // Convert WebRTC to RTMP using ffmpeg
   });
   ```

3. **FFmpeg Conversion**
   - Receive WebRTC stream
   - Convert to RTMP format
   - Forward to MUX: `rtmp://global-live.mux.com:5222/app/{streamKey}`

## Option 3: MUX Wocket Approach

MUX has a proof-of-concept called "Wocket" that uses WebSockets:

1. Browser captures video using MediaRecorder
2. Sends chunks via WebSocket to server
3. Server converts chunks to RTMP
4. Forwards to MUX RTMP endpoint

### Implementation

```javascript
// Browser side
const recorder = new MediaRecorder(stream);
const ws = new WebSocket('ws://your-server/stream');

recorder.ondataavailable = (event) => {
  if (event.data.size > 0) {
    ws.send(event.data);
  }
};

// Server side
ws.on('message', (chunk) => {
  // Convert WebM chunks to RTMP
  // Forward to MUX
});
```

## Option 4: Use External Service

Services that provide WebRTC-to-RTMP bridges:
- **Agora.io** - Has WebRTC and RTMP conversion
- **Twilio Video** - WebRTC with RTMP output
- **Vonage Video API** - WebRTC streaming
- **100ms** - WebRTC with RTMP support

## Quick Start: Socket.io + FFmpeg

### 1. Install Dependencies

```bash
npm install socket.io fluent-ffmpeg
```

### 2. Create WebSocket Server

```javascript
// server.js (separate from Next.js)
const io = require('socket.io')(3001);
const ffmpeg = require('fluent-ffmpeg');

io.on('connection', (socket) => {
  let ffmpegProcess;
  
  socket.on('start-stream', (streamKey) => {
    const rtmpUrl = `rtmp://global-live.mux.com:5222/app/${streamKey}`;
    
    ffmpegProcess = ffmpeg()
      .input('pipe:0')
      .inputFormat('webm')
      .output(rtmpUrl)
      .outputFormat('flv')
      .run();
  });
  
  socket.on('stream-chunk', (chunk) => {
    if (ffmpegProcess) {
      ffmpegProcess.stdin.write(chunk);
    }
  });
  
  socket.on('stop-stream', () => {
    if (ffmpegProcess) {
      ffmpegProcess.kill();
    }
  });
});
```

### 3. Update Frontend

```javascript
// Use Socket.io client
import io from 'socket.io-client';

const socket = io('http://localhost:3001');
const recorder = new MediaRecorder(stream);

recorder.ondataavailable = (event) => {
  socket.emit('stream-chunk', event.data);
};

socket.emit('start-stream', streamKey);
recorder.start(1000);
```

## STUN/TURN Servers

For NAT traversal, you'll need STUN/TURN servers:

- **Free STUN**: `stun:stun.l.google.com:19302`
- **TURN**: Requires paid service or self-hosted (coturn)

## Current Status

The current implementation includes:
- ✅ Browser media capture (camera/mic)
- ✅ Device selection
- ✅ Preview display
- ⚠️ WebRTC signaling (needs WebSocket server)
- ⚠️ Media conversion (needs media server)

## Next Steps

1. Choose an option (Janus, FFmpeg, or external service)
2. Set up the media server
3. Create WebSocket server for signaling
4. Update the WebRTCStream component to connect to your server
5. Test the full pipeline

## Resources

- [Janus Gateway Documentation](https://janus.conf.meetecho.com/docs/)
- [MUX Wocket GitHub](https://github.com/MuxLabs/wocket)
- [WebRTC API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)


