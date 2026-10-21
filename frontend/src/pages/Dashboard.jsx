import { useEffect, useState } from 'react'
import { getStats, getTasks } from '../services/api'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getStats(), getTasks()])
      .then(([s, t]) => {
        setStats(s)
        setTasks(t.slice(0, 5))
      })
      .catch((err) => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading dashboard...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your office</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Employees</div>
          <div className="value">{stats.total_employees}</div>
        </div>
        <div className="stat-card">
          <div className="label">Active</div>
          <div className="value" style={{ color: 'var(--success)' }}>{stats.active_employees}</div>
        </div>
        <div className="stat-card">
          <div className="label">On Leave</div>
          <div className="value" style={{ color: 'var(--warning)' }}>{stats.on_leave}</div>
        </div>
        <div className="stat-card">
          <div className="label">Tasks Completed</div>
          <div className="value">{stats.completed_tasks}/{stats.total_tasks}</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Recent Tasks</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.assignee}</td>
                  <td>
                    <span className={`badge badge-${t.status === 'Completed' ? 'completed' : t.status === 'In Progress' ? 'progress' : 'pending'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{t.due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
