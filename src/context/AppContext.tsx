import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, Assignment, Submission } from '../data/seedData'
import {
  initStorage,
  getCurrentUser,
  setCurrentUser,
  getUsers,
  getAssignments,
  saveAssignments,
  getSubmissions,
  saveSubmissions,
  markSubmitted as storageMarkSubmitted,
  getAssignmentsForAdmin,
  getAssignmentsForStudent,
} from '../data/storage'
interface AppContextValue {
  currentUser: User | null
  users: User[]
  assignments: Assignment[]
  submissions: Submission[]
  visibleAssignments: Assignment[]
  login: (userId: string) => void
  logout: () => void
  addAssignment: (a: Omit<Assignment, 'id'>) => void
  updateAssignment: (a: Assignment) => void
  deleteAssignment: (id: string) => void
  markSubmitted: (assignmentId: string, studentId: string) => void
  refresh: () => void
}

const AppContext = createContext<AppContextValue>(null!)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])

  const refresh = useCallback(() => {
    setCurrentUserState(getCurrentUser())
    setUsers(getUsers())
    setAssignments(getAssignments())
    setSubmissions(getSubmissions())
  }, [])

  useEffect(() => {
    initStorage()
    refresh()
  }, [refresh])

  const login = useCallback((userId: string) => {
    setCurrentUser(userId)
    refresh()
  }, [refresh])

  const logout = useCallback(() => {
    setCurrentUser(null)
    refresh()
  }, [refresh])

  const addAssignment = useCallback((data: Omit<Assignment, 'id'>) => {
    const all = getAssignments()
    const newA: Assignment = { ...data, id: `a_${Date.now()}` }
    const updated = [...all, newA]
    saveAssignments(updated)
    setAssignments(updated)
  }, [])

  const updateAssignment = useCallback((a: Assignment) => {
    const all = getAssignments()
    const updated = all.map(x => x.id === a.id ? a : x)
    saveAssignments(updated)
    setAssignments(updated)
  }, [])

  const deleteAssignment = useCallback((id: string) => {
    const all = getAssignments()
    const updated = all.filter(x => x.id !== id)
    saveAssignments(updated)
    setAssignments(updated)
    // Also clean up submissions
    const subs = getSubmissions().filter(s => s.assignmentId !== id)
    saveSubmissions(subs)
    setSubmissions(subs)
  }, [])

  const markSubmitted = useCallback((assignmentId: string, studentId: string) => {
    storageMarkSubmitted(assignmentId, studentId)
    setSubmissions(getSubmissions())
  }, [])

  const visibleAssignments = currentUser
    ? currentUser.role === 'admin'
      ? getAssignmentsForAdmin(currentUser.id)
      : getAssignmentsForStudent(currentUser.id)
    : []

  return (
    <AppContext.Provider value={{
      currentUser, users, assignments, submissions,
      visibleAssignments,
      login, logout,
      addAssignment, updateAssignment, deleteAssignment,
      markSubmitted,
      refresh,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
