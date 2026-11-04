import React, { useMemo, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StudentProgress from '../components/student/StudentProgress';
import StudentAssignmentCard from '../components/student/StudentAssignmentCard';
import SubmissionModal from '../components/student/SubmissionModal';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useAssignments } from '../context/AssignmentContext';
import { isOverdue } from '../utils/dateUtils';
import type { Assignment } from '../data/seedData';
import { Search, ClipboardX } from 'lucide-react';

type Filter = 'all' | 'submitted' | 'pending' | 'overdue';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { assignments, submissions } = useAssignments();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'title'>('dueDate');
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);

  const myAssignments = useMemo(() => {
    if (!currentUser) return [];
    return assignments.filter(
      (a) =>
        a.assignedStudentIds.includes('all') ||
        a.assignedStudentIds.includes(currentUser.id)
    );
  }, [assignments, currentUser]);

  const mySubmissions = useMemo(() => {
    if (!currentUser) return [];
    return submissions.filter((s) => s.studentId === currentUser.id);
  }, [submissions, currentUser]);

  const getSubmission = (assignmentId: string) =>
    mySubmissions.find((s) => s.assignmentId === assignmentId);

  const filteredAssignments = useMemo(() => {
    let list = [...myAssignments];

    // Filter
    if (filter === 'submitted') {
      list = list.filter((a) => !!getSubmission(a.id));
    } else if (filter === 'pending') {
      list = list.filter((a) => !getSubmission(a.id) && !isOverdue(a.dueDate));
    } else if (filter === 'overdue') {
      list = list.filter((a) => isOverdue(a.dueDate) && !getSubmission(a.id));
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [myAssignments, filter, search, sortBy, mySubmissions]);

  const filterOptions: { label: string; value: Filter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Submitted', value: 'submitted' },
    { label: 'Pending', value: 'pending' },
    { label: 'Overdue', value: 'overdue' },
  ];

  return (
    <DashboardLayout pageTitle="My Dashboard">
      {/* Progress stats */}
      <StudentProgress
        assignments={myAssignments}
        submissions={mySubmissions}
        studentId={currentUser?.id ?? ''}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Filter tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={[
                'px-3 py-1.5 text-sm rounded-lg font-medium transition-colors',
                filter === opt.value
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-44">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
        >
          <option value="dueDate">Sort: Due Date</option>
          <option value="title">Sort: Title</option>
        </select>
      </div>

      {/* Assignment grid */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          icon={<ClipboardX size={48} />}
          title="No assignments found"
          message={
            myAssignments.length === 0
              ? 'You have no assignments at the moment.'
              : 'No assignments match your current filters.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAssignments.map((assignment) => (
            <StudentAssignmentCard
              key={assignment.id}
              assignment={assignment}
              submission={getSubmission(assignment.id)}
              onSubmit={(a) => setSubmittingAssignment(a)}
            />
          ))}
        </div>
      )}

      {/* Submission modal */}
      <SubmissionModal
        assignment={submittingAssignment}
        onClose={() => setSubmittingAssignment(null)}
      />
    </DashboardLayout>
  );
}
