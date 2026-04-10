"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
  }, [router]);

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const stats = [
    { title: "Total Users", value: "24,592", trend: "+12%", icon: "group", variant: "primary" },
    { title: "Pending Approvals", value: "184", trend: "Priority", icon: "pending_actions", variant: "secondary" },
    { title: "Active Subscriptions", value: "12,105", trend: "94% Active", icon: "star", variant: "tertiary" },
    { title: "Platform Viewers", value: "8.2k", trend: "Real-time", icon: "visibility", variant: "neutral" },
  ];

  const recentRequests = [
    { name: "Nexus Digital", email: "contact@nexus.io", tier: "Enterprise", date: "Oct 12, 2023", risk: "Low", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAY1xBijVPVarTdZPRNdQo2U8aUvHm0rMLx4mMeIA6cZysgXJZ85ZpVC5Anpr4uuow341bmqBr47DfoJ_r9evSkHaa_T3PyRVENXJS-Gn8gy8Ip4jjPyUrN2-Ya-OGLNKnXEYzMuE4Oxz4EgM2pWjyk-0gZQ68r8Nn0lLfO9Svnkq-H-u_V78lp8qD9e6iHEQm9gkCMr_UwLeBXTsx0TO7A4ww6mF8q1-tklu-kTC2HBfk8l9vwe19aWeOEDBfCvaLATzwR1FFC6zXv" },
    { name: "Velo Sports", email: "admin@velosports.com", tier: "Merchant", date: "Oct 11, 2023", risk: "Medium", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuABIvmijIaVvYbw1ux6ITxL3D0jfsbK67e6nwhdBSsoeRAW5E4qRCrBKDF3FXCl66-pUYD71aKBeBSmDiMJLx3o1YqdjtF2tgE_T8KnjbVtYlAo5VlasrcVQvcZkQqXCrMGeHyLMOADf1Mdd2BTiaMfasyKCHEFia5Ci1Q0eXpfNpX8cNpiznHgHqUB-IfQHW-PTm0_27PQnRheqfTag9SX37d-9rndBskHGWIBXT66fkOIBlhYTmtX8FRKXjM5G6xEAU0BOSfip8IE" },
    { name: "Urban Oasis", email: "hq@urbanoasis.co", tier: "Enterprise", date: "Oct 11, 2023", risk: "Low", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWBY9lDdNdVV1BhEII7SKZ7iku8-OyrpempkB4reP5WpJn3PRdCYyEXlJePo-fXSdufiNDYxtCGJAwiI7BPPJOfRYLjldXaWvu9TzYgBdxQybHOYdcSvk4y8vVMbEK7xs7wpZD_qcKhkFPt5M77Y3b6T3O0uX-59nadJtz99j3SnTQh9Or6E-RHmSeZ8PdDSpuvbKGTf4_2qKl19rEm9fPEEF9BFsVZ6qZvaB6pdvQdwRSYh_JsMYxS013eNltNc60_DHB1dT7oBRf" },
  ];

  return (
    <div className="dashboard-container">
      {/* Backdrop for mobile */}
      {isSidebarOpen && <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>}

      <button className="mobile-nav-toggle material-symbols-outlined" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? 'close' : 'menu'}
      </button>

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-box">
            <span className="material-symbols-outlined">play_prism</span>
          </div>
          <div className="brand-info">
            <h2>Prism Workspace</h2>
            <p>Premium Tier</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-link active">
            <span className="material-symbols-outlined">home</span> Home
          </a>
          <a href="#" className="nav-link">
            <span className="material-symbols-outlined">person</span> Profile
          </a>
          <a href="#" className="nav-link">
            <span className="material-symbols-outlined">analytics</span> Analytics
          </a>
          <a href="#" className="nav-link">
            <span className="material-symbols-outlined">archive</span> Archive
          </a>
          <a href="#" className="nav-link">
            <span className="material-symbols-outlined">flag</span> Goals
          </a>
        </nav>

        <div className="sidebar-footer">
          <a href="#" className="nav-link">
            <span className="material-symbols-outlined">settings</span> Settings
          </a>
          <a href="#" className="nav-link">
            <span className="material-symbols-outlined">help_outline</span> Help
          </a>
          <a className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">logout</span> Logout
          </a>
          <button className="upgrade-btn">Upgrade Plan</button>
        </div>
      </aside>

      <div className="main-wrapper">
        <main className="dashboard-main">
          {/* Header */}
          <header className="main-header">
            <div className="header-title">
              <h1>Platform Overview</h1>
            </div>
            <div className="header-actions">
              <div className="status-badge">
                <div className="status-dot"></div>
                <span>System Status: Optimal</span>
              </div>
              <button className="icon-btn material-symbols-outlined">notifications</button>
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

          <div className="dashboard-content-grid">
            <section className="chart-card scroll-reveal">
              <div className="section-header-row">
                <div className="section-info">
                  <h3>Revenue Overview</h3>
                  <p>Annual platform revenue growth trends</p>
                </div>
                <select className="period-select">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>

              <div className="mock-chart">
                <div className="chart-lines">
                  {[...Array(5)].map((_, i) => <div key={i} className="chart-line"></div>)}
                </div>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                  <div key={i} className="chart-bar-group">
                    <div
                      className={`bar ${month === 'Jun' ? 'highlighted' : ''}`}
                      style={{ height: `${[40, 55, 45, 70, 85, 100][i]}%` }}
                    ></div>
                    <span className="month-label">{month}</span>
                  </div>
                ))}
              </div>

              <div className="chart-summary-bar">
                <div className="summary-item">
                  <div className="summary-icon material-symbols-outlined" style={{ color: 'var(--primary)' }}>account_balance_wallet</div>
                  <div>
                    <p className="summary-label">Total MRR</p>
                    <p className="summary-value">$142,390.00</p>
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-icon material-symbols-outlined" style={{ color: 'var(--secondary)' }}>trending_up</div>
                  <div>
                    <p className="summary-label">Growth Rate</p>
                    <p className="summary-value" style={{ color: 'var(--secondary)' }}>+18.4%</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="alerts-card scroll-reveal">
              <div className="section-header-row">
                <div className="section-info">
                  <h3>System Alerts</h3>
                </div>
                <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>more_horiz</span>
              </div>
              <div className="alerts-list">
                <div className="alert-item error">
                  <span className="material-symbols-outlined alert-icon">error</span>
                  <div className="alert-content">
                    <h4>API Latency Spike</h4>
                    <p>US-East endpoint experiencing 200ms+ delay. Investigating...</p>
                    <span className="alert-time">2 mins ago</span>
                  </div>
                </div>
                <div className="alert-item warning">
                  <span className="material-symbols-outlined alert-icon">warning</span>
                  <div className="alert-content">
                    <h4>Database Backup Delayed</h4>
                    <p>Nightly mirror task stalled at 82%. Retrying in 5 mins.</p>
                    <span className="alert-time">15 mins ago</span>
                  </div>
                </div>
                <div className="alert-item info">
                  <span className="material-symbols-outlined alert-icon">info</span>
                  <div className="alert-content">
                    <h4>New Patch Available</h4>
                    <p>V2.4.1 core update ready for deployment to staging.</p>
                    <span className="alert-time">1 hour ago</span>
                  </div>
                </div>
              </div>
              <button className="view-all-btn">View All Logs</button>
            </section>
          </div>

          <section className="table-card scroll-reveal">
            <div className="section-header-row">
              <div className="section-info">
                <h3>Recent Registration Requests</h3>
                <p>Pending merchant and enterprise accounts requiring review</p>
              </div>
              <button className="btn-sm btn-neutral" style={{ padding: '0.625rem 1.5rem', background: 'var(--surface-container-high)', color: 'var(--primary)' }}>
                View Queue (184)
              </button>
            </div>

            <div className="table-wrapper no-scrollbar">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Entity</th>
                    <th>Tier</th>
                    <th>Applied Date</th>
                    <th>Risk Score</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((req, i) => (
                    <tr key={i}>
                      <td>
                        <div className="entity-info">
                          <div className="entity-logo">
                            <img src={req.logo} alt="Logo" />
                          </div>
                          <div className="entity-text">
                            <p>{req.name}</p>
                            <span>{req.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: req.tier === 'Enterprise' ? 'var(--primary)' : 'inherit', fontWeight: 600 }}>{req.tier}</td>
                      <td style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>{req.date}</td>
                      <td>
                        <span className="stat-trend trend-up" style={{ background: req.risk === 'Low' ? '#ecfdf5' : '#fff7ed', color: req.risk === 'Low' ? '#059669' : '#d97706' }}>
                          {req.risk}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-sm btn-primary">Approve</button>
                          <button className="btn-sm btn-neutral">View</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
