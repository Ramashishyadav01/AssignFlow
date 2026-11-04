import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import AdminAssignmentCard from './AdminAssignmentCard'
import AssignmentForm from './AssignmentForm'
import { getUsers } from '../../data/storage'

type SortBy = 'dueDate' | 'title' | 'completion'

export default function AdminDashboard() {
  const { currentUser, visibleAssignments, submissions } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('dueDate')

  if (!currentUser) return null

  const allStudents = getUsers().filter(u => u.role === 'student')

  const enriched = useMemo(() => {
    return visibleAssignments.map(a => {
      const assigned = a.assignedTo.includes('all')
        ? allStudents
        : allStudents.filter(s => a.assignedTo.includes(s.id))
      const submittedCount = assigned.filter(s =>
        submissions.find(sub => sub.assignmentId === a.id && sub.studentId === s.id && sub.submitted)
      ).length
      const pct = assigned.length > 0 ? submittedCount / assigned.length : 0
      return { ...a, submittedCount, totalCount: assigned.length, pct }
    })
  }, [visibleAssignments, submissions, allStudents])

  const totalSubmissions = enriched.reduce((acc, a) => acc + a.submittedCount, 0)
  const totalPossible = enriched.reduce((acc, a) => acc + a.totalCount, 0)
  const overallPct = totalPossible > 0 ? Math.round((totalSubmissions / totalPossible) * 100) : 0

  const filtered = useMemo(() => {
    return enriched
      .filter(a =>
        search.trim() === '' ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'dueDate') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        if (sortBy === 'title') return a.title.localeCompare(b.title)
        return b.pct - a.pct
      })
  }, [enriched, search, sortBy])

  return (
    <>
      {showForm && <AssignmentForm onClose={() => setShowForm(false)} />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hello, {currentUser.name} 👋</h1>
            <p className="text-gray-500 mt-1">Manage your assignments and track student progress</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Assignment
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-medium text-gray-500 mb-1">Total Assignments</p>
            <p className="text-3xl font-bold text-gray-900">{enriched.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-medium text-gray-500 mb-1">Submissions</p>
            <p className="text-3xl font-bold text-indigo-600">{totalSubmissions}</p>
            <p className="text-xs text-gray-400">of {totalPossible} possible</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-medium text-gray-500 mb-1">Class Completion</p>
            <p className="text-3xl font-bold text-green-600">{overallPct}%</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-medium text-gray-500 mb-1">Overdue</p>
            <p className="text-3xl font-bold text-red-500">
              {enriched.filter(a => new Date(a.dueDate) < new Date()).length}
            </p>
            <p className="text-xs text-gray-400">assignments</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search assignments..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700"
          >
            <option value="dueDate">Sort: Due Date</option>
            <option value="title">Sort: Title</option>
            <option value="completion">Sort: Completion</option>
          </select>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">No assignments yet</p>
            <p className="text-gray-300 text-sm mt-1">Click "New Assignment" to create one</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(a => (
              <AdminAssignmentCard key={a.id} assignment={a} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
