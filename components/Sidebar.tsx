'use client'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-greeting">
        <p>Hello user!</p>
      </div>
      <nav className="sidebar-nav">
        <a href="#" className="sidebar-link active">For You</a>
        <a href="#" className="sidebar-link">Followed Sellers</a>
      </nav>
      <div className="sidebar-categories">
        <h3 className="categories-title">Categories</h3>
        <nav className="categories-nav">
          <a href="#" className="category-link">Tools</a>
          <a href="#" className="category-link">Electronics</a>
          <a href="#" className="category-link">Everyday Electronics</a>
          <a href="#" className="category-link">Baby & Kids</a>
          <a href="#" className="category-link">Knives & EDC</a>
          <a href="#" className="category-link">Knives & Hunting</a>
          <a href="#" className="category-link">Pallets</a>
          <a href="#" className="category-link">Wholesale</a>
        </nav>
      </div>
      <div className="sidebar-footer">
        <div className="footer-links">
          <a href="#">Blog</a>
          <a href="#">Careers</a>
          <a href="#">About Us</a>
          <a href="#">FAQ</a>
        </div>
        <div className="footer-links">
          <a href="#">SpiceNot Partner</a>
        </div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Contact</a>
        </div>
        <div className="language-selector">
          <span>English</span>
        </div>
      </div>
    </aside>
  )
}
