import React, { useMemo } from 'react';
import type { Assignment } from '../../data/seedData';
import { useAssignments } from '../../context/AssignmentContext';
import { getStudents } from '../../utils/storage';
import { formatDate, isOverdue, getDaysLeft } from '../../utils/dateUtils';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import Button from '../common/Button';
import {
  Calendar,
  Users,
  Eye,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
  onViewDetails: (assignment: Assignment) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignment: Assignment) => void;
}

export default function AssignmentCard({
  assignment,
  onViewDetails,
  onEdit,
  onDelete,
}: AssignmentCardProps) {
  const { submissions } = useAssignments();

  const { assignedStudents, submittedCount, pendingCount, completionPct } = useMemo(() => {
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

  const overdue = isOverdue(assignment.dueDate);
  const daysLeft = getDaysLeft(assignment.dueDate);

  return (
    <div className="bg-white border border-gray-200/80 shadow-sm rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-gray-900 line-clamp-1 flex-1">
          {assignment.title}
        </h3>
        {overdue ? (
          <Badge variant="danger" className="shrink-0 flex items-center gap-1">
            <AlertTriangle size={10} />
            Overdue
          </Badge>
        ) : (
          <Badge variant="info" className="shrink-0">
            Active
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
        {assignment.description}
      </p>

      {/* Meta Dates & Assignment info */}
      <div className="flex flex-wrap gap-y-1.5 gap-x-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar size={13} className={overdue ? 'text-red-500' : 'text-indigo-500'} />
          <span className={overdue ? 'text-red-600 font-medium' : ''}>
            Due {formatDate(assignment.dueDate)}
            {!overdue && daysLeft >= 0 && ` (${daysLeft}d left)`}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <Users size={13} className="text-indigo-500" />
          {assignedStudents.length} student{assignedStudents.length !== 1 ? 's' : ''} assigned
        </span>
      </div>

      {/* Explicit Submitted & Pending Badges */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100/90">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-emerald-700 font-semibold uppercase tracking-wider">
              Submitted
            </p>
            <p className="text-sm font-bold text-emerald-900">
              {submittedCount}{' '}
              <span className="text-xs font-normal text-emerald-700">/ {assignedStudents.length}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-100/90">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-amber-700 font-semibold uppercase tracking-wider">
              Pending
            </p>
            <p className="text-sm font-bold text-amber-900">
              {pendingCount}{' '}
              <span className="text-xs font-normal text-amber-700">students</span>
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span className="font-medium text-gray-600">Completion</span>
          <span className="font-bold text-indigo-600">{completionPct}%</span>
        </div>
        <ProgressBar
          value={completionPct}
          color={completionPct === 100 ? 'emerald' : overdue ? 'red' : 'indigo'}
          size="sm"
        />
      </div>

      {/* External Link */}
      <div className="pt-0.5">
        <a
          href={assignment.driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
        >
          <ExternalLink size={12} />
          Google Drive Submission Link
        </a>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-gray-100 flex-wrap">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onViewDetails(assignment)}
          className="flex items-center gap-1.5 flex-1 justify-center sm:flex-initial"
        >
          <Eye size={14} />
          View Details
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(assignment)}
          className="flex items-center gap-1.5"
        >
          <Pencil size={14} />
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(assignment)}
          className="flex items-center gap-1.5"
        >
          <Trash2 size={14} />
          Delete
        </Button>
      </div>
    </div>
  );
}
