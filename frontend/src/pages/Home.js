import React, { useEffect, useState } from 'react';
import '../styles/Home.css';

// Import images
import softwareEngineerImg from '../assets/software_engineer.jpg';
import uix_designer from '../assets/uix_designer.jpg';
import doctor from '../assets/doctor.jpg';
import teacher from '../assets/teacher.jpg';
import accountant from '../assets/accountant.jpg';
import research_scientist from '../assets/research_scientist.jpg';
import civil from '../assets/civil.jpg';
import journalist from '../assets/journalist.jpg';
import interior_designer from '../assets/interior_designer.jpg';
import business_analyst from '../assets/business_analyst.jpg';
import lawyer from '../assets/lawyer.jpg';
import chef from '../assets/chef.jpg';

const Home = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Robust fuzzy matching for career titles
  const getImageForCareer = (title) => {
    const key = title?.toLowerCase().trim();

    if (key.includes('software') || key.includes('developer')) return softwareEngineerImg;
    if (key.includes('ui') || key.includes('ux') || key.includes('designer')) return uix_designer;
    if (key.includes('doctor') || key.includes('medical')) return doctor;
    if (key.includes('teacher') || key.includes('educator')) return teacher;
    if (key.includes('accountant') || key.includes('ca')) return accountant;
    if (key.includes('scientist') || key.includes('data') || key.includes('research')) return research_scientist;
    if (key.includes('civil')) return civil;
    if (key.includes('journalist') || key.includes('media')) return journalist;
    if (key.includes('interior')) return interior_designer;
    if (key.includes('analyst') || key.includes('business')) return business_analyst;
    if (key.includes('lawyer') || key.includes('legal')) return lawyer;
    if (key.includes('chef') || key.includes('cook')) return chef;

    return softwareEngineerImg; // Default fallback
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/careers')
      .then(res => res.json())
      .then(data => {
        setCareers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching careers:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Discover Your <span>Dream Career</span> with AI Guidance</h1>
          <p>Get personalized career suggestions based on your interests, skills, and academic profile.</p>
          <div className="hero-buttons">
            <a href="/library" className="btn btn-primary">Explore Careers</a>
            <a href="/chat" className="btn btn-secondary">Chat with AI</a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works section">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <h4>Share Your Interests</h4>
            <p>Tell us what you love—be it coding, art, or helping others.</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h4>Get AI Suggestions</h4>
            <p>Our AI matches you with suitable careers and roadmaps.</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h4>Explore Opportunities</h4>
            <p>Browse top courses, colleges, and career growth options.</p>
          </div>
        </div>
      </section>

      {/* Popular Career Cards */}
      <section className="popular-careers section">
        <h2>Popular Career Paths</h2>
        {loading ? (
          <p>Loading popular careers...</p>
        ) : careers.length === 0 ? (
          <p>No careers found. Please try again later.</p>
        ) : (
          <div className="career-grid">
            {careers.map((career, index) => (
              <div className="career-card" key={index}>
                <img
                  src={getImageForCareer(career.title)}
                  alt={`Image representing ${career.title}`}
                  className="career-image"
                  onError={(e) => (e.target.src = softwareEngineerImg)}
                />
                <div className="career-content">
                  <h4>{career.title}</h4>
                  <p>
                    {career.description.length > 100
                      ? `${career.description.slice(0, 100)}...`
                      : career.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us Section */}
      <section className="why-us section">
        <h2>Why Choose CareerDendro?</h2>
        <ul>
          <li>🎯 Personalized Guidance with AI + Human Expert</li>
          <li>📚 500+ Career Paths, Colleges & Exams</li>
          <li>🧠 Built for Students of Class 8th to Graduation</li>
          <li>💬 Real-time AI Chat & Bookable Counselors</li>
        </ul>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials section">
        <h2>Student Testimonials</h2>
        <div className="testimonial-cards">
          <div className="testimonial">"I was lost after 12th. CareerDendro gave me the clarity I needed."</div>
          <div className="testimonial">"Best platform for stream selection. The AI is super smart."</div>
          <div className="testimonial">"Thanks to this, I got into a great college. Loved the user experience!"</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
