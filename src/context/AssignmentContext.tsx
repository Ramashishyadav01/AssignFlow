import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import type { Assignment, Submission } from '../data/seedData';
import {
  getAssignments,
  saveAssignments,
  getSubmissions,
  saveSubmissions,
  getSubmissionForStudent,
} from '../utils/storage';

interface AssignmentContextValue {
  assignments: Assignment[];
  submissions: Submission[];
  addAssignment: (data: Omit<Assignment, 'id' | 'createdAt'>) => void;
  updateAssignment: (id: string, data: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  markSubmitted: (assignmentId: string, studentId: string) => void;
  refresh: () => void;
}

const AssignmentContext = createContext<AssignmentContextValue | undefined>(undefined);

export function AssignmentProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>(() => getAssignments());
  const [submissions, setSubmissions] = useState<Submission[]>(() => getSubmissions());

  const refresh = useCallback(() => {
    setAssignments(getAssignments());
    setSubmissions(getSubmissions());
  }, []);

  const addAssignment = useCallback((data: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...data,
      id: `a_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...getAssignments(), newAssignment];
    saveAssignments(updated);
    setAssignments(updated);
  }, []);

  const updateAssignment = useCallback((id: string, data: Partial<Assignment>) => {
    const current = getAssignments();
    const updated = current.map((a) => (a.id === id ? { ...a, ...data } : a));
    saveAssignments(updated);
    setAssignments(updated);
  }, []);

  const deleteAssignment = useCallback((id: string) => {
    const current = getAssignments();
    const updated = current.filter((a) => a.id !== id);
    saveAssignments(updated);
    setAssignments(updated);

    // Also remove submissions for this assignment
    const currentSubs = getSubmissions();
    const updatedSubs = currentSubs.filter((s) => s.assignmentId !== id);
    saveSubmissions(updatedSubs);
    setSubmissions(updatedSubs);
  }, []);

  const markSubmitted = useCallback((assignmentId: string, studentId: string) => {
    const existing = getSubmissionForStudent(assignmentId, studentId);
    const currentSubs = getSubmissions();
    let updatedSubs: Submission[];

    if (existing) {
      // Already submitted, no duplicate
      return;
    } else {
      const newSub: Submission = {
        id: `s_${Date.now()}`,
        assignmentId,
        studentId,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      };
      updatedSubs = [...currentSubs, newSub];
    }

    saveSubmissions(updatedSubs);
    setSubmissions(updatedSubs);
  }, []);

  return (
    <AssignmentContext.Provider
      value={{
        assignments,
        submissions,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        markSubmitted,
        refresh,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
}

export function useAssignments(): AssignmentContextValue {
  const ctx = useContext(AssignmentContext);
  if (!ctx) throw new Error('useAssignments must be used within AssignmentProvider');
  return ctx;
}
