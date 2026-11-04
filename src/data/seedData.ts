export type Role = 'student' | 'admin'

export type User = {
  id: string
  name: string
  email: string
  role: Role
}

export type Assignment = {
  id: string
  title: string
  description: string
  dueDate: string
  driveLink: string
  createdBy: string      // admin user id
  assignedTo: string[]   // 'all' sentinel or array of student ids
}

export type Submission = {
  assignmentId: string
  studentId: string
  submitted: boolean
  submittedAt?: string
}

export const SEED_USERS: User[] = [
  { id: 'admin1', name: 'Prof. Ajit Sharma', email: 'ajit123@uni.edu', role: 'admin' },
  { id: 'admin2', name: 'Prof. Sunil Singh', email: 'sunil@uni.edu', role: 'admin' },
  { id: 'stu1',   name: 'Ashish Yadav',        email: 'ashish11@uni.edu', role: 'student' },
  { id: 'stu2',   name: 'Prince Singh',           email: 'prince33@uni.edu',   role: 'student' },
  { id: 'stu3',   name: 'Vishal Kumar',         email: 'vishal@uni.edu', role: 'student' },
  { id: 'stu4',   name: 'Deepak Yadav',          email: 'deepak55@uni.edu', role: 'student' },
  { id: 'stu5',   name: 'Sandeep Rai',           email: 'sandeep66@uni.edu',   role: 'student' },
]

export const SEED_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    title: 'React Fundamentals Report',
    description: 'Write a 5-page report covering React hooks, component lifecycle, and state management best practices.',
    dueDate: '2026-11-15',
    driveLink: 'https://drive.google.com/file/d/1',
    createdBy: 'admin1',
    assignedTo: ['all'],
  },
  {
    id: 'a2',
    title: 'Algorithm Analysis Assignment',
    description: 'Analyze the time and space complexity of 10 sorting algorithms with examples and benchmarks.',
    dueDate: '2026-11-20',
    driveLink: 'https://drive.google.com/file/d/2',
    createdBy: 'admin1',
    assignedTo: ['stu1', 'stu2', 'stu3'],
  },
  {
    id: 'a3',
    title: 'Database Design Project',
    description: 'Design a normalized relational database schema for a library management system with ER diagrams.',
    dueDate: '2026-11-10',
    driveLink: 'https://drive.google.com/file/d/3',
    createdBy: 'admin2',
    assignedTo: ['all'],
  },
  {
    id: 'a4',
    title: 'Machine Learning Lab',
    description: 'Implement a simple neural network from scratch in Python and train it on the MNIST dataset.',
    dueDate: '2026-11-25',
    driveLink: 'https://drive.google.com/file/d/4',
    createdBy: 'admin2',
    assignedTo: ['stu4', 'stu5'],
  },
  {
    id: 'a5',
    title: 'Operating Systems Essay',
    description: 'Compare and contrast process scheduling algorithms used in modern operating systems.',
    dueDate: '2026-12-01',
    driveLink: 'https://drive.google.com/file/d/5',
    createdBy: 'admin1',
    assignedTo: ['all'],
  },
]

export const SEED_SUBMISSIONS: Submission[] = [
  { assignmentId: 'a1', studentId: 'stu1', submitted: true, submittedAt: '2026-11-10T10:30:00Z' },
  { assignmentId: 'a1', studentId: 'stu2', submitted: true, submittedAt: '2026-11-11T14:00:00Z' },
  { assignmentId: 'a1', studentId: 'stu3', submitted: false },
  { assignmentId: 'a1', studentId: 'stu4', submitted: true, submittedAt: '2026-11-12T09:00:00Z' },
  { assignmentId: 'a1', studentId: 'stu5', submitted: false },

  { assignmentId: 'a2', studentId: 'stu1', submitted: true, submittedAt: '2026-11-13T11:00:00Z' },
  { assignmentId: 'a2', studentId: 'stu2', submitted: false },
  { assignmentId: 'a2', studentId: 'stu3', submitted: false },

  { assignmentId: 'a3', studentId: 'stu1', submitted: false },
  { assignmentId: 'a3', studentId: 'stu2', submitted: true, submittedAt: '2026-11-08T08:00:00Z' },
  { assignmentId: 'a3', studentId: 'stu3', submitted: true, submittedAt: '2026-11-09T16:00:00Z' },
  { assignmentId: 'a3', studentId: 'stu4', submitted: false },
  { assignmentId: 'a3', studentId: 'stu5', submitted: false },

  { assignmentId: 'a4', studentId: 'stu4', submitted: false },
  { assignmentId: 'a4', studentId: 'stu5', submitted: false },

  { assignmentId: 'a5', studentId: 'stu1', submitted: false },
  { assignmentId: 'a5', studentId: 'stu2', submitted: false },
  { assignmentId: 'a5', studentId: 'stu3', submitted: false },
  { assignmentId: 'a5', studentId: 'stu4', submitted: false },
  { assignmentId: 'a5', studentId: 'stu5', submitted: false },
]
