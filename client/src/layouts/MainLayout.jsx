import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
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