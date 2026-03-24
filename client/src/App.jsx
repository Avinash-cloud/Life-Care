import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import ScrollToTop from './components/shared/ScrollToTop';
import NotFound from './pages/public/NotFound';
import TestApi from './pages/TestApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Blog from './pages/public/Blog';
import Gallery from './pages/public/Gallery';
import Videos from './pages/public/Videos';
import Contact from './pages/public/Contact';
import CounsellorsDemo from './pages/public/CounsellorsDemo';
import Consilar from './pages/public/Consilar';
import ConditionDetail from './pages/public/conditions/ConditionDetail';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOTP from './pages/auth/VerifyOTP';
import VerifyEmail from './pages/auth/VerifyEmail';

// Client Pages
import ClientDashboard from './pages/client/Dashboard';
import Counsellors from './pages/client/Counsellors';
import CounsellorFinder from './pages/client/CounsellorFinder';
import BookAppointment from './pages/client/BookAppointment';
import MyAppointments from './pages/client/MyAppointments';

import ChatSession from './pages/client/ChatSession';
import VideoCall from './pages/client/VideoCall';
import Payments from './pages/client/Payments';
import Feedback from './pages/client/Feedback';
import Profile from './pages/client/Profile';
import ClientCounsellorProfile from './pages/client/CounsellorProfile';
import PostSessionMaterials from './pages/client/PostSessionMaterials';
import AppointmentDetail from './pages/client/AppointmentDetail';

// Counsellor Pages
import CounsellorDashboard from './pages/counsellor/Dashboard';
import CounsellorAppointments from './pages/counsellor/Appointments';
import CounsellorAvailability from './pages/counsellor/Availability';
import CounsellorEarnings from './pages/counsellor/Earnings';
import CounsellorProfile from './pages/counsellor/Profile';
import CounsellorAppointmentDetail from './pages/counsellor/AppointmentDetail';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminCounsellors from './pages/admin/Counsellors';
import AdminAppointments from './pages/admin/Appointments';
import AdminWithdrawals from './pages/admin/Withdrawals';
import AdminContent from './pages/admin/Content';
import BlogEditor from './pages/admin/BlogEditor';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import AdminDisputes from './pages/admin/Disputes';
import AdminCallbacks from './pages/admin/CallbackRequests';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <AuthProvider>
        {/* Floating Action Buttons */}
        <div className="floating-actions">
          <a href="https://wa.me/9716129129" target="_blank" rel="noopener noreferrer" className="floating-btn whatsapp-btn" title="Chat on WhatsApp">
            <i className="bi bi-whatsapp"></i>
          </a>
          <a href="tel:+919716129129" className="floating-btn contact-btn" title="Call Us">
            <i className="bi bi-telephone-fill"></i>
          </a>
        </div>
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="blog" element={<Blog />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="videos" element={<Videos />} />
            <Route path="contact" element={<Contact />} />
            <Route path="consilar" element={<Consilar />} />
            <Route path="conditions/:condition" element={<ConditionDetail />} />
          </Route>
          
          {/* Auth Routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} /> {/* Public registration for clients only */}
          <Route path="verify-email/:token" element={<VerifyEmail />} />
          <Route path="verify-otp" element={<VerifyOTP />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:resetToken" element={<ResetPassword />} />
          <Route path="test-api" element={<TestApi />} />

          {/* Video Call Routes - Outside Dashboard Layout */}
          <Route element={<ProtectedRoute allowedRoles={['client', 'counsellor']} />}>
            <Route path="/client/video/:appointmentId" element={<VideoCall />} />
            <Route path="/counsellor/video/:appointmentId" element={<VideoCall />} />
          </Route>

          {/* Client Routes with DashboardLayout */}
          <Route element={<ProtectedRoute allowedRoles={['client']} />}>
            <Route path="/client" element={<DashboardLayout role="client" />}>
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="counsellors" element={<CounsellorFinder />} />
              <Route path="book-appointment/:counsellorId" element={<BookAppointment />} />
              <Route path="appointments" element={<MyAppointments />} />
              <Route path="appointments/:appointmentId" element={<AppointmentDetail />} />
              <Route path="appointments/:appointmentId/notes" element={<AppointmentDetail />} />
              <Route path="attachments" element={<PostSessionMaterials />} />
              <Route path="chat/:appointmentId" element={<ChatSession />} />
              <Route path="payments" element={<Payments />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="profile" element={<Profile />} />
              <Route path="counsellors/:counsellorId" element={<ClientCounsellorProfile />} />
            </Route>
          </Route>

          {/* Counsellor Routes with DashboardLayout */}
          <Route element={<ProtectedRoute allowedRoles={['counsellor']} />}>
            <Route path="/counsellor" element={<DashboardLayout role="counsellor" />}>
              <Route path="dashboard" element={<CounsellorDashboard />} />
              <Route path="appointments" element={<CounsellorAppointments />} />
              <Route path="appointments/:appointmentId" element={<CounsellorAppointmentDetail />} />
              <Route path="availability" element={<CounsellorAvailability />} />
              <Route path="earnings" element={<CounsellorEarnings />} />
              <Route path="profile" element={<CounsellorProfile />} />
              <Route path="chat/:appointmentId" element={<ChatSession />} />
            </Route>
          </Route>

          {/* Admin Routes with DashboardLayout */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<DashboardLayout role="admin" />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="counsellors" element={<AdminCounsellors />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="withdrawals" element={<AdminWithdrawals />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="content/blog/new" element={<BlogEditor />} />
              <Route path="content/blog/edit/:id" element={<BlogEditor />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="disputes" element={<AdminDisputes />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="callbacks" element={<AdminCallbacks />} />
            </Route>
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;