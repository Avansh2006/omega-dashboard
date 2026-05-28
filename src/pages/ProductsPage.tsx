import { useState, useMemo, useCallback, useEffect } from 'react'
import type { SortField, SortOrder } from '../types/product'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useUrlState } from '../hooks/useUrlState'
import { useDebounce } from '../hooks/useDebounce'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import StarRating from '../components/UI/StarRating'
import Pagination from '../components/UI/Pagination'
import { Search, SlidersHorizontal, ArrowUpDown, MoveLeft, MoveRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePublication } from '../context/PublicationContext'

interface Column {
  id: string
  label: string
  visible: boolean
}

export default function ProductsPage() {
  const navigate = useNavigate()
  const { allProducts, categories, loading, error } = useProducts()
  const { filters, setFilters } = useUrlState()

  // For debounced search inputs
  const [searchInput, setSearchInput] = useState(filters.search)

  // Sync state search input when URL changes
  useEffect(() => {
    const t = setTimeout(() => setSearchInput(filters.search), 0)
    return () => clearTimeout(t)
  }, [filters.search])

  const debouncedSearch = useDebounce(searchInput, 400)

  // Sync debounced search to URL
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch, page: 1 })
    }
  }, [debouncedSearch, filters.search, setFilters])

  // Column customization state (Bonus requirement 2: Column customisation)
  const [columns, setColumns] = useState<Column[]>([
    { id: 'image', label: 'Image', visible: true },
    { id: 'name', label: 'Product Name', visible: true },
    { id: 'category', label: 'Category', visible: true },
    { id: 'price', label: 'Price', visible: true },
    { id: 'stock', label: 'Stock Status', visible: true },
    { id: 'rating', label: 'Rating', visible: true },
  ])

  const [showColPanel, setShowColPanel] = useState(false)

  // Toggle Visibility
  const toggleColumnVisibility = useCallback((id: string) => {
    setColumns(prev => prev.map(c => c.id === id ? { ...c, visible: !c.visible } : c))
  }, [])

  // Reorder Column (Shift Up/Down or Left/Right)
  const moveColumn = useCallback((index: number, direction: 'left' | 'right') => {
    setColumns(prev => {
      const next = [...prev]
      const targetIndex = direction === 'left' ? index - 1 : index + 1
      if (targetIndex >= 0 && targetIndex < next.length) {
        const temp = next[index]
        next[index] = next[targetIndex]
        next[targetIndex] = temp
      }
      return next
    })
  }, [])

  // Handle category chip click (Multi-category selection)
  const toggleCategory = useCallback((slug: string) => {
    const isSelected = filters.categories.includes(slug)
    const nextCategories = isSelected
      ? filters.categories.filter(c => c !== slug)
      : [...filters.categories, slug]
    setFilters({ categories: nextCategories, page: 1 })
  }, [filters.categories, setFilters])

  // Sorting handlers
  const handleSort = useCallback((field: SortField) => {
    const isSameField = filters.sortField === field
    const nextOrder = isSameField && filters.sortOrder === 'asc' ? 'desc' : 'asc'
    setFilters({ sortField: field, sortOrder: nextOrder })
  }, [filters.sortField, filters.sortOrder, setFilters])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      categories: [],
      sortField: 'title',
      sortOrder: 'asc',
      page: 1,
      minRating: 0
    })
    setSearchInput('')
  }, [setFilters])

  // Filtered & Sorted Products
  const processedProducts = useMemo(() => {
    let result = [...allProducts]

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase()
      result = result.filter(
        p => p.title.toLowerCase().includes(query) || p.brand?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category))
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter(p => p.rating >= filters.minRating)
    }

    // Sorting using explicit field accessor to avoid `any`
    const getField = (item: typeof result[0], field: SortField) => {
      switch (field) {
        case 'title': return String(item.title ?? '').toLowerCase()
        case 'price': return Number(item.price ?? 0)
        case 'rating': return Number(item.rating ?? 0)
        case 'stock': return Number(item.stock ?? 0)
        default: return String(item.title ?? '').toLowerCase()
      }
    }

    result.sort((a, b) => {
      const aVal = getField(a, filters.sortField)
      const bVal = getField(b, filters.sortField)

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1
        return 0
      }

      const na = Number(aVal)
      const nb = Number(bVal)
      if (na < nb) return filters.sortOrder === 'asc' ? -1 : 1
      if (na > nb) return filters.sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [allProducts, filters.search, filters.categories, filters.minRating, filters.sortField, filters.sortOrder])

  // Enforce published-only visibility for non-admins
  const { user } = useAuth()
  const { isPublished, togglePublished } = usePublication()

  const visibleProducts = useMemo(() => {
    if (user?.role === 'admin') return processedProducts
    return processedProducts.filter(p => isPublished(p.id))
  }, [processedProducts, user, isPublished])

  // Pagination bounds
  const itemsPerPage = 8
  const paginatedProducts = useMemo(() => {
    const start = (filters.page - 1) * itemsPerPage
    return visibleProducts.slice(start, start + itemsPerPage)
  }, [visibleProducts, filters.page])

  // Stock badge helper
  const getStockBadge = (stock: number) => {
    if (stock === 0) return <span className="badge badge-red">Out of Stock</span>
    if (stock < 10) return <span className="badge badge-amber">Low Stock ({stock})</span>
    return <span className="badge badge-green">In Stock ({stock})</span>
  }

  if (loading && !allProducts.length) return <LoadingSpinner fullPage />
  if (error) return <div className="empty-state"><div className="empty-title">{error}</div></div>

  return (
    <div className="fade-in">
      <div className="products-header">
        <div>
          <h1 className="page-title">Product Catalog</h1>
          <p className="page-subtitle">Manage listings, customize views and monitor inventory</p>
        </div>

        <button className="filter-btn" onClick={() => setShowColPanel(!showColPanel)}>
          <SlidersHorizontal size={16} />
          Customize Columns
        </button>
      </div>

      {/* Column Customizer Panel */}
      {showColPanel && (
        <div className="col-toggle-panel fade-in">
          {columns.map((col, idx) => (
            <div key={col.id} className="col-toggle-item" style={{ justifyContent: 'space-between', width: '100%' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={col.visible}
                  onChange={() => toggleColumnVisibility(col.id)}
                />
                <span>{col.label}</span>
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  disabled={idx === 0}
                  onClick={() => moveColumn(idx, 'left')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <MoveLeft size={14} />
                </button>
                <button
                  disabled={idx === columns.length - 1}
                  onClick={() => moveColumn(idx, 'right')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <MoveRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters & Search */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search products, brands..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>

        <select
          className="select-input"
          value={filters.minRating}
          onChange={e => setFilters({ minRating: Number(e.target.value), page: 1 })}
        >
          <option value="0">All Ratings</option>
          <option value="4">4.0+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>

        <select
          className="select-input"
          value={`${filters.sortField}-${filters.sortOrder}`}
          onChange={e => {
            const [field, order] = e.target.value.split('-')
            setFilters({ sortField: field as unknown as SortField, sortOrder: order as unknown as SortOrder })
          }}
        >
          <option value="title-asc">Sort: A-Z</option>
          <option value="title-desc">Sort: Z-A</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
          <option value="stock-desc">Stock: High to Low</option>
        </select>

        {(filters.search || filters.categories.length > 0 || filters.minRating > 0) && (
          <button className="filter-btn active" onClick={resetFilters}>
            Clear All Filters
          </button>
        )}
      </div>

      {/* Category Selection Chips */}
      <div className="category-chips">
        {categories.map(cat => {
          const isSelected = filters.categories.includes(cat.slug)
          return (
            <button
              key={cat.slug}
              className={`chip${isSelected ? ' selected' : ''}`}
              onClick={() => toggleCategory(cat.slug)}
            >
              {cat.name}
            </button>
          )
        })}
      </div>

      {/* Table grid wrapper */}
      <div className="table-wrapper">
        {paginatedProducts.length === 0 ? (
          <div className="empty-state">
            <Search size={48} />
            <div className="empty-title">No products found</div>
            <div className="empty-sub">Try adjusting your filters or search query</div>
          </div>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                {columns.map(col => {
                  if (!col.visible) return null
                  const isSortable = ['name', 'price', 'rating', 'stock'].includes(col.id)
                  const isSorted = filters.sortField === (col.id === 'name' ? 'title' : col.id)
                  
                  return (
                    <th
                      key={col.id}
                      className={isSortable ? `th-sortable${isSorted ? ' sorted' : ''}` : undefined}
                      onClick={isSortable ? () => handleSort((col.id === 'name' ? 'title' : col.id) as SortField) : undefined}
                    >
                      <div className="th-inner">
                        <span>{col.label}</span>
                        {isSortable && <ArrowUpDown size={12} style={{ opacity: isSorted ? 1 : 0.4 }} />}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map(p => (
                <tr key={p.id} onClick={() => navigate(`/products/${p.id}`)}>
                  {columns.map(col => {
                    if (!col.visible) return null
                    switch (col.id) {
                      case 'image':
                        return (
                          <td key={col.id}>
                            <img src={p.thumbnail} alt={p.title} className="product-img" loading="lazy" />
                          </td>
                        )
                      case 'name':
                        return (
                          <td key={col.id}>
                            <div className="product-name-cell">
                              <div>
                                <div className="product-name-text">{p.title}</div>
                                <div className="product-sku">{p.sku}</div>
                              </div>
                            </div>
                          </td>
                        )
                      case 'category':
                        return (
                          <td key={col.id}>
                            <span className="badge badge-blue">{p.category}</span>
                          </td>
                        )
                      case 'price':
                        return (
                          <td key={col.id} className="price-cell">
                            ${p.price.toFixed(2)}
                          </td>
                        )
                      case 'stock':
                        return (
                          <td key={col.id}>
                            {getStockBadge(p.stock)}
                          </td>
                        )
                      case 'rating':
                        return (
                          <td key={col.id}>
                            <StarRating rating={p.rating} />
                          </td>
                        )
                      default:
                        return null
                    }
                  })}
                  {/* Admin publish toggle column */}
                  {user?.role === 'admin' && (
                    <td key="publish">
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isPublished(p.id)}
                          onChange={() => togglePublished(p.id)}
                        />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{isPublished(p.id) ? 'Published' : 'Hidden'}</span>
                      </label>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Pagination
          page={filters.page}
          total={visibleProducts.length}
          perPage={itemsPerPage}
          onPage={p => setFilters({ page: p })}
        />
      </div>
    </div>
  )
}
