import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import type { Assignment } from '../../data/seedData'

interface Props {
  assignment: Assignment
}

type Step = 'idle' | 'confirm1' | 'confirm2'

function StatusBadge({ submitted, overdue }: { submitted: boolean; overdue: boolean }) {
  if (submitted) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Submitted
      </span>
    )
  }
  if (overdue) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Overdue
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
      Pending
    </span>
  )
}

export default function StudentAssignmentCard({ assignment }: Props) {
  const { currentUser, submissions, markSubmitted } = useApp()
  const [step, setStep] = useState<Step>('idle')

  const sub = submissions.find(
    s => s.assignmentId === assignment.id && s.studentId === currentUser?.id
  )
  const submitted = sub?.submitted ?? false
  const overdue = !submitted && new Date(assignment.dueDate) < new Date()

  const handleConfirm = () => {
    if (!currentUser) return
    markSubmitted(assignment.id, currentUser.id)
    setStep('idle')
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${overdue && !submitted ? 'border-red-200' : 'border-gray-100'}`}>
      {/* Top accent */}
      <div className={`h-1 ${submitted ? 'bg-green-400' : overdue ? 'bg-red-400' : 'bg-indigo-400'}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-gray-900 text-base leading-tight">{assignment.title}</h3>
          <StatusBadge submitted={submitted} overdue={overdue} />
        </div>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{assignment.description}</p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Due: <strong className={overdue && !submitted ? 'text-red-600' : 'text-gray-700'}>{new Date(assignment.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
          </span>
          {sub?.submittedAt && (
            <span className="flex items-center gap-1 text-green-600">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Submitted on {new Date(sub.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Drive Link
          </a>

          {!submitted && (
            <button
              onClick={() => setStep('confirm1')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Yes, I have submitted
            </button>
          )}
        </div>
      </div>

      {/* Step 1 confirmation */}
      {step === 'confirm1' && (
        <div className="border-t border-gray-100 bg-yellow-50 px-5 py-4">
          <p className="text-sm font-medium text-gray-800 mb-3">Are you sure you want to mark this as submitted?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setStep('confirm2')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Yes, confirm
            </button>
            <button
              onClick={() => setStep('idle')}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Step 2 final confirmation */}
      {step === 'confirm2' && (
        <div className="border-t border-red-100 bg-red-50 px-5 py-4">
          <p className="text-sm font-medium text-red-800 mb-1">Final confirmation</p>
          <p className="text-xs text-red-600 mb-3">This action cannot be undone. Your submission will be recorded permanently.</p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              ✓ Mark as Submitted
            </button>
            <button
              onClick={() => setStep('idle')}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
