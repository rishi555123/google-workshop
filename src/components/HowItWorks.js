function HowItWorks() {
  const steps = [
    { num: "01", icon: "📝", title: "Digital Registration",   desc: "Create a verified profile and set your service radius to match with donors or NGOs in your area." },
    { num: "02", icon: "🔔", title: "Smart Notifications",    desc: "Real-time alerts the moment a fresh donation is posted within your geofenced location." },
    { num: "03", icon: "📋", title: "Inventory Management",   desc: "Restaurants list specific food types and storage requirements so NGOs bring the right equipment." },
    { num: "04", icon: "🛡️", title: "Secure Verification",    desc: "Every pickup is secured with a unique system-generated ID to prevent unauthorized claims." },
    { num: "05", icon: "🧊", title: "Safety Compliance",      desc: "All donations follow a strict time-window protocol to maintain food freshness and safety." },
    { num: "06", icon: "📊", title: "Analytics Tracking",     desc: "Monthly reports on waste prevented, carbon footprint reduction, and lives impacted." },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <h2>The Technology Behind the Impact</h2>
        <p>Advanced features that make Food Link a secure and efficient food redistribution network.</p>
      </div>
      <div className="steps-grid">
        {steps.map((s, i) => (
          <div
            className="step-card"
            key={s.num}
            style={{ animationDelay: `${i * 0.08}s`, animation: "fadeInUp 0.5s ease both" }}
          >
            <div className="step-num">{s.num}</div>
            <div className="step-icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;