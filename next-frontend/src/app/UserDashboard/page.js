"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import "../../styles/UserDashboard.css";

export default function UserDashboard() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [visibility, setVisibility] = useState({
    mobile: true,
    email: true,
    address: true,
    projects: true,
    products: true
  });

  useEffect(() => {
    // Auth guard
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Fetch user details from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch cards from API
    API.get("/cards").then((res) => setCards(res.data)).catch(() => {});
  }, [router]);

  // Lock scroll when sidebar/modals are open
  useEffect(() => {
    if (isSidebarOpen || isComingSoonOpen || isSettingsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSidebarOpen, isComingSoonOpen, isSettingsOpen]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const handleComingSoon = () => setIsComingSoonOpen(true);

  const toggleVisibility = (key) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* SideNavBar */}
      <aside className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo-section">
          <div className="logo-icon">
            <span className="material-symbols-outlined">play_prism</span>
          </div>
          <div className="logo-text">
            <h1>Prism QR</h1>
            <p>Premium Tier</p>
          </div>
          {/* Mobile Close Button */}
          <button className="mobile-close-btn" onClick={toggleSidebar}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="nav-links">
          <a className="nav-item active" href="#">
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </a>
          <a className="nav-item" onClick={() => router.push('/UserProfile')} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">person</span>
            <span>Profile</span>
          </a>
          <a className="nav-item" onClick={handleComingSoon} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">analytics</span>
            <span>Analytics</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="upgrade-btn" onClick={handleComingSoon}>Upgrade Plan</button>
          <a className="nav-item" onClick={() => setIsSettingsOpen(true)} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </a>
          <a className="nav-item" onClick={handleComingSoon} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">help_outline</span>
            <span>Help</span>
          </a>
          <a className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <main className="main-content">
          <header className="header">
            <div className="header-left" style={{ flex: 1, minWidth: 0 }}>
              <button className="mobile-menu-btn" onClick={toggleSidebar}>
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="header-welcome" style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ margin: 0, padding: '0 4px', fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Welcome back, {user?.name || "Member"}</h2>
              </div>
            </div>
            <div className="header-actions">
              <button className="icon-btn">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <div className="user-avatar" onClick={() => router.push('/UserProfile')} style={{ cursor: 'pointer' }}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPIK-w9GXEfApkbrMLYb-yFwUn6EAZLzI4MXrZe20usvcEB59_mLWzUCyo0E-nKq3_i78AIPEqgEFSNFE8v6jlbkQIbhYieXHVa9TU3s7aw2jQo77-pTrY7_zYtKh9YiIluDOTLhZHP3cZzLeodZMUB4rIP_MjAlZlycFRe84ig-GjhymoBrGQtBaZsIMIKDPzKp8gp-VIXUQFr6m_B-WOZQRdNxiIwkQbxgXZzaFWiWD8ykNy-sV3HSE44SV1GVsgKzOdNybXWuKi"
                  alt="User"
                />
              </div>
            </div>
          </header>

          <div className="bento-grid">
            {/* Quick Edit Card */}
            <div className="card quick-action-card" onClick={() => router.push("/UserEditPublishProfile")}>
              <span className="material-symbols-outlined">edit_square</span>
              <div>
                <h3>Profile<br />Editor</h3>
                <p>Jump to 3D Customization</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-container">
              <div className="card stat-card">
                <div className="stat-header">
                  <span className="stat-icon material-symbols-outlined">visibility</span>
                  <span className="stat-badge">+12%</span>
                </div>
                <p className="stat-label">Total Views</p>
                <p className="stat-value">12,482</p>
              </div>

              <div className="card stat-card secondary">
                <div className="stat-header">
                  <span className="stat-icon material-symbols-outlined">qr_code_scanner</span>
                  <span className="stat-badge">Live</span>
                </div>
                <p className="stat-label">New Scans Today</p>
                <p className="stat-value">143</p>
              </div>

              <div className="card stat-card tertiary">
                <div className="stat-header">
                  <span className="stat-icon material-symbols-outlined">online_prediction</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                    <span className="stat-badge" style={{ padding: 0 }}>Active</span>
                  </div>
                </div>
                <p className="stat-label">Status</p>
                <p className="stat-value">Online</p>
              </div>
            </div>

            {/* Public View Card */}
            <div className="card public-view-card">
              <div className="qr-preview-box floating-element">
                {cards.length > 0 ? (
                  <img src={cards[0].qrCode} alt="QR Code" />
                ) : (
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSuwO3KxJKKmBnbAvVhewqBfeN8kWHYZ_wGIpEWpZiDzZ4L1UzF6V9fVOEqKq6lmHeiAT60BD8UyBzFCWz27bWCgMgDWdRciz7_S3aISyTvqx683U8EMClAq_4vxEg5NNTdjJfw6wal4YLEusrdxXiD7mpC3y4ffUIOFEGB_VdnP98zIwUMybNZoRDSO2N8n7LmroMJ60IDhaTJMUt-v4uy8Szc7RJ5V7J88UQnW50mgwEB-WTs5iEuq95GT16wQuCZEKRo6W3plJg" 
                    alt="Sample QR" 
                  />
                )}
                <div className="qr-overlay">
                  <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '2rem' }}>download</span>
                </div>
              </div>
              <div className="live-view-info">
                <h4>prism.qr/{user?.name?.toLowerCase().replace(/\s+/g, '-') || 'workspace'}</h4>
                <p>Your public profile is optimized for mobile viewing.</p>
                <button className="view-live-btn">
                  View Live <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>open_in_new</span>
                </button>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="card activity-card">
              <div className="activity-header">
                <h4>Recent Activity</h4>
                <a href="#" className="view-all-link">View All</a>
              </div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-item-icon">
                    <span className="material-symbols-outlined">smartphone</span>
                  </div>
                  <div className="activity-item-text">
                    <p>iPhone 15 Pro • London, UK</p>
                    <span>2 minutes ago</span>
                  </div>
                  <span className="material-symbols-outlined verified-icon">verified</span>
                </div>
                <div className="activity-item">
                  <div className="activity-item-icon">
                    <span className="material-symbols-outlined">tablet_mac</span>
                  </div>
                  <div className="activity-item-text">
                    <p>iPad Air • New York, US</p>
                    <span>45 minutes ago</span>
                  </div>
                  <span className="material-symbols-outlined verified-icon">verified</span>
                </div>
                <div className="activity-item">
                  <div className="activity-item-icon">
                    <span className="material-symbols-outlined">devices</span>
                  </div>
                  <div className="activity-item-text">
                    <p>Chrome Desktop • Tokyo, JP</p>
                    <span>2 hours ago</span>
                  </div>
                  <span className="material-symbols-outlined verified-icon">verified</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Coming Soon Popup */}
      {isComingSoonOpen && (
        <div className="modal-backdrop" onClick={() => setIsComingSoonOpen(false)}>
          <div className="modal-content reveal-up" onClick={e => e.stopPropagation()}>
            <span className="material-symbols-outlined modal-icon">hourglass_empty</span>
            <h3>Under Processing</h3>
            <p>This module is coming soon.<br />Thank you for your patience!</p>
            <button className="btn-modal-close" onClick={() => setIsComingSoonOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Settings / Visibility Modal */}
      {isSettingsOpen && (
        <div className="modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-content reveal-up settings-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Section Visibility</h3>
              <button className="icon-btn-close" onClick={() => setIsSettingsOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="modal-desc">Control which sections are visible on your public profile.</p>
            
            <div className="visibility-list">
              {Object.keys(visibility).map(key => (
                <div key={key} className="visibility-item">
                  <div className="visibility-info">
                    <span className="material-symbols-outlined">
                      {key === 'mobile' ? 'smartphone' : key === 'email' ? 'mail' : key === 'address' ? 'location_on' : key === 'projects' ? 'work' : 'shopping_bag'}
                    </span>
                    <span className="visibility-label">{key.charAt(0).toUpperCase() + key.slice(1)} Section</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={visibility[key]} 
                      onChange={() => toggleVisibility(key)} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
            
            <button className="btn-save-settings" onClick={() => setIsSettingsOpen(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
