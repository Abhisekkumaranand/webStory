import React from 'react'
import { useAuth } from '../auth/AuthProvider'
import Landing from './Landing'
import Home from './Home'

export default function IndexPage() {
  const { user } = useAuth()
  return user ? <Home /> : <Landing />
}