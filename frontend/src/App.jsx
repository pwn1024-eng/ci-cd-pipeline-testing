import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Tasks from './pages/Tasks'
import './App.css'

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">🏢</span>
          <span>OfficeHub</span>
        </div>
        <nav>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Dashboard
          </NavLink>
          <NavLink to="/employees" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Employees
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Tasks
          </NavLink>
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
