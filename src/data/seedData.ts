export type Role = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  driveLink: string;
  createdBy: string;
  assignedStudentIds: string[];
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  status: 'submitted';
  submittedAt: string;
}

export const SEED_USERS: User[] = [
  { id: 'admin1', name: 'Prof. Ajit Sharma', email: 'admin1@joineazy.com', role: 'admin' },
  { id: 'admin2', name: 'Prof. Sunil Singh', email: 'admin2@joineazy.com', role: 'admin' },
  { id: 'stu1', name: 'Rahul Verma', email: 'rahul@student.com', role: 'student' },
  { id: 'stu2', name: 'Priya Sharma', email: 'priya@student.com', role: 'student' },
  { id: 'stu3', name: 'Neha Gupta', email: 'neha@student.com', role: 'student' },
  { id: 'stu4', name: 'Rohit Kumar', email: 'rohit@student.com', role: 'student' },
  { id: 'stu5', name: 'Pooja Singh', email: 'pooja@student.com', role: 'student' },
];

export const SEED_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    title: 'React Fundamentals Report',
    description: 'Write a 5-page report covering React hooks, component lifecycle, and state management best practices.',
    dueDate: '2026-11-15',
    driveLink: 'https://drive.google.com/file/d/1',
    createdBy: 'admin1',
    assignedStudentIds: ['all'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a2',
    title: 'Algorithm Analysis Assignment',
    description: 'Analyze the time and space complexity of 10 sorting algorithms with examples and benchmarks.',
    dueDate: '2026-11-20',
    driveLink: 'https://drive.google.com/file/d/2',
    createdBy: 'admin1',
    assignedStudentIds: ['stu1', 'stu2', 'stu3'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a3',
    title: 'Database Design Project',
    description: 'Design a normalized relational database schema for a library management system.',
    dueDate: '2026-11-10',
    driveLink: 'https://drive.google.com/file/d/3',
    createdBy: 'admin2',
    assignedStudentIds: ['all'],
    createdAt: new Date().toISOString(),
  },
];

export const SEED_SUBMISSIONS: Submission[] = [
  { id: 's1', assignmentId: 'a1', studentId: 'stu1', status: 'submitted', submittedAt: new Date().toISOString() },
  { id: 's2', assignmentId: 'a1', studentId: 'stu2', status: 'submitted', submittedAt: new Date().toISOString() },
  { id: 's3', assignmentId: 'a2', studentId: 'stu1', status: 'submitted', submittedAt: new Date().toISOString() },
];
