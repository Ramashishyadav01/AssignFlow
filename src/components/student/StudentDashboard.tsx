import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import StudentAssignmentCard from './StudentAssignmentCard'

type FilterStatus = 'all' | 'submitted' | 'pending' | 'overdue'
type SortBy = 'dueDate' | 'title'

export default function StudentDashboard() {
  const { currentUser, visibleAssignments, submissions } = useApp()
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [sortBy, setSortBy] = useState<SortBy>('dueDate')
  const [search, setSearch] = useState('')

  if (!currentUser) return null

  const now = new Date()

  const enriched = visibleAssignments.map(a => {
    const sub = submissions.find(s => s.assignmentId === a.id && s.studentId === currentUser.id)
    const submitted = sub?.submitted ?? false
    const overdue = !submitted && new Date(a.dueDate) < now
    return { ...a, submitted, overdue }
  })

  const submittedCount = enriched.filter(a => a.submitted).length
  const totalCount = enriched.length

  const filtered = useMemo(() => {
    return enriched
      .filter(a => {
        if (filterStatus === 'submitted') return a.submitted
        if (filterStatus === 'pending') return !a.submitted && !a.overdue
        if (filterStatus === 'overdue') return a.overdue
        return true
      })
      .filter(a =>
        search.trim() === '' ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'dueDate') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        return a.title.localeCompare(b.title)
      })
  }, [enriched, filterStatus, sortBy, search])

  const progressPct = totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0

  const filterOptions: { label: string; value: FilterStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Submitted', value: 'submitted' },
    { label: 'Overdue', value: 'overdue' },
  ]

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome banner */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Hello, {currentUser.name.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here are your assignments</p>
      </div>

      {/* Progress card */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl p-6 mb-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-indigo-200 text-sm font-medium">Overall Progress</p>
            <p className="text-3xl font-bold mt-1">
              {submittedCount} <span className="text-indigo-200 text-lg font-normal">of {totalCount} submitted</span>
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-4xl font-bold">{progressPct}%</p>
            <p className="text-indigo-200 text-sm">completion</p>
          </div>
        </div>
        <div className="mt-4 bg-indigo-400/40 rounded-full h-2.5">
          <div
            className="bg-white rounded-full h-2.5 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
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

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortBy)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700"
        >
          <option value="dueDate">Sort: Due Date</option>
          <option value="title">Sort: Title</option>
        </select>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilterStatus(opt.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 ${
              filterStatus === opt.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
            }`}
          >
            {opt.label}
            {opt.value !== 'all' && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                filterStatus === opt.value ? 'bg-indigo-500' : 'bg-gray-100 text-gray-500'
              }`}>
                {opt.value === 'submitted' ? enriched.filter(a => a.submitted).length
                  : opt.value === 'pending' ? enriched.filter(a => !a.submitted && !a.overdue).length
                  : enriched.filter(a => a.overdue).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium">No assignments found</p>
          <p className="text-gray-300 text-sm mt-1">Try adjusting your filters or search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(a => (
            <StudentAssignmentCard key={a.id} assignment={a} />
          ))}
        </div>
      )}
    </main>
  )
}
