import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

const links = [
  { to: "/jobs",      label: "Find Jobs" },
  { to: "/tracker",  label: "Tracker"   },
  { to: "/analytics",label: "Analytics" },
];

function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav style={navStyle}>
      {/* Logo */}
      <Link to="/dashboard" style={{ textDecoration: "none" }}>
        <span style={logoStyle}>
          Career<span style={{ color: "#a78bfa" }}>Flow</span>
        </span>
      </Link>

      {/* Links + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {links.map(({ to, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} style={linkStyle(active)}>
              {label}
            </Link>
          );
        })}

        {/* Divider */}
        <div style={dividerStyle} />

        <button onClick={logout} style={logoutStyle}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(167,139,250,0.25)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(167,139,250,0.15)"}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

/* ─── Styles ─── */
const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 2rem",
  height: "90px",
  background: "#1a1a2e",
  borderBottom: "1px solid #252542",
  fontFamily: "'DM Sans', system-ui, sans-serif",
};

const logoStyle = {
  fontSize: "20px",
  fontWeight: 600,
  color: "white",
  letterSpacing: "-0.4px",
};

const linkStyle = (active) => ({
  fontSize: "17px",
  color: active ? "white" : "rgba(255,255,255,0.55)",
  textDecoration: "none",
  padding: "6px 13px",
  borderRadius: "8px",
  background: active ? "rgba(255,255,255,0.08)" : "transparent",
  transition: "background 0.15s, color 0.15s",
});

const dividerStyle = {
  width: "1px",
  height: "18px",
  background: "rgba(255,255,255,0.12)",
  margin: "0 8px",
};

const logoutStyle = {
  fontSize: "13px",
  fontWeight: 500,
  background: "rgba(167,139,250,0.15)",
  color: "#a78bfa",
  border: "1px solid rgba(167,139,250,0.3)",
  padding: "6px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background 0.15s",
  fontFamily: "'DM Sans', system-ui, sans-serif",
};

export default Navbar;