import type { User, Assignment, Submission } from '../data/seedData';
import { SEED_USERS, SEED_ASSIGNMENTS, SEED_SUBMISSIONS } from '../data/seedData';

const KEYS = {
  USERS: 'af_users',
  ASSIGNMENTS: 'af_assignments',
  SUBMISSIONS: 'af_submissions',
  CURRENT_USER: 'af_currentUser',
};

export function initStorage(): void {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(KEYS.ASSIGNMENTS)) {
    localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(SEED_ASSIGNMENTS));
  }
  if (!localStorage.getItem(KEYS.SUBMISSIONS)) {
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(SEED_SUBMISSIONS));
  }
}

export function getUsers(): User[] {
  const raw = localStorage.getItem(KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function getAssignments(): Assignment[] {
  const raw = localStorage.getItem(KEYS.ASSIGNMENTS);
  return raw ? JSON.parse(raw) : [];
}

export function saveAssignments(assignments: Assignment[]): void {
  localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(assignments));
}

export function getSubmissions(): Submission[] {
  const raw = localStorage.getItem(KEYS.SUBMISSIONS);
  return raw ? JSON.parse(raw) : [];
}

export function saveSubmissions(submissions: Submission[]): void {
  localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(submissions));
}

export function getCurrentUserId(): string | null {
  return localStorage.getItem(KEYS.CURRENT_USER);
}

export function setCurrentUserId(id: string): void {
  localStorage.setItem(KEYS.CURRENT_USER, id);
}

export function clearCurrentUser(): void {
  localStorage.removeItem(KEYS.CURRENT_USER);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getStudents(): User[] {
  return getUsers().filter((u) => u.role === 'student');
}

export function getAssignmentsForAdmin(adminId: string): Assignment[] {
  return getAssignments().filter((a) => a.createdBy === adminId);
}

export function getAssignmentsForStudent(studentId: string): Assignment[] {
  return getAssignments().filter(
    (a) =>
      a.assignedStudentIds.includes('all') ||
      a.assignedStudentIds.includes(studentId)
  );
}

export function getSubmissionsForAssignment(assignmentId: string): Submission[] {
  return getSubmissions().filter((s) => s.assignmentId === assignmentId);
}

export function getSubmissionForStudent(
  assignmentId: string,
  studentId: string
): Submission | undefined {
  return getSubmissions().find(
    (s) => s.assignmentId === assignmentId && s.studentId === studentId
  );
}
