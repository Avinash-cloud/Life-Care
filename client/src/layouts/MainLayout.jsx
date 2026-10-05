import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
  const location = useLocation();
  // Detect if user is taking an assessment or viewing an assessment report
  const isAssessmentFlow = 
    (location.pathname.startsWith('/assessments/') && location.pathname !== '/assessments') || 
    location.pathname === '/anxiety-test';

  if (isAssessmentFlow) {
    return (
      <div className="assessment-flow-layout" style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden' }}>
        <Outlet />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1" style={{ marginTop: '100px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;