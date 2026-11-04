import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import type { Assignment } from '../../data/seedData'
import { getUsers } from '../../data/storage'

interface Props {
  existing?: Assignment
  onClose: () => void
}

export default function AssignmentForm({ existing, onClose }: Props) {
  const { currentUser, addAssignment, updateAssignment } = useApp()
  const students = getUsers().filter(u => u.role === 'student')

  const [title, setTitle] = useState(existing?.title ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? '')
  const [driveLink, setDriveLink] = useState(existing?.driveLink ?? '')
  const [assignAll, setAssignAll] = useState(
    !existing || existing.assignedTo.includes('all')
  )
  const [selectedStudents, setSelectedStudents] = useState<string[]>(
    existing?.assignedTo.includes('all') ? [] : (existing?.assignedTo ?? [])
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!description.trim()) e.description = 'Description is required'
    if (!dueDate) e.dueDate = 'Due date is required'
    if (!driveLink.trim()) e.driveLink = 'Drive link is required'
    if (!assignAll && selectedStudents.length === 0) e.students = 'Select at least one student'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const data: Omit<Assignment, 'id'> = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      driveLink: driveLink.trim(),
      createdBy: currentUser!.id,
      assignedTo: assignAll ? ['all'] : selectedStudents,
    }
    if (existing) updateAssignment({ ...data, id: existing.id })
    else addAssignment(data)
    onClose()
  }

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-bold text-gray-900 text-lg">
            {existing ? 'Edit Assignment' : 'Create Assignment'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Assignment title"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the assignment..."
              rows={3}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.dueDate ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
          </div>

          {/* Drive Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drive Link <span className="text-red-500">*</span></label>
            <input
              type="url"
              value={driveLink}
              onChange={e => setDriveLink(e.target.value)}
              placeholder="https://drive.google.com/..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.driveLink ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.driveLink && <p className="text-xs text-red-500 mt-1">{errors.driveLink}</p>}
          </div>

          {/* Assign to */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign To <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-3 mb-3">
              <button
                type="button"
                onClick={() => setAssignAll(true)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${assignAll ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}
              >
                All Students
              </button>
              <button
                type="button"
                onClick={() => setAssignAll(false)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${!assignAll ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}
              >
                Select Students
              </button>
            </div>

            {!assignAll && (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {students.map((s, i) => (
                  <label
                    key={s.id}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${i > 0 ? 'border-t border-gray-100' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(s.id)}
                      onChange={() => toggleStudent(s.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-300"
                    />
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-700">{s.name[0]}</span>
                    </div>
                    <span className="text-sm text-gray-700">{s.name}</span>
                  </label>
                ))}
              </div>
            )}
            {errors.students && <p className="text-xs text-red-500 mt-1">{errors.students}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              {existing ? 'Save Changes' : 'Create Assignment'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
