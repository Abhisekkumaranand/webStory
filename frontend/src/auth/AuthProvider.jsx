import React, { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token')
    console.log('AuthProvider init token:', t)
    return t || null
  })
  const [user, setUser] = useState(() => {
    try {
      const t = localStorage.getItem('token')
      if (t) {
        const decoded = jwtDecode(t)
        console.log('AuthProvider init user:', decoded)
        return decoded
      }
      return null
    } catch (err) {
      console.error('AuthProvider init decode error:', err)
      return null
    }
  })

  useEffect(() => {
    console.log('AuthProvider useEffect token:', token)
    if (token) {
      localStorage.setItem('token', token)
      try {
        const decoded = jwtDecode(token)
        console.log('AuthProvider useEffect decoded user:', decoded)
        setUser(decoded)
      } catch (err) {
        console.error('AuthProvider useEffect decode error:', err)
        setUser(null)
      }
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token])

  const login = (newToken) => {
    console.log('AuthProvider login called with token:', newToken)
    setToken(newToken)
  }
  const logout = () => {
    console.log('AuthProvider logout called')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
