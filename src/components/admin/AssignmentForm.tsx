import React, { useState, useEffect } from 'react';
import { Assignment } from '../../data/seedData';
import { useAssignments } from '../../context/AssignmentContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { validateAssignmentForm, AssignmentFormValues } from '../../utils/validation';
import { getStudents } from '../../utils/storage';
import { User } from '../../data/seedData';
import Button from '../common/Button';

interface AssignmentFormProps {
  existingAssignment?: Assignment | null;
  onClose: () => void;
}

const defaultValues: AssignmentFormValues = {
  title: '',
  description: '',
  dueDate: '',
  driveLink: '',
  assignTo: 'all',
  selectedStudentIds: [],
};

export default function AssignmentForm({ existingAssignment, onClose }: AssignmentFormProps) {
  const { addAssignment, updateAssignment } = useAssignments();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [students, setStudents] = useState<User[]>([]);
  const [values, setValues] = useState<AssignmentFormValues>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isEdit = !!existingAssignment;

  useEffect(() => {
    setStudents(getStudents());
  }, []);

  useEffect(() => {
    if (existingAssignment) {
      const isAll = existingAssignment.assignedStudentIds.includes('all');
      setValues({
        title: existingAssignment.title,
        description: existingAssignment.description,
        dueDate: existingAssignment.dueDate,
        driveLink: existingAssignment.driveLink,
        assignTo: isAll ? 'all' : 'selected',
        selectedStudentIds: isAll ? [] : existingAssignment.assignedStudentIds,
      });
    } else {
      setValues(defaultValues);
    }
  }, [existingAssignment]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAssignTo = (val: 'all' | 'selected') => {
    setValues((prev) => ({ ...prev, assignTo: val, selectedStudentIds: [] }));
    setErrors((prev) => ({ ...prev, assignedStudentIds: '' }));
  };

  const handleStudentToggle = (id: string) => {
    setValues((prev) => ({
      ...prev,
      selectedStudentIds: prev.selectedStudentIds.includes(id)
        ? prev.selectedStudentIds.filter((s) => s !== id)
        : [...prev.selectedStudentIds, id],
    }));
    setErrors((prev) => ({ ...prev, assignedStudentIds: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateAssignmentForm(values, isEdit);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors as Record<string, string>);
      return;
    }

    setLoading(true);
    try {
      const assignedStudentIds =
        values.assignTo === 'all' ? ['all'] : values.selectedStudentIds;

      if (isEdit && existingAssignment) {
        updateAssignment(existingAssignment.id, {
          title: values.title.trim(),
          description: values.description.trim(),
          dueDate: values.dueDate,
          driveLink: values.driveLink.trim(),
          assignedStudentIds,
        });
        showToast('Assignment updated successfully!', 'success');
      } else {
        addAssignment({
          title: values.title.trim(),
          description: values.description.trim(),
          dueDate: values.dueDate,
          driveLink: values.driveLink.trim(),
          assignedStudentIds,
          createdBy: currentUser!.id,
        });
        showToast('Assignment created successfully!', 'success');
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="p-6 flex flex-col gap-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Assignment title"
          className={[
            'w-full border rounded-xl px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow',
            errors.title ? 'border-red-400' : 'border-gray-200',
          ].join(' ')}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Describe the assignment..."
          rows={4}
          className={[
            'w-full border rounded-xl px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none',
            errors.description ? 'border-red-400' : 'border-gray-200',
          ].join(' ')}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="dueDate"
          value={values.dueDate}
          onChange={handleChange}
          className={[
            'w-full border rounded-xl px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow',
            errors.dueDate ? 'border-red-400' : 'border-gray-200',
          ].join(' ')}
        />
        {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>}
      </div>

      {/* Drive Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Google Drive Link <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          name="driveLink"
          value={values.driveLink}
          onChange={handleChange}
          placeholder="https://drive.google.com/..."
          className={[
            'w-full border rounded-xl px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow',
            errors.driveLink ? 'border-red-400' : 'border-gray-200',
          ].join(' ')}
        />
        {errors.driveLink && (
          <p className="mt-1 text-xs text-red-500">{errors.driveLink}</p>
        )}
      </div>

      {/* Assign To */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign To <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={values.assignTo === 'all'}
              onChange={() => handleAssignTo('all')}
              className="accent-indigo-600"
            />
            <span className="text-sm text-gray-700">All Students</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={values.assignTo === 'selected'}
              onChange={() => handleAssignTo('selected')}
              className="accent-indigo-600"
            />
            <span className="text-sm text-gray-700">Selected Students</span>
          </label>
        </div>

        {values.assignTo === 'selected' && (
          <div className="border border-gray-200 rounded-xl p-3 max-h-44 overflow-y-auto space-y-2">
            {students.map((student) => (
              <label
                key={student.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1"
              >
                <input
                  type="checkbox"
                  checked={values.selectedStudentIds.includes(student.id)}
                  onChange={() => handleStudentToggle(student.id)}
                  className="accent-indigo-600 w-4 h-4"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{student.name}</p>
                  <p className="text-xs text-gray-400">{student.email}</p>
                </div>
              </label>
            ))}
          </div>
        )}
        {errors.assignedStudentIds && (
          <p className="mt-1 text-xs text-red-500">{errors.assignedStudentIds}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={loading}>
          {isEdit ? 'Update Assignment' : 'Create Assignment'}
        </Button>
      </div>
    </form>
  );
}
