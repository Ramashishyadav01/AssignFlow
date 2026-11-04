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
import { Calendar, Users, ExternalLink, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function AssignmentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assignments, submissions } = useAssignments();

  const assignment = useMemo(
    () => assignments.find((a) => a.id === id),
    [assignments, id]
  );

  const { assignedStudents, submittedCount, completionPct } = useMemo(() => {
    if (!assignment) return { assignedStudents: [], submittedCount: 0, completionPct: 0 };

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

    const pct = assigned.length > 0 ? Math.round((subs.length / assigned.length) * 100) : 0;

    return {
      assignedStudents: assigned,
      submittedCount: subs.length,
      completionPct: pct,
    };
  }, [assignment, submissions]);

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
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors self-start"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Assignment header card */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col gap-4">
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
            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-medium self-start"
          >
            <ExternalLink size={14} />
            Open Assignment on Google Drive
          </a>
        </div>

        {/* Progress card */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-gray-700">Submission Progress</p>
            <span className="text-sm font-bold text-indigo-600">{completionPct}%</span>
          </div>
          <ProgressBar
            value={completionPct}
            color={completionPct === 100 ? 'emerald' : overdue ? 'red' : 'indigo'}
            size="lg"
          />
          <p className="mt-2 text-xs text-gray-500">
            {submittedCount} of {assignedStudents.length} students submitted
          </p>
        </div>

        {/* Student table */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Student Submissions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-gray-50">
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
              <tbody className="bg-white divide-y divide-gray-50">
                {assignedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-400">
                      No students assigned to this assignment.
                    </td>
                  </tr>
                ) : (
                  assignedStudents.map((student) => {
                    const sub = submissions.find(
                      (s) => s.assignmentId === assignment.id && s.studentId === student.id
                    );
                    return (
                      <StudentSubmissionRow
                        key={student.id}
                        student={student}
                        submission={sub}
                      />
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
