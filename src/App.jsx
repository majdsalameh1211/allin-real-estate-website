import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';

// Public pages
import Home from './pages/home/Home';
import Projects from './pages/projects/Projects';
import Team from './pages/team/team';
import Courses from './pages/courses/Courses';

// Legal pages
import PrivacyPolicy from './pages/global/Footer/PrivacyPolicy/PrivacyPolicy';
import TermsOfUse from './pages/global/Footer/TermsOfUse/TermsOfUse';
import CookiePolicy from './pages/global/Footer/CookiePolicy/CookiePolicy';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <Routes>
        {/* Public Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/team" element={<Team />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;