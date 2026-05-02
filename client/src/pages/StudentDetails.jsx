import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchStudent, deleteStudent } from '../api/studentApi';

export default function StudentDetails({ addToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchStudent(id);
        setStudent(res.data);
      } catch (err) {
        addToast('Student not found', 'error');
        navigate('/students');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleDelete() {
    try {
      await deleteStudent(id);
      addToast('Student deleted successfully');
      navigate('/students');
    } catch (err) {
      addToast(err.message, 'error');
    }
  }

  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading student details...</p></div>;
  if (!student) return null;

  const s = student;

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Link to="/students" style={{ color: 'var(--acl)', fontSize: '.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '.5rem' }}>← Back to Students</Link>
          <h2>Student Profile</h2>
          <p>Detailed information about the student</p>
        </div>
      </div>

      <div className="glass-card detail-card slide-up">
        <div className="detail-header">
          <div className="detail-avatar">{s.firstName[0]}{s.lastName[0]}</div>
          <div>
            <h2>{s.firstName} {s.lastName}</h2>
            <div className="email">{s.email}</div>
            <span className={`status-badge ${s.status.toLowerCase()}`} style={{ marginTop: '6px' }}>{s.status}</span>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-field">
            <label>📧 Email</label>
            <p>{s.email}</p>
          </div>
          <div className="detail-field">
            <label>📱 Phone</label>
            <p>{s.phone || 'Not provided'}</p>
          </div>
          <div className="detail-field">
            <label>🎂 Date of Birth</label>
            <p>{s.dateOfBirth || 'Not provided'}</p>
          </div>
          <div className="detail-field">
            <label>🏛 Department</label>
            <p>{s.department}</p>
          </div>
          <div className="detail-field">
            <label>📅 Year</label>
            <p>{s.year}</p>
          </div>
          <div className="detail-field">
            <label>📈 GPA</label>
            <p style={{ color: s.gpa >= 3.5 ? 'var(--ok)' : s.gpa >= 2.5 ? 'var(--warn)' : 'var(--err)' }}>{s.gpa.toFixed(2)} / 4.00</p>
          </div>
          <div className="detail-field" style={{ gridColumn: '1 / -1' }}>
            <label>📍 Address</label>
            <p>{s.address || 'Not provided'}</p>
          </div>
          <div className="detail-field">
            <label>📋 Enrolled</label>
            <p>{new Date(s.enrollmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="detail-field">
            <label>🔄 Last Updated</label>
            <p>{new Date(s.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="detail-actions">
          <Link to={`/students/edit/${s._id}`} className="btn btn-primary">✏️ Edit Student</Link>
          <button className="btn btn-danger" onClick={() => setShowDelete(true)}>🗑 Delete Student</button>
          <Link to="/students" className="btn btn-secondary">← Back</Link>
        </div>
      </div>

      {showDelete && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>⚠️ Delete Student</h3>
            <p>Are you sure you want to delete <strong>{s.firstName} {s.lastName}</strong>? This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
