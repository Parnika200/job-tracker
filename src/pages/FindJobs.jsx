import { useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Navbar from "../componants/Navbar";

const JOBS_PER_PAGE = 8;

/* ─── Tag pill ─── */
function Tag({ label, variant }) {
  const styles = {
    default: { background: "#f0efe8", color: "#666" },
    type:    { background: "#ede9fe", color: "#5b21b6" },
    loc:     { background: "#e0f2fe", color: "#0369a1" },
  };
  const s = styles[variant] ?? styles.default;
  return (
    <span style={{
      fontSize: "11px",
      fontWeight: 500,
      padding: "3px 10px",
      borderRadius: "20px",
      ...s,
    }}>
      {label}
    </span>
  );
}

/* ─── Job card ─── */
function JobCard({ job, onTrack }) {
  const desc = job.description?.replace(/<[^>]+>/g, "").slice(0, 160) + "…";
  const date  = job.publication_date?.slice(0, 10) ?? "";

  return (
    <div style={{
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
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div>
          <p style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.3px", marginBottom: "3px" }}>
            {job.title}
          </p>
          <p style={{ fontSize: "13px", color: "#888" }}>
            {job.company_name}
          </p>
        </div>
        {job.job_type && <Tag label={job.job_type} variant="type" />}
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {job.candidate_required_location && (
          <Tag label={`🌍 ${job.candidate_required_location}`} variant="loc" />
        )}
        {job.category && <Tag label={job.category} />}
      </div>

      {/* Description */}
      <p style={{ fontSize: "13px", color: "#777", lineHeight: 1.55 }}>{desc}</p>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "4px" }}>
        <a
          href={job.url}
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
          View &amp; Apply ↗
        </a>

        <button
          onClick={() => onTrack(job)}
          style={{
            height: "36px",
            padding: "0 16px",
            background: "white",
            color: "#6b5ce7",
            border: "1px solid rgba(107,92,231,0.35)",
            borderRadius: "9px",
            fontSize: "13px",
            fontWeight: 500,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#f5f3ff"}
          onMouseLeave={e => e.currentTarget.style.background = "white"}
        >
          + Track Job
        </button>

        {date && (
          <span style={{ marginLeft: "auto", fontSize: "12px", color: "#bbb" }}>
            {date}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Pagination button ─── */
function PgBtn({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        height: "36px",
        padding: "0 16px",
        background: "white",
        border: "1px solid #eae9e3",
        borderRadius: "9px",
        fontSize: "13px",
        fontFamily: "inherit",
        cursor: disabled ? "default" : "pointer",
        color: disabled ? "#ccc" : "#555",
        transition: "border-color 0.15s, color 0.15s",
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = "#6b5ce7"; e.currentTarget.style.color = "#6b5ce7"; }}}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#eae9e3"; e.currentTarget.style.color = disabled ? "#ccc" : "#555"; }}
    >
      {children}
    </button>
  );
}

/* ─── FindJobs page ─── */
function FindJobs() {
  const { user } = useAuth();

  const [query,       setQuery]       = useState("");
  const [jobs,        setJobs]        = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const searchJobs = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res  = await fetch(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setJobs(data.jobs ?? []);
      setCurrentPage(1);
    } catch {
      toast.error("Failed to fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const trackJob = async (job) => {
    await addDoc(collection(db, "trackedJobs"), {
      title:    job.title,
      company:  job.company_name,
      location: job.candidate_required_location,
      link:     job.url,
      status:   "Saved",
      userId:   user.uid,
      createdAt: new Date(),
    });
    toast.success("Job tracked!");
  };

  const totalPages   = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const startIndex   = (currentPage - 1) * JOBS_PER_PAGE;
  const selectedJobs = jobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f4f3ef", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Heading */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 600, letterSpacing: "-0.8px", marginBottom: "4px" }}>
            Find Jobs
          </h1>
          <p style={{ fontSize: "14px", color: "#888" }}>
            Search thousands of remote roles worldwide.
          </p>
        </div>

        {/* Search bar */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="Search React Developer, Product Designer…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && searchJobs()}
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
          <button
            onClick={searchJobs}
            style={{
              height: "44px",
              padding: "0 22px",
              background: "#6b5ce7",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#5a4bcc"}
            onMouseLeave={e => e.currentTarget.style.background = "#6b5ce7"}
          >
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p style={{ fontSize: "14px", color: "#aaa", marginBottom: "1rem" }}>
            Searching jobs…
          </p>
        )}

        {/* Results meta */}
        {!loading && jobs.length > 0 && (
          <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "1.25rem" }}>
            Showing {startIndex + 1}–{Math.min(startIndex + JOBS_PER_PAGE, jobs.length)} of {jobs.length} results
          </p>
        )}

        {/* Job cards */}
        {!loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {selectedJobs.length === 0 && jobs.length === 0 && query && (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "#bbb", fontSize: "14px" }}>
                No jobs found for "{query}". Try a different search.
              </div>
            )}
            {selectedJobs.map(job => (
              <JobCard key={job.id} job={job} onTrack={trackJob} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {jobs.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "2rem" }}>
            <PgBtn
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >
              ← Prev
            </PgBtn>
            <span style={{ fontSize: "13px", color: "#aaa", padding: "0 6px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <PgBtn
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </PgBtn>
          </div>
        )}

      </div>
    </div>
  );
}

export default FindJobs;