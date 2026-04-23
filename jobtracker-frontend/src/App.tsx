import { useEffect, useState } from "react";
import "./App.css";

type Job = {
  id: number;
  company: string;
  position: string;
  status: string;
};

const API = "http://localhost:5103/jobs";

function App() {

  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");

  const loadJobs = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setJobs(data);
  };
  
  const addJob = async () => {
  const newJob = {
    company,
    position,
    status,
  };

  await fetch("http://localhost:5103/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newJob),
  });


  loadJobs();

  setCompany("");
  setPosition("");
  setStatus("Applied");
};
  const filterInterview = async () => {
    const res = await fetch(`${API}?status=Interview`);
    const data = await res.json();
    setJobs(data);
  };
  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Job Tracker</h1>
      <h2>Add Job</h2>

      <input
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <input
        placeholder="Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Rejected">Rejected</option>
        <option value="Offer">Offer</option>
      </select>

      <button onClick={addJob}>Add Job</button>
      <button onClick={filterInterview}>
         Show Interview
      </button>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            {job.company} - {job.position} ({job.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;