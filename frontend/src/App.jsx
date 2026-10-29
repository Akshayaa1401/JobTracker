import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api/applications";
const STATUSES = ["Applied", "Interview", "Selected", "Rejected"];
const emptyForm = {
  companyName: "",
  jobRole: "",
  applicationDate: new Date().toISOString().slice(0, 10),
  status: "Applied"
};

export default function App() {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadApplications() {
    try {
      setError("");
      const { data } = await axios.get(API);
      setApplications(data);
    } catch {
      setError("Could not connect to the backend. Make sure Spring Boot is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function addApplication(e) {
    e.preventDefault();

    if (!form.companyName.trim() || !form.jobRole.trim()) {
      setError("Company name and job role are required.");
      return;
    }

    try {
      setError("");
      await axios.post(API, {
        ...form,
        companyName: form.companyName.trim(),
        jobRole: form.jobRole.trim()
      });
      setForm(emptyForm);
      await loadApplications();
    } catch {
      setError("Could not save application. Check the backend and database connection.");
    }
  }

  async function changeStatus(id, status) {
    try {
      setError("");
      await axios.patch(`${API}/${id}/status`, { status });
      await loadApplications();
    } catch {
      setError("Could not update status.");
    }
  }

  const visible = useMemo(
    () =>
      filter === "All"
        ? applications
        : applications.filter((a) => a.status === filter),
    [applications, filter]
  );

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">JT</span>
          <div>
            <h1>JobTrack</h1>
            <p>Your job search, organized.</p>
          </div>
        </div>
        <span className="top-label">APPLICATION TRACKER</span>
      </header>

      <main className="main">
        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR CAREER DASHBOARD</p>
            <h2>
              Keep every opportunity
              <br className="desktop-break" /> moving forward.
            </h2>
            <p className="welcome-copy">
              Track applications and stay on top of your next step.
            </p>
          </div>

          <div className="total-card">
            <span className="total-icon">↗</span>
            <div>
              <p>Total applications</p>
              <strong>{applications.length}</strong>
            </div>
          </div>
        </section>

        {error && (
          <div className="notice" role="alert">
            {error}
          </div>
        )}

        <section className="panel">
          <div className="section-heading">
            <div>
              <span className="section-kicker">NEW OPPORTUNITY</span>
              <h3>Add an application</h3>
            </div>
            <span className="step-badge">01</span>
          </div>

          <form onSubmit={addApplication}>
            <div className="form-grid">
              <label>
                Company name <span className="required">*</span>
                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={(e) =>
                    setForm({ ...form, companyName: e.target.value })
                  }
                  placeholder="e.g. Google"
                  required
                  maxLength="100"
                />
              </label>

              <label>
                Job role <span className="required">*</span>
                <input
                  name="jobRole"
                  value={form.jobRole}
                  onChange={(e) =>
                    setForm({ ...form, jobRole: e.target.value })
                  }
                  placeholder="e.g. Software Engineer"
                  required
                  maxLength="100"
                />
              </label>

              <label>
                Application date
                <input
                  type="date"
                  name="applicationDate"
                  value={form.applicationDate}
                  onChange={(e) =>
                    setForm({ ...form, applicationDate: e.target.value })
                  }
                />
              </label>

              <label>
                Current status
                <select
                  name="status"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-footer">
              <p>
                <span className="required">*</span> Required fields
              </p>
              <button className="primary" type="submit">
                ＋ Add application
              </button>
            </div>
          </form>
        </section>

        <section className="panel applications-panel">
          <div className="section-heading list-heading">
            <div>
              <span className="section-kicker">YOUR PIPELINE</span>
              <h3>
                Applications <span className="count">{applications.length}</span>
              </h3>
            </div>

            <label className="filter-label">
              Filter by status
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option>All</option>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>

          {loading ? (
            <div className="empty-state">Loading applications…</div>
          ) : visible.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">▤</span>
              <strong>
                {filter === "All"
                  ? "No applications yet"
                  : `No ${filter.toLowerCase()} applications`}
              </strong>
              <p>Add your first job application above to get started.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>COMPANY</th>
                    <th>JOB ROLE</th>
                    <th>APPLICATION DATE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div className="company-cell">
                          <span className="company-icon">
                            {(app.companyName || "?").charAt(0).toUpperCase()}
                          </span>
                          <strong>{app.companyName}</strong>
                        </div>
                      </td>
                      <td>{app.jobRole}</td>
                      <td>{app.applicationDate || "—"}</td>
                      <td>
                        <select
                          aria-label={`Status for ${app.companyName}`}
                          className={`status-select status-${(
                            app.status || "Applied"
                          ).toLowerCase()}`}
                          value={app.status}
                          onChange={(e) =>
                            changeStatus(app.id, e.target.value)
                          }
                        >
                          {STATUSES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer>
          Made for your next career move <span>·</span> JobTrack
        </footer>
      </main>
    </div>
  );
}

