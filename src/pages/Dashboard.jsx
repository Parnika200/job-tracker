import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../componants/Navbar";

/* ─── helpers ─── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const tips = [
  "Consistency beats intensity — apply to a few well-matched roles daily.",
  "Tailor your resume for every strong opportunity you apply to.",
  "Follow up after interviews with a short, professional thank-you note.",
  "Every rejection narrows the field — stay focused on the next one.",
  "Small progress compounded daily leads to extraordinary results.",
];

/* ─── Badge component ─── */
const statusColors = {
  Saved:     { bg: "#f3f4f6", color: "#6b7280" },
  Applied:   { bg: "#e0f2fe", color: "#0369a1" },
  Interview: { bg: "#fef9c3", color: "#854d0e" },
  Rejected:  { bg: "#fee2e2", color: "#991b1b" },
  Offer:     { bg: "#dcfce7", color: "#166534" },
};

function StatusBadge({ status }) {
  const s = statusColors[status] ?? { bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span style={{
      fontSize: "11px",
      fontWeight: 500,
      padding: "3px 10px",
      borderRadius: "20px",
      background: s.bg,
      color: s.color,
    }}>
      {status}
    </span>
  );
}

/* ─── Stat card ─── */
function StatCard({ label, value, highlight }) {
  return (
    <div style={{
      background: highlight ? "#6b5ce7" : "white",
      border: `1px solid ${highlight ? "#6b5ce7" : "#eae9e3"}`,
      borderRadius: "14px",
      padding: "1rem",
    }}>
      <p style={{
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.6px",
        color: highlight ? "rgba(255,255,255,0.65)" : "#999",
        marginBottom: "8px",
      }}>
        {label}
      </p>
      <p style={{
        fontSize: "26px",
        fontWeight: 600,
        letterSpacing: "-1px",
        color: highlight ? "white" : "#1a1a1a",
      }}>
        {value}
      </p>
    </div>
  );
}

