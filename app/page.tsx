import LiveStreamsGrid from '@/components/LiveStreamsGrid'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="main-content">
          <LiveStreamsGrid />
        </main>
      </div>
    </div>
  )
}
