import React from 'react'

interface PaginationProps {
  page: number
  total: number
  perPage: number
  onPage: (p: number) => void
}

const Pagination = React.memo(function Pagination({ page, total, perPage, onPage }: PaginationProps) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  const from = (page - 1) * perPage + 1
  const to   = Math.min(page * perPage, total)

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing <strong>{from}–{to}</strong> of <strong>{total}</strong> products
      </span>
      <div className="pagination-controls">
        <button className="page-btn" onClick={() => onPage(page - 1)} disabled={page === 1} aria-label="Previous">‹</button>
        {pages.map((p, i) =>
          p === '...'
            ? <span key={`e${i}`} className="page-btn" style={{ cursor: 'default', border: 'none' }}>…</span>
            : <button
                key={p}
                className={`page-btn${page === p ? ' active' : ''}`}
                onClick={() => onPage(p as number)}
                aria-label={`Page ${p}`}
                aria-current={page === p ? 'page' : undefined}
              >{p}</button>
        )}
        <button className="page-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages} aria-label="Next">›</button>
      </div>
    </div>
  )
})

export default Pagination
