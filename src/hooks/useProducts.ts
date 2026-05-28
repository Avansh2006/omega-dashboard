import { useState, useEffect, useCallback, useRef } from 'react'
import type { Product, Category, ProductsResponse } from '../types/product'

const BASE = 'https://dummyjson.com'
const POLL_INTERVAL = 30_000 // 30 seconds

export function useProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      // Fetch all 194 products (limit 194 so we can filter client-side)
      const [prodRes, catRes] = await Promise.all([
        fetch(`${BASE}/products?limit=194&select=id,title,description,category,price,discountPercentage,rating,stock,brand,sku,thumbnail,images,availabilityStatus,tags,reviews,warrantyInformation,shippingInformation,returnPolicy,minimumOrderQuantity,weight`),
        fetch(`${BASE}/products/categories`),
      ])
      if (!prodRes.ok || !catRes.ok) throw new Error('API error')

      const prodData: ProductsResponse = await prodRes.json()
      const catData: Category[] = await catRes.json()

      setAllProducts(prodData.products)
      setCategories(catData)
      setLastUpdated(new Date())
      setError(null)
    } catch {
      setError('Failed to fetch products. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (cancelled) return
      await fetchAll()
    })()
    return () => { cancelled = true }
  }, [fetchAll])

  // Real-time polling (bonus feature)
  useEffect(() => {
    pollRef.current = setInterval(() => fetchAll(true), POLL_INTERVAL)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [fetchAll])

  const refresh = useCallback(() => fetchAll(false), [fetchAll])

  return { allProducts, categories, loading, error, lastUpdated, refresh }
}

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    fetch(`${BASE}/products/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { if (!cancelled) { setProduct(data); setError(null) } })
      .catch(() => { if (!cancelled) setError('Product not found.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  return { product, loading, error }
}
