import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchStats, fetchStudents } from '../api/studentApi';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          fetchStats(),
          fetchStudents({ sort: 'newest' })
        ]);
        setStats(statsRes.data);
        setRecent(studentsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading dashboard...</p></div>;

  const s = stats || { total: 0, active: 0, graduated: 0, avgGpa: 0, departmentStats: [], yearStats: [] };
  const maxDept = Math.max(...(s.departmentStats?.map(d => d.count) || [1]), 1);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your student management system</p>
      </div>

      <div className="stats-grid">
        {[
          { icon: '👥', label: 'Total Students', value: s.total, cls: 'blue' },
          { icon: '✅', label: 'Active Students', value: s.active, cls: 'green' },
          { icon: '🎓', label: 'Graduated', value: s.graduated, cls: 'purple' },
          { icon: '📈', label: 'Average GPA', value: s.avgGpa.toFixed(2), cls: 'cyan' },
        ].map((item, i) => (
          <div key={i} className="glass-card stat-card slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`stat-card-icon ${item.cls}`}>{item.icon}</div>
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Department Distribution */}
        <div className="glass-card chart-section slide-up">
          <h3>📊 Department Distribution</h3>
          {s.departmentStats?.length > 0 ? (
            <div className="bar-chart">
              {s.departmentStats.map((dept, i) => (
                <div key={i} className="bar-row">
                  <span className="bar-label">{dept._id}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(dept.count / maxDept) * 100}%` }}>{dept.count}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : <p style={{ color: 'var(--t3)', fontSize: '.9rem' }}>No data yet</p>}
        </div>

        {/* Quick Actions */}
        <div className="glass-card slide-up" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>⚡ Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            <Link to="/students/add" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>➕ Add New Student</Link>
            <Link to="/students" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>👥 View All Students</Link>
          </div>
          {s.yearStats?.length > 0 && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--bgl)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '.85rem', color: 'var(--t2)', marginBottom: '.75rem' }}>Year Breakdown</h4>
              {s.yearStats.map((y, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '.35rem 0', fontSize: '.85rem' }}>
                  <span style={{ color: 'var(--t2)' }}>{y._id}</span>
                  <span style={{ fontWeight: 600 }}>{y.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Students */}
      <div className="glass-card recent-section slide-up">
        <h3>🕐 Recently Added Students</h3>
        {recent.length > 0 ? (
          <table className="recent-table">
            <thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Year</th><th>Status</th></tr></thead>
            <tbody>
              {recent.map(st => (
                <tr key={st._id}>
                  <td><Link to={`/students/${st._id}`} style={{ color: 'var(--acl)', fontWeight: 500 }}>{st.firstName} {st.lastName}</Link></td>
                  <td style={{ color: 'var(--t2)' }}>{st.email}</td>
                  <td>{st.department}</td>
                  <td>{st.year}</td>
                  <td><span className={`status-badge ${st.status.toLowerCase()}`}>{st.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--t3)', fontSize: '.9rem', padding: '1rem 0' }}>No students added yet. <Link to="/students/add" style={{ color: 'var(--acl)' }}>Add your first student!</Link></p>
        )}
      </div>
    </div>
  );
}
