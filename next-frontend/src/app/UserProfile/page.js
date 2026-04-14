"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../utils/api';
import '../../styles/UserProfile.css';

export default function UserProfile() {
  const router = useRouter();
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
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    
    API.get("/auth/profile").then(res => {
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    }).catch(err => {
      console.error(err);
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    });
  }, [router]);

  useEffect(() => {
    if (isSidebarOpen || isComingSoonOpen || isSettingsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSidebarOpen, isComingSoonOpen, isSettingsOpen]);

  const toggleVisibility = (key) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const subscription = {
    plan: "Premium Tier",
    status: "Active",
    startDate: "Jan 12, 2024",
    endDate: "Jan 12, 2025",
    billingCycle: "Annual",
    price: "₹2,499/year"
  };

  return (
    <div className="profile-container">
      {/* Backdrop for mobile */}
      {isSidebarOpen && <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>}
      
      {/* Mobile Menu Toggle */}
      <button className="mobile-nav-toggle material-symbols-outlined" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? 'close' : 'menu'}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="nav-links">
          <a onClick={() => router.push('/UserDashboard')} className="nav-item" style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </a>
          <a className="nav-item active" style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            <span>Profile</span>
          </a>
          <a className="nav-item" onClick={() => setIsComingSoonOpen(true)} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">analytics</span>
            <span>Analytics</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="upgrade-btn" onClick={() => setIsComingSoonOpen(true)}>Upgrade Plan</button>
          <a className="nav-item" onClick={() => setIsSettingsOpen(true)} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </a>
          <a className="nav-item" onClick={() => setIsComingSoonOpen(true)} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">help_outline</span>
            <span>Help</span>
          </a>
        </div>
      </aside>

      <div className="profile-main-wrapper">
        <header className="profile-header">
          <h1>My Profile</h1>
        </header>

        <div className="profile-content">
          {/* Basic Details Card */}
          <div className="profile-card reveal-up" style={{ animationDelay: '0s' }}>
            <div className="user-info-section">
              <div className="profile-avatar-large">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPIK-w9GXEfApkbrMLYb-yFwUn6EAZLzI4MXrZe20usvcEB59_mLWzUCyo0E-nKq3_i78AIPEqgEFSNFE8v6jlbkQIbhYieXHVa9TU3s7aw2jQo77-pTrY7_zYtKh9YiIluDOTLhZHP3cZzLeodZMUB4rIP_MjAlZlycFRe84ig-GjhymoBrGQtBaZsIMIKDPzKp8gp-VIXUQFr6m_B-WOZQRdNxiIwkQbxgXZzaFWiWD8ykNy-sV3HSE44SV1GVsgKzOdNybXWuKi" 
                  alt="Avatar" 
                />
              </div>
              <h2>{user?.name || "Member Name"}</h2>
              <span className="user-tag">{subscription.plan}</span>

              <div className="detail-row">
                <span className="detail-label">Email Address</span>
                <span className="detail-value">{user?.email || "member@prism.qr"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mobile Number</span>
                <span className="detail-value">{user?.mobile || "1234567890"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Account Created</span>
                <span className="detail-value">Dec 10, 2023</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className="detail-value" style={{ color: 'var(--success)' }}>Verified Member</span>
              </div>
            </div>
            
            <div className="profile-actions" style={{ justifyContent: 'center' }}>
              <button 
                className="btn-profile btn-outline-profile" 
                style={{ maxWidth: '200px' }}
                onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/login'); }}
              >
                Logout Account
              </button>
            </div>
          </div>

          {/* Subscription Details Card */}
          <div className="profile-card reveal-up" style={{ animationDelay: '0.1s' }}>
            <div className="subscription-status-banner">
              <div className="status-check">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div className="status-text">
                <h3>Subscription Active</h3>
                <p>Your premium features are fully unlocked.</p>
              </div>
            </div>

            <div className="plan-details-grid">
              <div className="plan-item highlight">
                <span className="item-label">Current Plan</span>
                <p className="item-value">{subscription.plan}</p>
              </div>
              <div className="plan-item">
                <span className="item-label">Billing Cycle</span>
                <p className="item-value">{subscription.billingCycle}</p>
              </div>
              <div className="plan-item">
                <span className="item-label">Start Date</span>
                <p className="item-value">{subscription.startDate}</p>
              </div>
              <div className="plan-item">
                <span className="item-label">Expiry Date</span>
                <p className="item-value" style={{ color: 'var(--secondary)' }}>{subscription.endDate}</p>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--surface-container-low)', borderRadius: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Auto-Renewal</span>
                <span style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 700 }}>Enabled</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Your plan will automatically renew on {subscription.endDate}.</p>
            </div>

            <button className="btn-profile btn-outline-profile" style={{ width: '100%', marginTop: '2rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
              Manage Billing & Invoices
            </button>
          </div>
        </div>
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
                    <input type="checkbox" checked={visibility[key]} onChange={() => toggleVisibility(key)} />
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
