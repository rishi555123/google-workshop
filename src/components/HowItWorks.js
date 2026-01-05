import React from 'react';

function HowItWorks() {
  const steps = [
    { 
      num: "01", 
      icon: "📝", 
      title: "Digital Registration", 
      desc: "Create a verified profile and set your service radius to match with donors or NGOs in your immediate area." 
    },
    { 
      num: "02", 
      icon: "🔔", 
      title: "Smart Notifications", 
      desc: "Our system sends real-time push alerts the moment a fresh donation is posted within your geofenced location." 
    },
    { 
      num: "03", 
      icon: "📋", 
      title: "Inventory Management", 
      desc: "Restaurants list specific food types and storage requirements to ensure NGOs bring the right transport equipment." 
    },
    { 
      num: "04", 
      icon: "🛡️", 
      title: "Secure Verification", 
      desc: "Every pickup is secured with a unique system-generated ID to prevent unauthorized claims and ensure transparency." 
    },
    { 
      num: "05", 
      icon: "🧊", 
      title: "Safety Compliance", 
      desc: "All donations follow a strict time-window protocol to maintain food freshness and consumption safety standards." 
    },
    { 
      num: "06", 
      icon: "📊", 
      title: "Analytics Tracking", 
      desc: "Generate monthly reports on waste prevented, carbon footprint reduction, and the total number of lives impacted." 
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Centered Section Header */}
      <div className="section-title" style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>The Technology Behind the Impact</h2>
        <p style={{ color: 'var(--text-gray)', fontSize: '1.1rem' }}>
          Discover the advanced features that make Food Link a secure and efficient food redistribution network.
        </p>
      </div>

      {/* Grid displaying 6 steps */}
      <div className="how-it-works-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px' 
      }}>
        {steps.map((step, i) => (
          <div className="step-card" key={i} style={{ 
            animation: 'fadeInUp 0.6s ease-out forwards',
            animationDelay: `${i * 0.1}s` 
          }}>
            <div className="step-number" style={{
              width: '40px',
              height: '40px',
              background: '#dcfce7',
              color: 'var(--primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              margin: '0 auto 20px'
            }}>{step.num}</div>
            
            <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '15px' }}>
              {step.icon}
            </span>
            
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{step.title}</h3>
            
            <p style={{ 
              color: 'var(--text-gray)', 
              fontSize: '0.95rem', 
              lineHeight: '1.6' 
            }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;