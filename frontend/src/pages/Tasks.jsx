import { useEffect, useState } from 'react'
import { getTasks, createTask } from '../services/api'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ title: '', assignee: '', status: 'Pending', due_date: '' })

  const load = () => {
    setLoading(true)
    getTasks()
      .then(setTasks)
      .catch((err) => setError(err.message || 'Failed to load tasks'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createTask(form)
      setForm({ title: '', assignee: '', status: 'Pending', due_date: '' })
      load()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create task')
    }
  }

  if (loading) return <div className="loading">Loading tasks...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div>
      <div className="page-header">
        <h1>Tasks</h1>
        <p>Track office work</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Add Task</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              style={{ minWidth: 220 }}
            />
            <input
              placeholder="Assignee"
              value={form.assignee}
              onChange={(e) => setForm({ ...form, assignee: e.target.value })}
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            />
            <button type="submit" className="btn btn-primary">Add Task</button>
          </div>
        </form>
      </div>

      <div className="card">
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
                  <td><strong>{t.title}</strong></td>
                  <td>{t.assignee}</td>
                  <td>
                    <span className={`badge badge-${t.status === 'Completed' ? 'completed' : t.status === 'In Progress' ? 'progress' : 'pending'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{t.due_date || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Tasks
