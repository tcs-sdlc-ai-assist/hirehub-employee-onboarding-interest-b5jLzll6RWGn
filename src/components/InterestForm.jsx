import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { validateName, validateEmail, validateMobile, validateDepartment } from '../utils/validators';
import { addSubmission, isEmailDuplicate } from '../utils/storage';

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Human Resources',
  'Finance',
  'Operations',
  'Sales',
  'Data Science',
];

export default function InterestForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullName: validateName(formData.fullName),
      email: validateEmail(formData.email),
      mobile: validateMobile(formData.mobile),
      department: validateDepartment(formData.department),
    };

    if (!newErrors.email && isEmailDuplicate(formData.email)) {
      newErrors.email = 'This email has already been submitted.';
    }

    setErrors(newErrors);

    return !newErrors.fullName && !newErrors.email && !newErrors.mobile && !newErrors.department;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      addSubmission({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        department: formData.department.trim(),
      });

      setFormData({
        fullName: '',
        email: '',
        mobile: '',
        department: '',
      });

      setErrors({
        fullName: '',
        email: '',
        mobile: '',
        department: '',
      });

      setSuccessMessage('Your interest has been submitted successfully!');
    } catch (err) {
      if (err.message === 'Duplicate email') {
        setErrors((prev) => ({ ...prev, email: 'This email has already been submitted.' }));
      } else {
        console.error('Error submitting form:', err);
      }
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>Submit Your Interest</h2>

        {successMessage && (
          <div className="form-success">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'input-error' : ''}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <div className="error-message">{errors.fullName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className={errors.mobile ? 'input-error' : ''}
              placeholder="Enter your 10-digit mobile number"
            />
            {errors.mobile && (
              <div className="error-message">{errors.mobile}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="department">Department of Interest</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={errors.department ? 'input-error' : ''}
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <div className="error-message">{errors.department}</div>
            )}
          </div>

          <button type="submit" className="btn-primary">
            Submit
          </button>
        </form>

        <div className="text-center mt-md">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}