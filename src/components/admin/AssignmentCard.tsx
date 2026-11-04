import React, { useMemo } from 'react';
import { Assignment } from '../../data/seedData';
import { useAssignments } from '../../context/AssignmentContext';
import { getStudents, getSubmissionsForAssignment, getSubmissionForStudent } from '../../utils/storage';
import { formatDate, isOverdue, getDaysLeft } from '../../utils/dateUtils';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import Button from '../common/Button';
import { Calendar, Users, ExternalLink, Eye, Pencil, Trash2, AlertTriangle } from 'lucide-react';

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

  const { assignedStudents, submittedCount, completionPct } = useMemo(() => {
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

  const overdue = isOverdue(assignment.dueDate);
  const daysLeft = getDaysLeft(assignment.dueDate);

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-1 flex-1">
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

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar size={13} className={overdue ? 'text-red-500' : 'text-indigo-500'} />
          <span className={overdue ? 'text-red-600 font-medium' : ''}>
            Due {formatDate(assignment.dueDate)}
            {!overdue && daysLeft >= 0 && ` (${daysLeft}d left)`}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <Users size={13} className="text-indigo-500" />
          {assignedStudents.length} student{assignedStudents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>
            Submitted: {submittedCount} / {assignedStudents.length}
          </span>
          <span className="font-medium text-indigo-600">{completionPct}%</span>
        </div>
        <ProgressBar
          value={completionPct}
          color={completionPct === 100 ? 'emerald' : overdue ? 'red' : 'indigo'}
          size="sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 flex-wrap">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onViewDetails(assignment)}
          className="flex items-center gap-1.5"
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
