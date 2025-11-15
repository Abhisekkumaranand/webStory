import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import IndexPage from './pages/IndexPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import StoryForm from './pages/StoryForm.jsx'
import EditStory from './pages/EditStory.jsx'
import StoryPlayer from './pages/StoryPlayer.jsx'
import './index.css'
import { AuthProvider } from './auth/AuthProvider'
import RequireAuth from './auth/RequireAuth'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'


createRoot(document.getElementById('root')).render(
    
  <BrowserRouter>
    <AuthProvider>
       <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<IndexPage />} />
        <Route path="admin" element={<RequireAuth requiredRole="admin"><AdminDashboard /></RequireAuth>} />
        <Route path="admin/new" element={<RequireAuth requiredRole="admin"><StoryForm /></RequireAuth>} />
        <Route path="admin/edit/:id" element={<RequireAuth requiredRole="admin"><EditStory /></RequireAuth>} />
        <Route path="story/:id" element={<StoryPlayer />} />
        <Route path="login" element={<Login/>} />
        <Route path="signup" element={<Signup/>} />

      </Route>
    </Routes>
     </AuthProvider>
  </BrowserRouter>
)
