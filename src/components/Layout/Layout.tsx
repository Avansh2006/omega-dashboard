import { useState, useCallback } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useProducts } from '../../hooks/useProducts'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { lastUpdated, refresh } = useProducts()

  const handleToggle = useCallback(() => setCollapsed(c => !c), [])
  const handleMobileToggle = useCallback(() => setMobileOpen(o => !o), [])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await refresh()
    setTimeout(() => setIsRefreshing(false), 800)
  }, [refresh])

  return (
    <div className="layout">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay${mobileOpen ? ' visible' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggle}
      />

      <div className={`main-wrapper${collapsed ? ' sidebar-collapsed' : ''}`}>
        <Topbar
          collapsed={collapsed}
          onMobileMenuToggle={handleMobileToggle}
          lastUpdated={lastUpdated}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        <main className="page-content fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
