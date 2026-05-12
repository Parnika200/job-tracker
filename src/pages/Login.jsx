import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: "#f4f3ef",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>

        {/* ── Logo ── */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span style={{
            fontSize: "22px",
            fontWeight: 600,
            letterSpacing: "-0.5px",
            color: "#1a1a1a",
          }}>
            Career<span style={{ color: "#6b5ce7" }}>Flow</span>
          </span>
          <p style={{ fontSize: "14px", color: "#aaa", marginTop: "6px" }}>
            Sign in to your account
          </p>
        </div>

        {/* ── Card ── */}
        <div style={{
          background: "white",
          border: "1px solid #eae9e3",
          borderRadius: "20px",
          padding: "2rem",
        }}>

          {/* Email */}
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
              onFocus={e  => e.target.style.borderColor = "#6b5ce7"}
              onBlur={e   => e.target.style.borderColor = "#e0dfd8"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
              onFocus={e  => e.target.style.borderColor = "#6b5ce7"}
              onBlur={e   => e.target.style.borderColor = "#e0dfd8"}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              height: "44px",
              background: loading ? "#a78bfa" : "#6b5ce7",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: loading ? "default" : "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#5a4bcc"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#6b5ce7"; }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "20px 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "#f0efe8" }} />
            <span style={{ fontSize: "12px", color: "#ccc" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#f0efe8" }} />
          </div>

          {/* Signup link */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "#aaa" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{
              color: "#6b5ce7",
              textDecoration: "none",
              fontWeight: 500,
            }}>
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: "12px", color: "#ccc", marginTop: "1.5rem" }}>
          Your job search, organised.
        </p>
      </div>
    </div>
  );
}

/* ─── Shared input styles ─── */
const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "#555",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  height: "44px",
  padding: "0 14px",
  borderRadius: "12px",
  border: "1px solid #e0dfd8",
  background: "#fafaf8",
  fontSize: "14px",
  fontFamily: "'DM Sans', system-ui, sans-serif",
  outline: "none",
  color: "#1a1a1a",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

export default Login;