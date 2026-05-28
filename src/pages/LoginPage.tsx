import { ShieldCheck, UserRound, Sparkles } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()

  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <div className="login-page fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '24px' }}>
      <div className="login-card" style={{ maxWidth: 920, width: '100%', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20, alignItems: 'center', padding: 24 }}>
        <div style={{ padding: 8 }}>
          <div className="login-kicker" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--accent)' }}>
            <Sparkles size={16} />
            <span style={{ fontWeight: 600 }}>Assessment Access Gateway</span>
          </div>

          <h1 className="login-title" style={{ marginTop: 12, marginBottom: 8 }}>Welcome to the Admin Console</h1>
          <p className="login-subtitle" style={{ color: 'var(--text-secondary)', marginBottom: 18 }}>
            Choose a session role to proceed. Admins can view analytics and manage published products; Users can browse published products only.
          </p>

          <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-secondary)', fontSize: 14 }}>
            <li>Product listing with search, filters and sorting</li>
            <li>Product detail pages with carousel and metadata</li>
            <li>Analytics dashboard for Admins</li>
          </ul>

          <div style={{ marginTop: 18, color: 'var(--text-muted)', fontSize: 13 }}>
            Tip: Use the <strong>Customize Columns</strong> button on the Products page to show/hide columns.
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: 18, borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Start Session</div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Pick a role</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,var(--accent),var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Sparkles size={18} />
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <button
              className="login-role-card"
              onClick={() => login('admin')}
              style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'linear-gradient(90deg, rgba(108,99,255,0.06), transparent)', cursor: 'pointer' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ShieldCheck size={18} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>Admin View</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Access analytics, full product list, and publish controls.</div>
              </div>
            </button>

            <button
              className="login-role-card"
              onClick={() => login('user')}
              style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <UserRound size={18} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>User View</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Browse published products and view product details.</div>
              </div>
            </button>
          </div>

          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--text-muted)' }}>
            Session is stored locally in your browser. To switch roles, click the avatar and logout.
          </div>
        </div>
      </div>
    </div>
  )
}
