import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function RequireAuth({ children, requiredRole }) {
  const { token, user } = useAuth()
  const location = useLocation()
  console.log('RequireAuth: token:', !!token, 'user:', user, 'requiredRole:', requiredRole, 'path:', location.pathname)
  if (!token) {
    console.log('RequireAuth: no token, redirect to login')
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!roles.includes(user?.role)) {
      console.log('RequireAuth: role mismatch, redirect to home')
      return <Navigate to="/" replace />
    }
  }
  console.log('RequireAuth: access granted')
  return children
}
