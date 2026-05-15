const ALLOWED_DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product', 'Legal', 'Support'];

/**
 * Validates a full name string.
 * @param {string} name - The name to validate
 * @returns {string} Error message string, or empty string if valid
 */
export function validateName(name) {
  if (!name || name.trim().length === 0) {
    return 'Full name is required.';
  }
  if (name.trim().length < 2) {
    return 'Full name must be at least 2 characters.';
  }
  return '';
}

/**
 * Validates an email address string using regex.
 * @param {string} email - The email to validate
 * @returns {string} Error message string, or empty string if valid
 */
export function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return 'Email is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address.';
  }
  return '';
}

/**
 * Validates a mobile number string (10-digit numeric format).
 * @param {string} mobile - The mobile number to validate
 * @returns {string} Error message string, or empty string if valid
 */
export function validateMobile(mobile) {
  if (!mobile || mobile.trim().length === 0) {
    return 'Mobile number is required.';
  }
  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobile.trim())) {
    return 'Mobile number must be exactly 10 digits.';
  }
  return '';
}

/**
 * Validates a department string against the allowed department list.
 * @param {string} department - The department to validate
 * @returns {string} Error message string, or empty string if valid
 */
export function validateDepartment(department) {
  if (!department || department.trim().length === 0) {
    return 'Department is required.';
  }
  if (!ALLOWED_DEPARTMENTS.includes(department.trim())) {
    return 'Please select a valid department.';
  }
  return '';
}

export { ALLOWED_DEPARTMENTS };