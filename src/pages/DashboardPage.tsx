import { useMemo } from 'react'
import { useProducts } from '../hooks/useProducts'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { Package, Star, DollarSign, Folder } from 'lucide-react'
import StarRating from '../components/UI/StarRating'

export default function DashboardPage() {
  const { allProducts, loading, error } = useProducts()

  const stats = useMemo(() => {
    if (!allProducts.length) return null

    const totalProducts = allProducts.length
    const totalRating = allProducts.reduce((acc, p) => acc + p.rating, 0)
    const avgRating = totalRating / totalProducts
    
    // Total Inventory Value = Sum of (price * stock)
    const totalInventoryValue = allProducts.reduce((acc, p) => acc + (p.price * p.stock), 0)

    // Category distribution
    const catMap: Record<string, number> = {}
    allProducts.forEach(p => {
      catMap[p.category] = (catMap[p.category] || 0) + 1
    })

    const categoryDistribution = Object.keys(catMap).map(name => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: catMap[name]
    })).sort((a, b) => b.value - a.value).slice(0, 8) // top 8 categories

    // Price brackets for inventory value by bracket
    const brackets = {
      'Under $20': 0,
      '$20 - $50': 0,
      '$50 - $100': 0,
      'Over $100': 0
    }
    allProducts.forEach(p => {
      if (p.price < 20) brackets['Under $20']++
      else if (p.price <= 50) brackets['$20 - $50']++
      else if (p.price <= 100) brackets['$50 - $100']++
      else brackets['Over $100']++
    })
    const priceRangeDistribution = Object.keys(brackets).map(range => ({
      range,
      count: brackets[range as keyof typeof brackets]
    }))

    return {
      totalProducts,
      avgRating,
      totalInventoryValue,
      categoryDistribution,
      priceRangeDistribution
    }
  }, [allProducts])

  if (loading) return <LoadingSpinner fullPage />
  if (error) return <div className="empty-state"><div className="empty-title">{error}</div></div>
  if (!stats) return null

  const COLORS = ['#6c63ff', '#00d2b4', '#f59e0b', '#f43f5e', '#10b981', '#a855f7', '#3b82f6', '#ec4899']

  return (
    <div className="fade-in">
      <div className="section-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">Real-time system health and analytics report</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card accent">
          <div className="stat-header">
            <span className="stat-label">Total Products</span>
            <div className="stat-icon accent">
              <Package size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.totalProducts}</div>
          <div className="stat-delta up">
            <span>Active catalog items</span>
          </div>
        </div>

        <div className="stat-card teal">
          <div className="stat-header">
            <span className="stat-label">Average Rating</span>
            <div className="stat-icon teal">
              <Star size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.avgRating.toFixed(2)}</div>
          <div className="stat-delta up">
            <StarRating rating={stats.avgRating} showNumber={false} />
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-header">
            <span className="stat-label">Total Inventory Value</span>
            <div className="stat-icon amber">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-value">${stats.totalInventoryValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div className="stat-delta up">
            <span>Asset net worth</span>
          </div>
        </div>

        <div className="stat-card rose">
          <div className="stat-header">
            <span className="stat-label">Unique Categories</span>
            <div className="stat-icon rose">
              <Folder size={20} />
            </div>
          </div>
          <div className="stat-value">{Object.keys(allProducts.reduce((acc, p) => ({...acc, [p.category]: true}), {})).length}</div>
          <div className="stat-delta up">
            <span>Diverse catalog verticals</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Category Distribution</div>
              <div className="chart-subtitle">Top product categories by volume</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categoryDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '16px' }}>
            {stats.categoryDistribution.map((entry, idx) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length] }} />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Price Range Demographics</div>
              <div className="chart-subtitle">Product density mapped to pricing tiers</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={stats.priceRangeDistribution}>
                <XAxis dataKey="range" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]}>
                  {stats.priceRangeDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--accent)' : 'var(--teal)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
