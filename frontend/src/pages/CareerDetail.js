import React, { useState } from "react";
import { FaSearch, FaCrown } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "../styles/CareerDetail.css";
import careerData from "../data/careerData";
import PremiumPopup from "../components/PremiumPlans";

const categories = [
  "All", "Technology", "Creative", "Healthcare", "Education",
  "Finance", "Science", "Engineering", "Media",
  "Design", "Business", "Legal", "Culinary"
];

const CareerCard = ({ career, onGetRoadmap }) => (
  <div className="career-card premium">
    <img src={career.image} alt={career.title} className="career-image" />
    <div className="card-header">
      <h3>{career.title}</h3>
      <span className="badge">{career.category}</span>
    </div>
    <p className="desc">{career.description}</p>
    <div className="see-more-wrapper">
      <button className="see-more-btn" onClick={() => onGetRoadmap(career)}>
        Get Roadmap...
      </button>
    </div>
  </div>
);

export default function CareerPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  const handleGetRoadmap = (career) => {
    if (user?.isPremium) {
      setSelectedCareer(career);
    } else {
      setShowPremiumPopup(true);
    }
  };

  const handleDownload = (career) => {
    const doc = new jsPDF();
    let y = 50;

    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, 210, 20, "F");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("CareerDendro - Career Roadmap", 10, 13);

    doc.setFontSize(18);
    doc.setTextColor(33, 33, 33);
    doc.setFont("helvetica", "bold");
    doc.text(career.title, 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100);
    doc.text(`Category: ${career.category}`, 10, y);
    y += 10;

    doc.setDrawColor(200);
    doc.line(10, y, 200, y);
    y += 7;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Description:", 10, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(career.description, 180);
    doc.text(descLines, 10, y);
    y += doc.getTextDimensions(descLines).h + 5;

    doc.setFont("helvetica", "bold");
    doc.text("Skills Required:", 10, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(career.skills.join(", "), 10, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("Education Roadmap:", 10, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    career.roadmap.forEach((step, i) => {
      if (y > 270) {
        doc.addPage();
        y = addFooter(doc);
      }
      doc.text(`${i + 1}. ${step}`, 10, y);
      y += 7;
    });

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text(`Expected Salary: ${career.salary}`, 10, y);
    y += 10;

    if (career.subcategories?.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Specializations:", 10, y);
      y += 10;

      career.subcategories.forEach((sub) => {
        if (y > 250) {
          doc.addPage();
          y = addFooter(doc);
        }
        doc.setFont("helvetica", "bold");
        doc.setTextColor(70, 130, 180);
        doc.text(sub.name, 10, y);
        y += 7;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(33, 33, 33);
        const desc = doc.splitTextToSize(sub.description, 180);
        doc.text(desc, 10, y);
        y += doc.getTextDimensions(desc).h + 3;

        sub.roadmap.forEach((step) => {
          if (y > 270) {
            doc.addPage();
            y = addFooter(doc);
          }
          doc.text(`- ${step}`, 15, y);
          y += 6;
        });
        y += 5;
      });
    }

    addFooter(doc);
    doc.save(`${career.title}_Roadmap.pdf`);
  };

  const addFooter = (doc) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(200);
    doc.line(10, pageHeight - 15, 200, pageHeight - 15);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Generated via CareerDendro", 10, pageHeight - 10);
    return 20;
  };

  const filtered = careerData.filter(c =>
    (category === "All" || c.category === category) &&
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="career-page">
      <section className="header">
        <h1>Explore Career Paths</h1>
        <p>Discover careers that fit your passion and skills</p>
      </section>

      <div className="controls">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search careers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="category-scroll">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="career-grid">
        {filtered.map((career, index) => (
          <CareerCard
            key={index}
            career={career}
            onGetRoadmap={handleGetRoadmap}
          />
        ))}
      </div>

      {selectedCareer && (
        <div className="career-modal">
          <div className="modal-content enhanced">
            <button className="close-btn" onClick={() => setSelectedCareer(null)}>&times;</button>

            <div className="modal-header">
              <h2 className="career-title">{selectedCareer.title}</h2>
              <span className="badge big">{selectedCareer.category}</span>
              <p className="modal-desc">{selectedCareer.description}</p>
            </div>

            <div className="modal-section">
              <strong>Skills Required:</strong>
              <div className="skills">
                {selectedCareer.skills.map((s, i) => (
                  <span key={i} className="skill-chip">{s}</span>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <strong>Education Roadmap:</strong>
              <ul className="roadmap-list">
                {selectedCareer.roadmap.map((step, i) => (
                  <li key={i} className="roadmap-step">{step}</li>
                ))}
              </ul>
            </div>

            <div className="modal-section salary">
              <strong>Expected Salary:</strong>
              <span className="salary-pill">{selectedCareer.salary}</span>
            </div>

            {selectedCareer.subcategories?.length > 0 && (
              <div className="modal-section">
                <strong>Career Specializations:</strong>
                <div className="subcategory-scroll">
                  {selectedCareer.subcategories.map((sub, index) => (
                    <div key={index} className="subcategory-card">
                      <h4>{sub.name}</h4>
                      <p className="subcategory-desc">{sub.description}</p>
                      <ul className="subcategory-roadmap">
                        {sub.roadmap.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="download-btn" onClick={() => handleDownload(selectedCareer)}>
                📄 Download Word File
              </button>
            </div>
          </div>
        </div>
      )}

      {showPremiumPopup && (
        <PremiumPopup
          onClose={() => setShowPremiumPopup(false)}
          onUpgrade={() => {
            const updatedUser = JSON.parse(localStorage.getItem("user"));
            setUser(updatedUser);
            setShowPremiumPopup(false);
          }}
        />
      )}
    </div>
  );
}
