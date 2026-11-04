import React from 'react';
import type { Assignment, Submission } from '../../data/seedData';
import { isOverdue } from '../../utils/dateUtils';
import StatCard from '../common/StatCard';
import { ClipboardList, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface StudentProgressProps {
  assignments: Assignment[];
  submissions: Submission[];
  studentId: string;
}

export default function StudentProgress({
  assignments,
  submissions,
  studentId,
}: StudentProgressProps) {
  const total = assignments.length;
  const submitted = submissions.filter((s) => s.studentId === studentId).length;
  const pending = total - submitted;
  const overdue = assignments.filter(
    (a) =>
      isOverdue(a.dueDate) &&
      !submissions.find((s) => s.assignmentId === a.id && s.studentId === studentId)
  ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={<ClipboardList size={22} />}
        label="Total Assigned"
        value={total}
        color="indigo"
      />
      <StatCard
        icon={<CheckCircle size={22} />}
        label="Submitted"
        value={submitted}
        color="emerald"
      />
      <StatCard
        icon={<Clock size={22} />}
        label="Pending"
        value={pending}
        color="amber"
      />
      <StatCard
        icon={<AlertTriangle size={22} />}
        label="Overdue"
        value={overdue}
        color="red"
      />
    </div>
  );
}
