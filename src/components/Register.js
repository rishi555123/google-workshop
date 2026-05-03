import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { registerUser } from "../services/authService";

// Fix Leaflet default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Smoothly re-centers map when coordinates change
function MapRecenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], map.getZoom()); }, [lat, lng, map]);
  return null;
}

// Handles map click to drop pin
function LocationMarker({ lat, lng, onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return <Marker position={[lat, lng]} />;
}

const DEFAULT_LAT = 17.3850;
const DEFAULT_LNG = 78.4867;

function Register({ onGoLogin }) {
  const [role, setRole]       = useState("restaurant");
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState({
    name: "", userId: "", phone: "", address: "",
    email: "", password: "",
    lat: DEFAULT_LAT, lng: DEFAULT_LNG,
  });

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const getLiveLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setForm((f) => ({ ...f, address: data.display_name, lat: latitude, lng: longitude }));
        } catch {
          setForm((f) => ({ ...f, address: `${latitude}, ${longitude}`, lat: latitude, lng: longitude }));
        }
        setIsLocating(false);
      },
      () => { setIsLocating(false); alert("Location permission denied."); }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const result = registerUser(form, role);
    if (!result.success) {
      setError(result.error);
      return;
    }
    alert("Account created! Please log in.");
    onGoLogin();
  };

  return (
    <div className="auth-page" style={{ alignItems: "flex-start", paddingTop: 48 }}>
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <h2>Join Food Link</h2>
        <p className="subtitle">Create your account to get started</p>

        {/* Role selector */}
        <div className="role-toggle">
          <div
            className={`role-btn${role === "restaurant" ? " active" : ""}`}
            onClick={() => setRole("restaurant")}
          >
            <span className="role-icon">🏨</span>Restaurant
          </div>
          <div
            className={`role-btn${role === "ngo" ? " active" : ""}`}
            onClick={() => setRole("ngo")}
          >
            <span className="role-icon">🤝</span>NGO
          </div>
        </div>

        {error && (
          <div style={{
            background: "var(--danger-light)", color: "#991b1b",
            padding: "12px 16px", borderRadius: "var(--radius-sm)",
            fontSize: "0.9rem", fontWeight: 600, marginBottom: 20,
            border: "1px solid #fecaca"
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{role === "restaurant" ? "Restaurant Name" : "NGO Name"}</label>
            <input className="form-input" placeholder="Enter name" required
              onChange={(e) => set("name", e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Unique User ID</label>
            <input className="form-input" placeholder="e.g. hotel_xyz_hyd" required
              onChange={(e) => set("userId", e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" type="tel" placeholder="10-digit mobile number" required
              onChange={(e) => set("phone", e.target.value)} />
          </div>

          {/* Address + map */}
          <div className="form-group">
            <label className="form-label">Address / Location</label>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                placeholder="Enter address or use 📍"
                value={form.address}
                required
                onChange={(e) => set("address", e.target.value)}
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={getLiveLocation}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                         background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}
              >
                {isLocating ? "⌛" : "📍"}
              </button>
            </div>
          </div>

          <div style={{ height: 200, borderRadius: "var(--radius-sm)", overflow: "hidden",
                        marginBottom: 18, border: "1.5px solid var(--border)" }}>
            <MapContainer center={[form.lat, form.lng]} zoom={13} style={{ height: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapRecenter lat={form.lat} lng={form.lng} />
              <LocationMarker
                lat={form.lat} lng={form.lng}
                onPick={(lat, lng) =>
                  setForm((f) => ({ ...f, lat, lng, address: `Pinned: ${lat.toFixed(4)}, ${lng.toFixed(4)}` }))
                }
              />
            </MapContainer>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 18, marginTop: -14 }}>
            Click the map to pin your exact location
          </p>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@example.com" required
              onChange={(e) => set("email", e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Create a password" required
              onChange={(e) => set("password", e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 8 }}>
            Create Account →
          </button>
        </form>

        <p style={{ marginTop: 24, textAlign: "center", color: "var(--muted)", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <span style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 700 }} onClick={onGoLogin}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;