import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import LoginPage from './components/LoginPage'
import Navbar from './components/Navbar'
import StudentDashboard from './components/student/StudentDashboard'
import AdminDashboard from './components/admin/AdminDashboard'

function AppShell() {
  const { currentUser } = useApp()

  if (!currentUser) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {currentUser.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
