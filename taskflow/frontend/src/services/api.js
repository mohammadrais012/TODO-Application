/**
 * API Service for TaskFlow
 * Handles all HTTP requests to the backend server with JWT authorization
 */

const API_BASE_URL = import.meta.env?.VITE_API_URL || '';

/**
 * Token and User session management via localStorage
 */
export const getToken = () => localStorage.getItem('taskflow_token');

export const setAuthData = (token, user) => {
  localStorage.setItem('taskflow_token', token);
  localStorage.setItem('taskflow_user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('taskflow_token');
  localStorage.removeItem('taskflow_user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('taskflow_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Helper to execute fetch requests with Authorization headers
 */
const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // If backend returns a custom friendly message, throw it
    const errorMessage = data.message || 'Something went wrong. Please try again.';
    throw new Error(errorMessage);
  }

  return data;
};

// ==========================================
// Authentication APIs
// ==========================================

export const signup = async (name, email, password) => {
  return await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
};

export const login = async (email, password) => {
  return await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

// ==========================================
// Task CRUD APIs
// ==========================================

export const getTasks = async () => {
  return await request('/api/tasks', {
    method: 'GET',
  });
};

export const createTask = async ({ title, description, priority }) => {
  return await request('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, description, priority }),
  });
};

export const updateTask = async (id, updateFields) => {
  return await request(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateFields),
  });
};

export const deleteTask = async (id) => {
  return await request(`/api/tasks/${id}`, {
    method: 'DELETE',
  });
};
