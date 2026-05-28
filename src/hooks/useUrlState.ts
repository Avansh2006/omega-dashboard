import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { FilterState, SortField, SortOrder } from '../types/product'

/** Reads & writes all filter state from the URL search params */
export function useUrlState() {
  const [params, setParams] = useSearchParams()

  const filters: FilterState = useMemo(() => ({
    search:     params.get('q') ?? '',
    categories: params.get('category') ? params.get('category')!.split(',').filter(Boolean) : [],
    sortField:  (params.get('sort') as SortField) ?? 'title',
    sortOrder:  (params.get('order') as SortOrder) ?? 'asc',
    page:       Number(params.get('page') ?? '1'),
    minRating:  Number(params.get('rating') ?? '0'),
  }), [params])

  const setFilters = useCallback((patch: Partial<FilterState>) => {
    const merged = { ...filters, ...patch }
    const next = new URLSearchParams()

    if (merged.search) next.set('q', merged.search)
    if (merged.categories && merged.categories.length) next.set('category', merged.categories.join(','))
    if (merged.sortField && merged.sortField !== 'title') next.set('sort', merged.sortField)
    if (merged.sortOrder && merged.sortOrder !== 'asc') next.set('order', merged.sortOrder)
    if (merged.page && merged.page > 1) next.set('page', String(merged.page))
    if (merged.minRating && merged.minRating > 0) next.set('rating', String(merged.minRating))

    setParams(next, { replace: true })
  }, [filters, setParams])

  return { filters, setFilters }
}
