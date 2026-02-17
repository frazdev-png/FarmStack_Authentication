import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { setToken } from '../utils/auth'

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('Login attempt with:', { email: formData.email })

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      })
      
      console.log('Login response:', response.data)
      
      // Your backend returns: {"access_token": "xxx", "token_type": "bearer"}
      const token = response.data.access_token
      
      if (!token) {
        throw new Error('No token received from server')
      }
      
      setToken(token)
      console.log('Token saved to localStorage')
      
      onLogin()
      navigate('/dashboard')
      
    } catch (error) {
      console.error('Login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      
      setError(
        error.response?.data?.detail || 
        error.response?.data?.message ||
        'Login failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        
        {/* Debug button - remove in production */}
        <button 
          onClick={async () => {
            try {
              console.log('Testing backend connection...')
              const response = await api.get('/')
              console.log('Backend is reachable:', response.data)
              alert(`Backend is running: ${response.data.message}`)
            } catch (error) {
              console.error('Cannot reach backend:', error.message)
              alert(`Cannot connect to backend: ${error.message}`)
            }
          }}
          style={{
            marginTop: '1rem',
            padding: '0.5rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Test Backend Connection
        </button>
      </div>
    </div>
  )
}

export default Login