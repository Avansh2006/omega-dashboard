// src/types/product.ts
export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  sku: string
  availabilityStatus: string
  images: string[]
  thumbnail: string
  reviews: Review[]
  warrantyInformation: string
  shippingInformation: string
  returnPolicy: string
  minimumOrderQuantity: number
  weight: number
  dimensions: { width: number; height: number; depth: number }
  meta: { createdAt: string; updatedAt: string; barcode: string; qrCode: string }
}

export interface Review {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface Category {
  slug: string
  name: string
  url: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export type SortField = 'title' | 'price' | 'rating' | 'stock'
export type SortOrder = 'asc' | 'desc'

export interface FilterState {
  search: string
  categories: string[]
  sortField: SortField
  sortOrder: SortOrder
  page: number
  minRating: number
}
