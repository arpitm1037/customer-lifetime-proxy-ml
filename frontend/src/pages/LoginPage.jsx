import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { loginUser } from "../api/api";
import "../styles/main.css";

function LoginPage({ onLoginSuccess, goSignup, goBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      const user = res?.data?.user || { email };
      onLoginSuccess(user);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Network error or invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-first">
      <Navbar onBack={goBack} />

      <div className="center">
        <div className="auth-card" style={{ backgroundColor: "#fff", padding: "48px 40px", borderRadius: "12px", border: "1px solid #e0e0e0", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", width: "100%", maxWidth: "420px" }}>
          
          <h2 className="upload-title" style={{ textAlign: "center", margin: "0 0 8px 0" }}>Log In</h2>
        <p style={{ textAlign: "center", color: "#666", fontSize: "0.95rem", margin: "0 0 32px 0" }}>Welcome back to the insights platform</p>
        
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {error && <div style={{ color: "#d93025", fontSize: "14px", textAlign: "center", backgroundColor: "#fce8e6", padding: "10px", borderRadius: "6px" }}>{error}</div>}

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#333" }}>Email Address</label>
            <input 
              type="email" 
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#333" }}>Password</label>
            <input 
              type="password" 
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#555" }}>
          Don't have an account? <span onClick={goSignup} className="auth-link">Sign up</span>
        </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
