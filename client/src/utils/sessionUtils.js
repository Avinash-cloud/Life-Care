// Session management utilities
let lastUpdateTime = 0;
const UPDATE_THROTTLE = 60000; // Only update once per minute

export const sessionUtils = {
  // Check if session is likely expired based on last activity
  isSessionExpired: () => {
    const lastActivity = localStorage.getItem('lastActivity');
    if (!lastActivity) return false;
    
    const now = Date.now();
    const lastActivityTime = parseInt(lastActivity);
    const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
    
    return (now - lastActivityTime) > sessionTimeout;
  },

  // Update last activity timestamp (throttled)
  updateLastActivity: () => {
    const now = Date.now();
    if (now - lastUpdateTime < UPDATE_THROTTLE) {
      return; // Skip update if called too frequently
    }
    lastUpdateTime = now;
    localStorage.setItem('lastActivity', now.toString());
  },

  // Clear session data
  clearSession: () => {
    localStorage.removeItem('lastActivity');
    localStorage.removeItem('user');
    sessionStorage.clear();
    lastUpdateTime = 0;
  },

  // Initialize session tracking
  initSessionTracking: () => {
    // Use fewer, more meaningful events to reduce overhead
    const events = ['click', 'keydown', 'scroll'];
    
    const updateActivity = () => {
      sessionUtils.updateLastActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Initial activity update
    sessionUtils.updateLastActivity();

    // Return cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }
};