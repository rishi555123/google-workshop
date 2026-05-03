import { useState } from "react";

const TEAM = [
  { name: "Rishith",    email: "rishi.srighakollapu@gmail.com", phone: "9912452660" },
  { name: "Bharadwaaz", email: "bharadwaazgaddam@gmail.com",     phone: "8985724301" },
  { name: "Varshith",   email: "varshithpannem@gmail.com",       phone: "8074519459" },
  { name: "Santosh",    email: "ragisantosh9@gmail.com",         phone: "7673956942" },
];

const FAQ = [
  { q: "What is Food Link?",        a: "A platform connecting restaurants with NGOs to redistribute surplus food." },
  { q: "Who can donate?",           a: "Any restaurant, caterer, or food business with surplus safe food." },
  { q: "What food is accepted?",    a: "Fresh, packaged, and surplus food that is not expired and safe to consume." },
  { q: "How is food distributed?",  a: "NGOs claim donations on the platform and coordinate pickup directly." },
  { q: "Is there any cost?",        a: "No. Donating and receiving is completely free." },
];

function Modal({ title, onClose, children }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        {children}
        <button className="btn btn-primary btn-full mt-6" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function Footer({ onNav }) {
  const [modal, setModal] = useState(null);

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <img src="/logo.jpeg" alt="Food Link" />
          <h3>Food Link</h3>
          <p>Connecting surplus food to those in need, one meal at a time.</p>
          <div className="social-row">
            <a href="https://linkedin.com"  target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i></a>
            <a href="https://youtube.com"   target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
            <a href="https://facebook.com"  target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
          </div>
        </div>

        {/* Quick links */}
        <div className="footer-col">
          <h4>Links</h4>
          <ul>
            <li onClick={() => onNav("home")}>Home</li>
            <li onClick={() => onNav("about")}>About Us</li>
            <li onClick={() => onNav("how-it-works")}>How It Works</li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li onClick={() => setModal("faq")}>FAQs</li>
            <li onClick={() => setModal("contact")}>Contact Us</li>
            <li onClick={() => setModal("privacy")}>Privacy Policy</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024–2026 Food Link · All Rights Reserved</p>
      </div>

      {/* Modals */}
      {modal === "faq" && (
        <Modal title="Frequently Asked Questions" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{ borderLeft: "3px solid var(--primary)", paddingLeft: 14 }}>
                <p style={{ fontWeight: 800, marginBottom: 4, color: "#0f172a" }}>{item.q}</p>
                <p style={{ fontSize: "0.9rem", color: "#64748b" }}>{item.a}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {modal === "contact" && (
        <Modal title="Contact Support" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {TEAM.map((m, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 16px", borderLeft: "4px solid var(--primary)" }}>
                <p style={{ fontWeight: 800, marginBottom: 4, color: "#0f172a" }}>{m.name}</p>
                <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
                  📧 <a href={`mailto:${m.email}`} style={{ color: "var(--primary)" }}>{m.email}</a>
                </p>
                <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
                  📞 <a href={`tel:${m.phone}`} style={{ color: "var(--primary)" }}>{m.phone}</a>
                </p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {modal === "privacy" && (
        <Modal title="Privacy Policy" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: "0.92rem", color: "#334155", lineHeight: 1.6 }}>
            <p>We respect your privacy and are committed to protecting your personal information.</p>
            <p>We only collect necessary details such as your name, contact information, and donation-related data to operate the platform effectively.</p>
            <p>Your information is used solely for communication, coordination, and platform improvement.</p>
            <p>We do not sell, trade, or share personal data with third parties except when required by law or to ensure safe food distribution.</p>
            <p>Reasonable security measures are in place to protect your data. By using this platform, you agree to this policy.</p>
          </div>
        </Modal>
      )}
    </footer>
  );
}

export default Footer;