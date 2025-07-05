// src/pages/TopColleges.js

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CollegesByLocation.css';

const TopColleges = () => {
  const [course, setCourse] = useState('');
  const [location, setLocation] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if ((!course || !location) && !collegeName) {
      return alert('Please enter Course & Location OR College Name');
    }

    setLoading(true);
    setError('');
    setColleges([]);

    try {
      const res = await axios.post('http://localhost:5000/api/colleges', {
        course,
        location,
        collegeName
      });

      if (Array.isArray(res.data.colleges)) {
        setColleges(res.data.colleges);
      } else {
        setError('⚠️ Unexpected response format');
      }
    } catch (err) {
      console.error(err);
      setError('⚠️ Error retrieving college list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="college-page-wrapper">
      <div className="hero-section">
        <h1>🎓 Explore Premier Colleges in India</h1>
        <p>Search for the best institutions by course, location, or college name.</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter course (e.g. MBA, B.Tech)"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter location (e.g. Mumbai)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <div className="or-separator">— OR —</div>

          <input
            type="text"
            placeholder="Enter college name"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
          />

          <button
            className={`search-btn ${loading ? 'searching' : ''}`}
            onClick={handleSearch}
            disabled={loading}
          >
            <span className="icon-container">
              <span className="search-icon">🔍</span>
            </span>
            {loading ? 'Searching...' : 'Find Colleges'}
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}
        {loading && (
          <div className="loading-strip-wrapper">
            <div className="loading-strip">
              <div className="dot dot1" />
              <div className="dot dot2" />
              <div className="dot dot3" />
            </div>
          </div>
        )}
      </div>

      {colleges.length > 0 && (
        <div className="results-section">
          <h2>🏆 {collegeName ? `Results for "${collegeName}"` : `Top Colleges for ${course} in ${location}`}</h2>
          <div className="college-list">
            {colleges.map((clg, i) => (
              <div className="college-card" key={i}>
                <div className="college-card-left">
                  <div className="college-badge">#{i + 1}</div>
                  <h3 className="college-name">{clg.name}</h3>
                  <p className="college-ranking">{clg.ranking || 'Top College'}</p>
                  <p>📍 <strong>Location:</strong> {clg.location}</p>
                  <p>🎓 <strong>Course:</strong> {clg.course}</p>
                  <p>🏫 <strong>Type:</strong> {clg.type}</p>
                  <p>📘 <strong>Affiliation:</strong> {clg.affiliation}</p>
                </div>

                <div className="college-card-right">
                  <ul>
                    <li><strong>💸 Fees:</strong> {clg.fees}</li>
                    <li><strong>📈 Placement Rate:</strong> {clg.placementRate}</li>
                    <li><strong>💼 Recruiters:</strong> {clg.topRecruiters?.join(', ')}</li>
                    <li><strong>🧑‍🏫 Faculty:</strong> {clg.faculty}</li>
                    <li><strong>🏕️ Campus Life:</strong> {clg.campusLife}</li>
                    <li><strong>📝 Entrance Exam:</strong> {clg.entranceExam}</li>
                    <li><strong>📅 Admission Deadline:</strong> {clg.admissionDeadline}</li>

                    {clg.cutOffs && (
                      <>
                        <li><strong>📊 Branch-wise Cutoffs:</strong></li>
                        <ul className="branch-cutoffs">
                          {Object.entries(clg.cutOffs).map(([branch, cutoff], idx) => (
                            <li key={idx}>🔹 <strong>{branch}:</strong> {cutoff}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    <li><strong>🌐 Website:</strong> <a href={clg.website} target="_blank" rel="noreferrer">{clg.website}</a></li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopColleges;
