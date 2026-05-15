import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getSubmissions, updateSubmission, deleteSubmission } from '../utils/storage';
import { logout } from '../utils/adminAuth';
import SubmissionTable from './SubmissionTable';
import EditModal from './EditModal';

function formatDate(isoString) {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}

export default function AdminDashboard({ onLogout }) {
  const [submissions, setSubmissions] = useState(() => getSubmissions());
  const [editingSubmission, setEditingSubmission] = useState(null);

  const refreshData = useCallback(() => {
    setSubmissions(getSubmissions());
  }, []);

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  const handleEdit = (submission) => {
    setEditingSubmission(submission);
  };

  const handleEditSave = (updates) => {
    if (editingSubmission) {
      updateSubmission(editingSubmission.id, updates);
      setEditingSubmission(null);
      refreshData();
    }
  };

  const handleEditClose = () => {
    setEditingSubmission(null);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this submission?');
    if (confirmed) {
      deleteSubmission(id);
      refreshData();
    }
  };

  const totalSubmissions = submissions.length;

  const uniqueDepartments = new Set(submissions.map((s) => s.department)).size;

  const latestSubmission = submissions.length > 0
    ? formatDate(
        submissions.reduce((latest, s) => {
          const currentDate = new Date(s.submittedAt);
          const latestDate = new Date(latest);
          return currentDate > latestDate ? s.submittedAt : latest;
        }, submissions[0].submittedAt)
      )
    : 'N/A';

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)' }}>
        <h1>Admin Dashboard</h1>
        <button type="button" className="btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-label">Total Submissions</div>
          <div className="stat-value">{totalSubmissions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Departments</div>
          <div className="stat-value">{uniqueDepartments}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Latest Submission</div>
          <div className="stat-value" style={{ fontSize: 'var(--font-size-lg)' }}>{latestSubmission}</div>
        </div>
      </div>

      <SubmissionTable
        submissions={submissions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingSubmission && (
        <EditModal
          submission={editingSubmission}
          onSave={handleEditSave}
          onClose={handleEditClose}
        />
      )}
    </div>
  );
}

AdminDashboard.propTypes = {
  onLogout: PropTypes.func,
};