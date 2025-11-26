# SpiceNot - Live Streaming Platform

A modern web application for live streaming built with Next.js 16 and MUX integration. Features a grid layout similar to WhatsApp for viewing multiple live streams simultaneously.

## Features

- 🎥 **Live Streaming**: Create and manage live streams using MUX
- 📱 **Grid Layout**: Beautiful grid view for multiple streams (like WhatsApp)
- 🔄 **Real-time Updates**: Auto-refreshes stream status every 10 seconds
- 🎨 **Modern UI**: Clean, dark-themed interface with smooth animations
- ⚡ **Next.js 16**: Built with the latest Next.js App Router

## Prerequisites

- Node.js 18+ installed
- MUX account with API credentials

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Get your MUX credentials from [MUX Dashboard](https://dashboard.mux.com/settings/access-tokens)
   - Add your `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` to `.env.local`

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating a Live Stream

1. Click the "+ Create New Stream" button
2. A new live stream will be created with:
   - Stream ID
   - Stream Key (for broadcasting)
   - Playback ID (for viewing)

### Broadcasting to a Stream

To broadcast to a stream, you'll need to use the Stream Key with a streaming software like OBS Studio:

1. Open OBS Studio
2. Go to Settings → Stream
3. Set Service to "Custom"
4. Enter the RTMP URL: `rtmp://global-live.mux.com:5222/app/`
5. Enter the Stream Key from the stream details
6. Click "Start Streaming"

### Viewing Streams

- All active streams are displayed in a grid layout
- Stream status is shown with color-coded indicators:
  - 🟢 Green: Active
  - 🟡 Yellow: Idle
  - 🔴 Red: Disconnected
- Click "Show Details" to see stream information including the Stream Key

## Project Structure

```
├── app/
│   ├── api/
│   │   └── live-streams/     # API routes for stream management
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/
│   ├── LiveStreamsGrid.tsx    # Main grid component
│   ├── StreamCard.tsx         # Individual stream card
│   └── CreateStreamButton.tsx # Stream creation button
└── lib/
    └── mux.ts                 # MUX SDK initialization
```

## API Routes

- `GET /api/live-streams` - List all live streams
- `POST /api/live-streams` - Create a new live stream
- `GET /api/live-streams/[id]` - Get a specific stream
- `DELETE /api/live-streams/[id]` - Delete a stream

## Technologies Used

- **Next.js 16**: React framework with App Router
- **MUX**: Live streaming infrastructure
- **TypeScript**: Type-safe development
- **React 18**: UI library

## License

MIT



