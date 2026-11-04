import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import type { Assignment } from '../../data/seedData'
import { getUsers } from '../../data/storage'
import AssignmentForm from './AssignmentForm'

interface Props {
  assignment: Assignment
}

export default function AdminAssignmentCard({ assignment }: Props) {
  const { submissions, deleteAssignment } = useApp()
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const allStudents = getUsers().filter(u => u.role === 'student')
  const assignedStudents = assignment.assignedTo.includes('all')
    ? allStudents
    : allStudents.filter(s => assignment.assignedTo.includes(s.id))

  const studentSubmissions = assignedStudents.map(student => {
    const sub = submissions.find(
      s => s.assignmentId === assignment.id && s.studentId === student.id
    )
    return { student, submitted: sub?.submitted ?? false, submittedAt: sub?.submittedAt }
  })

  const submittedCount = studentSubmissions.filter(s => s.submitted).length
  const totalCount = assignedStudents.length
  const pct = totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0
  const overdue = new Date(assignment.dueDate) < new Date()

  return (
    <>
      {editing && (
        <AssignmentForm existing={assignment} onClose={() => setEditing(false)} />
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Accent bar */}
        <div className={`h-1 ${pct === 100 ? 'bg-green-400' : overdue ? 'bg-red-400' : 'bg-purple-400'}`} />

        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-base leading-tight flex-1">{assignment.title}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setEditing(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{assignment.description}</p>

          <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due: <strong className={overdue ? 'text-red-600' : 'text-gray-700'}>{new Date(assignment.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {assignment.assignedTo.includes('all') ? 'All students' : `${assignedStudents.length} students`}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-gray-600">Class completion</span>
              <span className="text-xs font-bold text-gray-800">{submittedCount}/{totalCount} ({pct}%)</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2">
              <div
                className={`rounded-full h-2 transition-all duration-500 ${pct === 100 ? 'bg-green-500' : pct > 50 ? 'bg-indigo-500' : 'bg-yellow-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Drive link */}
          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 transition-colors mb-4"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Drive Link
          </a>

          {/* Student status list */}
          <details className="group">
            <summary className="cursor-pointer text-xs font-semibold text-gray-600 hover:text-indigo-600 transition-colors list-none flex items-center gap-1 select-none">
              <svg className="w-3.5 h-3.5 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Student Submissions ({submittedCount}/{totalCount})
            </summary>
            <div className="mt-3 space-y-1.5">
              {studentSubmissions.map(({ student, submitted, submittedAt }) => (
                <div key={student.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${submitted ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      {student.name[0]}
                    </div>
                    <span className="text-xs text-gray-700 font-medium">{student.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {submitted ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-green-600 font-medium">Submitted</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-gray-400">Pending</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Assignment?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              "<strong>{assignment.title}</strong>" will be permanently deleted along with all submissions.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { deleteAssignment(assignment.id); setConfirmDelete(false) }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
