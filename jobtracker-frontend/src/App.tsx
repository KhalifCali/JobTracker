import { useEffect, useState } from "react";
import "./App.css";

type Job = {
  id: number;
  company: string;
  position: string;
  status: string;
};

const API = "http://localhost:5103/jobs";
const STATUSES = ["Applied", "Interview", "Rejected", "Offer"];
const STATUS_COLORS: { [key: string]: string } = {
  Applied: "#4cafef",
  Interview: "#ffa500",
  Rejected: "#ff6b6b",
  Offer: "#51cf66",
};

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const loadJobs = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setJobs(data);
  };

  const addJob = async () => {
    if (!company.trim() || !position.trim()) return;

    const newJob = { company, position, status };
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });

    loadJobs();
    setCompany("");
    setPosition("");
    setStatus("Applied");
  };

  const getStats = () => {
    return STATUSES.map((s) => ({
      status: s,
      count: jobs.filter((j) => j.status === s).length,
    }));
  };

  const getFilteredJobs = () => {
    return filterStatus ? jobs.filter((j) => j.status === filterStatus) : jobs;
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const stats = getStats();
  const displayedJobs = getFilteredJobs();

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="header">
        <h1>📊 Job Tracker Dashboard</h1>
        <p>Track your job applications</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        {stats.map((stat) => (
          <div
            key={stat.status}
            className="stat-card"
            onClick={() => setFilterStatus(filterStatus === stat.status ? null : stat.status)}
            style={{
              borderLeft: `4px solid ${STATUS_COLORS[stat.status]}`,
              cursor: "pointer",
              opacity: !filterStatus || filterStatus === stat.status ? 1 : 0.6,
            }}
          >
            <div className="stat-number">{stat.count}</div>
            <div className="stat-label">{stat.status}</div>
          </div>
        ))}
      </div>

      {/* Add Job Form */}
      <div className="form-section">
        <h2>➕ Add New Application</h2>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addJob()}
          />
          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addJob()}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button onClick={addJob} className="btn-add">Add Application</button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="jobs-section">
        <div className="jobs-header">
          <h2>📋 Applications</h2>
          {filterStatus && (
            <button
              onClick={() => setFilterStatus(null)}
              className="btn-clear-filter"
            >
              Clear Filter
            </button>
          )}
        </div>

        {displayedJobs.length === 0 ? (
          <div className="no-jobs">No applications {filterStatus && `with status "${filterStatus}"`}</div>
        ) : (
          <div className="jobs-list">
            {displayedJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-content">
                  <div className="job-company">{job.company}</div>
                  <div className="job-position">{job.position}</div>
                </div>
                <div
                  className="job-status"
                  style={{ backgroundColor: STATUS_COLORS[job.status] }}
                >
                  {job.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;