import React from 'react';
import { User, Submission } from '../../data/seedData';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/dateUtils';

interface StudentSubmissionRowProps {
  student: User;
  submission: Submission | undefined;
}

export default function StudentSubmissionRow({
  student,
  submission,
}: StudentSubmissionRowProps) {
  const isSubmitted = !!submission;

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xs font-bold shrink-0">
            {student.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <span className="text-sm font-medium text-gray-900">{student.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{student.email}</td>
      <td className="px-4 py-3">
        <Badge variant={isSubmitted ? 'success' : 'warning'}>
          {isSubmitted ? 'Submitted' : 'Pending'}
        </Badge>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {isSubmitted ? formatDate(submission!.submittedAt) : '—'}
      </td>
    </tr>
  );
}
