import { useEffect, useState } from 'react'
import { getEmployees, createEmployee, deleteEmployee } from '../services/api'

function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: '', role: '', department: 'Engineering', email: '' })

  const load = () => {
    setLoading(true)
    getEmployees()
      .then(setEmployees)
      .catch((err) => setError(err.message || 'Failed to load employees'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createEmployee(form)
      setForm({ name: '', role: '', department: 'Engineering', email: '' })
      load()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create employee')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return
    try {
      await deleteEmployee(id)
      load()
    } catch {
      alert('Failed to delete')
    }
  }

  if (loading) return <div className="loading">Loading employees...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div>
      <div className="page-header">
        <h1>Employees</h1>
        <p>Manage office staff</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Add Employee</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            />
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            >
              <option>Engineering</option>
              <option>Product</option>
              <option>Design</option>
              <option>Human Resources</option>
              <option>General</option>
            </select>
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Email</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.role}</td>
                  <td>{e.department}</td>
                  <td>{e.email}</td>
                  <td>
                    <span className={`badge ${e.status === 'Active' ? 'badge-active' : 'badge-leave'}`}>
                      {e.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(e.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Employees
