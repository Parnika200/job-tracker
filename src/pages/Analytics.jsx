import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../componants/Navbar";

/* ─── Config ─── */
const STATUS_CONFIG = [
  { name: "Saved",     color: "#888780" },
  { name: "Applied",   color: "#6b5ce7" },
  { name: "Interview", color: "#a78bfa" },
  { name: "Rejected",  color: "#f87171" },
  { name: "Offer",     color: "#34d399" },
];

const statusStyle = {
  Saved:     { background: "#f3f4f6", color: "#6b7280" },
  Applied:   { background: "#e0f2fe", color: "#0369a1" },
  Interview: { background: "#fef9c3", color: "#854d0e" },
  Rejected:  { background: "#fee2e2", color: "#991b1b" },
  Offer:     { background: "#dcfce7", color: "#166534" },
};

/* ─── Stat card ─── */
function StatCard({ label, value, highlight }) {
  return (
    <div style={{
      background: highlight ? "#6b5ce7" : "white",
      border: `1px solid ${highlight ? "#6b5ce7" : "#eae9e3"}`,
      borderRadius: "14px",
      padding: "1rem",
      textAlign: "center",
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

/* ─── Panel ─── */
function Panel({ title, children }) {
  return (
    <div style={{
      background: "white",
      border: "1px solid #eae9e3",
      borderRadius: "16px",
      padding: "1.5rem",
    }}>
      {title && (
        <p style={{
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          color: "#aaa",
          marginBottom: "1.5rem",
        }}>
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

/* ─── Custom tooltip ─── */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  const s = statusStyle[name] ?? { background: "#f3f4f6", color: "#6b7280" };
  return (
    <div style={{
      background: "white",
      border: "1px solid #eae9e3",
      borderRadius: "10px",
      padding: "8px 14px",
      fontSize: "13px",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <span style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 500,
        marginBottom: "4px",
        ...s,
      }}>
        {name}
      </span>
      <p style={{ fontWeight: 600, color: "#1a1a1a" }}>{value} job{value !== 1 ? "s" : ""}</p>
    </div>
  );
}

/* ─── Analytics ─── */
function Analytics() {
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

  const chartData = STATUS_CONFIG.map(({ name, color }) => ({
    name,
    color,
    value: jobs.filter(j => j.status === name).length,
  }));

  const conversionRate = applied > 0 ? Math.round((interview / applied) * 100) : 0;
  const offerRate      = interview > 0 ? Math.round((offer / interview) * 100) : 0;

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f4f3ef", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* ── Heading ── */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 600, letterSpacing: "-0.8px", marginBottom: "4px" }}>
            Analytics
          </h1>
          <p style={{ fontSize: "14px", color: "#888" }}>
            A breakdown of your entire job search pipeline.
          </p>
        </div>

        {loading && (
          <p style={{ fontSize: "14px", color: "#aaa" }}>Loading analytics…</p>
        )}

        {!loading && total === 0 && (
          <div style={{
            padding: "3.5rem 2rem",
            textAlign: "center",
            background: "white",
            borderRadius: "16px",
            border: "1px solid #eae9e3",
          }}>
            <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "6px" }}>No analytics yet</p>
            <p style={{ fontSize: "14px", color: "#aaa" }}>Track some jobs to view charts and insights.</p>
          </div>
        )}

        {!loading && total > 0 && (
          <>
            {/* ── Stat cards ── */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "10px",
              marginBottom: "14px",
            }}>
              <StatCard label="Total"     value={total}     highlight />
              <StatCard label="Applied"   value={applied} />
              <StatCard label="Interview" value={interview} />
              <StatCard label="Rejected"  value={rejected} />
              <StatCard label="Offers"    value={offer} />
            </div>

            {/* ── Conversion insight cards ── */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "14px",
            }}>
              <div style={{
                background: "#1a1a2e",
                border: "1px solid #252542",
                borderRadius: "14px",
                padding: "1.25rem 1.5rem",
              }}>
                <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.6px", color: "#a78bfa", fontWeight: 600, marginBottom: "6px" }}>
                  Interview rate
                </p>
                <p style={{ fontSize: "32px", fontWeight: 600, color: "white", letterSpacing: "-1.5px" }}>
                  {conversionRate}%
                </p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                  of applications → interview
                </p>
              </div>

              <div style={{
                background: "#1a1a2e",
                border: "1px solid #252542",
                borderRadius: "14px",
                padding: "1.25rem 1.5rem",
              }}>
                <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.6px", color: "#34d399", fontWeight: 600, marginBottom: "6px" }}>
                  Offer rate
                </p>
                <p style={{ fontSize: "32px", fontWeight: 600, color: "white", letterSpacing: "-1.5px" }}>
                  {offerRate}%
                </p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                  of interviews → offer
                </p>
              </div>
            </div>

            {/* ── Charts row ── */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "14px",
            }}>
              {/* Pie chart */}
              <Panel title="Status breakdown">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
                  {chartData.map(({ name, color, value }) => (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#666" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                      {name} ({value})
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Bar chart */}
              <Panel title="Jobs by status">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0efe8" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#aaa", fontFamily: "'DM Sans', system-ui" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#aaa", fontFamily: "'DM Sans', system-ui" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f4f3ef" }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>

            {/* ── Pipeline progress ── */}
            <Panel title="Pipeline funnel">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {chartData.map(({ name, color, value }) => {
                  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
                  return (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ width: "68px", fontSize: "12px", color: "#888", flexShrink: 0 }}>{name}</span>
                      <div style={{ flex: 1, background: "#f4f3ef", borderRadius: "6px", height: "22px", overflow: "hidden" }}>
                        <div style={{
                          width: `${pct}%`,
                          minWidth: value > 0 ? "28px" : "0",
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
                          {value > 0 ? value : ""}
                        </div>
                      </div>
                      <span style={{ fontSize: "12px", color: "#bbb", width: "32px", textAlign: "right" }}>
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;