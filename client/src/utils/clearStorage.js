// Utility to clear all auth data
export const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  console.log('Cleared all auth storage');
};

// Run this in browser console: clearAuthStorage()
window.clearAuthStorage = clearAuthStorage;