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
    inStock: true,
  },
  {
    id: '2',
    name: 'Wireless Headphones Pro',
    price: 79.99,
    originalPrice: 129.99,
    description: 'Noise cancelling with 30hr battery life',
    category: 'Electronics',
    inStock: true,
  },
  {
    id: '3',
    name: 'Designer Watch Collection',
    price: 199.99,
    originalPrice: 299.99,
    description: 'Luxury timepiece with leather strap',
    category: 'Accessories',
    inStock: true,
  },
  {
    id: '4',
    name: 'Baby Clothes Bundle',
    price: 39.99,
    originalPrice: 59.99,
    description: '5-piece set for newborns, 100% cotton',
    category: 'Baby & Kids',
    inStock: true,
  },
  {
    id: '5',
    name: 'Home Decor Set',
    price: 49.99,
    originalPrice: 79.99,
    description: 'Modern pillows and throws for your living room',
    category: 'Home',
    inStock: true,
  },
  {
    id: '6',
    name: 'EDC Knife Premium',
    price: 129.99,
    originalPrice: 179.99,
    description: 'Titanium handle, razor sharp blade',
    category: 'Knives & EDC',
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
        <div 
          className="product-image-placeholder"
          style={{ background: getGradient(displayProduct.name) }}
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

