import axios from 'axios';

// Create axios instance with base URL
const baseURL = '/api';
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for cookies/CORS
});

// For debugging
console.log('API Base URL:', baseURL);

// Add request logging
api.interceptors.request.use(request => {
  console.log('Starting API Request:', request.method, request.url);
  return request;
});

// Add response logging and validation
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    
    // Validate response data
    if (response.data === undefined || response.data === null) {
      console.warn('API returned undefined/null data:', response.config.url);
    }
    
    return response;
  },
  error => {
    console.error('API Error:', error.response?.status, error.config?.url);
    console.error('Error details:', error.response?.data);
    
    // Handle cases where response is not JSON
    if (error.response && typeof error.response.data === 'string') {
      console.error('Non-JSON response received:', error.response.data.substring(0, 200));
    }
    
    return Promise.reject(error);
  }
);



let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve();
  });
  failedQueue = [];
};

// Public routes that don't require authentication
const publicRoutes = [
  '/cms/blogs',
  '/cms/videos', 
  '/cms/gallery',
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/auth/reset-password'
];

const isPublicRoute = (url) => {
  return publicRoutes.some(route => url?.includes(route));
};

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Skip auth handling for public routes
    if (isPublicRoute(originalRequest?.url)) {
      return Promise.reject(error);
    }
    
    // Don't retry refresh-token endpoint to prevent infinite loops
    if (error.config?.url?.includes('/auth/refresh-token')) {
      isRefreshing = false;
      processQueue(error, null);
      if (window.updateAuthUser) {
        window.updateAuthUser(null);
      }
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      
      // Only redirect to login if not on public page
      const publicPaths = ['/', '/about', '/blog', '/gallery', '/videos', '/contact', '/login', '/register'];
      const isPublicPage = publicPaths.some(path => 
        window.location.pathname === path || window.location.pathname.startsWith(path)
      );
      
      if (!isPublicPage && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh-token');
        isRefreshing = false;
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        
        const publicPaths = ['/', '/about', '/blog', '/gallery', '/videos', '/contact', '/login', '/register'];
        const isPublicPage = publicPaths.some(path => 
          window.location.pathname === path || window.location.pathname.startsWith(path)
        );
        
        if (!isPublicPage && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resendOTP: (email) => api.post('/auth/resend-otp', { email }),
  login: (credentials) => api.post('/auth/login', credentials),
  googleLogin: (idToken) => api.post('/auth/google', { idToken }),
  logout: () => api.get('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh-token'),
  updateProfile: (userData) => {
    const isFormData = userData instanceof FormData;
    return api.put('/auth/updatedetails', userData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },
  updatePassword: (passwordData) => api.put('/auth/updatepassword', passwordData),
  forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
  resetPassword: (resetToken, password) => api.put(`/auth/resetpassword/${resetToken}`, { password })
};

// Client API
export const clientAPI = {
  getProfile: () => api.get('/client/profile'),
  updateProfile: (profileData) => {
    const isFormData = profileData instanceof FormData;
    return api.put('/client/profile', profileData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },
  getCounsellors: (params) => api.get('/client/counsellors', { params }),
  getCounsellor: (id) => api.get(`/client/counsellors/${id}`),
  bookAppointment: (appointmentData) => api.post('/client/appointments', appointmentData),
  getAppointments: (params) => api.get('/client/appointments', { params }),
  getAppointment: (id) => api.get(`/client/appointments/${id}`),
  cancelAppointment: (id, reason) => api.put(`/client/appointments/${id}/cancel`, { reason }),
  submitReview: (reviewData) => api.post('/client/reviews', reviewData),
  getReviews: () => api.get('/client/reviews'),
  getPostSessionAttachments: (page = 1, limit = 10) => api.get(`/post-session/client/attachments?page=${page}&limit=${limit}`),
  getPostSessionAttachment: (id) => api.get(`/post-session/client/attachments/${id}`),
  getPaymentHistory: (params) => api.get('/payments/client/history', { params })
};

// Appointment API
export const appointmentAPI = {
  getAvailableSlots: (counsellorId, date) => api.get(`/appointments/available-slots?counsellorId=${counsellorId}&date=${date}`),
  bookAppointment: (appointmentData) => api.post('/appointments/book', appointmentData),
  verifyPayment: (paymentData) => api.post('/appointments/verify-payment', paymentData)
};

// Counsellor API
export const counsellorAPI = {
  getProfile: () => api.get('/counsellor/profile'),
  updateProfile: (profileData) => {
    const isFormData = profileData instanceof FormData;
    return api.put('/counsellor/profile', profileData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },
  updateAvailability: (availabilityData) => api.put('/counsellor/availability', availabilityData),
  uploadVerificationDocuments: (documents) => api.post('/counsellor/verification', { documentUrls: documents }),
  getAppointments: (params) => api.get('/counsellor/appointments', { params }),
  getAppointment: (id) => api.get(`/counsellor/appointments/${id}`),
  updateAppointmentStatus: (id, status, reason) => api.put(`/counsellor/appointments/${id}/status`, { status, reason }),
  addSessionNotes: (id, notesData) => api.post(`/counsellor/appointments/${id}/notes`, notesData),
  getSessionNotes: (id) => api.get(`/counsellor/appointments/${id}/notes`),
  getEarnings: () => api.get('/counsellor/earnings'),
  requestWithdrawal: (withdrawalData) => api.post('/counsellor/withdrawals', withdrawalData),
  createBlog: (blogData) => api.post('/counsellor/blogs', blogData),
  uploadVideo: (videoData) => api.post('/counsellor/videos', videoData),
  createPostSessionAttachment: (appointmentId, attachmentData) => api.post(`/post-session/appointments/${appointmentId}/attachments`, attachmentData),
  getAppointmentAttachments: (appointmentId) => api.get(`/post-session/appointments/${appointmentId}/attachments`),
  updatePostSessionAttachment: (id, attachmentData) => api.put(`/post-session/attachments/${id}`, attachmentData),
  deletePostSessionAttachment: (id) => api.delete(`/post-session/attachments/${id}`),
  uploadFile: (formData) => api.post('/upload/attachment', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, userData) => {
    // Always use FormData for user updates to handle avatar properly
    console.log('API updateUser received userData:', userData);
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key] !== undefined && userData[key] !== null) {
        formData.append(key, userData[key]);
        console.log(`FormData appended: ${key} = ${userData[key]}`);
      }
    });
    return api.put(`/admin/users/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateUserWithFile: (id, formData) => api.put(`/admin/users/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  banUser: (id, banData) => api.put(`/admin/users/${id}/ban`, banData),
  
  // Counsellors
  getCounsellors: (params) => api.get('/admin/counsellors', { params }),
  getCounsellor: (id) => api.get(`/admin/counsellors/${id}`),
  createCounsellor: (counsellorData) => api.post('/admin/counsellors', counsellorData),
  updateCounsellor: (id, counsellorData) => api.put(`/admin/counsellors/${id}`, counsellorData),
  deleteCounsellor: (id) => api.delete(`/admin/counsellors/${id}`),
  verifyCounsellor: (id, isVerified) => api.put(`/admin/counsellors/${id}/verify`, { isVerified }),
  
  // Appointments
  getAppointments: (params) => api.get('/admin/appointments', { params }),
  updatePaymentStatus: (id, paymentData) => api.put(`/admin/appointments/${id}/payment`, paymentData),
  handleDispute: (id, disputeData) => api.put(`/admin/disputes/${id}`, disputeData),
  
  // Withdrawals
  getWithdrawals: (params) => api.get('/admin/withdrawals', { params }),
  processWithdrawal: (id, withdrawalData) => api.put(`/admin/withdrawals/${id}`, withdrawalData),
  
  // CMS - Blogs
  getBlogs: (params) => api.get('/admin/cms/blogs', { params }),
  getBlog: (id) => api.get(`/admin/cms/blogs/${id}`),
  createBlog: (blogData) => api.post('/admin/cms/blogs', blogData),
  updateBlog: (id, blogData) => api.put(`/admin/cms/blogs/${id}`, blogData),
  deleteBlog: (id) => api.delete(`/admin/cms/blogs/${id}`),
  
  // CMS - Videos
  getVideos: (params) => api.get('/admin/cms/videos', { params }),
  createVideo: (videoData) => api.post('/admin/cms/videos', videoData),
  updateVideo: (id, videoData) => api.put(`/admin/cms/videos/${id}`, videoData),
  deleteVideo: (id) => api.delete(`/admin/cms/videos/${id}`),
  
  // CMS - Gallery
  getGallery: (params) => api.get('/admin/cms/gallery', { params }),
  uploadGalleryImage: (imageData) => api.post('/admin/cms/gallery', imageData),
  deleteGalleryImage: (id) => api.delete(`/admin/cms/gallery/${id}`),
  
  // Reports
  getReports: (params) => api.get('/admin/reports', { params }),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settingsData) => api.put('/admin/settings', settingsData),
  
  // Callback Requests
  getCallbackRequests: (params) => api.get('/admin/callbacks', { params }),
  updateCallbackRequest: (id, data) => api.put(`/admin/callbacks/${id}`, data),
  deleteCallbackRequest: (id) => api.delete(`/admin/callbacks/${id}`)
};

// CMS API (Public)
export const cmsAPI = {
  getBlogs: (params) => api.get('/cms/blogs', { params }),
  getBlog: (slug) => api.get(`/cms/blogs/${slug}`),
  getBlogCategories: () => api.get('/cms/blogs/categories'),
  getVideos: (params) => api.get('/cms/videos', { params }),
  getVideo: (id) => api.get(`/cms/videos/${id}`),
  getVideoCategories: () => api.get('/cms/videos/categories'),
  getGallery: (params) => api.get('/cms/gallery', { params }),
  getGalleryCategories: () => api.get('/cms/gallery/categories'),
  getPublicCounsellors: () => api.get('/cms/counsellors')
};

// Payment API
export const paymentAPI = {
  getSettings: () => api.get('/payments/admin/settings'),
  updateSettings: (settings) => api.put('/payments/admin/settings', settings),
  calculatePayment: (data) => api.post('/payments/calculate', data),
  processPayment: (data) => api.post('/payments/process', data),
  downloadInvoice: (appointmentId) => {
    return api.get(`/payments/invoice/${appointmentId}`, {
      responseType: 'blob'
    });
  }
};

// Upload API
export const uploadAPI = {
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return api.post('/upload/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadBlogImage: (file) => {
    const formData = new FormData();
    formData.append('blogImage', file);
    return api.post('/upload/blog-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadFeaturedImage: (file) => {
    const formData = new FormData();
    formData.append('featuredImage', file);
    return api.post('/upload/featured-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadGalleryImage: (file) => {
    const formData = new FormData();
    formData.append('galleryImage', file);
    return api.post('/upload/gallery-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadDocuments: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('documents', file));
    return api.post('/upload/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append('video', file);
    return api.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000 // 5 minutes for video uploads
    });
  }
};

export default api;