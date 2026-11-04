import type {
  Assignment,
  Submission,
  User,
} from './seedData'
import {
  SEED_ASSIGNMENTS,
  SEED_SUBMISSIONS,
  SEED_USERS,
} from './seedData'

const KEYS = {
  users: 'asgn_users',
  assignments: 'asgn_assignments',
  submissions: 'asgn_submissions',
  currentUser: 'asgn_currentUser',
}

function load<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : seed
  } catch {
    return seed
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

// ---- Users ----
export function getUsers(): User[] {
  return load(KEYS.users, SEED_USERS)
}

export function getCurrentUser(): User | null {
  const id = localStorage.getItem(KEYS.currentUser)
  if (!id) return null
  return getUsers().find(u => u.id === id) ?? null
}

export function setCurrentUser(id: string | null): void {
  if (id === null) localStorage.removeItem(KEYS.currentUser)
  else localStorage.setItem(KEYS.currentUser, id)
}

// ---- Assignments ----
export function getAssignments(): Assignment[] {
  return load(KEYS.assignments, SEED_ASSIGNMENTS)
}

export function saveAssignments(assignments: Assignment[]): void {
  save(KEYS.assignments, assignments)
}

export function getAssignmentsForAdmin(adminId: string): Assignment[] {
  return getAssignments().filter(a => a.createdBy === adminId)
}

export function getAssignmentsForStudent(studentId: string): Assignment[] {
  return getAssignments().filter(
    a => a.assignedTo.includes('all') || a.assignedTo.includes(studentId)
  )
}

// ---- Submissions ----
export function getSubmissions(): Submission[] {
  return load(KEYS.submissions, SEED_SUBMISSIONS)
}

export function saveSubmissions(submissions: Submission[]): void {
  save(KEYS.submissions, submissions)
}

export function getSubmission(assignmentId: string, studentId: string): Submission | undefined {
  return getSubmissions().find(
    s => s.assignmentId === assignmentId && s.studentId === studentId
  )
}

export function markSubmitted(assignmentId: string, studentId: string): void {
  const subs = getSubmissions()
  const idx = subs.findIndex(
    s => s.assignmentId === assignmentId && s.studentId === studentId
  )
  const updated: Submission = {
    assignmentId,
    studentId,
    submitted: true,
    submittedAt: new Date().toISOString(),
  }
  if (idx >= 0) subs[idx] = updated
  else subs.push(updated)
  saveSubmissions(subs)
}

// Ensure seed data exists on first load.
// Users are always re-seeded from SEED_USERS so name/email changes
// in seedData.ts are immediately reflected everywhere (dashboard,
// navbar, profile, student-submission lists, etc.).
export function initStorage(): void {
  // Always overwrite users so any name/email edits in seedData.ts
  // take effect without needing to clear localStorage manually.
  save(KEYS.users, SEED_USERS)

  if (!localStorage.getItem(KEYS.assignments)) save(KEYS.assignments, SEED_ASSIGNMENTS)
  if (!localStorage.getItem(KEYS.submissions)) save(KEYS.submissions, SEED_SUBMISSIONS)
}
