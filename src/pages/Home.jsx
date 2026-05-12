import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

/* ─── Feature data ─── */
const features = [
  {
    icon: "🔍",
    title: "Smart Job Search",
    desc: "Browse thousands of remote roles in real time. Filter by role, location, and type — all in one place.",
  },
  {
    icon: "📂",
    title: "Application Tracker",
    desc: "Never lose track of a role again. Log every application, update statuses, and keep your pipeline organised.",
  },
  {
    icon: "📊",
    title: "Pipeline Analytics",
    desc: "See exactly where you're winning and where you're dropping off — with charts that tell the full story.",
  },
  {
    icon: "🎯",
    title: "Progress Scoring",
    desc: "A live score that reflects your momentum. The higher it climbs, the closer you are to your next offer.",
  },
];

const stats = [
  { value: "10k+", label: "Jobs indexed" },
  { value: "3 min", label: "To get started" },
  { value: "100%", label: "Free to use" },
];

/* ─── Animated counter (CSS only via keyframes injected once) ─── */
const injectStyles = () => {
  if (document.getElementById("cf-home-styles")) return;
  const el = document.createElement("style");
  el.id = "cf-home-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

    @keyframes cf-fade-up {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes cf-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes cf-float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-10px); }
    }
    @keyframes cf-spin-slow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes cf-shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }

    .cf-nav-link {
      font-size: 14px;
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      transition: color 0.2s;
    }
    .cf-nav-link:hover { color: white; }

    .cf-btn-ghost {
      height: 42px;
      padding: 0 22px;
      background: rgba(255,255,255,0.08);
      color: white;
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      transition: background 0.2s, border-color 0.2s;
    }
    .cf-btn-ghost:hover {
      background: rgba(255,255,255,0.14);
      border-color: rgba(255,255,255,0.3);
    }

    .cf-btn-primary {
      height: 52px;
      padding: 0 32px;
      background: white;
      color: #1a1a2e;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 24px rgba(0,0,0,0.25);
    }
    .cf-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }

    .cf-btn-outline {
      height: 52px;
      padding: 0 32px;
      background: transparent;
      color: white;
      border: 1.5px solid rgba(255,255,255,0.3);
      border-radius: 12px;
      font-size: 15px;
      font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      transition: border-color 0.2s, background 0.2s;
    }
    .cf-btn-outline:hover {
      border-color: rgba(255,255,255,0.6);
      background: rgba(255,255,255,0.06);
    }

    .cf-feature-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 2rem;
      transition: background 0.25s, border-color 0.25s, transform 0.25s;
    }
    .cf-feature-card:hover {
      background: rgba(255,255,255,0.08);
      border-color: rgba(167,139,250,0.4);
      transform: translateY(-4px);
    }

    .cf-shimmer-text {
      background: linear-gradient(90deg, #fff 0%, #a78bfa 40%, #fff 60%, #a78bfa 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: cf-shimmer 4s linear infinite;
    }

    .cf-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }

    .cf-ticker {
      display: flex;
      gap: 3rem;
      animation: cf-ticker-scroll 18s linear infinite;
    }
    @keyframes cf-ticker-scroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
  `;
  document.head.appendChild(el);
};

/* ─── Home ─── */
function Home() {
  useEffect(() => { injectStyles(); }, []);

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: "#0d0d1a",
      color: "white",
      overflowX: "hidden",
    }}>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 3rem",
        height: "70px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(13,13,26,0.85)",
        backdropFilter: "blur(12px)",
      }}>
        <span style={{ fontSize: "18px", fontWeight: 600, letterSpacing: "-0.4px" }}>
          Career<span style={{ color: "#a78bfa" }}>Flow</span>
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <a href="#features" className="cf-nav-link">Features</a>
          <a href="#stats"    className="cf-nav-link">Why us</a>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/login"  className="cf-btn-ghost">Sign in</Link>
          <Link to="/signup" className="cf-btn-primary" style={{ height: "38px", padding: "0 18px", fontSize: "13px", boxShadow: "none" }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{
        position: "relative",
        minHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "6rem 2rem 4rem",
        overflow: "hidden",
      }}>
        {/* Orbs */}
        <div className="cf-orb" style={{ width: 600, height: 600, background: "#6b5ce7", opacity: 0.18, top: "5%", left: "5%" }} />
        <div className="cf-orb" style={{ width: 400, height: 400, background: "#a78bfa", opacity: 0.12, bottom: "10%", right: "5%" }} />
        <div className="cf-orb" style={{ width: 300, height: 300, background: "#34d399", opacity: 0.07, top: "40%", right: "20%" }} />

        {/* Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(167,139,250,0.12)",
          border: "1px solid rgba(167,139,250,0.3)",
          borderRadius: "100px",
          padding: "6px 16px",
          fontSize: "12px",
          fontWeight: 500,
          color: "#c4b5fd",
          marginBottom: "2rem",
          animation: "cf-fade-in 0.6s ease both",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", display: "inline-block" }} />
          Free to use · No credit card required
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "clamp(42px, 7vw, 86px)",
          fontWeight: 400,
          lineHeight: 1.08,
          letterSpacing: "-2px",
          marginBottom: "1.5rem",
          maxWidth: "820px",
          animation: "cf-fade-up 0.7s ease 0.1s both",
        }}>
          Your job search,{" "}
          <span className="cf-shimmer-text" style={{ fontStyle: "italic" }}>
            finally organised.
          </span>
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: "18px",
          color: "rgba(255,255,255,0.5)",
          maxWidth: "520px",
          lineHeight: 1.65,
          marginBottom: "2.5rem",
          fontWeight: 300,
          animation: "cf-fade-up 0.7s ease 0.2s both",
        }}>
          Track applications, analyse your pipeline, and land your next role faster — all from one clean dashboard.
        </p>

        {/* CTA buttons */}
        <div style={{
          display: "flex",
          gap: "14px",
          flexWrap: "wrap",
          justifyContent: "center",
          animation: "cf-fade-up 0.7s ease 0.3s both",
        }}>
          <Link to="/signup" className="cf-btn-primary">
            Start for free →
          </Link>
          <Link to="/login" className="cf-btn-outline">
            Sign in
          </Link>
        </div>

        {/* Dashboard mockup */}
        <div style={{
          marginTop: "5rem",
          width: "100%",
          maxWidth: "860px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "2rem",
          animation: "cf-fade-up 0.9s ease 0.45s both",
          position: "relative",
        }}>
          {/* Mock top bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.5rem" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f87171", opacity: 0.7 }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24", opacity: 0.7 }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#34d399", opacity: 0.7 }} />
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)", marginLeft: "8px" }} />
          </div>

          {/* Mock stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "16px" }}>
            {[["Total", "24", "#6b5ce7"], ["Applied", "11", "rgba(255,255,255,0.08)"], ["Interview", "4", "rgba(255,255,255,0.08)"], ["Offers", "1", "rgba(255,255,255,0.08)"]].map(([label, val, bg]) => (
              <div key={label} style={{ background: bg, border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px" }}>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{label}</p>
                <p style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-1px" }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Mock progress bar */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px" }}>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Pipeline progress</p>
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "100px", height: "8px" }}>
              <div style={{ width: "67%", height: "100%", background: "linear-gradient(90deg,#6b5ce7,#a78bfa)", borderRadius: "100px" }} />
            </div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "8px" }}>67% · 16 of 24 jobs active</p>
          </div>
        </div>
      </section>

      {/* ══ STATS TICKER ══ */}
      <section id="stats" style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "2.5rem 0",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", gap: "6rem", justifyContent: "center" }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center", flexShrink: 0 }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "42px", fontWeight: 400, letterSpacing: "-1.5px", color: "#a78bfa" }}>
                {value}
              </p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" style={{ padding: "7rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "#6b5ce7", marginBottom: "1rem" }}>
            Everything you need
          </p>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(30px, 4vw, 50px)",
            fontWeight: 400,
            letterSpacing: "-1.5px",
            lineHeight: 1.1,
          }}>
            Built for the modern<br />
            <span style={{ fontStyle: "italic", color: "#a78bfa" }}>job seeker.</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="cf-feature-card">
              <div style={{ fontSize: "28px", marginBottom: "1rem" }}>{icon}</div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px", letterSpacing: "-0.3px" }}>{title}</h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section style={{ padding: "2rem 2rem 7rem" }}>
        <div style={{
          maxWidth: "820px",
          margin: "0 auto",
          background: "linear-gradient(135deg, #1e1040 0%, #2d1b69 50%, #1a1a2e 100%)",
          border: "1px solid rgba(167,139,250,0.2)",
          borderRadius: "28px",
          padding: "4rem 3rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div className="cf-orb" style={{ width: 300, height: 300, background: "#6b5ce7", opacity: 0.2, top: "-80px", right: "-60px" }} />
          <div className="cf-orb" style={{ width: 200, height: 200, background: "#a78bfa", opacity: 0.15, bottom: "-60px", left: "-40px" }} />

          <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "#a78bfa", marginBottom: "1.25rem" }}>
            Ready to start?
          </p>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(28px, 4vw, 46px)",
            fontWeight: 400,
            letterSpacing: "-1.5px",
            lineHeight: 1.15,
            marginBottom: "1.25rem",
          }}>
            Land your next role<br />
            <span style={{ fontStyle: "italic" }}>with clarity and confidence.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", marginBottom: "2.5rem", maxWidth: "420px", margin: "0 auto 2.5rem" }}>
            Join thousands of job seekers who track smarter, apply better, and get hired faster.
          </p>

          <Link to="/signup" className="cf-btn-primary">
            Create your free account →
          </Link>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "2rem 3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontSize: "15px", fontWeight: 600, letterSpacing: "-0.3px" }}>
          Career<span style={{ color: "#6b5ce7" }}>Flow</span>
        </span>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }}>
          © {new Date().getFullYear()} CareerFlow. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default Home;