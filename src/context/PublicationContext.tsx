/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

interface PublicationContextValue {
  hiddenProductIds: number[]
  isPublished: (productId: number) => boolean
  togglePublished: (productId: number) => void
  setPublished: (productId: number, published: boolean) => void
}

const STORAGE_KEY = 'omega_hidden_product_ids'

const PublicationContext = createContext<PublicationContextValue | null>(null)

function getStoredHiddenIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as number[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(v => Number.isInteger(v) && v > 0)
  } catch {
    return []
  }
}

export function PublicationProvider({ children }: { children: React.ReactNode }) {
  const [hiddenProductIds, setHiddenProductIds] = useState<number[]>(() => getStoredHiddenIds())

  const persist = useCallback((ids: number[]) => {
    setHiddenProductIds(ids)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [])

  const isPublished = useCallback((productId: number) => {
    return !hiddenProductIds.includes(productId)
  }, [hiddenProductIds])

  const togglePublished = useCallback((productId: number) => {
    const exists = hiddenProductIds.includes(productId)
    const next = exists
      ? hiddenProductIds.filter(id => id !== productId)
      : [...hiddenProductIds, productId]
    persist(next)
  }, [hiddenProductIds, persist])

  const setPublished = useCallback((productId: number, published: boolean) => {
    const exists = hiddenProductIds.includes(productId)
    if (published && exists) {
      persist(hiddenProductIds.filter(id => id !== productId))
      return
    }
    if (!published && !exists) {
      persist([...hiddenProductIds, productId])
    }
  }, [hiddenProductIds, persist])

  const value = useMemo<PublicationContextValue>(() => ({
    hiddenProductIds,
    isPublished,
    togglePublished,
    setPublished,
  }), [hiddenProductIds, isPublished, togglePublished, setPublished])

  return <PublicationContext.Provider value={value}>{children}</PublicationContext.Provider>
}

export function usePublication() {
  const context = useContext(PublicationContext)
  if (!context) throw new Error('usePublication must be used within PublicationProvider')
  return context
}
