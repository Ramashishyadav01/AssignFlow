import React, { useMemo } from 'react';
import { Assignment } from '../../data/seedData';
import { useAssignments } from '../../context/AssignmentContext';
import { getStudents } from '../../utils/storage';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import StudentSubmissionRow from './StudentSubmissionRow';
import { Calendar, Users, ExternalLink, AlertTriangle } from 'lucide-react';

interface AssignmentDetailModalProps {
  assignment: Assignment | null;
  onClose: () => void;
}

export default function AssignmentDetailModal({
  assignment,
  onClose,
}: AssignmentDetailModalProps) {
  const { submissions } = useAssignments();

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

  if (!assignment) return null;

  const overdue = isOverdue(assignment.dueDate);

  return (
    <Modal open={!!assignment} onClose={onClose} title={assignment.title} size="xl">
      <div className="p-6 flex flex-col gap-6">
        {/* Info section */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 items-center">
            {overdue ? (
              <Badge variant="danger" className="flex items-center gap-1">
                <AlertTriangle size={10} />
                Overdue
              </Badge>
            ) : (
              <Badge variant="info">Active</Badge>
            )}
            <Badge variant="gray" className="flex items-center gap-1">
              <Calendar size={10} />
              Due {formatDate(assignment.dueDate)}
            </Badge>
            <Badge variant="gray" className="flex items-center gap-1">
              <Users size={10} />
              {assignedStudents.length} student{assignedStudents.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{assignment.description}</p>

          <a
            href={assignment.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
          >
            <ExternalLink size={14} />
            Open Assignment on Google Drive
          </a>
        </div>

        {/* Progress */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">
              Submission Progress
            </p>
            <span className="text-sm font-bold text-indigo-600">{completionPct}%</span>
          </div>
          <ProgressBar
            value={completionPct}
            color={completionPct === 100 ? 'emerald' : overdue ? 'red' : 'indigo'}
            size="md"
          />
          <p className="mt-2 text-xs text-gray-500">
            {submittedCount} of {assignedStudents.length} students submitted
          </p>
        </div>

        {/* Student table */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Student Submissions</h3>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
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
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">
                      No students assigned.
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
    </Modal>
  );
}
