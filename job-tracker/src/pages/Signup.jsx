import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) return;
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created!");
      navigate("/login");
    } catch {
      toast.error("Could not create account. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignup();
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
            Create your free account
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
              onFocus={e => e.target.style.borderColor = "#6b5ce7"}
              onBlur={e  => e.target.style.borderColor = "#e0dfd8"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#6b5ce7"}
              onBlur={e  => e.target.style.borderColor = "#e0dfd8"}
            />
          </div>

          {/* Confirm password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Confirm password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                ...inputStyle,
                borderColor: confirm && confirm !== password ? "#f87171" : "#e0dfd8",
              }}
              onFocus={e => e.target.style.borderColor = confirm !== password ? "#f87171" : "#6b5ce7"}
              onBlur={e  => e.target.style.borderColor = confirm && confirm !== password ? "#f87171" : "#e0dfd8"}
            />
            {confirm && confirm !== password && (
              <p style={{ fontSize: "12px", color: "#e53e3e", marginTop: "5px" }}>
                Passwords do not match.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSignup}
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
            {loading ? "Creating account…" : "Create account"}
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

          {/* Login link */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "#aaa" }}>
            Already have an account?{" "}
            <Link to="/login" style={{
              color: "#6b5ce7",
              textDecoration: "none",
              fontWeight: 500,
            }}>
              Sign in
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

export default Signup;