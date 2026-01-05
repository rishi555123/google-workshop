import { useState, useEffect } from "react"; // Added useEffect
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'; // Added useMap
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Register({ goLogin }) {
  const [role, setRole] = useState("restaurant");
  const [isLocating, setIsLocating] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", email: "", password: "", userId: "", phone: "", address: "",
    lat: 17.3850, lng: 78.4867 
  });

  // --- NEW ADDITION: COMPONENT TO RE-CENTER MAP VISUALLY ---
  function MapRecenter({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
      map.flyTo([lat, lng], map.getZoom()); // Smoothly moves map to the new pin
    }, [lat, lng, map]);
    return null;
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData(prev => ({ ...prev, lat, lng, address: `Pinned: ${lat.toFixed(4)}, ${lng.toFixed(4)}` }));
      },
    });
    return formData.lat ? <Marker position={[formData.lat, formData.lng]} /> : null;
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

  const handleCreate = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.userId === formData.userId)) return alert("User ID taken!");
    users.push({ ...formData, role, id: Date.now() });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Success! Please Login.");
    goLogin();
  };

  return (
    <div className="auth-container" style={{padding: '40px 0'}}>
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <h2>Join Food Link</h2>
        <form onSubmit={handleCreate}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div onClick={() => setRole("restaurant")} className={`role-btn ${role === 'restaurant' ? 'active' : ''}`}>🏨 Restaurant</div>
            <div onClick={() => setRole("ngo")} className={`role-btn ${role === 'ngo' ? 'active' : ''}`}>🤝 NGO</div>
          </div>

          <input placeholder={role === "restaurant" ? "Restaurant Name" : "NGO Name"} required onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input placeholder="Unique User ID" required onChange={(e) => setFormData({...formData, userId: e.target.value})} />
          <input placeholder="Phone" type="tel" required onChange={(e) => setFormData({...formData, phone: e.target.value})} />

          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <input placeholder="Address" value={formData.address} required onChange={(e) => setFormData({...formData, address: e.target.value})} />
            <button type="button" onClick={getLiveLocation} style={{ position: 'absolute', right: '10px', top: '10px', border: 'none', background: 'none', cursor: 'pointer' }}>
              {isLocating ? "⌛" : "📍"}
            </button>
          </div>

          <div style={{ height: '200px', borderRadius: '10px', overflow: 'hidden', marginBottom: '15px', border: '1px solid #ddd' }}>
            <MapContainer center={[formData.lat, formData.lng]} zoom={13} style={{ height: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {/* Added the recenter component here */}
              <MapRecenter lat={formData.lat} lng={formData.lng} /> 
              <LocationMarker />
            </MapContainer>
            <small style={{ color: '#64748b' }}>Click on the map to pin exact location</small>
          </div>

          <input placeholder="Email" type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input placeholder="Password" type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
          
          <button type="submit" className="primary-btn" style={{ width: '100%' }}>Create Account</button>
        </form>
      </div>
    </div>
  );
}
export default Register;