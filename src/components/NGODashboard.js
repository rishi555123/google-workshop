import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import confetti from "canvas-confetti";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  syncExpiredDonations,
  getAvailableDonations,
  getClaimedByUser,
  getExpiredCount,
  claimDonation,
  cancelClaim,
} from "../services/storageService";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DEFAULT_LAT = 17.3850;
const DEFAULT_LNG = 78.4867;

function NGODashboard({ user, onEdit, onDeleteAccount }) {
  const [available, setAvailable] = useState([]);
  const [myClaims,  setMyClaims]  = useState([]);
  const [expired,   setExpired]   = useState(0);
  const [toast,     setToast]     = useState("");

  const load = () => {
    syncExpiredDonations();
    setAvailable(getAvailableDonations());
    setMyClaims(getClaimedByUser(user.userId));
    setExpired(getExpiredCount());
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000); // refresh every minute
    return () => clearInterval(id);
  }, [user.userId]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openDirections = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  const handleClaim = (donation) => {
    claimDonation(donation.id, user.userId);
    load();
    confetti({ particleCount: 140, spread: 70, origin: { y: 0.6 }, colors: ["#16a34a", "#ffffff", "#facc15"] });
    showToast("🎉 Food claimed! Opening directions…");
    setTimeout(() => openDirections(donation.lat, donation.lng), 2000);
  };

  const handleCancel = (id) => {
    if (window.confirm("Cancel this claim? The food will be available for others again.")) {
      cancelClaim(id);
      load();
    }
  };

  // Freshness bar helpers
  const minsLeft  = (expiry) => Math.max(0, Math.round((expiry - Date.now()) / 60_000));
  const freshPct  = (expiry) => Math.max(0, ((expiry - Date.now()) / (4 * 60 * 60 * 1000)) * 100);
  const freshColor = (expiry) => (expiry - Date.now() < 3_600_000 ? "#ef4444" : "#16a34a");

  return (
    <div className="dashboard">
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 90, left: "50%", transform: "translateX(-50%)",
          background: "#0f172a", color: "#fff", padding: "14px 28px",
          borderRadius: "var(--radius-md)", fontWeight: 700, zIndex: 500,
          animation: "fadeInUp 0.3s ease", boxShadow: "var(--shadow-lg)"
        }}>
          {toast}
        </div>
      )}

      {/* Hero */}
      <div className="dashboard-hero">
        <div className="user-bar">
          <div className="user-pill">
            <div className="user-avatar">{user.name[0].toUpperCase()}</div>
            NGO: {user.name} · ID: {user.userId}
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
        <h1>NGO Dashboard</h1>
      </div>

      {/* Expired notice */}
      {expired > 0 && (
        <div style={{
          background: "#fff1f2", color: "#be123c", padding: "14px 20px",
          borderRadius: "var(--radius-sm)", marginBottom: 24,
          border: "1px solid #fecdd3", fontWeight: 600, fontSize: "0.9rem"
        }}>
          ⚠️ {expired} donation(s) expired and removed from the live list.
        </div>
      )}

      {/* Map */}
      <h2 className="section-title">Live Donation Map</h2>
      <div className="map-wrap" style={{ height: 340, marginBottom: 36 }}>
        <MapContainer
          center={[user.lat || DEFAULT_LAT, user.lng || DEFAULT_LNG]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {available.map((d) => (
            <Marker key={d.id} position={[d.lat || DEFAULT_LAT, d.lng || DEFAULT_LNG]}>
              <Popup>
                <strong>{d.restaurant}</strong><br />
                <span style={{ fontSize: "0.85rem" }}>📞 {d.phone}</span><br />
                {d.freshness === "Safe" && (
                  <span style={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 700 }}>✅ AI: Safe</span>
                )}
                <br />
                <button
                  onClick={() => openDirections(d.lat, d.lng)}
                  style={{
                    marginTop: 8, width: "100%", background: "var(--primary)",
                    color: "#fff", border: "none", padding: "7px 12px",
                    borderRadius: 6, cursor: "pointer", fontWeight: 700
                  }}
                >
                  Get Directions
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Available donations */}
      <h2 className="section-title">Available Donations</h2>
      {available.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍃</div>
          <h3>No donations right now</h3>
          <p>Check back soon — restaurants post new listings regularly.</p>
        </div>
      ) : (
        <div className="food-grid">
          {available.map((d) => (
            <div className="food-card" key={d.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge badge-green">Available</span>
                <small style={{ color: "var(--muted)" }}>{d.time}</small>
              </div>

              <h3>{d.name}</h3>
              <p className="card-meta">🏨 {d.restaurant}</p>
              <p className="card-meta">📦 {d.qty} servings</p>

              {d.freshness === "Safe" && (
                <span className="badge badge-green" style={{ marginTop: 8 }}>✅ AI Verified: Safe</span>
              )}

              {/* Freshness bar */}
              <div className="freshness-bar">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--muted)", marginBottom: 5 }}>
                  <span>Freshness</span>
                  <span>{minsLeft(d.expiry)} mins left</span>
                </div>
                <div className="freshness-bar-track">
                  <div
                    className="freshness-bar-fill"
                    style={{ width: `${freshPct(d.expiry)}%`, background: freshColor(d.expiry) }}
                  />
                </div>
              </div>

              <button className="btn btn-primary btn-full" style={{ marginTop: "auto" }} onClick={() => handleClaim(d)}>
                Claim Food
              </button>
            </div>
          ))}
        </div>
      )}

      <hr className="divider" />

      {/* Claim history */}
      <h2 className="section-title" style={{ color: "var(--muted)" }}>My Claim History</h2>
      {myClaims.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No claims yet.</p>
      ) : (
        <div className="food-grid">
          {myClaims.map((d) => (
            <div className="food-card" key={d.id} style={{ borderLeft: "4px solid var(--muted)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>{d.name}</h3>
                <small style={{ color: "var(--muted)" }}>{d.time}</small>
              </div>
              <p className="card-meta">From: {d.restaurant}</p>
              <p className="card-meta">📞 {d.phone}</p>
              {d.freshness === "Safe" && (
                <small style={{ color: "#16a34a", fontWeight: 700 }}>✨ AI Verified: Safe</small>
              )}
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => openDirections(d.lat, d.lng)}>
                  📍 Directions
                </button>
                <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => handleCancel(d.id)}>
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NGODashboard;