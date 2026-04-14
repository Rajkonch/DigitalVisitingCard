"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../utils/api";
import "../styles/home.css";

const STATIC_FALLBACK_USERS = [
  { 
    name: "Sanya Kapoor", 
    role: "Architect", 
    bg: "#e1f5f9", // Light Teal
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    desc: "Scan to see my architectural portfolio instantly."
  },
  { 
    name: "David Lawson", 
    role: "Tech Lead", 
    bg: "#f3f8ee", // Light Sage
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    desc: "Access my GitHub and tech stack in one scan."
  },
  { 
    name: "Aisha Zaveri", 
    role: "Director", 
    bg: "#f8f9fa", // Soft Gray
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    desc: "The fastest way to connect and save my contact."
  },
  { 
    name: "Vikram Mehta", 
    role: "Sales Director", 
    bg: "#fff6f0", // Soft Peach
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    desc: "Share my digital card and close deals faster."
  },
  { 
    name: "Priya Rao", 
    role: "UI Designer", 
    bg: "#f0f2ff", // Soft Blueish-Purple
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    desc: "Check my latest Dribbble shots via this QR."
  }
];

export default function Home() {
  const router = useRouter();
  const heroArtifactRef = useRef(null);
  const [activeProfiles, setActiveProfiles] = useState(STATIC_FALLBACK_USERS);
  const [slideIndex, setSlideIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);

  useEffect(() => {
    // Fetch Real Active Users
    API.get('/card/public/list')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map(card => ({
             name: card.name || "User",
             role: card.jobTitle || "Professional",
             bg: card.themeColor || "#00647b",
             img: card.profileImage || "/logo.png",
             qr: card.qrCodeUrl || card.qrCode,
             desc: "A smart way to share your professional world."
          }));
          setActiveProfiles([...mapped, ...STATIC_FALLBACK_USERS]);
        }
      })
      .catch(err => console.error("Showcase fetch err:", err));

    // Mouse Parallax
    const scene = document.getElementById("hero-scene");
    const artifact = document.getElementById("hero-artifact");

    const handleMouseMove = (e) => {
      if (!artifact || window.innerWidth < 1024) return;
      const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
      artifact.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };

    const handleMouseLeave = () => {
      if (!artifact) return;
      artifact.style.transform = `rotateY(0deg) rotateX(0deg)`;
    };

    if (scene) {
      scene.addEventListener("mousemove", handleMouseMove);
      scene.addEventListener("mouseleave", handleMouseLeave);
    }

    // Snappy Zoom Reveal elements
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => observer.observe(el));

    // Tilt Cards 3D Interaction
    const cards = document.querySelectorAll(".tilt-card");
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        if (window.innerWidth < 768) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });

    // Parallax Scroll Float Elements
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const floaters = document.querySelectorAll('.parallax-floater');
      floaters.forEach((floater) => {
        const speed = floater.dataset.speed || 0.1;
        floater.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };
    window.addEventListener('scroll', handleScroll);

    // Responsive items count
    const handleResize = () => {
      setItemsToShow(window.innerWidth < 768 ? 1 : 4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Rhythmic Auto Scroller
    const scrollerTimer = setInterval(() => {
      setSlideIndex((curr) => {
        const next = curr + 1;
        return next >= activeProfiles.length ? 0 : next;
      });
    }, 2000);

    return () => {
      clearInterval(scrollerTimer);
      window.removeEventListener("resize", handleResize);
      if (scene) {
        scene.removeEventListener("mousemove", handleMouseMove);
        scene.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener('scroll', handleScroll);
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, [activeProfiles.length]);

  return (
    <div className="home-page smooth-scroll">
      {/* NAVBAR */}
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
        {/* HERO SECTION 🚀 */}
        <section className="hero-section" id="hero-scene">
          <div className="hero-grid">
            <div className="hero-content-left reveal">
              <h1 className="hero-title">
                One Scan.<br />
                <span className="text-gradient">Your Complete Digital Identity.</span>
              </h1>
              <p className="hero-subtitle">
                Turn your visiting card into a smart digital profile. Always updated, trackable, and designed to impress.
              </p>
              <div className="hero-pitch">
                <span className="icon-tiny">🎯</span> Create your digital profile, share it with a QR, and track every interaction in real-time.
              </div>
              <div className="hero-buttons">
                <button className="primary-btn large btn-3d-lift" onClick={() => router.push("/login")}>Get Started Free</button>
                <button className="secondary-btn large tilt-card" onClick={() => router.push("/login")}>View Demo</button>
              </div>
            </div>

            <div className="hero-content-right reveal delay-100">
              <div className="hero-artifact animate-floating" id="hero-artifact" ref={heroArtifactRef}>
                <div className="artifact-glow"></div>
                <img
                  className="hero-qr-image"
                  alt="3D QR code floating in glass"
                  src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://prismqr.com/demo&color=00647b&bgcolor=ffffff"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />

                <div className="floating-card top-right parallax-floater hover-tilt" data-speed="0.12">
                  <div className="icon-box">⭐</div>
                  <div>
                    <p className="mini-text">Dynamic Profile</p>
                    <p className="bold-text">Always Updated</p>
                  </div>
                </div>
                <div className="floating-card bottom-left parallax-floater hover-tilt" data-speed="-0.08">
                  <div className="icon-box safe">🚀</div>
                  <div>
                    <p className="bold-text">Track Scans</p>
                    <p className="mini-text">Real-time stats</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="stats-section reveal">
          <div className="stats-container tilt-card">
            <div className="stat-item">
              <h3 className="text-gradient">10,000+</h3>
              <p>Professionals</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3 className="text-gradient">50,000+</h3>
              <p>Smart Connections</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3 className="text-gradient">5,000+</h3>
              <p>Digital Profiles Created</p>
            </div>
          </div>
        </section>

        {/* FEATURED PROFILES - 3D CAPSULES SLIDER */}
        <section className="users-section">
          <div className="section-header reveal">
            <span className="badge-modern">Showcase</span>
            <h2>Smart Profiles in Action</h2>
            <p>Experience how different professionals utilize their digital identity.</p>
          </div>
          <div className="users-slider-container reveal">
            <div className="slider-viewport">
              <div 
                className="capsules-sliding-track" 
                style={{ 
                  transform: `translateX(-${slideIndex * (100 / itemsToShow)}%)`,
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {activeProfiles.map((user, idx) => {
                   const isReverse = idx % 2 !== 0; // Alternate top/bottom for QR
                   return (
                    <div 
                      key={idx} 
                      className={`modern-user-card tilt-card ${isReverse ? 'layout-reverse' : ''}`}
                      style={{ flex: `0 0 ${100 / itemsToShow}%` }}
                    >
                      {/* 75% Info Section */}
                      <div className="card-info-section" style={{ background: user.bg, color: '#333' }}>
                        <div className="card-pfp-wrapper">
                           <img src={user.img} alt={user.name} onError={(e) => e.target.src = '/logo.png'} />
                        </div>
                        <div className="card-text-content">
                           <h4 className="user-name">{user.name}</h4>
                           <span className="user-role">{user.role}</span>
                           <p className="user-desc">{user.desc}</p>
                        </div>
                        <div className="card-arrow">
                           <span className="material-symbols-outlined">north_east</span>
                        </div>
                      </div>

                      {/* 25% QR Section */}
                      <div className="card-qr-section">
                        <img 
                          src={user.qr || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://prismqr.com/p/${user.name?.split(' ')[0].toLowerCase() || 'user'}&color=00647b&bgcolor=ffffff`} 
                          alt="QR" 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-it-works-section light-bg">
          <div className="section-header reveal">
            <h2>How It Works</h2>
          </div>
          <div className="steps-container">
            <div className="step-card tilt-card reveal">
              <div className="step-number">1</div>
              <h4>Create Your Profile</h4>
              <p>Add your details, links, and branding</p>
            </div>
            <div className="step-card tilt-card reveal delay-100">
              <div className="step-number">2</div>
              <h4>Generate Your QR</h4>
              <p>Get your unique smart identity code</p>
            </div>
            <div className="step-card tilt-card reveal delay-200">
              <div className="step-number">3</div>
              <h4>Share Anywhere</h4>
              <p>Use it on cards, shops, or social media</p>
            </div>
            <div className="step-card tilt-card reveal delay-300">
              <div className="step-number">4</div>
              <h4>Track & Grow</h4>
              <p>Monitor scans and grow your network</p>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="pricing-section">
          <div className="section-header reveal">
            <h2>Pricing Plans</h2>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card tilt-card reveal">
              <h3>Demo Card</h3>
              <div className="pricing-value">15 Days Free</div>
              <p>Try out the full Prism experience for two weeks.</p>
              <button className="secondary-btn" onClick={() => router.push("/login")}>Get 15-Day Access</button>
            </div>
            <div className="pricing-card pro tilt-card reveal delay-100">
              <div className="badge-modern absolute-badge">Best Value</div>
              <h3>Monthly</h3>
              <div className="pricing-value">₹49 <small>/mo</small></div>
              <p>Professional identity at an affordable price.</p>
              <button className="primary-btn large" onClick={() => router.push("/login")}>Choose Monthly</button>
            </div>
            <div className="pricing-card tilt-card reveal delay-200">
              <h3>Yearly</h3>
              <div className="pricing-value">₹499 <small>/yr</small></div>
              <p>Everything you need for an entire year.</p>
              <button className="secondary-btn" onClick={() => router.push("/login")}>Choose Yearly</button>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section reveal">
          <div className="cta-container tilt-card parallax-floater" data-speed="-0.03">
            <div className="cta-bg-blur"></div>
            <div className="cta-content">
              <h2>Start Your Smart Digital Identity Today</h2>
              <p>Create, share, and grow your network with one simple QR.</p>
            </div>
            <div className="cta-action">
              <button className="primary-btn-white large btn-3d-lift" onClick={() => router.push("/login")}>Get Started Now →</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
