import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { toast } from "react-toastify";
import Navbar from "../componants/Navbar";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

/* ─── Status config ─── */
const STATUS_OPTIONS = ["Saved", "Applied", "Interview", "Rejected", "Offer"];

const statusStyle = {
  Saved:     { background: "#f3f4f6", color: "#6b7280" },
  Applied:   { background: "#e0f2fe", color: "#0369a1" },
  Interview: { background: "#fef9c3", color: "#854d0e" },
  Rejected:  { background: "#fee2e2", color: "#991b1b" },
  Offer:     { background: "#dcfce7", color: "#166534" },
};

/* ─── Status badge ─── */
function StatusBadge({ status }) {
  const s = statusStyle[status] ?? statusStyle.Saved;
  return (
    <span style={{
      fontSize: "11px",
      fontWeight: 500,
      padding: "3px 10px",
      borderRadius: "20px",
      ...s,
    }}>
      {status}
    </span>
  );
}

/* ─── Empty state ─── */
function EmptyState({ title, subtitle }) {
  return (
    <div style={{
      marginTop: "2rem",
      padding: "3.5rem 2rem",
      textAlign: "center",
      background: "white",
      borderRadius: "16px",
      border: "1px solid #eae9e3",
    }}>
      <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "6px", color: "#1a1a1a" }}>
        {title}
      </p>
      <p style={{ fontSize: "14px", color: "#aaa" }}>{subtitle}</p>
    </div>
  );
}

/* ─── Tracker ─── */
function Tracker() {
  const { user } = useAuth();

  const [jobs,         setJobs]         = useState([]);
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading,      setLoading]      = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "trackedJobs"));
    const data = snapshot.docs
      .map(item => ({ id: item.id, ...item.data() }))
      .filter(job => job.userId === user.uid);
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const deleteJob = async (id) => {
    await deleteDoc(doc(db, "trackedJobs", id));
    toast.error("Job removed.");
    fetchJobs();
  };

  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "trackedJobs", id), { status: newStatus });
    fetchJobs();
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f4f3ef", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* ── Heading ── */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 600, letterSpacing: "-0.8px", marginBottom: "4px" }}>
            My Tracker
          </h1>
          <p style={{ fontSize: "14px", color: "#888" }}>
            Manage and update every job you're pursuing.
          </p>
        </div>

        {/* ── Filters ── */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="Search by title or company…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              height: "44px",
              padding: "0 16px",
              borderRadius: "12px",
              border: "1px solid #e0dfd8",
              background: "white",
              fontSize: "14px",
              fontFamily: "inherit",
              outline: "none",
              color: "#1a1a1a",
            }}
          />

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              height: "44px",
              padding: "0 14px",
              borderRadius: "12px",
              border: "1px solid #e0dfd8",
              background: "white",
              fontSize: "14px",
              fontFamily: "inherit",
              color: "#555",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">All statuses</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* ── Results meta ── */}
        {!loading && jobs.length > 0 && (
          <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "1.25rem" }}>
            {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} shown
            {filterStatus !== "All" ? ` · ${filterStatus}` : ""}
          </p>
        )}

        {/* ── Loading ── */}
        {loading && (
          <p style={{ fontSize: "14px", color: "#aaa" }}>Loading your jobs…</p>
        )}

        {/* ── Empty states ── */}
        {!loading && jobs.length === 0 && (
          <EmptyState
            title="No tracked jobs yet"
            subtitle="Search jobs and click Track Job to add them here."
          />
        )}

        {!loading && jobs.length > 0 && filteredJobs.length === 0 && (
          <EmptyState
            title="No matching jobs"
            subtitle="Try adjusting your search or status filter."
          />
        )}

        {/* ── Job cards ── */}
        {!loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredJobs.map(job => (
              <div
                key={job.id}
                style={{
                  background: "white",
                  border: "1px solid #eae9e3",
                  borderRadius: "16px",
                  padding: "1.4rem 1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#c4bff5"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#eae9e3"}
              >
                {/* Title row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.3px", marginBottom: "3px" }}>
                      {job.title}
                    </p>
                    <p style={{ fontSize: "13px", color: "#888" }}>
                      {job.company}
                      {job.location ? ` · ${job.location}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>

                {/* Actions row */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", paddingTop: "4px" }}>
                  {/* View link */}
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      height: "36px",
                      padding: "0 16px",
                      background: "#1a1a2e",
                      color: "white",
                      border: "none",
                      borderRadius: "9px",
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    View Job ↗
                  </a>

                  {/* Status select */}
                  <select
                    value={job.status}
                    onChange={e => updateStatus(job.id, e.target.value)}
                    style={{
                      height: "36px",
                      padding: "0 12px",
                      borderRadius: "9px",
                      border: "1px solid rgba(107,92,231,0.35)",
                      background: "white",
                      color: "#6b5ce7",
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  {/* Delete */}
                  <button
                    onClick={() => deleteJob(job.id)}
                    style={{
                      height: "36px",
                      padding: "0 16px",
                      background: "white",
                      color: "#e53e3e",
                      border: "1px solid rgba(229,62,62,0.3)",
                      borderRadius: "9px",
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tracker;