import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/UI/LoadingSpinner'
import { useAuth } from './context/AuthContext'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/products" replace />
  return <>{children}</>
}

export default function App() {
  const { user, isAuthenticated } = useAuth()

  const defaultRoute = !isAuthenticated
    ? '/login'
    : user?.role === 'admin'
      ? '/dashboard'
      : '/products'

  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to={defaultRoute} replace /> : <LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Navigate to={defaultRoute} replace />
            </ProtectedLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <AdminOnly>
                <DashboardPage />
              </AdminOnly>
            </ProtectedLayout>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedLayout>
              <ProductsPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProtectedLayout>
              <ProductDetailPage />
            </ProtectedLayout>
          }
        />

        <Route path="*" element={<Navigate to={defaultRoute} replace />} />
      </Routes>
    </Suspense>
  )
}
