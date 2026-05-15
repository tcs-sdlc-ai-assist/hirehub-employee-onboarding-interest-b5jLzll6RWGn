import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { validateName, validateMobile, validateDepartment, ALLOWED_DEPARTMENTS } from '../utils/validators';

export default function EditModal({ submission, onSave, onClose }) {
  const [formData, setFormData] = useState({
    fullName: submission.fullName || '',
    mobile: submission.mobile || '',
    department: submission.department || '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    mobile: '',
    department: '',
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullName: validateName(formData.fullName),
      mobile: validateMobile(formData.mobile),
      department: validateDepartment(formData.department),
    };

    setErrors(newErrors);

    return !newErrors.fullName && !newErrors.mobile && !newErrors.department;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave({
      fullName: formData.fullName.trim(),
      mobile: formData.mobile.trim(),
      department: formData.department.trim(),
    });
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Submission</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="edit-fullName">Full Name</label>
              <input
                type="text"
                id="edit-fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'input-error' : ''}
                placeholder="Enter full name"
              />
              {errors.fullName && (
                <div className="error-message">{errors.fullName}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-email">Email Address</label>
              <input
                type="email"
                id="edit-email"
                name="email"
                value={submission.email}
                readOnly
                style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-mobile">Mobile Number</label>
              <input
                type="tel"
                id="edit-mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={errors.mobile ? 'input-error' : ''}
                placeholder="Enter 10-digit mobile number"
              />
              {errors.mobile && (
                <div className="error-message">{errors.mobile}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-department">Department of Interest</label>
              <select
                id="edit-department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={errors.department ? 'input-error' : ''}
              >
                <option value="">Select a department</option>
                {ALLOWED_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <div className="error-message">{errors.department}</div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditModal.propTypes = {
  submission: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    submittedAt: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};