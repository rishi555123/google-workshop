import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import confetti from 'canvas-confetti'; // Celebration library
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function NGODashboard({ user, goEdit, deleteAccount }) {
  const [availableFood, setAvailableFood] = useState([]);
  const [myClaims, setMyClaims] = useState([]); 
  const [popup, setPopup] = useState("");
  const [expiredCount, setExpiredCount] = useState(0); 

  const loadData = () => {
    const all = JSON.parse(localStorage.getItem("donations")) || [];
    const now = Date.now();

    // 1. ANALYSER TOOL: Update statuses in background
    const analyzedData = all.map(d => {
      if (d.status === "Available" && d.expiry && now > d.expiry) {
        return { ...d, status: "Expired" };
      }
      return d;
    });

    localStorage.setItem("donations", JSON.stringify(analyzedData));

    // 2. STRICT FILTER: Only show food that is Available AND NOT past expiry time
    setAvailableFood(analyzedData.filter(d => d.status === "Available" && d.expiry > now));
    
    setMyClaims(analyzedData.filter(d => d.status === "Claimed" && d.claimedBy === user.userId));
    setExpiredCount(analyzedData.filter(d => d.status === "Expired").length);
  };

  useEffect(() => {
    if (user) {
      loadData();
      const interval = setInterval(loadData, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (!user) return null;

  const openDirections = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const handleClaim = (donation) => {
    const all = JSON.parse(localStorage.getItem("donations")) || [];
    const updated = all.map(item => {
      if (item.id === donation.id) {
        return { ...item, status: "Claimed", claimedBy: user.userId };
      }
      return item;
    });

    localStorage.setItem("donations", JSON.stringify(updated));
    loadData(); 

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#16a34a', '#ffffff', '#facc15']
    });

    setPopup(`Food Claimed Successfully! 🤝 Opening map...`);
    setTimeout(() => {
      openDirections(donation.lat, donation.lng);
      setPopup("");
    }, 2000);
  };

  const handleCancel = (id) => {
    if (window.confirm("Cancel this claim? The food will be available for others again.")) {
      const all = JSON.parse(localStorage.getItem("donations")) || [];
      const updated = all.map(d => 
        d.id === id ? { ...d, status: "Available", claimedBy: null } : d
      );
      localStorage.setItem("donations", JSON.stringify(updated));
      loadData();
    }
  };

  return (
    <div className="dashboard-container">
      {popup && <div className="popup" style={{zIndex: 3000}}><div className="popup-box">{popup}</div></div>}

      {/* NEW HERO BACKGROUND SECTION */}
      <div className="dashboard-hero-bg">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <div className="user-info-bar">
            <div className="user-avatar">{user.name[0]}</div>
            <span>NGO: {user.name} (ID: {user.userId})</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={goEdit} className="outline-btn" style={{background: 'rgba(255,255,255,0.9)'}}>Edit Profile</button>
            <button onClick={deleteAccount} className="outline-btn" style={{borderColor: 'red', color: 'red', background: 'rgba(255,255,255,0.9)'}}>Delete Account</button>
          </div>
        </div>
        <h1 style={{color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)', position: 'relative', zIndex: 2}}>NGO Dashboard</h1>
      </div>

      {expiredCount > 0 && (
        <div style={{ background: '#fff1f2', color: '#be123c', padding: '15px', borderRadius: '15px', marginBottom: '25px', border: '1px solid #fecdd3' }}>
          ⚠️ <b>Safety Notice:</b> {expiredCount} donation(s) expired and were removed from the live list.
        </div>
      )}

      <h2 style={{ marginBottom: '15px' }}>Donation Map</h2>
      <div className="map-container" style={{ height: '350px', width: '100%', borderRadius: '20px', marginBottom: '40px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <MapContainer center={[user.lat || 17.3850, user.lng || 78.4867]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {availableFood.map((d) => (
            <Marker key={d.id} position={[d.lat || 17.3850, d.lng || 78.4867]}>
              <Popup>
                <div>
                  <strong>{d.restaurant}</strong><br />
                  <p style={{margin: '5px 0'}}>📞 {d.phone}</p>
                  {/* CLEAN AI STATUS: Only shows if Safe */}
                  {d.freshness === 'Safe' && (
                    <p style={{fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold'}}>
                      ✅ AI Status: {d.freshness}
                    </p>
                  )}
                  <button onClick={() => openDirections(d.lat, d.lng)} style={{ marginTop: '10px', width: '100%' }}>Get Directions</button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <section style={{ marginBottom: '50px' }}>
        <h1>Available Donations List</h1>
        <div className="ngo-grid">
          {availableFood.length === 0 ? (
             <div style={{ textAlign: 'center', width: '100%', padding: '40px', color: '#64748b' }}>
                <p style={{fontSize: '1.2rem'}}>🍃 No fresh donations available right now.</p>
             </div>
          ) : (
            availableFood.map((d) => (
              <div className="food-card" key={d.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span className="badge">Available</span>
                  <small>{d.time}</small>
                </div>
                <h3>{d.name}</h3>
                <p>Restaurant: <b>{d.restaurant}</b></p>
                
                {/* CLEAN AI VERIFIED BADGE: Only shows if Safe */}
                {d.freshness === 'Safe' && (
                  <div style={{ margin: '12px 0' }}>
                    <span style={{
                      color: '#16a34a',
                      fontWeight: 'bold',
                      background: '#f0fdf4',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      border: '1px solid #bbf7d0',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      ✅ AI Verified: Safe
                    </span>
                  </div>
                )}

                <p>Quantity: {d.qty} servings</p>
                
                <div style={{ marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                     <span>Freshness Tracker</span>
                     <span>{Math.max(0, Math.round((d.expiry - Date.now()) / 60000))} mins left</span>
                  </div>
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.max(0, ((d.expiry - Date.now()) / (4 * 60 * 60 * 1000)) * 100)}%`, 
                      background: (d.expiry - Date.now()) < 3600000 ? '#ef4444' : '#16a34a',
                      transition: 'width 1s linear'
                    }}></div>
                  </div>
                </div>

                <button className="primary-btn" onClick={() => handleClaim(d)} style={{ marginTop: '20px', width: '100%' }}>
                  Claim Food
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '40px' }}>
        <h1 style={{ marginBottom: '20px', color: '#64748b' }}>My Claim History</h1>
        <div className="ngo-grid">
          {myClaims.length === 0 && <p>You haven't claimed any donations yet.</p>}
          {myClaims.map((d) => (
            <div className="food-card" key={d.id} style={{ borderLeft: '5px solid #64748b', opacity: 0.9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>{d.name}</h3>
                <small>{d.time}</small>
              </div>
              <p>From: <b>{d.restaurant}</b></p>
              <p style={{ marginTop: '5px' }}>📞 {d.phone}</p>
              
              {/* Clean AI Badge in History */}
              {d.freshness === 'Safe' && (
                <div style={{marginTop: '10px'}}>
                  <small style={{color: '#16a34a', fontWeight: 'bold'}}>✨ AI Verified: Safe</small>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="outline-btn" onClick={() => openDirections(d.lat, d.lng)} style={{flex: 1}}>📍 Directions</button>
                <button className="outline-btn" onClick={() => handleCancel(d.id)} style={{flex: 1, color: 'red', borderColor: 'red'}}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default NGODashboard;