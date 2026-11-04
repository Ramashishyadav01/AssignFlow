import React, { useMemo, useState } from 'react';
import type { Assignment } from '../../data/seedData';
import { useAssignments } from '../../context/AssignmentContext';
import { getStudents } from '../../utils/storage';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import StudentSubmissionRow from './StudentSubmissionRow';
import {
  Calendar,
  Users,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
} from 'lucide-react';

interface AssignmentDetailModalProps {
  assignment: Assignment | null;
  onClose: () => void;
}

type FilterType = 'all' | 'submitted' | 'pending';

export default function AssignmentDetailModal({
  assignment,
  onClose,
}: AssignmentDetailModalProps) {
  const { submissions } = useAssignments();
  const [filter, setFilter] = useState<FilterType>('all');

  const { assignedStudents, submittedCount, pendingCount, completionPct } = useMemo(() => {
    if (!assignment) {
      return { assignedStudents: [], submittedCount: 0, pendingCount: 0, completionPct: 0 };
    }

    const allStudents = getStudents();
    const assigned = assignment.assignedStudentIds.includes('all')
      ? allStudents
      : allStudents.filter((s) => assignment.assignedStudentIds.includes(s.id));

    const subs = submissions.filter(
      (s) =>
        s.assignmentId === assignment.id &&
        (assignment.assignedStudentIds.includes('all') ||
          assignment.assignedStudentIds.includes(s.studentId))
    );

    const submitted = subs.length;
    const pending = Math.max(0, assigned.length - submitted);
    const pct = assigned.length > 0 ? Math.round((submitted / assigned.length) * 100) : 0;

    return {
      assignedStudents: assigned,
      submittedCount: submitted,
      pendingCount: pending,
      completionPct: pct,
    };
  }, [assignment, submissions]);

  const studentsWithStatus = useMemo(() => {
    if (!assignment) return [];
    return assignedStudents.map((student) => {
      const sub = submissions.find(
        (s) => s.assignmentId === assignment.id && s.studentId === student.id
      );
      return {
        student,
        submission: sub,
        isSubmitted: !!sub,
      };
    });
  }, [assignedStudents, submissions, assignment]);

  const filteredStudents = useMemo(() => {
    if (filter === 'submitted') {
      return studentsWithStatus.filter((item) => item.isSubmitted);
    }
    if (filter === 'pending') {
      return studentsWithStatus.filter((item) => !item.isSubmitted);
    }
    return studentsWithStatus;
  }, [studentsWithStatus, filter]);

  if (!assignment) return null;

  const overdue = isOverdue(assignment.dueDate);

  return (
    <Modal open={!!assignment} onClose={onClose} title={assignment.title} size="xl">
      <div className="p-4 sm:p-6 flex flex-col gap-5">
        {/* Header Tags & Metadata */}
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap gap-2 items-center">
            {overdue ? (
              <Badge variant="danger" className="flex items-center gap-1">
                <AlertTriangle size={11} />
                Overdue
              </Badge>
            ) : (
              <Badge variant="info">Active</Badge>
            )}
            <Badge variant="gray" className="flex items-center gap-1">
              <Calendar size={11} />
              Due {formatDate(assignment.dueDate)}
            </Badge>
            <Badge variant="gray" className="flex items-center gap-1">
              <Users size={11} />
              {assignedStudents.length} Assigned
            </Badge>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{assignment.description}</p>

          <div>
            <a
              href={assignment.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
            >
              <ExternalLink size={14} />
              Open Assignment on Google Drive
            </a>
          </div>
        </div>

        {/* Highlighted Stat Cards for Submitted & Pending */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-emerald-800">Submitted</p>
              <p className="text-lg font-bold text-emerald-900 leading-tight">
                {submittedCount}{' '}
                <span className="text-xs font-normal text-emerald-700">/ {assignedStudents.length}</span>
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Clock size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-amber-800">Pending</p>
              <p className="text-lg font-bold text-amber-900 leading-tight">
                {pendingCount}{' '}
                <span className="text-xs font-normal text-amber-700">students</span>
              </p>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-indigo-50/90 border border-indigo-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Users size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-indigo-800">Completion</p>
              <p className="text-lg font-bold text-indigo-900 leading-tight">
                {completionPct}%
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-50/80 rounded-xl p-3.5 border border-gray-100">
          <div className="flex justify-between items-center mb-1.5 text-xs">
            <span className="font-semibold text-gray-700">Class Submission Progress</span>
            <span className="font-bold text-indigo-600">{completionPct}%</span>
          </div>
          <ProgressBar
            value={completionPct}
            color={completionPct === 100 ? 'emerald' : overdue ? 'red' : 'indigo'}
            size="md"
          />
        </div>

        {/* Student Submissions Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold text-gray-900">Student Submissions</h3>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={[
                  'px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer',
                  filter === 'all'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900',
                ].join(' ')}
              >
                All ({assignedStudents.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('submitted')}
                className={[
                  'px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1',
                  filter === 'submitted'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-gray-500 hover:text-emerald-600',
                ].join(' ')}
              >
                <CheckCircle size={11} className="text-emerald-500" />
                Submitted ({submittedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('pending')}
                className={[
                  'px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1',
                  filter === 'pending'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-gray-500 hover:text-amber-600',
                ].join(' ')}
              >
                <Clock size={11} className="text-amber-500" />
                Pending ({pendingCount})
              </button>
            </div>
          </div>

          {/* MOBILE LIST VIEW (Guaranteed zero horizontal cut-off on phones!) */}
          <div className="sm:hidden flex flex-col gap-2">
            {filteredStudents.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 rounded-xl">
                No students match this filter.
              </div>
            ) : (
              filteredStudents.map(({ student, submission, isSubmitted }) => (
                <div
                  key={student.id}
                  className={[
                    'p-3 rounded-xl border flex flex-col gap-2 bg-white',
                    isSubmitted
                      ? 'border-emerald-100/90 bg-emerald-50/20'
                      : 'border-gray-200/80',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{student.email}</p>
                      </div>
                    </div>

                    {/* Prominent Badge */}
                    <div className="shrink-0">
                      {isSubmitted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                          <CheckCircle size={11} className="text-emerald-600" />
                          Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200/80">
                          <Clock size={11} className="text-amber-600" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Date row for mobile */}
                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-50">
                    <span>Status details:</span>
                    <span>
                      {isSubmitted
                        ? `Submitted on ${formatDate(submission!.submittedAt)}`
                        : 'Awaiting submission'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP TABLE VIEW (With smooth scroll and explicit min-width) */}
          <div className="hidden sm:block border border-gray-200/80 rounded-xl overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">
                        No students found for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(({ student, submission }) => (
                      <StudentSubmissionRow
                        key={student.id}
                        student={student}
                        submission={submission}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
