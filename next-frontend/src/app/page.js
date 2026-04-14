"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../utils/api";
import "../styles/home.css";

const STATIC_FALLBACK_USERS = [
  { name: "Sanya K.", role: "Architect", bg: "#e1f5f9", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300", desc: "Portfolio" },
  { name: "David L.", role: "Consultant", bg: "#f3f8ee", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300", desc: "Tech Stack" },
  { name: "Aisha Z.", role: "Director", bg: "#f8f9fa", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300", desc: "Connect" },
  { name: "Vikram M.", role: "Sales Dir", bg: "#fff6f0", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300", desc: "Digital Card" },
  { name: "Priya R.", role: "Designer", bg: "#f0f2ff", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300", desc: "Dribbble" },
  { name: "Chris J.", role: "Tech Lead", bg: "#e9fced", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300", desc: "Meeting" },
  { name: "Neha W.", role: "HR Lead", bg: "#fff2f8", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300", desc: "Careers" },
  { name: "Sam D.", role: "Founder", bg: "#e1f5f9", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300", desc: "Prism QR" }
];

export default function Home() {
  const router = useRouter();
  const heroArtifactRef = useRef(null);
  const [activeProfiles, setActiveProfiles] = useState(STATIC_FALLBACK_USERS);
  const [slideIndex, setSlideIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(6);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // For Infinite Loop: Clone the list
  const displayProfiles = [...activeProfiles, ...activeProfiles];

  useEffect(() => {
    // Fetch Real Active Users
    API.get('/card/public/list')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map(card => ({
             name: card.name?.split(' ')[0] || "User",
             role: card.jobTitle?.split(' ')[0] || "Pro",
             bg: "#f8f9fa",
             img: card.profileImage || "/logo.png",
             qr: card.qrCodeUrl || card.qrCode,
             desc: "Prism QR"
          }));
          setActiveProfiles([...mapped, ...STATIC_FALLBACK_USERS]);
        }
      })
      .catch(err => console.error("Showcase fetch err:", err));

    // Responsive items count
    const handleResize = () => {
      setItemsToShow(window.innerWidth < 768 ? 3 : 9);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Snappy Zoom Reveal elements
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

    return () => {
      window.removeEventListener("resize", handleResize);
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Infinite Rhythmic Auto Scroller Logic
  useEffect(() => {
    const totalOriginals = activeProfiles.length;
    const interval = setInterval(() => {
      setSlideIndex((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeProfiles.length]);

  // Seamless Reset Handler
  useEffect(() => {
    const totalOriginals = activeProfiles.length;
    if (slideIndex === totalOriginals) {
      // Wait for the transition to finish (800ms defined in CSS)
      setTimeout(() => {
        setIsTransitioning(false);
        setSlideIndex(0);
        // Turn transition back on in next cycle
        setTimeout(() => setIsTransitioning(true), 50);
      }, 800);
    }
  }, [slideIndex, activeProfiles.length]);

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
        <section className="hero-section" id="hero-scene">
          <div className="hero-grid">
            <div className="hero-content-left reveal">
              <h1 className="hero-title">One Scan.<br /><span className="text-gradient">Your Complete Digital Identity.</span></h1>
              <p className="hero-subtitle">Turn your visiting card into a smart digital profile. Always updated, trackable, and designed to impress.</p>
              <div className="hero-buttons">
                <button className="primary-btn large btn-3d-lift" onClick={() => router.push("/login")}>Get Started Free</button>
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

        <section className="users-section">
          <div className="section-header reveal">
            <span className="badge-modern">Showcase</span>
            <h2>Smart Profiles in Action</h2>
          </div>
          <div className="users-slider-container reveal">
            <div className="slider-viewport">
              <div 
                className="capsules-sliding-track" 
                style={{ 
                  transform: `translateX(-${slideIndex * (100 / itemsToShow)}%)`, 
                  transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none' 
                }}
              >
                {displayProfiles.map((user, idx) => {
                   const isReverse = idx % 2 !== 0; 
                   return (
                    <div key={idx} className={`modern-pencil-card tilt-card ${isReverse ? 'layout-reverse' : ''}`} style={{ flex: `0 0 ${100 / itemsToShow}%` }}>
                      <div className="card-pfp-section">
                         <img src={user.img} alt={user.name} onError={(e) => e.target.src = '/logo.png'} />
                      </div>
                      <div className="card-info-section" style={{ background: user.bg }}>
                        <h4 className="user-name">{user.name}</h4>
                        <span className="user-role">{user.role}</span>
                      </div>
                      <div className="card-qr-section">
                        <img src={user.qr || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://prismqr.com&color=00647b&bgcolor=ffffff`} alt="QR" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="pricing-section">
          <div className="section-header reveal"><h2>Pricing Plans</h2></div>
          <div className="pricing-grid">
            <div className="pricing-card tilt-card reveal">
              <h3>Demo Card</h3>
              <div className="pricing-value">15 Days Free</div>
              <button className="secondary-btn" onClick={() => router.push("/login")}>Get Access</button>
            </div>
            <div className="pricing-card pro tilt-card reveal delay-100">
              <div className="badge-modern absolute-badge">Best Value</div>
              <h3>Monthly</h3>
              <div className="pricing-value">₹49 <small>/mo</small></div>
              <button className="primary-btn large" onClick={() => router.push("/login")}>Choose</button>
            </div>
            <div className="pricing-card tilt-card reveal delay-200">
              <h3>Yearly</h3>
              <div className="pricing-value">₹499 <small>/yr</small></div>
              <button className="secondary-btn" onClick={() => router.push("/login")}>Choose</button>
            </div>
          </div>
        </section>

        <section className="cta-section reveal">
          <div className="cta-container tilt-card">
            <div className="cta-content">
              <h2>Start Your Smart Digital Identity Today</h2>
              <button className="primary-btn-white large btn-3d-lift" onClick={() => router.push("/login")}>Get Started Now →</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
