import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/common/StatCard';
import AssignmentCard from '../components/admin/AssignmentCard';
import AssignmentForm from '../components/admin/AssignmentForm';
import AssignmentDetailModal from '../components/admin/AssignmentDetailModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useAssignments } from '../context/AssignmentContext';
import { useToast } from '../components/common/Toast';
import { getStudents } from '../utils/storage';
import { isOverdue } from '../utils/dateUtils';
import { Assignment } from '../data/seedData';
import {
  ClipboardList,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  Search,
  SlidersHorizontal,
  ClipboardX,
} from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const { assignments, submissions, deleteAssignment } = useAssignments();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'title' | 'completion'>('dueDate');
  const [filterOverdue, setFilterOverdue] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [viewingAssignment, setViewingAssignment] = useState<Assignment | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState<Assignment | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const myAssignments = useMemo(
    () => assignments.filter((a) => a.createdBy === currentUser?.id),
    [assignments, currentUser]
  );

  const allStudents = useMemo(() => getStudents(), []);

  const stats = useMemo(() => {
    const totalAssignments = myAssignments.length;

    // Deduplicated assigned student ids across all my assignments
    const assignedStudentSet = new Set<string>();
    myAssignments.forEach((a) => {
      if (a.assignedStudentIds.includes('all')) {
        allStudents.forEach((s) => assignedStudentSet.add(s.id));
      } else {
        a.assignedStudentIds.forEach((id) => assignedStudentSet.add(id));
      }
    });
    const totalStudentsAssigned = assignedStudentSet.size;

    // Submissions that belong to my assignments
    const mySubmissions = submissions.filter((s) =>
      myAssignments.some((a) => a.id === s.assignmentId)
    );
    const totalSubmissions = mySubmissions.length;

    // Pending: sum of (assigned - submitted) for each assignment
    let pendingTotal = 0;
    let possibleTotal = 0;
    myAssignments.forEach((a) => {
      const assigned = a.assignedStudentIds.includes('all')
        ? allStudents.length
        : a.assignedStudentIds.length;
      const submitted = submissions.filter((s) => s.assignmentId === a.id).length;
      pendingTotal += Math.max(0, assigned - submitted);
      possibleTotal += assigned;
    });

    const completionPct =
      possibleTotal > 0 ? Math.round((totalSubmissions / possibleTotal) * 100) : 0;

    return {
      totalAssignments,
      totalStudentsAssigned,
      totalSubmissions,
      pendingTotal,
      completionPct,
    };
  }, [myAssignments, submissions, allStudents]);

  const getCompletionPct = (a: Assignment) => {
    const assigned = a.assignedStudentIds.includes('all')
      ? allStudents.length
      : a.assignedStudentIds.length;
    if (assigned === 0) return 0;
    const submitted = submissions.filter((s) => s.assignmentId === a.id).length;
    return Math.round((submitted / assigned) * 100);
  };

  const filteredAssignments = useMemo(() => {
    let list = [...myAssignments];

    if (filterOverdue) {
      list = list.filter((a) => isOverdue(a.dueDate));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'completion') {
        return getCompletionPct(b) - getCompletionPct(a);
      }
      return 0;
    });

    return list;
  }, [myAssignments, search, sortBy, filterOverdue, submissions]);

  const handleDelete = () => {
    if (!deletingAssignment) return;
    setDeleteLoading(true);
    deleteAssignment(deletingAssignment.id);
    showToast('Assignment deleted.', 'info');
    setDeleteLoading(false);
    setDeletingAssignment(null);
  };

  return (
    <DashboardLayout pageTitle="Admin Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          icon={<ClipboardList size={22} />}
          label="Total Assignments"
          value={stats.totalAssignments}
          color="indigo"
        />
        <StatCard
          icon={<Users size={22} />}
          label="Students Assigned"
          value={stats.totalStudentsAssigned}
          color="violet"
        />
        <StatCard
          icon={<CheckCircle size={22} />}
          label="Total Submissions"
          value={stats.totalSubmissions}
          color="emerald"
        />
        <StatCard
          icon={<Clock size={22} />}
          label="Pending"
          value={stats.pendingTotal}
          color="amber"
        />
        <div className="col-span-2 lg:col-span-1 bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <TrendingUp size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Class Completion</p>
              <p className="text-xl font-bold text-gray-900">{stats.completionPct}%</p>
            </div>
          </div>
          <ProgressBar
            value={stats.completionPct}
            color={stats.completionPct === 100 ? 'emerald' : 'indigo'}
            size="md"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
          >
            <option value="dueDate">Sort: Due Date</option>
            <option value="title">Sort: Title</option>
            <option value="completion">Sort: Completion %</option>
          </select>
        </div>

        <button
          onClick={() => setFilterOverdue((v) => !v)}
          className={[
            'px-3 py-2 text-sm rounded-xl border transition-colors font-medium',
            filterOverdue
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50',
          ].join(' ')}
        >
          {filterOverdue ? '✕ Overdue Only' : 'Filter: Overdue'}
        </button>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setEditingAssignment(null);
            setShowForm(true);
          }}
          className="flex items-center gap-1.5 shrink-0"
        >
          <Plus size={16} />
          New Assignment
        </Button>
      </div>

      {/* Assignment Grid */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          icon={<ClipboardX size={48} />}
          title="No assignments found"
          message={
            myAssignments.length === 0
              ? "You haven't created any assignments yet."
              : 'No assignments match your current filters.'
          }
          action={
            myAssignments.length === 0
              ? {
                  label: 'Create Your First Assignment',
                  onClick: () => setShowForm(true),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onViewDetails={(a) => setViewingAssignment(a)}
              onEdit={(a) => {
                setEditingAssignment(a);
                setShowForm(true);
              }}
              onDelete={(a) => setDeletingAssignment(a)}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingAssignment(null);
        }}
        title={editingAssignment ? 'Edit Assignment' : 'New Assignment'}
        size="lg"
      >
        <AssignmentForm
          existingAssignment={editingAssignment}
          onClose={() => {
            setShowForm(false);
            setEditingAssignment(null);
          }}
        />
      </Modal>

      {/* Detail Modal */}
      <AssignmentDetailModal
        assignment={viewingAssignment}
        onClose={() => setViewingAssignment(null)}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deletingAssignment}
        onClose={() => setDeletingAssignment(null)}
        onConfirm={handleDelete}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${deletingAssignment?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteLoading}
      />
    </DashboardLayout>
  );
}
