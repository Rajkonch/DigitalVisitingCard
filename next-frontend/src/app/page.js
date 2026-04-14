"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../utils/api";
import "../styles/home.css";

const STATIC_FALLBACK_USERS = [
  { name: "David Lawson", role: "Strategy Consultant", bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
  { name: "Aisha Zaveri", role: "Marketing Director", bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" },
  { name: "Vikram Mehta", role: "Product Manager", bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" },
  { name: "Priya Rao", role: "Lead Designer", bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
  { name: "Chris Jordan", role: "Technical Lead", bg: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" }
];

export default function Home() {
  const router = useRouter();
  const [activeProfiles, setActiveProfiles] = useState(STATIC_FALLBACK_USERS);

  useEffect(() => {
    API.get('/card/public/list')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map(card => ({
            name: card.name || "User",
            role: card.jobTitle || "Professional",
            bg: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
            img: card.profileImage || "/logo.png"
          }));
          setActiveProfiles([...mapped, ...STATIC_FALLBACK_USERS].slice(0, 8));
        }
      })
      .catch(err => console.error("Showcase fetch err:", err));

    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => reveals.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div className="home-page smooth-scroll">
      <header className="header-nav z-index-top">
        <nav className="navbar-glass compact-nav">
          <div className="logo-text">
            <img src="/logo.png" alt="Logo" style={{ height: '50px', width: 'auto', display: 'block' }} />
          </div>
          <div className="nav-actions">
            <button className="text-btn" onClick={() => router.push("/login")}>Login</button>
            <button className="primary-btn btn-3d-lift" onClick={() => router.push("/login?register=true")}>Sign Up</button>
          </div>
        </nav>
      </header>

      <main className="main-content">
        {/* HERO */}
        <section className="hero-section">
          <div className="hero-grid">
            <div className="hero-content-left reveal">
              <h1 className="hero-title">Elevate Your<br /><span className="text-gradient">Professional Identity.</span></h1>
              <p className="hero-subtitle">The most advanced digital visiting card platform for modern networking.</p>
              <div className="hero-buttons">
                <button className="primary-btn large btn-3d-lift" onClick={() => router.push("/login")}>Create Your Card</button>
              </div>
            </div>
            <div className="hero-content-right reveal delay-100">
              <div className="hero-artifact animate-floating">
                <div className="artifact-glow"></div>
                <img className="hero-qr-image" src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://prismqr.com/demo&color=00647b&bgcolor=ffffff" alt="QR" />
              </div>
            </div>
          </div>
        </section>

        {/* OUR USERS - MODERN GRID */}
        <section className="users-showcase-section">
          <div className="section-header reveal">
            <span className="badge-modern">Community</span>
            <h2>Trusted by Professionals</h2>
            <p className="section-subtitle">Join thousands of leaders who have switched to Prism QR cards.</p>
          </div>

          <div className="professionals-grid reveal">
            {activeProfiles.map((user, idx) => (
              <div key={idx} className="professional-card tilt-card" onClick={() => router.push("/login")}>
                <div className="p-card-top" style={{ background: user.bg }}>
                  <div className="p-avatar-ring">
                    <img src={user.img} alt={user.name} />
                  </div>
                </div>
                <div className="p-card-body">
                  <h4 className="p-name">{user.name}</h4>
                  <span className="p-role">{user.role}</span>
                  <div className="p-socials">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                  <button className="p-view-btn">View Profile</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section className="pricing-section">
          <div className="section-header reveal"><h2>Simple Pricing</h2></div>
          <div className="pricing-grid">
            <div className="pricing-card reveal">
              <h3>Free Trial</h3>
              <div className="pricing-value">15 Days</div>
              <button className="secondary-btn" onClick={() => router.push("/login")}>Start Now</button>
            </div>
            <div className="pricing-card pro reveal delay-100">
              <div className="badge-modern absolute-badge">Recommended</div>
              <h3>Monthly</h3>
              <div className="pricing-value">₹49</div>
              <button className="primary-btn large" onClick={() => router.push("/login")}>Go Pro</button>
            </div>
            <div className="pricing-card reveal delay-200">
              <h3>Yearly</h3>
              <div className="pricing-value">₹499</div>
              <button className="secondary-btn" onClick={() => router.push("/login")}>Save 20%</button>
            </div>
          </div>
        </section>

        <section className="cta-section reveal">
          <div className="cta-container">
            <h2>Ready to transform your networking?</h2>
            <button className="primary-btn-white large btn-3d-lift" onClick={() => router.push("/login")}>Create Your Profile Now</button>
          </div>
        </section>
      </main>
    </div>
  );
}
