import React, { useState } from 'react';
import { Assignment } from '../../data/seedData';
import { useAssignments } from '../../context/AssignmentContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface SubmissionModalProps {
  assignment: Assignment | null;
  onClose: () => void;
}

export default function SubmissionModal({ assignment, onClose }: SubmissionModalProps) {
  const { markSubmitted } = useAssignments();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleConfirm = () => {
    if (!assignment || !currentUser) return;
    setLoading(true);
    try {
      markSubmitted(assignment.id, currentUser.id);
      showToast(`"${assignment.title}" marked as submitted!`, 'success');
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={!!assignment}
      onClose={handleClose}
      title="Confirm Assignment Submission"
      size="sm"
    >
      <div className="p-6">
        {step === 1 ? (
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="p-4 bg-indigo-50 rounded-full">
              <CheckCircle size={36} className="text-indigo-600" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Have you submitted on Google Drive?
              </h3>
              <p className="text-sm text-gray-500">
                Click the button below to confirm that you have submitted this assignment.
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <Button variant="ghost" onClick={handleClose} fullWidth>
                Not Yet
              </Button>
              <Button variant="primary" onClick={() => setStep(2)} fullWidth>
                Confirm Submission
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Are you sure you have submitted <strong>{assignment?.title}</strong>? Once
                confirmed, your status will be updated to{' '}
                <strong>Submitted</strong> and cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setStep(1)} disabled={loading}>
                Go Back
              </Button>
              <Button variant="primary" onClick={handleConfirm} loading={loading}>
                Yes, Confirm
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
