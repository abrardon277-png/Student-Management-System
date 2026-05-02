import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchStudent, updateStudent } from '../api/studentApi';

const departments = ['Computer Science','Mathematics','Physics','Chemistry','Biology','Engineering','Business','Arts','Medicine','Law'];
const years = ['1st Year','2nd Year','3rd Year','4th Year'];
const statuses = ['Active','Inactive','Graduated','Suspended'];

export default function EditStudent({ addToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    dateOfBirth: '', department: 'Computer Science', year: '1st Year',
    gpa: '', status: 'Active', address: ''
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchStudent(id);
        const s = res.data;
        setForm({
          firstName: s.firstName || '', lastName: s.lastName || '',
          email: s.email || '', phone: s.phone || '',
          dateOfBirth: s.dateOfBirth || '', department: s.department || 'Computer Science',
          year: s.year || '1st Year', gpa: s.gpa?.toString() || '',
          status: s.status || 'Active', address: s.address || ''
        });
      } catch (err) {
        addToast('Failed to load student data', 'error');
        navigate('/students');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    try {
      setSaving(true);
      const data = { ...form, gpa: form.gpa ? parseFloat(form.gpa) : 0 };
      await updateStudent(id, data);
      addToast('Student updated successfully!');
      navigate(`/students/${id}`);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading student data...</p></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Edit Student</h2>
        <p>Update the student's information</p>
      </div>
      <form onSubmit={handleSubmit} className="glass-card form-card">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input id="dateOfBirth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <select id="department" name="department" value={form.department} onChange={handleChange}>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="year">Year *</label>
            <select id="year" name="year" value={form.year} onChange={handleChange}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="gpa">GPA (0.0 - 4.0)</label>
            <input id="gpa" name="gpa" type="number" step="0.01" min="0" max="4" value={form.gpa} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={form.status} onChange={handleChange}>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group full-width">
            <label htmlFor="address">Address</label>
            <textarea id="address" name="address" value={form.address} onChange={handleChange} />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : '💾 Update Student'}</button>
          <Link to={`/students/${id}`} className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
