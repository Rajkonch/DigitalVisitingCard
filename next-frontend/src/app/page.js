"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../utils/api";
import "../styles/home.css";

const STATIC_FALLBACK_USERS = [
  { name: "Rahul S.", role: "Founder", bg: "#00647b", arrow: "#00cffc", img: "/logo.png" },
  { name: "Sanya K.", role: "Architect", bg: "#A03929", arrow: "#FFC4B9", img: "https://api.dicebear.com/9.x/micah/svg?seed=Sanya&backgroundColor=transparent" },
  { name: "David L.", role: "Tech Lead", bg: "#00675F", arrow: "#5FFDEC", img: "https://api.dicebear.com/9.x/micah/svg?seed=David&backgroundColor=transparent" }
];

export default function Home() {
  const router = useRouter();
  const heroArtifactRef = useRef(null);

  // Slider State (5 on desktop, 1 on mobile)
  const [itemsPerSlide, setItemsPerSlide] = useState(5);
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeProfiles, setActiveProfiles] = useState(STATIC_FALLBACK_USERS);

  useEffect(() => {
    // Fetch Real Active Users
    API.get('/card/public/list')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map(card => ({
             name: card.name || "User",
             role: card.jobTitle || "Professional",
             bg: card.themeColor || "#00647b",
             arrow: "#ffffff",
             img: card.profileImage || "/logo.png",
             qr: card.qrCodeUrl || card.qrCode
          }));
          setActiveProfiles(mapped);
        }
      })
      .catch(err => console.error("Showcase fetch err:", err));

    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerSlide(1);
      else if (window.innerWidth < 1024) setItemsPerSlide(2);
      else setItemsPerSlide(5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Auto scroller mapping - one by one
    const timer = setInterval(() => {
      setActiveProfiles(prev => {
        setSlideIndex((curr) => (curr + 1 >= prev.length ? 0 : curr + 1));
        return prev;
      });
    }, 2500);

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

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", handleResize);
      if (scene) {
        scene.removeEventListener("mousemove", handleMouseMove);
        scene.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener('scroll', handleScroll);
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, [itemsPerSlide]);

  return (
    <div className="home-page smooth-scroll">
      {/* NAVBAR */}
      <header className="header-nav z-index-top">
        <nav className="navbar-glass compact-nav">
          <div className="logo-text">
            <img src="/logo.png" alt="Logo" style={{ height: '45px', width: 'auto', display: 'block' }} />
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
            <div className="capsules-container" style={{ transform: `translateX(-${(slideIndex * (100/itemsPerSlide))}%)` }}>
              {activeProfiles.map((user, idx) => (
                <div key={idx} className={`user-capsule tilt-card ${idx % 2 === 0 ? 'offset-up' : 'offset-down shadow-intense'}`} style={{ minWidth: `${100/itemsPerSlide}%` }}>
                  <div className="capsule-part part-qr">
                    <img 
                      src={user.qr || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://prismqr.com/p/${user.name.split(' ')[0].toLowerCase()}&color=00647b&bgcolor=ffffff`} 
                      alt="Profile QR" 
                      loading="lazy"
                    />
                  </div>
                  <div className="capsule-part part-image">
                    <img src={user.img} alt={user.name} onError={(e) => e.target.src = '/logo.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className="capsule-part part-details" style={{ background: user.bg }}>
                    <span className="tiny-brand">prism.qr</span>
                    <h4 className="capsule-name">{user.name}</h4>
                    <p style={{ fontSize: '10px', opacity: 0.9, fontWeight: 700 }}>{user.role}</p>
                    <div className="arrow-btn" style={{ color: user.arrow }}>
                       <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>north_east</span>
                    </div>
                  </div>
                </div>
              ))}
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
