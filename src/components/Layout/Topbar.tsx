import { Bell, RefreshCw, LogOut } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

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
  const navigate = useNavigate()
  const { logout, user } = useAuth()
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="avatar" style={{ cursor: 'default' }}>{user?.initials ?? 'NA'}</div>
          <button
            className="icon-btn"
            title="Logout"
            aria-label="Logout"
            onClick={() => { logout(); navigate('/login', { replace: true }) }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
