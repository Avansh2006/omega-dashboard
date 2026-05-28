import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProducts'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import StarRating from '../components/UI/StarRating'
import { ChevronLeft, ChevronRight, ArrowLeft, ShieldCheck, Truck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePublication } from '../context/PublicationContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { product, loading, error } = useProduct(Number(id))
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const { user } = useAuth()
  const { isPublished, togglePublished } = usePublication()

  if (loading) return <LoadingSpinner fullPage />
  if (error || !product) {
    return (
      <div className="empty-state">
        <div className="empty-title">Product not found</div>
        <Link to="/products" className="detail-back">
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>
    )
  }

  // If user is not admin and product is unpublished, treat as not found
  if (user?.role !== 'admin' && !isPublished(product.id)) {
    return (
      <div className="empty-state">
        <div className="empty-title">Product not found</div>
        <div className="empty-sub">This product is not available.</div>
        <Link to="/products" className="detail-back">
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>
    )
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail]

  const handlePrevImage = () => {
    setActiveImageIdx(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setActiveImageIdx(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="fade-in">
      <Link to="/products" className="detail-back">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="detail-grid">
        {/* Carousel Block */}
        <div className="carousel-wrapper">
          <div className="carousel-main">
            <img src={images[activeImageIdx]} alt={`${product.title} view`} />
            
            {images.length > 1 && (
              <>
                <button className="carousel-arrow left" onClick={handlePrevImage} aria-label="Previous image">
                  <ChevronLeft size={20} />
                </button>
                <button className="carousel-arrow right" onClick={handleNextImage} aria-label="Next image">
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="carousel-thumbs">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`carousel-thumb${idx === activeImageIdx ? ' active' : ''}`}
                  onClick={() => setActiveImageIdx(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Block */}
        <div className="detail-info">
          <div className="detail-card">
            <div className="detail-brand">{product.brand || 'Generic'}</div>
            <h1 className="detail-title">{product.title}</h1>
            
            <div className="detail-rating-row">
              <StarRating rating={product.rating} size="md" />
              <span className="badge badge-teal">{product.category}</span>
            </div>

            <div className="detail-price-row">
              <span className="detail-price">${product.price.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="detail-original-price">
                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                  </span>
                  <span className="discount-badge">-{product.discountPercentage}% OFF</span>
                </>
              )}
            </div>

            {/* Admin publish toggle */}
            {user?.role === 'admin' && (
              <div style={{ marginTop: 12 }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={isPublished(product.id)} onChange={() => togglePublished(product.id)} />
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{isPublished(product.id) ? 'Published' : 'Hidden'}</span>
                </label>
              </div>
            )}

            <p className="detail-desc">{product.description}</p>
          </div>

          {/* Guarantee Badges / Meta Info */}
          <div className="detail-meta-grid">
            <div className="meta-item">
              <div className="meta-label">Stock Availability</div>
              <div className="meta-value">{product.stock > 0 ? `${product.stock} units left` : 'Out of Stock'}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Min. Order Quantity</div>
              <div className="meta-value">{product.minimumOrderQuantity || 1} units</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Shipping Profile</div>
              <div className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <Truck size={14} className="accent-light" />
                {product.shippingInformation || 'Standard Shipping'}
              </div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Warranty Details</div>
              <div className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <ShieldCheck size={14} className="accent-light" />
                {product.warrantyInformation || 'No Warranty'}
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="detail-card">
            <h2 className="section-title" style={{ marginBottom: '16px' }}>Customer Reviews</h2>
            {product.reviews && product.reviews.length > 0 ? (
              <div className="reviews-list">
                {product.reviews.map((rev, idx) => (
                  <div key={idx} className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">{rev.reviewerName}</span>
                      <span className="review-date">{new Date(rev.date).toLocaleDateString()}</span>
                    </div>
                    <StarRating rating={rev.rating} showNumber={false} />
                    <p className="review-comment">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No reviews have been written for this product yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
