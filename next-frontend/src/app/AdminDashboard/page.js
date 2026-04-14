"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../utils/api'; 
import '../../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'active'

  useEffect(() => {
    // Auth guard — only admin allowed
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token) {
      router.push("/login");
      return;
    }
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.role !== "admin") {
        router.push("/UserDashboard");
      }
    }
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/auth/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = async (userId, permission) => {
    try {
      await API.post('/auth/update-permission', { userId, permission });
      fetchUsers(); // Refresh list
      alert(`User ${permission === 1 ? 'Approved' : 'Deactivated'} Successfully`);
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.message || err.message));
    }
  };

  // Lock scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSidebarOpen]);

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [users]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const pendingUsers = users.filter(u => u.permission_active === 0 && u.role !== 'admin');
  const activeUsers = users.filter(u => u.permission_active === 1 && u.role !== 'admin');

  const stats = [
    { title: "Total Platform Users", value: users.length, trend: "+New", icon: "group", variant: "primary" },
    { title: "Pending Approvals", value: pendingUsers.length, trend: "Priority", icon: "pending_actions", variant: "secondary" },
    { title: "Verified Active", value: activeUsers.length, trend: "94% Active", icon: "verified", variant: "tertiary" },
    { title: "Security Status", value: "Optimal", trend: "Protected", icon: "security", variant: "neutral" },
  ];

  const displayedUsers = activeTab === 'requests' ? pendingUsers : activeUsers;

  return (
    <div className="dashboard-container">
      {/* Backdrop for mobile - only shows if sidebar is open */}
      <div className={`sidebar-backdrop ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      <button className="mobile-nav-toggle material-symbols-outlined" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? 'close' : 'menu'}
      </button>

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
            <img src="/logo.png" alt="Logo" style={{ height: '75px', width: 'auto', objectFit: 'contain' }} />
          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          <a onClick={() => setActiveTab('requests')} className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">pending_actions</span> New Requests
          </a>
          <a onClick={() => setActiveTab('active')} className={`nav-link ${activeTab === 'active' ? 'active' : ''}`} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">group</span> Active Users
          </a>
          <a href="#" className="nav-link">
            <span className="material-symbols-outlined">analytics</span> Analytics
          </a>
        </nav>

        <div className="sidebar-footer">
          <a className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">logout</span> Logout
          </a>
        </div>
      </aside>

      <div className="main-wrapper">
        <main className="dashboard-main">
          {/* Header */}
          <header className="main-header">
            <div className="header-title">
              <h1>{activeTab === 'requests' ? 'Registration Approval Queue' : 'Active User Management'}</h1>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>Showing {displayedUsers.length} total entities</p>
            </div>
          </header>

          <section className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className={`stat-card ${stat.variant} scroll-reveal`}>
                <div className="stat-header">
                  <div className="stat-icon">
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <span className={`stat-trend ${stat.variant === 'primary' ? 'trend-up' : 'trend-label'}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="stat-label">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            ))}
          </section>

          <section className="table-card scroll-reveal">
            <div className="section-header-row">
              <div className="section-info">
                <h3>{activeTab === 'requests' ? `New Requests (${pendingUsers.length})` : `Active Users (${activeUsers.length})`}</h3>
              </div>
            </div>

            <div className="table-wrapper no-scrollbar">
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Data...</div>
              ) : displayedUsers.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>No users found in this category.</div>
              ) : (
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>User Info</th>
                      <th>Mobile</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedUsers.map((u, i) => (
                      <tr key={u._id}>
                        <td>
                          <div className="entity-info">
                            <div className="entity-logo" style={{ background: 'var(--primary-container)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                              {u.name.charAt(0)}
                            </div>
                            <div className="entity-text">
                              <p>{u.name}</p>
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{u.mobile}</td>
                        <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                        <td>
                          <span className={`stat-trend ${u.permission_active === 1 ? 'trend-up' : 'trend-label'}`} style={{ 
                            background: u.permission_active === 1 ? '#ecfdf5' : '#fff1f2', 
                            color: u.permission_active === 1 ? '#059669' : '#e11d48',
                            fontSize: '0.75rem',
                            padding: '4px 10px',
                            borderRadius: '99px',
                            fontWeight: 800
                          }}>
                            {u.permission_active === 1 ? 'ACTIVE' : 'PENDING'}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            {u.permission_active === 0 ? (
                              <button className="btn-sm btn-primary" onClick={() => updatePermission(u._id, 1)}>Approve</button>
                            ) : (
                              <button className="btn-sm btn-neutral" style={{ color: '#e11d48' }} onClick={() => updatePermission(u._id, 0)}>Deactivate</button>
                            )}
                            <button 
                              className="btn-sm" 
                              style={{ 
                                cursor: 'pointer', 
                                background: '#22c55e', // Bright Green to confirm latest version
                                color: 'white',
                                fontWeight: 'bold',
                                position: 'relative',
                                zIndex: 1001, // Higher than everything
                                border: 'none'
                              }}
                              onClick={() => {
                                console.log("LATEST VERSION: Redirecting to:", u._id);
                                const url = window.location.origin + `/UserDashboard?userId=${u._id}`;
                                window.open(url, '_blank');
                              }}
                            >
                              View ID
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
