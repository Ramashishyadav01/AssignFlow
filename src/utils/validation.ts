export interface AssignmentFormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
  driveLink?: string;
  assignedStudentIds?: string;
}

export interface AssignmentFormValues {
  title: string;
  description: string;
  dueDate: string;
  driveLink: string;
  assignTo: 'all' | 'selected';
  selectedStudentIds: string[];
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateAssignmentForm(
  values: AssignmentFormValues,
  isEdit: boolean
): AssignmentFormErrors {
  const errors: AssignmentFormErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Title is required.';
  } else if (values.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required.';
  } else if (values.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }

  if (!values.dueDate) {
    errors.dueDate = 'Due date is required.';
  } else if (!isEdit) {
    const due = new Date(values.dueDate);
    due.setHours(23, 59, 59, 999);
    if (due < new Date()) {
      errors.dueDate = 'Due date must be a future date.';
    }
  }

  if (!values.driveLink.trim()) {
    errors.driveLink = 'Google Drive link is required.';
  } else if (!isValidUrl(values.driveLink.trim())) {
    errors.driveLink = 'Please enter a valid URL.';
  }

  if (values.assignTo === 'selected' && values.selectedStudentIds.length === 0) {
    errors.assignedStudentIds = 'Please select at least one student.';
  }

  return errors;
}
