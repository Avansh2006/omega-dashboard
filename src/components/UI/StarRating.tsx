import React from 'react'

interface StarRatingProps {
  rating: number
  showNumber?: boolean
  size?: 'sm' | 'md'
}

const StarRating = React.memo(function StarRating({ rating, showNumber = true, size = 'sm' }: StarRatingProps) {
  const fontSize = size === 'sm' ? 13 : 16
  return (
    <div className="stars" aria-label={`Rating: ${rating.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={i <= Math.round(rating) ? 'star' : 'star-empty'}
          style={{ fontSize }}
        >★</span>
      ))}
      {showNumber && <span className="rating-num">{rating.toFixed(1)}</span>}
    </div>
  )
})

export default StarRating
