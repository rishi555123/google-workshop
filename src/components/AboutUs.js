function AboutUs() {
  return (
    <div className="dashboard-container">
      <div className="section-title">
        <h2>Our Mission</h2>
        <p>Connecting surplus to scarcity, one meal at a time.</p>
      </div>

      <div className="auth-container" style={{minHeight: 'auto'}}>
        <div className="auth-card" style={{maxWidth: '800px', textAlign: 'left'}}>
          <h3>Who We Are</h3>
          <p style={{lineHeight: '1.6', color: 'var(--text-gray)'}}>
            Food Link was founded with a simple goal: to reduce the 40% of food that goes to waste every year while millions go hungry. 
            We provide a real-time platform where restaurants can list their surplus food and local NGOs can claim it instantly.
          </p>
          <div className="stats-grid" style={{marginTop: '30px'}}>
            <div className="stat-card"><h3>100%</h3><p>Transparent</p></div>
            <div className="stat-card"><h3>Real-time</h3><p>Connections</p></div>
            <div className="stat-card"><h3>Impact</h3><p>Focused</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AboutUs;