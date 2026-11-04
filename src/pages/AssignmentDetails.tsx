import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import StudentSubmissionRow from '../components/admin/StudentSubmissionRow';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAssignments } from '../context/AssignmentContext';
import { getStudents } from '../utils/storage';
import { formatDate, isOverdue } from '../utils/dateUtils';
import {
  Calendar,
  Users,
  ExternalLink,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default function AssignmentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assignments, submissions } = useAssignments();
  const [filter, setFilter] = useState<'all' | 'submitted' | 'pending'>('all');

  const assignment = useMemo(
    () => assignments.find((a) => a.id === id),
    [assignments, id]
  );

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

  if (!assignment) {
    return (
      <DashboardLayout pageTitle="Assignment Not Found">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-gray-500">This assignment does not exist or was deleted.</p>
          <Button variant="primary" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const overdue = isOverdue(assignment.dueDate);

  return (
    <DashboardLayout pageTitle="Assignment Details">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Back button */}
        <button
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors self-start cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Assignment header card */}
        <div className="bg-white border border-gray-200/80 shadow-sm rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900 flex-1">{assignment.title}</h2>
            {overdue ? (
              <Badge variant="danger" className="flex items-center gap-1 shrink-0">
                <AlertTriangle size={12} />
                Overdue
              </Badge>
            ) : (
              <Badge variant="info" className="shrink-0">Active</Badge>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{assignment.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar size={15} className={overdue ? 'text-red-500' : 'text-indigo-500'} />
              <span className={overdue ? 'text-red-600 font-medium' : ''}>
                Due: {formatDate(assignment.dueDate)}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={15} className="text-indigo-500" />
              {assignedStudents.length} student{assignedStudents.length !== 1 ? 's' : ''} assigned
            </span>
          </div>

          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-semibold self-start"
          >
            <ExternalLink size={14} />
            Open Assignment on Google Drive
          </a>
        </div>

        {/* Stats for Submitted and Pending */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-800">Submitted</p>
              <p className="text-xl font-bold text-emerald-950">
                {submittedCount}{' '}
                <span className="text-xs font-normal text-emerald-700">/ {assignedStudents.length}</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-800">Pending</p>
              <p className="text-xl font-bold text-amber-950">
                {pendingCount}{' '}
                <span className="text-xs font-normal text-amber-700">students</span>
              </p>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-800">Completion</p>
              <p className="text-xl font-bold text-indigo-950">{completionPct}%</p>
            </div>
          </div>
        </div>

        {/* Progress card */}
        <div className="bg-white border border-gray-200/80 shadow-sm rounded-2xl p-5">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700">Class Submission Progress</p>
            <span className="text-sm font-bold text-indigo-600">{completionPct}%</span>
          </div>
          <ProgressBar
            value={completionPct}
            color={completionPct === 100 ? 'emerald' : overdue ? 'red' : 'indigo'}
            size="md"
          />
        </div>

        {/* Student list & table */}
        <div className="bg-white border border-gray-200/80 shadow-sm rounded-2xl overflow-hidden p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-base font-bold text-gray-900">Student Submissions</h3>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={[
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer',
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
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1',
                  filter === 'submitted'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-gray-500 hover:text-emerald-600',
                ].join(' ')}
              >
                <CheckCircle size={12} className="text-emerald-500" />
                Submitted ({submittedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('pending')}
                className={[
                  'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1',
                  filter === 'pending'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-gray-500 hover:text-amber-600',
                ].join(' ')}
              >
                <Clock size={12} className="text-amber-500" />
                Pending ({pendingCount})
              </button>
            </div>
          </div>

          {/* MOBILE LIST VIEW */}
          <div className="sm:hidden flex flex-col gap-2.5">
            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-xl">
                No students match this filter.
              </div>
            ) : (
              filteredStudents.map(({ student, submission, isSubmitted }) => (
                <div
                  key={student.id}
                  className={[
                    'p-3.5 rounded-xl border flex flex-col gap-2 bg-white',
                    isSubmitted
                      ? 'border-emerald-100 bg-emerald-50/20'
                      : 'border-gray-200/80',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
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

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1.5 border-t border-gray-50">
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

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden sm:block border border-gray-200/80 rounded-xl overflow-hidden">
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
    </DashboardLayout>
  );
}
