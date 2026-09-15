// Central place for auth API calls and token management.
// All calls go to /api/v1/auth/* on port 5000.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Register a new user.
 * @returns {{ user, token }} on success
 * @throws Error with message on failure
 */
export async function registerUser({ name, email, password }) {
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error?.message || 'Registration failed. Please try again.');
  }

  return data.data; // { user, token }
}

/**
 * Login an existing user.
 * @returns {{ user, token }} on success
 * @throws Error with message on failure
 */
export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error?.message || 'Invalid email or password.');
  }

  return data.data; // { user, token }
}

/**
 * Save token to localStorage.
 */
export function saveToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('repolens_token', token);
  }
}

/**
 * Get saved token.
 */
export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('repolens_token');
  }
  return null;
}

/**
 * Remove token (logout).
 */
export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('repolens_token');
  }
}

/**
 * Check if user is currently logged in.
 */
export function isLoggedIn() {
  return !!getToken();
}
