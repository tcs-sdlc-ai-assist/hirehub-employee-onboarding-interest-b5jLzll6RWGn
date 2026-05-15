const AUTH_KEY = 'hirehub_admin_auth';

/**
 * Attempts to log in with the provided credentials.
 * Validates against hardcoded credentials ('admin'/'admin').
 * @param {string} username - The username to validate
 * @param {string} password - The password to validate
 * @returns {{ success: boolean, error?: string }} Result object
 */
export function login(username, password) {
  if (username === 'admin' && password === 'admin') {
    sessionStorage.setItem(AUTH_KEY, 'true');
    return { success: true };
  }
  return { success: false, error: 'Invalid credentials' };
}

/**
 * Logs out the admin by removing the auth key from sessionStorage.
 */
export function logout() {
  sessionStorage.removeItem(AUTH_KEY);
}

/**
 * Checks if the admin is currently authenticated.
 * @returns {boolean} True if authenticated, false otherwise
 */
export function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}