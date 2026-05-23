import { Bell, RefreshCw } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface TopbarProps {
  collapsed: boolean
  onMobileMenuToggle: () => void
  lastUpdated: Date | null
  onRefresh: () => void
  isRefreshing: boolean
}

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/products': 'Products',
}

export default function Topbar({
  collapsed, onMobileMenuToggle, lastUpdated, onRefresh, isRefreshing
}: TopbarProps) {
  const location = useLocation()
  const basePath = '/' + location.pathname.split('/')[1]
  const title = location.pathname.startsWith('/products/') ? 'Product Detail'
    : pageTitles[basePath] ?? 'Dashboard'

  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--'

  return (
    <header className={`topbar${collapsed ? ' sidebar-collapsed' : ''}`}>
      <div className="topbar-left">
        {/* Mobile hamburger */}
        <button
          className="hamburger"
          onClick={onMobileMenuToggle}
          aria-label="Open menu"
        >
          <span /><span /><span />
        </button>

        <div>
          <div className="topbar-title">{title}</div>
          <div className="topbar-breadcrumb">
            <span>Nexus</span>
            <span className="breadcrumb-sep">›</span>
            <span>{title}</span>
          </div>
        </div>
      </div>

      <div className="topbar-right">
        {/* Live badge */}
        <div className="live-badge">
          <div className="live-dot" />
          <span>Live • {timeStr}</span>
        </div>

        {/* Refresh */}
        <button
          className="icon-btn"
          onClick={onRefresh}
          title="Refresh data"
          aria-label="Refresh"
          style={{ color: isRefreshing ? 'var(--accent)' : undefined }}
        >
          <RefreshCw
            size={16}
            style={{
              animation: isRefreshing ? 'spin 0.7s linear infinite' : 'none',
            }}
          />
        </button>

        {/* Notifications */}
        <div className="icon-btn" aria-label="Notifications">
          <Bell size={16} />
          <span className="notif-dot" />
        </div>

        {/* Avatar */}
        <div className="avatar" style={{ cursor: 'pointer' }}>AY</div>
      </div>
    </header>
  )
}
