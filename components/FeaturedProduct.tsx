'use client'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image?: string
  description?: string
  category?: string
  inStock: boolean
}

interface FeaturedProductProps {
  product?: Product
}

// Fake products for demonstration
const FAKE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Power Tool Set',
    price: 89.99,
    originalPrice: 149.99,
    description: 'Complete set with 20+ pieces including drill, saw, and accessories',
    category: 'Tools',
    image: 'https://d3k81ch9hvuctc.cloudfront.net/company/W9UExK/images/070a8ce1-67ef-4e3c-972c-04639568e9d3.jpeg',
    inStock: true,
  },
  {
    id: '2',
    name: 'Wireless Headphones Pro',
    price: 79.99,
    originalPrice: 129.99,
    description: 'Noise cancelling with 30hr battery life',
    category: 'Electronics',
    image: 'https://cdn11.bigcommerce.com/s-562ee/images/stencil/960w/products/106/1422/psColors__13805.1733337679.jpg?c=2',
    inStock: true,
  },
  {
    id: '3',
    name: 'Designer Watch Collection',
    price: 199.99,
    originalPrice: 299.99,
    description: 'Luxury timepiece with leather strap',
    category: 'Accessories',
    image: 'https://cdn11.bigcommerce.com/s-562ee/images/stencil/1280x1280/products/96/1283/spvzAllcolors2000x2000__26676.1748364797.png?c=2',
    inStock: true,
  },
  {
    id: '4',
    name: 'Surviv-All Premium',
    price: 39.99,
    originalPrice: 59.99,
    description: 'Premium quality product for everyday use',
    category: 'Featured',
    image: 'https://cdn11.bigcommerce.com/s-562ee/images/stencil/960w/products/93/762/_Surviv-All_MAIN_IMAGE__39274.1681928166.jpg?c=2',
    inStock: true,
  },
  {
    id: '5',
    name: 'Home Decor Set',
    price: 49.99,
    originalPrice: 79.99,
    description: 'Modern pillows and throws for your living room',
    category: 'Home',
    image: 'https://d3k81ch9hvuctc.cloudfront.net/company/W9UExK/images/070a8ce1-67ef-4e3c-972c-04639568e9d3.jpeg',
    inStock: true,
  },
  {
    id: '6',
    name: 'EDC Knife Premium',
    price: 129.99,
    originalPrice: 179.99,
    description: 'Titanium handle, razor sharp blade',
    category: 'Knives & EDC',
    image: 'https://cdn11.bigcommerce.com/s-562ee/images/stencil/960w/products/106/1422/psColors__13805.1733337679.jpg?c=2',
    inStock: true,
  },
]

export default function FeaturedProduct({ product }: FeaturedProductProps) {
  // If no product provided, use a random fake product
  const displayProduct = product || FAKE_PRODUCTS[Math.floor(Math.random() * FAKE_PRODUCTS.length)]

  const discount = displayProduct.originalPrice
    ? Math.round(((displayProduct.originalPrice - displayProduct.price) / displayProduct.originalPrice) * 100)
    : 0

  // Generate gradient based on product name
  const getGradient = (name: string) => {
    const gradients = [
      'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
      'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
      'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    ]
    const index = name.length % gradients.length
    return gradients[index]
  }

  return (
    <div className="featured-product-card">
      <div className="product-header">
        <h3>Featured Product</h3>
        <span className="live-badge-small">🔴 LIVE</span>
      </div>

      <div className="product-image-container">
        {displayProduct.image ? (
          <img 
            src={displayProduct.image} 
            alt={displayProduct.name}
            className="product-image"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const placeholder = target.nextElementSibling as HTMLElement
              if (placeholder) placeholder.style.display = 'flex'
            }}
          />
        ) : null}
        <div 
          className="product-image-placeholder"
          style={{ 
            background: displayProduct.image ? 'transparent' : getGradient(displayProduct.name),
            display: displayProduct.image ? 'none' : 'flex'
          }}
        >
          <div className="product-image-content">
            <div className="product-icon">🛍️</div>
            <div className="product-name-overlay">{displayProduct.name}</div>
          </div>
        </div>
        {discount > 0 && (
          <div className="discount-badge">
            -{discount}%
          </div>
        )}
      </div>

      <div className="product-info">
        <div className="product-category">{displayProduct.category || 'Featured'}</div>
        <h4 className="product-title">{displayProduct.name}</h4>
        {displayProduct.description && (
          <p className="product-description">{displayProduct.description}</p>
        )}

        <div className="product-pricing">
          {displayProduct.originalPrice && (
            <span className="original-price">${displayProduct.originalPrice.toFixed(2)}</span>
          )}
          <span className="current-price">${displayProduct.price.toFixed(2)}</span>
        </div>

        <div className="product-stock">
          {displayProduct.inStock ? (
            <span className="in-stock">✓ In Stock</span>
          ) : (
            <span className="out-of-stock">✗ Out of Stock</span>
          )}
        </div>

        <button className="buy-now-button">
          Buy Now
        </button>
        <button className="add-to-cart-button">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

