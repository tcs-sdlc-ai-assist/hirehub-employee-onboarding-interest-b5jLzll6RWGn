import PropTypes from 'prop-types';

const DEPARTMENT_BADGE_MAP = {
  Engineering: 'badge-success',
  Design: 'badge-success',
  Marketing: 'badge-warning',
  'Human Resources': 'badge-warning',
  Finance: 'badge-danger',
  Operations: 'badge-warning',
  Sales: 'badge-success',
  'Data Science': 'badge-success',
  HR: 'badge-warning',
  Product: 'badge-success',
  Legal: 'badge-danger',
  Support: 'badge-warning',
};

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

function getBadgeClass(department) {
  return DEPARTMENT_BADGE_MAP[department] || 'badge-warning';
}

export default function SubmissionTable({ submissions, onEdit, onDelete }) {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="table-container">
        <div className="table-empty">No submissions yet.</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Department</th>
            <th>Submitted On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => (
            <tr key={submission.id}>
              <td>{index + 1}</td>
              <td>{submission.fullName}</td>
              <td>{submission.email}</td>
              <td>{submission.mobile}</td>
              <td>
                <span className={`badge ${getBadgeClass(submission.department)}`}>
                  {submission.department}
                </span>
              </td>
              <td>{formatDate(submission.submittedAt)}</td>
              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => onEdit(submission)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-danger btn-sm"
                    onClick={() => onDelete(submission.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

SubmissionTable.propTypes = {
  submissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      mobile: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      submittedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};