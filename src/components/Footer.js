import React, { useState } from 'react';

// Added navigation props to the component
function Footer({ goHome, goAbout, goHow }) {
  const [modalContent, setModalContent] = useState(null);

  const supportTeam = [
    { name: "Rishith", email: "rishi.srighakollapu@gmail.com", phone: "9912452660" },
    { name: "Bharadwaaz", email: "bharadwaazgaddam@gmail.com", phone: "8985724301" },
    { name: "Varshith", email: "varshithpannem@gmail.com", phone: "8074519459" },
    { name: "Santosh", email: "ragisantosh9@gmail.com", phone: "7673956942" }
  ];

  const closeModal = () => setModalContent(null);

  // Helper function to navigate and scroll up
  const navigateTo = (navFunc) => {
    navFunc();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* BRAND SECTION */}
        <div className="footer-brand" style={{ textAlign: 'left' }}>
          <div className="footer-logo-stack" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
             <img src="/logo.jpeg" alt="Food Link Logo" style={{ height: '100px', width: 'auto', borderRadius: '12px' }} />
             <h2 style={{ margin: 0, fontSize: '2.2rem', color: '#ffffff' }}>Food Link</h2>
          </div>
          <p style={{ marginTop: '15px', color: '#ccc' }}>Connecting surplus food to those in need.</p>
          
          <div className="social-icons" style={{ display: 'flex', gap: '25px', marginTop: '25px' }}>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" style={{ color: 'white', fontSize: '2rem' }}>
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" style={{ color: 'white', fontSize: '2.2rem' }}>
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" style={{ color: 'white', fontSize: '2.1rem' }}>
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" style={{ color: 'white', fontSize: '2.1rem' }}>
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
        </div>

        {/* QUICK LINKS SECTION: FIXED NAVIGATION */}
        <div className="footer-links">
          <h4>Links</h4>
          <ul>
            <li onClick={() => navigateTo(goHome)} style={{ cursor: 'pointer' }}>Home</li>
            <li onClick={() => navigateTo(goAbout)} style={{ cursor: 'pointer' }}>About Us</li>
            <li onClick={() => navigateTo(goHow)} style={{ cursor: 'pointer' }}>How It Works</li>
          </ul>
        </div>

        {/* SUPPORT SECTION */}
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li onClick={() => setModalContent('faq')} style={{ cursor: 'pointer' }}>FAQs</li>
            <li onClick={() => setModalContent('contact')} style={{ cursor: 'pointer' }}>Contact us</li>
            <li onClick={() => setModalContent('privacy')} style={{ cursor: 'pointer' }}>Privacy Policy</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © 2022 - 2026 | Food Link | All Rights Reserved</p>
      </div>

      {/* --- MODAL POPUP SYSTEM --- */}
      {modalContent && (
        <div className="popup" style={{ zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)' }}>
          <div className="popup-box" style={{ maxWidth: '550px', width: '90%', textAlign: 'center', background: 'white', padding: '30px', borderRadius: '20px', color: '#000000' }}>
            <h2 style={{ color: '#16a34a', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', marginBottom: '20px' }}>
              {modalContent === 'contact' ? 'Contact Support' : 
               modalContent === 'faq' ? 'Frequently Asked Questions' : 
               'Privacy Policy'}
            </h2>

            <div style={{ textAlign: 'left', maxHeight: '400px', overflowY: 'auto' }}>
              {modalContent === 'faq' && (
                <div style={{ lineHeight: '1.6', color: '#334155' }}>
                  <p><strong>What is this food donation project about?</strong><br/>This project connects donors with people and communities in need by collecting and distributing safe, edible food.</p>
                  <p style={{ marginTop: '15px' }}><strong>Who can donate?</strong><br/>Individuals, restaurants, grocery stores, and organizations can donate food that meets safety and quality standards.</p>
                  <p style={{ marginTop: '15px' }}><strong>What kind of food is accepted?</strong><br/>We accept fresh, packaged, and surplus food that is not expired and is safe to consume.</p>
                  <p style={{ marginTop: '15px' }}><strong>How is the food distributed?</strong><br/>Food is distributed through volunteers, partner organizations, and community centers.</p>
                  <p style={{ marginTop: '15px' }}><strong>Is there any cost to donate or receive food?</strong><br/>No. Donating and receiving food is completely free.</p>
                </div>
              )}

              {modalContent === 'contact' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {supportTeam.map((m, i) => (
                    <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #16a34a' }}>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem', color: '#000000' }}>{m.name}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>
                        📧 <a href={`mailto:${m.email}`} style={{ color: '#16a34a', textDecoration: 'none' }}>{m.email}</a><br/>
                        📞 <a href={`tel:${m.phone}`} style={{ color: '#16a34a', textDecoration: 'none' }}>{m.phone}</a>
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {modalContent === 'privacy' && (
                <div style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#334155' }}>
                  <p>We respect your privacy and are committed to protecting your personal information.</p>
                  <p style={{ marginTop: '12px' }}>We only collect necessary details such as your name, contact information, and donation-related data to operate the project effectively.</p>
                  <p style={{ marginTop: '12px' }}>Your information is used solely for communication, coordination, and project improvement.</p>
                  <p style={{ marginTop: '12px' }}>We do not sell, trade, or share personal data with third parties except when required by law or to ensure safe food distribution.</p>
                  <p style={{ marginTop: '12px' }}>Reasonable security measures are in place to protect your data. By using this project, you agree to this privacy policy.</p>
                </div>
              )}
            </div>

            <button 
              className="primary-btn" 
              onClick={closeModal} 
              style={{ marginTop: '25px', width: '100%', background: '#16a34a', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;