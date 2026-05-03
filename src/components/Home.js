function Home({ onRegister }) {
  const scrollToSteps = () => {
    document.getElementById("steps-anchor")?.scrollIntoView({ behavior: "smooth" });
  };

  const steps = [
    { num: "01", icon: "🏨", title: "Restaurants Post",   desc: "Upload surplus food details, quantity, and pickup timings in seconds." },
    { num: "02", icon: "🔍", title: "NGOs Discover",      desc: "Nearby NGOs receive instant alerts and browse available food on the map." },
    { num: "03", icon: "🤝", title: "Claim & Pickup",     desc: "NGOs claim the food and coordinate a quick pickup from your location." },
    { num: "04", icon: "🌍", title: "Track Impact",       desc: "Monitor how many lives you've touched and your carbon footprint reduction." },
    { num: "05", icon: "🛡️", title: "Secure Validation",  desc: "Every claim is validated with unique IDs to ensure food safety." },
    { num: "06", icon: "♻️", title: "Zero Waste Loop",    desc: "Turning potential waste into nutritious community meals every day." },
    { num: "07", icon: "🚲", title: "Volunteer Support",  desc: "Community volunteers assist in transporting food to remote locations." },
    { num: "08", icon: "📊", title: "Smart Analytics",    desc: "Receive detailed reports on waste reduction and community reach metrics." },
  ];

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-pill">🍃 Reducing food waste, one meal at a time</div>
        <h1>
          Bridge the Gap Between<br />
          <em>Surplus Food</em> and Those <em>in Need</em>
        </h1>
        <p>
          Food Link connects restaurants with NGOs in real-time, ensuring fresh
          surplus food reaches communities instead of landfills.
        </p>
        <div className="hero-btns">
          <button className="btn btn-primary btn-lg" onClick={onRegister}>
            Get Started Free →
          </button>
          <button className="btn btn-outline btn-lg" onClick={scrollToSteps}>
            Learn How It Works
          </button>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stat"><h3>50K+</h3><p>Meals Saved</p></div>
        <div className="stat"><h3>200+</h3><p>Restaurants</p></div>
        <div className="stat"><h3>80+</h3><p>NGOs Connected</p></div>
        <div className="stat"><h3>95%</h3><p>Delivery Rate</p></div>
      </div>

      {/* HOW IT WORKS */}
      <section className="section" id="steps-anchor">
        <div className="section-header">
          <h2>Simple Process, Powerful Impact</h2>
          <p>Our platform makes food donation effortless for everyone</p>
        </div>
        <div className="steps-grid">
          {steps.map((s) => (
            <div className="step-card" key={s.num}>
              <div className="step-num">{s.num}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <h2>Ready to Make a Difference?</h2>
        <p>Join hundreds of restaurants and NGOs already using Food Link.</p>
        <button className="btn btn-primary btn-lg" onClick={onRegister}>
          Join the Movement
        </button>
      </div>
    </>
  );
}

export default Home;