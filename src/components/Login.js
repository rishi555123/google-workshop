import React, { useState } from 'react';

function Login({ setUser, goDashboard, goHome }) {
  // State for the input fields
  const [loginId, setLoginId] = useState(""); // Handles both Email or User ID
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault(); // Prevents page reload

    // 1. Get the list of registered users from local storage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 2. Find a user where (Email matches OR User ID matches) AND password matches
    const foundUser = users.find(u => 
      (u.email === loginId || u.userId === loginId) && u.password === password
    );

    if (foundUser) {
      // 3. Set the global user state so the app knows who is logged in
      setUser(foundUser); 

      // 4. Redirect to the correct dashboard (restaurant or ngo)
      goDashboard(foundUser.role); 
      
      // Play success sound
      //new Audio("/success.mp3").play().catch(() => {});
    } else {
      // Show error if credentials don't match
      alert("Invalid Credentials. Please check your Email/User ID and Password.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Centered Heading and Subtext */}
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-gray)', marginBottom: '30px' }}>
          Log in to continue sharing food
        </p>

        <form onSubmit={handleLogin}>
          {/* Label and Input for Login ID */}
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Email or User ID</label>
            <input 
              type="text"
              placeholder="Enter your Email or User ID" 
              required 
              onChange={(e) => setLoginId(e.target.value)} 
            />
          </div>

          {/* Label and Input for Password */}
          <div style={{ textAlign: 'left', marginTop: '15px' }}>
            <label style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Password</label>
            <input 
              type="password" 
              placeholder="Enter your Password" 
              required 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          {/* Full-width Sign In Button */}
          <button type="submit" className="primary-btn" style={{ width: '100%', marginTop: '25px' }}>
            Sign In
          </button>
        </form>

        {/* Link back to registration */}
        <p style={{ marginTop: '20px', color: 'var(--text-gray)' }}>
          Don't have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => window.location.hash = '/register'}>Create one</span>
        </p>
      </div>
    </div>
  );
}

export default Login;