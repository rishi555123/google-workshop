import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function EditProfile({ user, setUser, goBack }) {
  const [formData, setFormData] = useState({ ...user });
  const [isLocating, setIsLocating] = useState(false);

  // Re-centers the map visually when coordinates change
  function MapRecenter({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
      map.flyTo([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    return null;
  }

  // Handle manual clicks on the map to re-pin
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData(prev => ({ ...prev, lat, lng, address: `Pinned: ${lat.toFixed(4)}, ${lng.toFixed(4)}` }));
      },
    });
    return <Marker position={[formData.lat, formData.lng]} />;
  }

  const getLiveLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        setFormData({ ...formData, address: data.display_name, lat: latitude, lng: longitude });
      } catch {
        setFormData({ ...formData, address: `${latitude}, ${longitude}`, lat: latitude, lng: longitude });
      }
      setIsLocating(false);
    }, () => {
      setIsLocating(false);
      alert("Permission denied.");
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) => (u.userId === user.userId ? formData : u));
    
    localStorage.setItem("users", JSON.stringify(updatedUsers)); // Save to storage
    setUser(formData); // Update current session
    alert("Profile and Location updated successfully!");
    goBack();
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "500px" }}>
        <button onClick={goBack} className="back-btn">← Back</button>
        <h2>Edit Profile</h2>
        <form onSubmit={handleUpdate}>
          <label>Name</label>
          <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          
          <label>Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />

          {/* PASSWORD EDIT OPTION */}
          <label>Change Password</label>
          <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />

          <label>Phone</label>
          <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />

          {/* MAP EDITING SECTION */}
          <label>Update Location</label>
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <input value={formData.address} required onChange={(e) => setFormData({...formData, address: e.target.value})} />
            <button type="button" onClick={getLiveLocation} style={{ position: 'absolute', right: '10px', top: '10px', border: 'none', background: 'none', cursor: 'pointer' }}>
              {isLocating ? "⌛" : "📍"}
            </button>
          </div>

          <div style={{ height: '200px', borderRadius: '10px', overflow: 'hidden', marginBottom: '15px', border: '1px solid #ddd' }}>
            <MapContainer center={[formData.lat, formData.lng]} zoom={13} style={{ height: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapRecenter lat={formData.lat} lng={formData.lng} /> 
              <LocationMarker />
            </MapContainer>
            <small style={{ color: '#64748b' }}>Click map to update your pin</small>
          </div>

          <button type="submit" className="primary-btn" style={{ width: "100%", marginTop: "10px" }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;