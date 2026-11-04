import React from 'react';
import type { User, Submission } from '../../data/seedData';
import { formatDate } from '../../utils/dateUtils';
import { CheckCircle, Clock } from 'lucide-react';

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
    <tr className="hover:bg-gray-50/80 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
            {student.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <span className="text-sm font-semibold text-gray-900">{student.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{student.email}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        {isSubmitted ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/80">
            <CheckCircle size={12} className="text-emerald-600" />
            Submitted
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200/80">
            <Clock size={12} className="text-amber-600" />
            Pending
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
        {isSubmitted ? formatDate(submission!.submittedAt) : '—'}
      </td>
    </tr>
  );
}
