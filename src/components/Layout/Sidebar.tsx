import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, BarChart2, Settings,
  ChevronLeft, ChevronRight, Bell
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface SidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onToggle: () => void
  onNavigate: () => void
}


export default function Sidebar({ collapsed, mobileOpen, onToggle, onNavigate }: SidebarProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">N</div>
        <span className="logo-text">Nexus</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>

        {isAdmin && (
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} onClick={onNavigate}>
            <LayoutDashboard size={18} className="nav-icon" />
            <span className="nav-label">Dashboard</span>
          </NavLink>
        )}

        <NavLink to="/products" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} onClick={onNavigate}>
          <Package size={18} className="nav-icon" />
          <span className="nav-label">Products</span>
        </NavLink>

        {isAdmin && (
          <NavLink to="/dashboard" className="nav-item" onClick={onNavigate}>
            <BarChart2 size={18} className="nav-icon" />
            <span className="nav-label">Analytics</span>
          </NavLink>
        )}

        <div className="nav-section-label" style={{ marginTop: 12 }}>System</div>

        <div className="nav-item" style={{ cursor: 'default', opacity: 0.5 }}>
          <Bell size={18} className="nav-icon" />
          <span className="nav-label">Notifications</span>
        </div>

        <div className="nav-item" style={{ cursor: 'default', opacity: 0.5 }}>
          <Settings size={18} className="nav-icon" />
          <span className="nav-label">Settings</span>
        </div>
      </nav>

      {/* Collapse toggle */}
      <button className="collapse-btn" onClick={onToggle} aria-label="Toggle sidebar">
        {collapsed
          ? <ChevronRight size={16} />
          : <><ChevronLeft size={16} /><span className="nav-label">Collapse</span></>
        }
      </button>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar">{user?.initials ?? 'NA'}</div>
          <div className="user-info">
            <div className="user-name">{user?.name ?? 'Guest'}</div>
            <div className="user-role">{isAdmin ? 'Administrator' : 'Standard User'}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
