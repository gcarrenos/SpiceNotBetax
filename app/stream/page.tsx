import StreamPage from '@/components/StreamPage'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function Stream() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="main-content">
          <StreamPage />
        </main>
      </div>
    </div>
  )
}

