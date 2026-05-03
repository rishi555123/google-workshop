import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { updateProfile } from "../services/authService";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapRecenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], map.getZoom()); }, [lat, lng, map]);
  return null;
}

function LocationMarker({ lat, lng, onPick }) {
  useMapEvents({ click(e) { onPick(e.latlng.lat, e.latlng.lng); } });
  return <Marker position={[lat, lng]} />;
}

function EditProfile({ user, setUser, onBack }) {
  const [form, setForm]           = useState({ ...user });
  const [isLocating, setIsLocating] = useState(false);

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
      () => { setIsLocating(false); alert("Permission denied."); }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
    setUser(form);
    alert("Profile updated successfully!");
    onBack();
  };

  return (
    <div className="edit-page">
      <div className="edit-card">
        <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: 16 }}>
          ← Back
        </button>

        <div className="card card-pad">
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", marginBottom: 28 }}>
            Edit Profile
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" value={form.name} required
                onChange={(e) => set("name", e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} required
                onChange={(e) => set("email", e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Change Password</label>
              <input className="form-input" type="password" value={form.password} required
                onChange={(e) => set("password", e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" type="tel" value={form.phone} required
                onChange={(e) => set("phone", e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Address / Location</label>
              <div style={{ position: "relative" }}>
                <input
                  className="form-input"
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
                          marginBottom: 8, border: "1.5px solid var(--border)" }}>
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
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 20 }}>
              Click map to update your pin
            </p>

            <button type="submit" className="btn btn-primary btn-full">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;