// Utility functions for handling image URLs

const API_BASE_URL = window.location.origin;

/**
 * Get the full URL for an image
 * @param {string} imagePath - The image path from the database
 * @returns {string} - The full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a data URL, return as is
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // If it starts with /, it's a relative path from server
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // Otherwise, prepend /
  return `${API_BASE_URL}/${imagePath}`;
};

/**
 * Get avatar URL with fallback to default
 * @param {string} avatarPath - The avatar path from the database
 * @returns {string} - The avatar URL or default avatar
 */
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZTllY2VmIi8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjI1IiBmaWxsPSIjNmM3NTdkIi8+CjxwYXRoIGQ9Ik0zMCAxMjBjMC0yNSAyMC00NSA0NS00NXM0NSAyMCA0NSA0NXYzMEgzMHoiIGZpbGw9IiM2Yzc1N2QiLz4KPHN2Zz4K';
  }
  
  return getImageUrl(avatarPath);
};

export default {
  getImageUrl,
  getAvatarUrl
};
