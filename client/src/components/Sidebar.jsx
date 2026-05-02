import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', icon: '📊', label: 'Dashboard' },
  { to: '/students', icon: '👥', label: 'All Students' },
  { to: '/students/add', icon: '➕', label: 'Add Student' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🎓</div>
        <div>
          <h1>EduVault</h1>
          <span>Student Management</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-link-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ borderTop: '1px solid var(--bgl)', paddingTop: '1rem', marginTop: '1rem' }}>
        <div style={{ fontSize: '.75rem', color: 'var(--t3)', padding: '0 1rem' }}>
          EduVault v1.0<br/>© 2026 All rights reserved
        </div>
      </div>
    </aside>
  );
}
