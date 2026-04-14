"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../utils/api";
import "../styles/home.css";

const STATIC_FALLBACK_USERS = [
  { 
    id: "01",
    name: "Ahmad S.", 
    role: "Digital Consultant", 
    title: "Custom QR Services",
    desc: "Custom, organic digital profiles that include business cards, link-in-bio, and more.",
    bg: "#f0f4f0", 
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: "02",
    name: "Andrew S.", 
    role: "Creative Director", 
    title: "Eco Friendly Design",
    desc: "1st on the list providing highly effective environment friendly digital identities.",
    bg: "#fdf8ef", 
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: "03",
    name: "Zahra A.", 
    role: "Growth Expert", 
    title: "Enterprise Solutions",
    desc: "B2B digital profiles for large scale corporate networking and tracking.",
    bg: "#f4f0f9", 
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: "04",
    name: "David L.", 
    role: "Architect", 
    title: "Modern Portfolio",
    desc: "Showcase your artistic work with a scan. Instant lead generation for creators.",
    bg: "#eef7fd", 
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
  }
];

export default function Home() {
  const router = useRouter();
  const [activeProfiles, setActiveProfiles] = useState(STATIC_FALLBACK_USERS);
  const [slideIndex, setSlideIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const displayProfiles = [...activeProfiles, ...activeProfiles];

  useEffect(() => {
    API.get('/card/public/list')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((card, idx) => ({
             id: (idx + 1).toString().padStart(2, '0'),
             name: card.name || "User",
             role: card.jobTitle || "Professional",
             title: "Smart Profile",
             desc: "Join the digital revolution with Prism QR visiting cards.",
             bg: "#f8f9fa",
             img: card.profileImage || "/logo.png",
             qr: card.qrCodeUrl || card.qrCode
          }));
          setActiveProfiles([...mapped, ...STATIC_FALLBACK_USERS]);
        }
      })
      .catch(err => console.error("Showcase fetch err:", err));

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setItemsToShow(1);
      else if (width < 1200) setItemsToShow(2);
      else setItemsToShow(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeProfiles.length]);

  useEffect(() => {
    const totalOriginals = activeProfiles.length;
    if (slideIndex === totalOriginals) {
      setTimeout(() => {
        setIsTransitioning(false);
        setSlideIndex(0);
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
              <p className="hero-subtitle">Transform your professional presence with our smart QR visiting cards.</p>
              <div className="hero-buttons">
                <button className="primary-btn large btn-3d-lift" onClick={() => router.push("/login")}>Get Started Free</button>
              </div>
            </div>
            <div className="hero-content-right reveal delay-100">
               <div className="hero-artifact animate-floating">
                  <div className="artifact-glow"></div>
                  <img className="hero-qr-image" src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://prismqr.com/demo" alt="QR" />
               </div>
            </div>
          </div>
        </section>

        <section className="users-section">
          <div className="section-header reveal">
            <span className="badge-modern">Showcase</span>
            <h2>Gorges Professional Profiles</h2>
          </div>
          <div className="users-slider-container reveal">
            <div className="slider-viewport">
              <div 
                className="staggered-track" 
                style={{ 
                  transform: `translateX(-${slideIndex * (100 / itemsToShow)}%)`, 
                  transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none' 
                }}
              >
                {displayProfiles.map((user, idx) => {
                   // Staggered vertical rhythm: Up, Down, Up, Down...
                   const isOffset = idx % 2 !== 0; 
                   return (
                    <div 
                      key={idx} 
                      className={`service-card-wrapper ${isOffset ? 'offset-down' : ''}`}
                      style={{ flex: `0 0 ${100 / itemsToShow}%` }}
                    >
                      <div className="service-card-new">
                        <div className="card-top-image" style={{ background: user.bg }}>
                           <img src={user.img} alt={user.name} />
                           <div className="floating-badge">{user.name}</div>
                        </div>
                        <div className="accent-bar">
                           <span className="id-number">{user.id}</span>
                        </div>
                        <div className="card-bottom-info">
                           <h4 className="service-title">{user.title}</h4>
                           <p className="service-desc">{user.desc}</p>
                        </div>
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
              <h3>Demo</h3>
              <div className="pricing-value">Free</div>
              <button className="secondary-btn" onClick={() => router.push("/login")}>Try Now</button>
            </div>
            <div className="pricing-card pro tilt-card reveal delay-100">
              <div className="badge-modern absolute-badge">Popular</div>
              <h3>Monthly</h3>
              <div className="pricing-value">₹49</div>
              <button className="primary-btn large" onClick={() => router.push("/login")}>Get Started</button>
            </div>
            <div className="pricing-card tilt-card reveal delay-200">
              <h3>Yearly</h3>
              <div className="pricing-value">₹499</div>
              <button className="secondary-btn" onClick={() => router.push("/login")}>Save More</button>
            </div>
          </div>
        </section>

        <section className="cta-section reveal">
          <div className="cta-container tilt-card">
            <div className="cta-content">
              <h2>Join the Future of Networking</h2>
              <button className="primary-btn-white large btn-3d-lift" onClick={() => router.push("/login")}>Create Profile Now →</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
