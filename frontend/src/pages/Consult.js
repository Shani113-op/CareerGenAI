// src/pages/Consult.js

import React, { useEffect, useState } from 'react';
import '../styles/Consult.css';

import teacher from '../assets/teacher.jpg';
import business_analyst from '../assets/business_analyst.jpg';
import lawyer from '../assets/lawyer.jpg';

const Consult = () => {
  const [consultants, setConsultants] = useState([]);

  useEffect(() => {
    const mockConsultants = [
      {
        id: '1',
        name: 'Anjali Verma',
        role: 'Career Strategist',
        expertise: 'Engineering, Government Exams',
        experience: '5+ years',
        bio: 'Specializes in helping students prepare for IIT-JEE, UPSC, and other exams.',
        email: 'anjali@example.com',
        image: business_analyst,
      },
      {
        id: '2',
        name: 'Rahul Mehta',
        role: 'Creative Career Coach',
        expertise: 'UX Design, Animation, Fine Arts',
        experience: '7+ years',
        bio: 'Helps creative minds transition into successful design careers.',
        email: 'rahul@example.com',
        image: teacher,
      },
      {
        id: '3',
        name: 'Dr. Neha Sharma',
        role: 'Medical Career Mentor',
        expertise: 'NEET, Biology, MBBS Pathway',
        experience: '10+ years',
        bio: 'Guides students into medicine with experience-backed strategies.',
        email: 'neha@example.com',
        image: lawyer,
      },
    ];
    setConsultants(mockConsultants);
  }, []);

  return (
    <div className="consult-page">
      <div className="consult-header">
        <h1>Meet Your Career Mentors</h1>
        <p>Our hand-picked experts are here to guide you at every stage of your journey.</p>
      </div>

      <div className="consultant-grid">
        {consultants.map((c) => (
          <div key={c.id} className="consultant-card">
            <img src={c.image} alt={c.name} className="consultant-img" />
            <h2>{c.name}</h2>
            <h4>{c.role}</h4>
            <p className="expertise">🎯 {c.expertise}</p>
            <p className="bio">{c.bio}</p>
            <div className="consult-footer">
              <span className="experience">🧠 {c.experience}</span>
              <a href={`mailto:${c.email}`} className="contact-btn">📧 Contact</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Consult;
