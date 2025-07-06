// src/pages/ResumeBuilder.jsx
import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { marked } from 'marked';
import '../styles/ResumeBuilder.css';

const ResumeBuilder = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    skills: '',
    experience: '',
    projects: '',
    summary: '',
  });

  const [resumeMd, setResumeMd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResumeMd('');

    try {
      const res = await axios.post('http://localhost:5000/api/generate-resume', form);
      setResumeMd(res.data.resume);
    } catch (err) {
      console.error(err);
      setError('⚠️ Error generating resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const text = resumeMd.replace(/[#*_`>-]/g, '').trim(); // strip markdown symbols
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, 10);
    doc.save(`${form.name}_Resume.pdf`);
  };

  return (
    <div className="resume-builder-container">
      <h1 className="resume-title">📝 AI-Powered Resume Builder</h1>
      <p className="resume-subtitle">Generate a professional resume using OpenRouter AI.</p>

      <div className="resume-form">
        {Object.entries(form).map(([key, value]) => (
          <div key={key} className="form-group">
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <textarea
              name={key}
              value={value}
              onChange={handleChange}
              rows={key === 'summary' ? 4 : 2}
              placeholder={`Enter your ${key}`}
            />
          </div>
        ))}

        <button onClick={handleGenerate} disabled={loading} className="generate-btn">
          {loading ? 'Generating...' : 'Generate Resume'}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {resumeMd && (
        <div className="resume-preview-section">
          <h2>📄 Resume Preview</h2>
          <div
            className="rendered-markdown"
            dangerouslySetInnerHTML={{ __html: marked(resumeMd) }}
            id="resume-preview"
          />
          <button onClick={handleDownload} className="download-btn">Download PDF</button>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
