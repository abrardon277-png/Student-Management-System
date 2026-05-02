import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchStudents, deleteStudent } from '../api/studentApi';

export default function Students({ addToast }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');
  const [deleteId, setDeleteId] = useState(null);

  const departments = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Business', 'Arts', 'Medicine', 'Law'];
  const statuses = ['All', 'Active', 'Inactive', 'Graduated', 'Suspended'];

  async function loadStudents() {
    try {
      setLoading(true);
      const res = await fetchStudents({ search, department, status });
      setStudents(res.data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStudents(); }, [search, department, status]);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteStudent(deleteId);
      addToast('Student deleted successfully');
      setDeleteId(null);
      loadStudents();
    } catch (err) {
      addToast(err.message, 'error');
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h2>All Students</h2><p>Manage and view all student records</p></div>
        <Link to="/students/add" className="btn btn-primary">➕ Add Student</Link>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <input id="search-students" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select id="filter-department" className="filter-select" value={department} onChange={e => setDepartment(e.target.value)}>
          {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
        </select>
        <select id="filter-status" className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
          {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /><p>Loading students...</p></div>
      ) : students.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>No students found</h3>
          <p>Try adjusting your search or filters, or add a new student.</p>
          <Link to="/students/add" className="btn btn-primary">➕ Add First Student</Link>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--t3)', fontSize: '.85rem', marginBottom: '1rem' }}>{students.length} student{students.length !== 1 ? 's' : ''} found</p>
          <div className="students-grid">
            {students.map((st, i) => (
              <div key={st._id} className="glass-card student-card slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="student-card-header">
                  <div className="student-avatar">{st.firstName[0]}{st.lastName[0]}</div>
                  <div>
                    <h3>{st.firstName} {st.lastName}</h3>
                    <div className="email">{st.email}</div>
                  </div>
                  <span className={`status-badge ${st.status.toLowerCase()}`} style={{ marginLeft: 'auto' }}>{st.status}</span>
                </div>
                <div className="student-card-body">
                  <div className="student-card-field"><label>Department</label><span>{st.department}</span></div>
                  <div className="student-card-field"><label>Year</label><span>{st.year}</span></div>
                  <div className="student-card-field"><label>GPA</label><span>{st.gpa.toFixed(2)}</span></div>
                  <div className="student-card-field"><label>Phone</label><span>{st.phone || '—'}</span></div>
                </div>
                <div className="student-card-actions">
                  <Link to={`/students/${st._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>👁 View</Link>
                  <Link to={`/students/edit/${st._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>✏️ Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={e => { e.stopPropagation(); setDeleteId(st._id); }}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>⚠️ Delete Student</h3>
            <p>Are you sure you want to delete this student? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
