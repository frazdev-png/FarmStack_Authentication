import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import { isAuthenticated, logout } from './utils/auth'
import './index.css'

function App() {
  const [auth, setAuth] = useState(isAuthenticated())

  useEffect(() => {
    setAuth(isAuthenticated())
  }, [])

  const handleLogout = () => {
    logout()
    setAuth(false)
    window.location.href = '/login'
  }

  return (
    <div className="app">
      {auth && <Navbar onLogout={handleLogout} />}
      <main>
        <Routes>
          <Route path="/login" element={
            auth ? <Navigate to="/dashboard" /> : <Login onLogin={() => setAuth(true)} />
          } />
          <Route path="/signup" element={
            auth ? <Navigate to="/dashboard" /> : <Signup />
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          {/* Add a catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App