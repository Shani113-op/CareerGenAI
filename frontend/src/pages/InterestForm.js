import React, { useState } from 'react';
import axios from 'axios';
import '../styles/InterestForm.css';
import {
  FaCalculator, FaPalette, FaHandsHelping, FaCode,
  FaPenFancy, FaTree, FaUserCog, FaMicroscope,
  FaLaptop, FaHeartbeat, FaChartLine, FaComments,
  FaSearch, FaPuzzlePiece, FaChalkboardTeacher, FaLightbulb, FaChartBar, FaPaintBrush
} from 'react-icons/fa';
import PremiumPopup from '../components/PremiumPlans';

const interestsList = [
  { label: 'Mathematics', icon: <FaCalculator /> },
  { label: 'Designing', icon: <FaPalette /> },
  { label: 'Helping People', icon: <FaHandsHelping /> },
  { label: 'Coding', icon: <FaCode /> },
  { label: 'Writing', icon: <FaPenFancy /> },
  { label: 'Nature', icon: <FaTree /> },
  { label: 'Management', icon: <FaUserCog /> },
  { label: 'Science', icon: <FaMicroscope /> },
  { label: 'Art', icon: <FaPaintBrush /> },
  { label: 'Technology', icon: <FaLaptop /> },
  { label: 'Health', icon: <FaHeartbeat /> },
  { label: 'Business', icon: <FaChartLine /> },
  { label: 'Communication', icon: <FaComments /> },
  { label: 'Research', icon: <FaSearch /> },
  { label: 'Analysis', icon: <FaChartBar /> },
  { label: 'Problem Solving', icon: <FaPuzzlePiece /> },
  { label: 'Teaching', icon: <FaChalkboardTeacher /> },
  { label: 'Creativity', icon: <FaLightbulb /> }
];

export default function InterestForm() {
  const [selected, setSelected] = useState([]);
  const [careers, setCareers] = useState([]);
  const [showCareers, setShowCareers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeCategory, setActiveCategory] = useState("All");

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  const toggleSelect = (label) => {
    setSelected(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const handleSuggest = async () => {
    if (selected.length === 0) {
      alert('Please select at least one interest.');
      return;
    }

    // ✅ Check for Premium Access
    if (!user?.isPremium) {
      setShowPremiumPopup(true);
      return;
    }

    setLoading(true);
    setShowCareers(false);
    setErrorMsg('');
    setCareers([]);

    try {
      const res = await axios.post('http://localhost:5000/api/recommend', {
        interests: selected
      });

      if (Array.isArray(res.data.careers)) {
        setCareers(res.data.careers);
        setShowCareers(true);
      } else {
        setErrorMsg("⚠️ Received unexpected response. Please try again.");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 402) {
        setErrorMsg("⚠️ You've hit your free quota limit on OpenRouter. Try again later or reduce your selections.");
      } else {
        setErrorMsg("⚠️ Failed to fetch recommendations. Please check your server and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredCareers = careers.filter(c =>
    activeCategory === "All" || c.category === activeCategory
  );

  return (
    <div className="interest-page-container">
      <h2>Select Your Interests</h2>

      <div className="interest-grid">
        {interestsList.map((interest, idx) => (
          <div
            key={idx}
            className={`interest-item ${selected.includes(interest.label) ? 'selected' : ''}`}
            onClick={() => toggleSelect(interest.label)}
          >
            <span className="icon">{interest.icon}</span>
            <span>{interest.label}</span>
          </div>
        ))}
      </div>

      <div className="buttons">
        <button className="btn-primary" onClick={handleSuggest} disabled={loading}>
          {loading ? 'Generating...' : 'Get Career Suggestions'}
        </button>
        <button className="btn-secondary" onClick={() => {
          setSelected([]);
          setShowCareers(false);
          setCareers([]);
          setActiveCategory("All");
          setErrorMsg('');
        }}>
          Clear Selection
        </button>
      </div>

      {loading && <p className="loading-text">🔄 Fetching suggestions...</p>}
      {errorMsg && <p className="error-message">{errorMsg}</p>}

      {showCareers && (
        <div className="career-suggestions">
          <h3>Recommended Careers</h3>

          <div className="filter-chips">
            {["All", ...new Set(careers.map(c => c.category))].map((cat, i) => (
              <span
                key={i}
                className={`chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="career-list">
            {filteredCareers.map((career, index) => (
              <div className="career-card" key={index}>
                <h4>{career.title}</h4>
                <span className="badge">{career.category}</span>
                <p>{career.description}</p>

                <div className="career-grid">
                  <div>
                    <h5>Required Skills</h5>
                    {career.skills?.map(skill => (
                      <span className="tag" key={skill}>{skill}</span>
                    ))}
                  </div>
                  <div>
                    <h5>Education Roadmap</h5>
                    <ul>
                      {career.roadmap?.map((step, idx) => (
                        <li key={idx}>→ {step}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5>Salary & Growth</h5>
                    <div className="salary-box">
                      <strong>{career.salary}</strong>
                      <p>Growth potential varies by field</p>
                    </div>
                  </div>
                  <div>
                    <h5>Top Colleges</h5>
                    {career.colleges?.map(c => (
                      <span className="tag green" key={c}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Premium Plan Modal */}
      {showPremiumPopup && (
        <PremiumPopup
          onClose={() => setShowPremiumPopup(false)}
          onUpgrade={() => {
            const updatedUser = JSON.parse(localStorage.getItem("user"));
            setUser(updatedUser); // Refresh premium status
            setShowPremiumPopup(false);
            handleSuggest(); // Retry automatically after upgrade
          }}
        />
      )}
    </div>
  );
}
