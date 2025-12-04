import Hero from './Hero/Hero';
import About from './About/About';
import ProjectsPreview from './ProjectsPreview/ProjectsPreview'; 
import Services from './Services/Services';
import Testimonials from './Testimonials/Testimonials';
import Contact from './Contact/Contact';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <About />
      <ProjectsPreview /> 
      <Services />
      <Testimonials />
      <Contact /> 
    </div>
  );
};

export default Home;