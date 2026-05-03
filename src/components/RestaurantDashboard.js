import { useState, useEffect } from "react";
import {
  getDonationsForUser,
  addDonation,
  deleteDonation,
  syncExpiredDonations,
} from "../services/storageService";
import { analyzeFoodImage } from "../services/GeminiHelper";

function RestaurantDashboard({ user, onEdit, onDeleteAccount }) {
  const [donations, setDonations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isAiLoading, setIsAiLoading]   = useState(false);
  const [aiTimer, setAiTimer]           = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({ name: "", qty: "", freshness: "" });

  const load = () => {
    syncExpiredDonations();
    setDonations(getDonationsForUser(user.userId));
  };

  useEffect(() => { load(); }, [user.userId]);

  // AI scan timer
  useEffect(() => {
    if (!isAiLoading) { setAiTimer(0); return; }
    const id = setInterval(() => setAiTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [isAiLoading]);

  const resetForm = () => {
    setForm({ name: "", qty: "", freshness: "" });
    setImagePreview(null);
  };

  const handleImageScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setIsAiLoading(true);
    setForm((f) => ({ ...f, freshness: "Scanning…" }));

    const data = await analyzeFoodImage(file);

    if (data.freshness === "Unsafe") {
      alert(`❌ AI Safety Alert: Spoilage detected — ${data.reason || "unsafe to donate"}.\nThis item cannot be posted.`);
      resetForm();
    } else if (data.name) {
      setForm({ name: data.name, qty: String(data.qty || ""), freshness: "Safe" });
    } else {
      setForm((f) => ({ ...f, freshness: "" }));
      alert("AI couldn't identify the dish. Please fill details manually.");
    }
    setIsAiLoading(false);
  };

  const handlePost = () => {
    if (!form.name || !form.qty) return alert("Please fill food name and quantity.");
    const donation = {
      id:         Date.now(),
      userId:     user.userId,
      restaurant: user.name,
      phone:      user.phone,
      lat:        user.lat,
      lng:        user.lng,
      name:       form.name,
      qty:        form.qty,
      freshness:  form.freshness,
      time:       new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      expiry:     Date.now() + 4 * 60 * 60 * 1000, // 4 hours
      status:     "Available",
    };
    addDonation(donation);
    load();
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this donation post permanently?")) {
      deleteDonation(id);
      load();
    }
  };

  const statusClass = (s) =>
    s === "Available" ? "badge-green" : s === "Claimed" ? "badge-red" : "badge-gray";

  return (
    <div className="dashboard">
      {/* Hero */}
      <div className="dashboard-hero">
        <div className="user-bar">
          <div className="user-pill">
            <div className="user-avatar">{user.name[0].toUpperCase()}</div>
            {user.name}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-outline btn-sm" style={{ background: "rgba(255,255,255,0.9)" }} onClick={onEdit}>
              Edit Profile
            </button>
            <button className="btn btn-danger btn-sm" style={{ background: "rgba(255,255,255,0.9)" }} onClick={onDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
        <h1>Restaurant Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="dash-stat"><h4>Total Posted</h4><h2>{donations.length}</h2></div>
        <div className="dash-stat"><h4>Active Now</h4>  <h2>{donations.filter((d) => d.status === "Available").length}</h2></div>
        <div className="dash-stat"><h4>Claimed</h4>     <h2>{donations.filter((d) => d.status === "Claimed").length}</h2></div>
        <div className="dash-stat"><h4>Impact</h4>      <h2>98%</h2></div>
      </div>

      {/* Donate button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="section-title">Recent Donations</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          + Post Donation
        </button>
      </div>

      {/* Donation list */}
      {donations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍱</div>
          <h3>No donations yet</h3>
          <p>Click "Post Donation" to add your first surplus food listing.</p>
        </div>
      ) : (
        donations.map((d) => (
          <div className="donation-item" key={d.id}>
            <div className="donation-item-left">
              <div className="food-icon">🍱</div>
              <div>
                <h4>{d.name}</h4>
                <p>{d.qty} servings · {d.time}</p>
                {d.freshness === "Safe" && (
                  <span className="badge badge-green" style={{ marginTop: 4 }}>✨ AI Verified: Safe</span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className={`badge ${statusClass(d.status)}`}>{d.status}</span>
              <button
                onClick={() => handleDelete(d.id)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: 4 }}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      )}

      {/* Post Donation Modal */}
      {showModal && (
        <div className="overlay">
          <div className="modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3>Post New Donation</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => { setShowModal(false); resetForm(); }}>✕</button>
            </div>

            {/* AI scan */}
            <div className="ai-box">
              <p className="ai-box-label">✨ AI Freshness Scan (optional)</p>
              {imagePreview && (
                <img src={imagePreview} alt="Preview"
                  style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 10,
                           margin: "0 auto 10px", border: "3px solid var(--primary)", display: "block" }} />
              )}
              <input type="file" accept="image/*" onChange={handleImageScan} />
              {isAiLoading && (
                <div style={{ marginTop: 10 }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 700 }}>
                    Gemini AI analyzing… ({aiTimer}s)
                  </p>
                  <div className="ai-progress"><div className="ai-progress-bar" /></div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Food Item Name</label>
              <input className="form-input" placeholder="e.g. Rice & Curry"
                value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">Quantity (servings)</label>
              <input className="form-input" type="number" placeholder="e.g. 20"
                value={form.qty} onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))} />
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={handlePost}
              disabled={isAiLoading}
              style={{ marginTop: 8 }}
            >
              {isAiLoading ? "Processing AI…" : "Submit Donation"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantDashboard;