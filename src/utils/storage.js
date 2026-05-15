const STORAGE_KEY = 'hirehub_submissions';

/**
 * Generates a UUID v4 string
 * @returns {string} A UUID string
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Retrieves all submissions from localStorage.
 * Resets to empty array on parse error or corrupted data.
 * @returns {Array<Object>} Array of submission objects
 */
export function getSubmissions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data === null) {
      return [];
    }
    const submissions = JSON.parse(data);
    if (!Array.isArray(submissions)) {
      console.error('Storage data is not an array. Resetting to [].');
      localStorage.setItem(STORAGE_KEY, '[]');
      return [];
    }
    return submissions;
  } catch (e) {
    console.error('Error parsing submissions from localStorage:', e);
    localStorage.setItem(STORAGE_KEY, '[]');
    return [];
  }
}

/**
 * Saves the entire submissions array to localStorage.
 * @param {Array<Object>} submissions - Array of submission objects to save
 */
export function saveSubmissions(submissions) {
  try {
    if (!Array.isArray(submissions)) {
      console.error('saveSubmissions expects an array. Received:', typeof submissions);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.error('Error saving submissions to localStorage:', e);
  }
}

/**
 * Adds a new submission to localStorage.
 * Generates a UUID id and ISO timestamp automatically.
 * @param {Object} submission - Submission object (fullName, email, mobile, department)
 * @throws {Error} If email is a duplicate
 */
export function addSubmission(submission) {
  if (isEmailDuplicate(submission.email)) {
    throw new Error('Duplicate email');
  }
  const submissions = getSubmissions();
  const newSubmission = {
    ...submission,
    id: generateUUID(),
    submittedAt: new Date().toISOString(),
  };
  submissions.push(newSubmission);
  saveSubmissions(submissions);
  return newSubmission;
}

/**
 * Updates an existing submission by id, merging in the provided updates.
 * @param {string} id - The UUID of the submission to update
 * @param {Object} updates - Partial submission object with fields to update
 * @returns {Object|null} The updated submission, or null if not found
 */
export function updateSubmission(id, updates) {
  const submissions = getSubmissions();
  const index = submissions.findIndex((s) => s.id === id);
  if (index === -1) {
    console.error('Submission not found for id:', id);
    return null;
  }
  submissions[index] = { ...submissions[index], ...updates };
  saveSubmissions(submissions);
  return submissions[index];
}

/**
 * Deletes a submission by id.
 * @param {string} id - The UUID of the submission to delete
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteSubmission(id) {
  const submissions = getSubmissions();
  const filtered = submissions.filter((s) => s.id !== id);
  if (filtered.length === submissions.length) {
    console.error('Submission not found for deletion, id:', id);
    return false;
  }
  saveSubmissions(filtered);
  return true;
}

/**
 * Checks if an email already exists in submissions.
 * @param {string} email - The email to check
 * @param {string} [excludeId] - Optional id to exclude from the check (for edit scenarios)
 * @returns {boolean} True if a duplicate email exists
 */
export function isEmailDuplicate(email, excludeId) {
  const submissions = getSubmissions();
  const normalizedEmail = email.toLowerCase().trim();
  return submissions.some(
    (s) => s.email.toLowerCase().trim() === normalizedEmail && s.id !== excludeId
  );
}