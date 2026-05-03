function AboutUs() {
  return (
    <section className="section">
      <div className="section-header">
        <h2>Our Mission</h2>
        <p>Connecting surplus to scarcity, one meal at a time.</p>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div className="card card-pad" style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.6rem", marginBottom: 16 }}>
            Who We Are
          </h3>
          <p style={{ lineHeight: 1.8, color: "var(--muted)", fontSize: "1.02rem" }}>
            Food Link was founded with a simple goal: to reduce the 40% of food
            that goes to waste every year while millions go hungry. We provide a
            real-time platform where restaurants can list their surplus food and
            local NGOs can claim it instantly — before it perishes.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {[
            { h: "100%",      p: "Transparent" },
            { h: "Real-time", p: "Connections" },
            { h: "Impact",    p: "Focused" },
          ].map((s, i) => (
            <div key={i} className="card card-pad text-center">
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color: "var(--primary)", marginBottom: 6 }}>
                {s.h}
              </h2>
              <p style={{ color: "var(--muted)", fontWeight: 700 }}>{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutUs;