// src/components/PremiumPopup.jsx
import React, { useState } from "react";
import { FaCrown } from "react-icons/fa";
import "../styles/CareerDetail.css";

export default function PremiumPopup({ onClose = () => {}, onUpgrade }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpgradeConfirmation, setShowUpgradeConfirmation] = useState(false);

  const handleUpgrade = () => {
    const currentUser = JSON.parse(localStorage.getItem("user")) || {};
    currentUser.isPremium = true;
    localStorage.setItem("user", JSON.stringify(currentUser));

    alert("✅ Payment successful! You now have premium access.");
    onClose(); // Close modal safely
    onUpgrade?.(); // Optional callback to refresh parent state/UI
    window.location.reload(); // Force UI reload if needed
  };

  return (
    <div className="premium-overlay">
      <div className="premium-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>

        {!showUpgradeConfirmation ? (
          <>
            <div className="premium-header">
              <FaCrown size={40} color="#ffcc00" className="premium-icon" />
              <h2>Unlock Full Access</h2>
              <p className="premium-subtitle">
                Get detailed roadmaps, expert tips, and downloadable guides for every career.
              </p>
            </div>

            {/* Subscription Plans */}
            <div className="plan-cards">
              {["1 Month", "3 Months", "1 Year"].map((plan) => (
                <div
                  key={plan}
                  className={`plan-card ${selectedPlan === plan ? "selected" : ""} ${plan === "3 Months" ? "popular" : ""}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <h3>{plan}</h3>
                  <p>{plan === "1 Month" ? "₹99" : plan === "3 Months" ? "₹199" : "₹499"}</p>
                  <span>
                    {plan === "1 Month"
                      ? "Ideal for quick exploration"
                      : plan === "3 Months"
                      ? "Most Popular – Save 33%"
                      : "Best value for serious planning"}
                  </span>
                </div>
              ))}
            </div>

            <button
              className="subscribe-btn"
              disabled={!selectedPlan}
              onClick={() => setShowUpgradeConfirmation(true)}
            >
              Upgrade Now
            </button>

            <p className="secure-text">🔒 100% secure payment • Cancel anytime</p>
          </>
        ) : (
          <>
            <div className="premium-header">
              <FaCrown size={40} color="#ffcc00" className="premium-icon" />
              <h2>{selectedPlan} Plan Selected</h2>
              <p className="premium-subtitle">Scan the QR below and complete your payment</p>
            </div>

            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <img src="/images/qr-code.png" alt="QR Code" style={{ maxWidth: "200px" }} />
              <p style={{ marginTop: "10px" }}>Scan & Pay using UPI / PhonePe / GPay</p>
            </div>

            <div className="modal-actions">
              <button className="subscribe-btn" onClick={handleUpgrade}>
                Done
              </button>
            </div>

            <p className="secure-text">🔒 Manual verification. Please wait after clicking done.</p>
          </>
        )}
      </div>
    </div>
  );
}
