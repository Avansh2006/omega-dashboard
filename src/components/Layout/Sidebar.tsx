import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, BarChart2, Settings,
  ChevronLeft, ChevronRight, Bell
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}


export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">N</div>
        <span className="logo-text">Nexus</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>

        <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <LayoutDashboard size={18} className="nav-icon" />
          <span className="nav-label">Dashboard</span>
        </NavLink>

        <NavLink to="/products" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <Package size={18} className="nav-icon" />
          <span className="nav-label">Products</span>
        </NavLink>

        <NavLink to="/?tab=analytics" className="nav-item">
          <BarChart2 size={18} className="nav-icon" />
          <span className="nav-label">Analytics</span>
        </NavLink>

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
          <div className="avatar">AY</div>
          <div className="user-info">
            <div className="user-name">Avansh Yadav</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
