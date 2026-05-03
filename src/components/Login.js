import { useState } from "react";
import { loginUser } from "../services/authService";

function Login({ onLogin, onGoRegister }) {
  const [loginId, setLoginId]   = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Small timeout so the button press feels responsive
    setTimeout(() => {
      const result = loginUser(loginId, password);
      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Log in to continue sharing food</p>

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
            <label className="form-label">Email or User ID</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter your email or User ID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            style={{ marginTop: 8 }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p style={{ marginTop: 24, textAlign: "center", color: "var(--muted)", fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 700 }}
            onClick={onGoRegister}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;