/* ─── Funnel row ─── */
function FunnelRow({ label, count, max, color }) {
  const pct = max === 0 ? 0 : Math.round((count / max) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ width: "70px", fontSize: "12px", color: "#888", flexShrink: 0 }}>
        {label}
      </span>
      <div style={{
        flex: 1,
        background: "#f4f3ef",
        borderRadius: "6px",
        height: "22px",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`,
          minWidth: count > 0 ? "28px" : "0",
          height: "100%",
          background: color,
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "8px",
          fontSize: "11px",
          fontWeight: 600,
          color: "white",
          transition: "width 0.5s ease",
        }}>
          {count > 0 ? count : ""}
        </div>
      </div>
      <span style={{ fontSize: "12px", color: "#aaa", width: "20px", textAlign: "right" }}>
        {count}
      </span>
    </div>
  );
}

/* ─── Quick action button ─── */
function ActionCard({ to, icon, label, sub }) {
  return (
    <Link to={to} style={{
      background: "white",
      border: "1px solid #eae9e3",
      borderRadius: "14px",
      padding: "1rem",
      textDecoration: "none",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      transition: "border-color 0.15s, transform 0.12s",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = "#6b5ce7";
      e.currentTarget.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = "#eae9e3";
      e.currentTarget.style.transform = "translateY(0)";
    }}>
      <span style={{ fontSize: "18px" }}>{icon}</span>
      <span style={{ fontSize: "13px", fontWeight: 500, color: "#1a1a1a" }}>{label}</span>
      <span style={{ fontSize: "11px", color: "#bbb" }}>{sub}</span>
    </Link>
  );
}

/* ─── Panel wrapper ─── */
function Panel({ title, children, style }) {
  return (
    <div style={{
      background: "white",
      border: "1px solid #eae9e3",
      borderRadius: "16px",
      padding: "1.5rem",
      ...style,
    }}>
      {title && (
        <p style={{
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          color: "#aaa",
          marginBottom: "1.2rem",
        }}>
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

/* ─── Dashboard ─── */
function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, "trackedJobs"));
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(job => job.userId === user.uid);
      setJobs(data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const total     = jobs.length;
  const saved     = jobs.filter(j => j.status === "Saved").length;
  const applied   = jobs.filter(j => j.status === "Applied").length;
  const interview = jobs.filter(j => j.status === "Interview").length;
  const rejected  = jobs.filter(j => j.status === "Rejected").length;
  const offer     = jobs.filter(j => j.status === "Offer").length;

  const progress = total === 0
    ? 0
    : Math.round(((applied + interview + offer) / total) * 100);

  const recentJobs = jobs.slice(0, 3);
  const tip = tips[new Date().getDate() % tips.length];

  const firstName = user?.displayName?.split(" ")[0]
    ?? user?.email?.split("@")[0]
    ?? "there";

  const initials = firstName.slice(0, 2).toUpperCase();

  /* ─── layout tokens ─── */
  const pageStyle = {
    fontFamily: "'DM Sans', system-ui, sans-serif",
    background: "#f4f3ef",
    minHeight: "100vh",
    color: "#1a1a1a",
  };

  const contentStyle = {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
  };

  const twoCol = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "14px",
  };

  return (
    <div style={pageStyle}>
      <Navbar />

      <div style={contentStyle}>

        {/* ── Greeting ── */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 600, letterSpacing: "-0.8px", lineHeight: 1.2 }}>
            {getGreeting()},{" "}
            <span style={{ color: "#6b5ce7" }}>{firstName}.</span>{" "}👋
          </h1>
          <p style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>
            Here's where your job search stands today.
          </p>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <p style={{ color: "#aaa", fontSize: "14px" }}>Loading dashboard…</p>
        )}

        {!loading && (
          <>
            {/* ── Stats grid ── */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "10px",
              marginBottom: "14px",
            }}>
              <StatCard label="Total"     value={total}     highlight />
              <StatCard label="Saved"     value={saved} />
              <StatCard label="Applied"   value={applied} />
              <StatCard label="Interview" value={interview} />
              <StatCard label="Rejected"  value={rejected} />
              <StatCard label="Offers"    value={offer} />
            </div>

            {/* ── Progress + Funnel ── */}
            <div style={twoCol}>
              <Panel title="Progress score">
                <p style={{
                  fontSize: "40px",
                  fontWeight: 600,
                  letterSpacing: "-2px",
                  marginBottom: "14px",
                }}>
                  {progress}%
                </p>
                <div style={{
                  background: "#f0efe8",
                  borderRadius: "100px",
                  height: "8px",
                  overflow: "hidden",
                  marginBottom: "8px",
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #6b5ce7, #a78bfa)",
                    borderRadius: "100px",
                    transition: "width 0.6s ease",
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#aaa" }}>
                  <span>Applied + Interviews + Offers</span>
                  <span>{applied + interview + offer} / {total}</span>
                </div>
              </Panel>

              <Panel title="Application funnel">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <FunnelRow label="Applied"   count={applied}   max={applied} color="#6b5ce7" />
                  <FunnelRow label="Interview" count={interview} max={applied} color="#a78bfa" />
                  <FunnelRow label="Rejected"  count={rejected}  max={applied} color="#f87171" />
                  <FunnelRow label="Offers"    count={offer}     max={applied} color="#34d399" />
                </div>
              </Panel>
            </div>

            {/* ── Recent Jobs + Quick Actions ── */}
            <div style={twoCol}>
              <Panel title="Recent tracked jobs">
                {recentJobs.length === 0 ? (
                  <p style={{ fontSize: "14px", color: "#aaa" }}>No jobs tracked yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {recentJobs.map((job, i) => (
                      <div key={job.id} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        borderBottom: i < recentJobs.length - 1 ? "1px solid #f0efe8" : "none",
                      }}>
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "2px" }}>
                            {job.title}
                          </p>
                          <p style={{ fontSize: "12px", color: "#aaa" }}>{job.company}</p>
                        </div>
                        <StatusBadge status={job.status} />
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel title="Quick actions">
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}>
                  <ActionCard to="/jobs"      icon="🔍" label="Find Jobs"  sub="Browse listings" />
                  <ActionCard to="/tracker"   icon="📂" label="Tracker"    sub="All applications" />
                  <ActionCard to="/analytics" icon="📊" label="Analytics"  sub="Your stats" />
                  <ActionCard to="/resume"    icon="✏️" label="Resume"     sub="Update & export" />
                </div>
              </Panel>
            </div>

            {/* ── Daily Tip ── */}
            <div style={{
              background: "#1a1a2e",
              border: "1px solid #252542",
              borderRadius: "16px",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
            }}>
              <span style={{ fontSize: "28px", flexShrink: 0 }}>💡</span>
              <div>
                <p style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.7px",
                  color: "#a78bfa",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}>
                  Daily career tip
                </p>
                <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.55 }}>{tip}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;