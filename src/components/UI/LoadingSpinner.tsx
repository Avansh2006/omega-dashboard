interface LoadingSpinnerProps {
  fullPage?: boolean
  size?: number
}

export default function LoadingSpinner({ fullPage, size = 40 }: LoadingSpinnerProps) {
  return (
    <div className={`spinner-wrap${fullPage ? ' full-page' : ''}`}>
      <div
        className="spinner"
        style={{ width: size, height: size }}
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}
