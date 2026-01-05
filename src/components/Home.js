import React from 'react';

function Home({ goRegister }) {
  // Smooth scroll function for the "Learn How It Works" button
  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works-anchor');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div style={{display: 'inline-block', padding: '8px 20px', background: '#dcfce7', color: '#166534', borderRadius: '50px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '20px'}}>
          🍃 Reducing food waste, one meal at a time
        </div>
        <h1>Bridge the Gap Between <br/><span>Surplus Food</span> and Those <span>in Need</span></h1>
        <p>Food Link connects restaurants with NGOs in real-time, ensuring fresh surplus food reaches underprivileged communities instead of landfills.</p>
        
        <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
          <button className="primary-btn" onClick={goRegister}>
            Get Started Free →
          </button>
          <button className="outline-btn" onClick={scrollToHowItWorks}>
            Learn How It Works
          </button>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="stats-bar" style={{marginTop: '0'}}>
        <div className="stat-item"><h2>50K+</h2><p>Meals Saved</p></div>
        <div className="stat-item"><h2>200+</h2><p>Restaurants</p></div>
        <div className="stat-item"><h2>80+</h2><p>NGOs Connected</p></div>
        <div className="stat-item"><h2>95%</h2><p>Delivery Rate</p></div>
      </section>

      {/* HOW IT WORKS SECTION HEADER */}
      <div id="how-it-works-anchor" className="how-it-works-section" style={{ paddingTop: '80px' }}>
        <h2 style={{fontSize: '2.5rem'}}>Simple Process, Powerful Impact</h2>
        <p style={{color: 'var(--text-gray)'}}>Our platform makes food donation effortless for everyone</p>
      </div>

      <section className="how-it-works-grid">
        {/* Step 01 */}
        <div className="step-card">
          <div className="step-number">01</div>
          <span className="step-icon" style={{fontSize: '2.5rem'}}>🏨</span>
          <h3>Restaurants Post</h3>
          <p style={{color: 'var(--text-gray)'}}>Upload surplus food details, quantity, and pickup timings in seconds.</p>
        </div>

        {/* Step 02 */}
        <div className="step-card">
          <div className="step-number">02</div>
          <span className="step-icon" style={{fontSize: '2.5rem'}}>🔍</span>
          <h3>NGOs Discover</h3>
          <p style={{color: 'var(--text-gray)'}}>Nearby NGOs receive instant alerts and browse available food on the map.</p>
        </div>

        {/* Step 03 */}
        <div className="step-card">
          <div className="step-number">03</div>
          <span className="step-icon" style={{fontSize: '2.5rem'}}>🤝</span>
          <h3>Claim & Pickup</h3>
          <p style={{color: 'var(--text-gray)'}}>NGOs claim the food and coordinate a quick pickup from your location.</p>
        </div>

        {/* Step 04 */}
        <div className="step-card">
          <div className="step-number">04</div>
          <span className="step-icon" style={{fontSize: '2.5rem'}}>🌍</span>
          <h3>Track Impact</h3>
          <p style={{color: 'var(--text-gray)'}}>Monitor how many lives you've touched and your carbon footprint reduction.</p>
        </div>

        {/* Step 05 */}
        <div className="step-card">
          <div className="step-number">05</div>
          <span className="step-icon" style={{fontSize: '2.5rem'}}>🛡️</span>
          <h3>Secure Validation</h3>
          <p style={{color: 'var(--text-gray)'}}>Every claim is validated with unique IDs to ensure food safety and transparency.</p>
        </div>

        {/* Step 06 */}
        <div className="step-card">
          <div className="step-number">06</div>
          <span className="step-icon" style={{fontSize: '2.5rem'}}>♻️</span>
          <h3>Zero Waste Loop</h3>
          <p style={{color: 'var(--text-gray)'}}>Closing the loop by turning potential waste into nutritious community meals.</p>
        </div>

        {/* Step 07: NEW ADDITION */}
        <div className="step-card">
          <div className="step-number">07</div>
          <span className="step-icon" style={{fontSize: '2.5rem'}}>🚲</span>
          <h3>Volunteer Support</h3>
          <p style={{color: 'var(--text-gray)'}}>Community volunteers can assist in the transportation of food to remote locations.</p>
        </div>

        {/* Step 08: NEW ADDITION */}
        <div className="step-card">
          <div className="step-number">08</div>
          <span className="step-icon" style={{fontSize: '2.5rem'}}>📊</span>
          <h3>Smart Analytics</h3>
          <p style={{color: 'var(--text-gray)'}}>Receive detailed reports on waste reduction and community reach metrics.</p>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section style={{padding: '80px 10%', background: '#0f172a', color: 'white', textAlign: 'center', borderRadius: '40px', margin: '0 8% 80px'}}>
        <h2 style={{fontSize: '2.5rem', marginBottom: '20px'}}>Ready to Make a Difference?</h2>
        <p style={{opacity: '0.8', marginBottom: '40px'}}>Join hundreds of restaurants and NGOs already using Food Link.</p>
        <button className="primary-btn" onClick={goRegister} style={{padding: '15px 50px'}}>Join the Movement</button>
      </section>
    </div>
  );
}

export default Home;