import React, { useState, useEffect } from 'react';
import { analyzeFoodImage } from '../services/GeminiHelper';

function RestaurantDashboard({ user, goEdit, deleteAccount }) {
  const [showModal, setShowModal] = useState(false);
  const [donations, setDonations] = useState([]);
  const [newFood, setNewFood] = useState({ name: "", qty: "", freshness: "" }); // Reset to empty string
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [timer, setTimer] = useState(0);

  const loadDonations = () => {
    const saved = JSON.parse(localStorage.getItem("donations")) || [];
    setDonations(saved.filter(d => d.userId === user.userId));
  };

  useEffect(() => {
    loadDonations();
  }, [user.userId]);

  useEffect(() => {
    let interval;
    if (isAiLoading) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isAiLoading]);

  const resetForm = () => {
    setNewFood({ name: "", qty: "", freshness: "" });
    setImagePreview(null);
    setTimer(0);
  };

  const handlePost = () => {
    if (!newFood.name || !newFood.qty) return alert("Please fill all fields");
    
    const expiryTime = Date.now() + (4 * 60 * 60 * 1000); 

    const entry = {
      id: Date.now(),
      userId: user.userId,
      restaurant: user.name,
      name: newFood.name,
      qty: newFood.qty,
      freshness: newFood.freshness, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiry: expiryTime,
      status: "Available",
      lat: user.lat,
      lng: user.lng,
      phone: user.phone
    };

    const all = JSON.parse(localStorage.getItem("donations") || "[]");
    localStorage.setItem("donations", JSON.stringify([entry, ...all]));
    loadDonations();
    setShowModal(false);
    resetForm();
  };

  const deleteDonation = (id) => {
    if (window.confirm("Delete this donation post permanently?")) {
      const all = JSON.parse(localStorage.getItem("donations")) || [];
      const filtered = all.filter(d => d.id !== id);
      localStorage.setItem("donations", JSON.stringify(filtered));
      loadDonations();
    }
  };

  return (
    <div className="dashboard-container">
      {/* NEW HERO BACKGROUND AREA */}
      <div className="dashboard-hero-bg">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <div className="user-info-bar">
            <div className="user-avatar">{user.name[0]}</div>
            <span>Logged in as: {user.name}</span>
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={goEdit} className="outline-btn" style={{background: 'rgba(255,255,255,0.9)'}}>Edit Profile</button>
            <button onClick={deleteAccount} className="outline-btn" style={{color: 'red', borderColor: 'red', background: 'rgba(255,255,255,0.9)'}}>Delete Account</button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <h1 style={{color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>Restaurant Dashboard</h1>
          <button className="primary-btn" onClick={() => { resetForm(); setShowModal(true); }}>+ Post Donation</button>
        </div>
      </div>

      <div className="stats-grid" style={{marginTop: '-40px', position: 'relative', zIndex: 3}}>
        <div className="stat-card"><h4>Total Posted</h4><h2>{donations.length}</h2></div>
        <div className="stat-card"><h4>Meals Saved</h4><h2>1,250</h2></div>
        <div className="stat-card"><h4>Active</h4><h2>{donations.filter(d => d.status === "Available").length}</h2></div>
        <div className="stat-card"><h4>Impact</h4><h2>98%</h2></div>
      </div>

      <h3 style={{marginTop: '40px'}}>Recent Donations</h3>
      {donations.map((d, i) => (
        <div key={i} className="donation-list-item">
          <div className="donation-info">
            <div className="food-icon-box">🍱</div>
            <div>
              <b style={{fontSize: '1.1rem'}}>{d.name}</b>
              <p style={{margin: '5px 0', color: '#64748b'}}>{d.qty} servings • {d.time}</p>
              
              {/* CLEAN AI BADGE: No Manual Entry text */}
              {d.freshness === 'Safe' && (
                <small style={{
                  color: '#16a34a',
                  fontWeight: 'bold',
                  background: '#f0fdf4',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #bbf7d0',
                  display: 'inline-block',
                  marginTop: '4px'
                }}>
                  ✨ AI Verified: Safe
                </small>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span className={`badge ${d.status === "Available" ? 'status-available' : d.status === "Expired" ? 'status-expired' : 'status-claimed'}`}>
              {d.status}
            </span>
            <button onClick={() => deleteDonation(d.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
              🗑️
            </button>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="popup">
          <div className="popup-box" style={{maxHeight: '85vh', overflowY: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
               <h3>Post New Donation</h3>
               <button onClick={resetForm} style={{fontSize: '0.8rem', color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer'}}>Reset Form</button>
            </div>
            
            <div className="ai-scan-section">
              <label className="ai-scan-label">✨ AI Freshness Scan</label>
              
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '10px', border: '3px solid #16a34a', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)'}} 
                />
              )}
              
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  setImagePreview(URL.createObjectURL(file));
                  setIsAiLoading(true);
                  setNewFood(prev => ({ ...prev, freshness: "Scanning..." }));
                  
                  const data = await analyzeFoodImage(file);
                  
                  if (data) {
                    if (data.freshness === "Unsafe") {
                      alert(`❌ AI SAFETY ALERT: Spoilage detected. This cannot be donated.`);
                      resetForm();
                    } else {
                      setNewFood({ 
                        name: data.name || "", 
                        qty: data.qty || "", 
                        // ONLY set freshness if AI identifies as Safe
                        freshness: data.name ? "Safe" : "" 
                      });
                      if (!data.name) alert("AI couldn't identify the dish. Please fill manually.");
                    }
                  }
                  setIsAiLoading(false);
                }
              }} />
              
              {isAiLoading && (
                <div style={{marginTop: '10px'}}>
                  <p className="ai-loading-text">Gemini AI is analyzing... ({timer}s)</p>
                  <div className="ai-progress-container">
                    <div className="ai-progress-bar"></div>
                  </div>
                </div>
              )}
            </div>

            <label>Food Item Name</label>
            <input placeholder="e.g. Rice & Curry" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} />
            
            <label>Quantity (Servings)</label>
            <input placeholder="e.g. 20" value={newFood.qty} onChange={e => setNewFood({...newFood, qty: e.target.value})} />
            
            <button className="primary-btn" style={{ width: '100%', marginTop: '20px' }} onClick={handlePost} disabled={isAiLoading}>
              {isAiLoading ? "Processing AI Analysis..." : "Submit Donation"}
            </button>
            <button onClick={() => setShowModal(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantDashboard;