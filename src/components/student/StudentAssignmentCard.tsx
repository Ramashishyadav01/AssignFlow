import React from 'react';
import type { Assignment, Submission } from '../../data/seedData';
import { formatDate, isOverdue, getDaysLeft } from '../../utils/dateUtils';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Calendar, ExternalLink, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface StudentAssignmentCardProps {
  assignment: Assignment;
  submission: Submission | undefined;
  onSubmit: (assignment: Assignment) => void;
}

export default function StudentAssignmentCard({
  assignment,
  submission,
  onSubmit,
}: StudentAssignmentCardProps) {
  const isSubmitted = !!submission;
  const overdue = isOverdue(assignment.dueDate);
  const daysLeft = getDaysLeft(assignment.dueDate);

  return (
    <div
      className={[
        'bg-white border shadow-sm rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow',
        overdue && !isSubmitted ? 'border-red-100' : 'border-gray-100',
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-1 flex-1">
          {assignment.title}
        </h3>
        {isSubmitted ? (
          <Badge variant="success" className="shrink-0 flex items-center gap-1">
            <CheckCircle size={10} />
            Submitted
          </Badge>
        ) : overdue ? (
          <Badge variant="danger" className="shrink-0 flex items-center gap-1">
            <AlertTriangle size={10} />
            Overdue
          </Badge>
        ) : (
          <Badge variant="warning" className="shrink-0 flex items-center gap-1">
            <Clock size={10} />
            Pending
          </Badge>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
        {assignment.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span
          className={[
            'flex items-center gap-1',
            overdue && !isSubmitted ? 'text-red-600 font-medium' : '',
          ].join(' ')}
        >
          <Calendar
            size={13}
            className={overdue && !isSubmitted ? 'text-red-500' : 'text-indigo-500'}
          />
          Due {formatDate(assignment.dueDate)}
          {!overdue && daysLeft >= 0 && (
            <span className="text-gray-400"> ({daysLeft}d left)</span>
          )}
        </span>
        {isSubmitted && submission && (
          <span className="flex items-center gap-1 text-emerald-600">
            <CheckCircle size={13} />
            Submitted on {formatDate(submission.submittedAt)}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-1">
        <a
          href={assignment.driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          <ExternalLink size={14} />
          Open Assignment
        </a>

        {!isSubmitted && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onSubmit(assignment)}
            className="flex items-center gap-1.5"
          >
            <CheckCircle size={14} />
            Yes, I have submitted
          </Button>
        )}
      </div>
    </div>
  );
}
