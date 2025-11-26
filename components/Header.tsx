'use client'

export default function Header() {
  return (
    <header className="top-header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">S</span>
          <span className="logo-text">SpiceNot</span>
        </div>
        <nav className="header-nav">
          <button className="nav-button active">Home</button>
          <button className="nav-button">Browse</button>
        </nav>
      </div>
      <div className="header-center">
        <div className="search-bar">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input type="text" placeholder="Search SpiceNot..." />
        </div>
      </div>
      <div className="header-right">
        <button className="header-button">Become a Seller</button>
        <div className="header-icons">
          <button className="icon-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 5v8a2 2 0 0 1-2 2h-5l-5 4v-4H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
          <button className="icon-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6zM10 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z"/>
            </svg>
          </button>
          <button className="icon-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3zm0 8a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H3z"/>
            </svg>
          </button>
          <div className="profile-icon">G</div>
        </div>
      </div>
    </header>
  )
}
