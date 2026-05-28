import { ShieldCheck, UserRound, Sparkles } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()

  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <div className="login-page fade-in">
      <div className="login-card">
        <div className="login-kicker">
          <Sparkles size={14} />
          <span>Assessment Access Gateway</span>
        </div>
        <h1 className="login-title">Choose Session Role</h1>
        <p className="login-subtitle">
          Select a profile to continue. Admin has full controls, while User is restricted to published products only.
        </p>

        <div className="login-actions">
          <button className="login-role-card" onClick={() => login('admin')}>
            <div className="login-role-icon admin"><ShieldCheck size={20} /></div>
            <div>
              <div className="login-role-title">Admin View</div>
              <div className="login-role-desc">Access analytics, all products, and publish visibility controls.</div>
            </div>
          </button>

          <button className="login-role-card" onClick={() => login('user')}>
            <div className="login-role-icon user"><UserRound size={20} /></div>
            <div>
              <div className="login-role-title">User View</div>
              <div className="login-role-desc">Access product list and detail pages for published products only.</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
