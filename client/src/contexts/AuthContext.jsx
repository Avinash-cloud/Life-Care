import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { sessionUtils } from '../utils/sessionUtils';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.getMe();
        setUser(response.data.data);
        sessionUtils.initSessionTracking();
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);



  // Register user (Clients only - Counsellors must be created by admin)
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register(userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.verifyOTP(email, otp);
      const { user: userData } = response.data;
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.resendOTP(email);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(credentials);
      
      if (response.data.requireOTP) {
        return { requireOTP: true, email: credentials.email };
      }
      
      const { user: userData } = response.data;
      setUser(userData);
      sessionUtils.initSessionTracking();
      
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (userData.role === 'counsellor') {
        navigate('/counsellor/dashboard');
      } else {
        navigate('/client/dashboard');
      }
      
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const googleLogin = async (idToken) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.googleLogin(idToken);
      const { user: userData } = response.data;
      
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      sessionUtils.clearSession();
      setLoading(false);
      navigate('/login');
    }
  };

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getMe();
      const userData = response.data.data;
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user data');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (userData.avatar && typeof userData.avatar === 'string' && userData.avatar.startsWith('blob:')) {
        // Handle file upload
        const formData = new FormData();
        Object.keys(userData).forEach(key => {
          if (key !== 'avatar') {
            formData.append(key, userData[key]);
          }
        });
        response = await authAPI.updateProfile(formData);
      } else {
        response = await authAPI.updateProfile(userData);
      }
      
      const updatedUser = response.data.data;
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      await authAPI.updatePassword(passwordData);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.forgotPassword(email);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process forgot password request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (resetToken, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.resetPassword(resetToken, password);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    verifyOTP,
    resendOTP,
    login,
    googleLogin,
    logout,
    fetchCurrentUser,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isClient: user?.role === 'client',
    isCounsellor: user?.role === 'counsellor',
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;