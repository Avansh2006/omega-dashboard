import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { FilterState, SortField, SortOrder } from '../types/product'

/** Reads & writes all filter state from the URL search params */
export function useUrlState() {
  const [params, setParams] = useSearchParams()

  const filters: FilterState = {
    search:     params.get('q') ?? '',
    categories: params.get('category') ? params.get('category')!.split(',').filter(Boolean) : [],
    sortField:  (params.get('sort') as SortField) ?? 'title',
    sortOrder:  (params.get('order') as SortOrder) ?? 'asc',
    page:       Number(params.get('page') ?? '1'),
    minRating:  Number(params.get('rating') ?? '0'),
  }

  const setFilters = useCallback((patch: Partial<FilterState>) => {
    setParams(prev => {
      const next = new URLSearchParams(prev)
      const merged = { ...filters, ...patch }

      if (merged.search)              next.set('q', merged.search)
      else                            next.delete('q')
      if (merged.categories.length)   next.set('category', merged.categories.join(','))
      else                            next.delete('category')
      if (merged.sortField !== 'title') next.set('sort', merged.sortField)
      else                            next.delete('sort')
      if (merged.sortOrder !== 'asc') next.set('order', merged.sortOrder)
      else                            next.delete('order')
      if (merged.page > 1)            next.set('page', String(merged.page))
      else                            next.delete('page')
      if (merged.minRating > 0)       next.set('rating', String(merged.minRating))
      else                            next.delete('rating')

      return next
    }, { replace: true })
  }, [params])

  return { filters, setFilters }
}
