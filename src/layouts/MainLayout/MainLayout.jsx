import { Outlet } from 'react-router-dom';
import Navbar from '../../pages/global/Navbar/Navbar';
import Footer from '../../pages/global/Footer/Footer';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;