import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../home.css";

const userList = [
  { name: "Rahul S.", role: "Marketing", bg: "#FEA670", arrow: "#EB795F", img: "https://api.dicebear.com/9.x/micah/svg?seed=Rahul&backgroundColor=transparent" },
  { name: "Priya P.", role: "Design", bg: "linear-gradient(170deg, #F0802B 0%, #B02787 50%, #171C5A 100%)", arrow: "#9C228E", img: "https://api.dicebear.com/9.x/micah/svg?seed=Priya&backgroundColor=transparent" },
  { name: "Aman K.", role: "Founder", bg: "#7CD6FE", arrow: "#6DA6DF", img: "https://api.dicebear.com/9.x/micah/svg?seed=Aman&backgroundColor=transparent" },
  { name: "Neha S.", role: "Trainer", bg: "#65BEC3", arrow: "#55A2A7", img: "https://api.dicebear.com/9.x/micah/svg?seed=Neha&backgroundColor=transparent" },
  { name: "Vikram M.", role: "Sales Dir", bg: "#9EA5B4", arrow: "#8C94A6", img: "https://api.dicebear.com/9.x/micah/svg?seed=Vikram&backgroundColor=transparent" }
];

export default function Home() {
  const navigate = useNavigate();
  const heroArtifactRef = useRef(null);

  // Slider State (2 by 2)
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    // Auto scroller mapping (2 items every 3 sec)
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 2 >= userList.length ? 0 : prev + 2));
    }, 3000);

    // Mouse Parallax
    const scene = document.getElementById("hero-scene");
    const artifact = document.getElementById("hero-artifact");

    const handleMouseMove = (e) => {
      if (!artifact) return;
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
      { threshold: 0.15 } // Activate when 15% visible
    );
    reveals.forEach((el) => observer.observe(el));

    // Tilt Cards 3D Interaction
    const cards = document.querySelectorAll(".tilt-card");
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
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
      if (scene) {
        scene.removeEventListener("mousemove", handleMouseMove);
        scene.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener('scroll', handleScroll);
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="home-page smooth-scroll">
      {/* Promo Banner 🔥 */}
      <div className="promo-banner z-index-top">
        {/* <p>Built for modern professionals • Powered by smart QR technology</p> */}
      </div>

      {/* NAVBAR */}
      <header className="header-nav z-index-top">
        <nav className="navbar-glass compact-nav">
          <div className="logo-text">
            <img src="/logo.png" alt="Logo" style={{ height: '35px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <div className="nav-actions">
            <button className="text-btn" onClick={() => navigate("/login")}>Login</button>
            <button className="primary-btn btn-3d-lift" onClick={() => navigate("/login", { state: { isRegister: true } })}>Sign Up</button>
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
                <button className="primary-btn large btn-3d-lift" onClick={() => navigate("/login")}>Get Started Free</button>
                <button className="secondary-btn large tilt-card" onClick={() => navigate("/login")}>View Demo</button>
              </div>
            </div>

            <div className="hero-content-right reveal delay-100">
              <div className="hero-artifact animate-floating" id="hero-artifact" ref={heroArtifactRef}>
                <div className="artifact-glow"></div>
                <img
                  className="hero-qr-image"
                  alt="3D QR code floating in glass"
                  src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://prismqr.com/demo&color=00647b&bgcolor=ffffff"
                />

                {/* Parallax Float Elements */}
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

        {/* GROWTH / TRUST SECTION 📈 */}
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

        {/* HOW IT WORKS 🚀 */}
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

        {/* WHY PRISM QR (Benefits) 💡 */}
        <section className="benefits-section">
          <div className="section-header reveal">
            <h2>Why Choose Prism QR?</h2>
          </div>
          <div className="bento-grid">
            <div className="bento-card compact-benefit tilt-card reveal">
              <div className="bento-content">
                <span className="bento-icon-small">💰</span>
                <h3>Zero Printing Cost</h3>
                <p>Never print visiting cards again.</p>
              </div>
            </div>
            <div className="bento-card compact-benefit tilt-card reveal delay-100">
              <div className="bento-content">
                <span className="bento-icon-small">🔄</span>
                <h3>Always Up-to-Date</h3>
                <p>Edit anytime, reflect instantly.</p>
              </div>
            </div>
            <div className="bento-card compact-benefit tilt-card reveal delay-200">
              <div className="bento-content">
                <span className="bento-icon-small">📊</span>
                <h3>Real-time Tracking</h3>
                <p>Know who viewed your profile.</p>
              </div>
            </div>
            <div className="bento-card compact-benefit tilt-card reveal delay-300">
              <div className="bento-content">
                <span className="bento-icon-small">⚡</span>
                <h3>Instant Sharing</h3>
                <p>Just scan and connect instantly.</p>
              </div>
            </div>
            <div className="bento-card compact-benefit tilt-card reveal delay-400">
              <div className="bento-content">
                <span className="bento-icon-small">📱</span>
                <h3>Mobile Optimized</h3>
                <p>Works perfectly on all devices.</p>
              </div>
            </div>
            <div className="bento-card compact-benefit tilt-card reveal delay-500">
              <div className="bento-content">
                <span className="bento-icon-small">🔐</span>
                <h3>Secure Platform</h3>
                <p>Admin approval and protected access.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION ⚡ */}
        <section className="features-section light-bg">
          <div className="section-header reveal">
            <h2>Powerful Features Built for Growth</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card tilt-card reveal">
              <div className="feature-icon">🎨</div>
              <h3>Smart Profile Builder</h3>
              <p>Create stunning, branded digital identities</p>
            </div>
            <div className="feature-card tilt-card reveal delay-100">
              <div className="feature-icon">📊</div>
              <h3>Real-Time Analytics</h3>
              <p>Track scans, visitors, location, and engagement insights</p>
            </div>
            <div className="feature-card tilt-card reveal delay-200">
              <div className="feature-icon">🔗</div>
              <h3>Smart QR Sharing</h3>
              <p>Share your profile anywhere using a single QR</p>
            </div>
            <div className="feature-card tilt-card reveal delay-300">
              <div className="feature-icon">🎯</div>
              <h3>Lead Tracking System</h3>
              <p>Know your audience and convert better</p>
            </div>
            <div className="feature-card tilt-card reveal delay-400">
              <div className="feature-icon">💳</div>
              <h3>Subscription & Billing</h3>
              <p>Easy upgrade with flexible plans</p>
            </div>
            <div className="feature-card tilt-card reveal delay-500">
              <div className="feature-icon">🛠</div>
              <h3>Advanced Admin Panel</h3>
              <p>Manage users, plans, and platform activity</p>
            </div>
          </div>
        </section>

        {/* WHY DIFFERENT 🎯 */}
        <section className="difference-section reveal">
          <div className="difference-container tilt-card parallax-floater" data-speed="0.05">
            <div className="diff-left">
              <h2>What Makes Us Different?</h2>
              <p>Why stick to outdated paper cards? <br /><b>Upgrade to smart digital networking.</b></p>
            </div>
            <div className="diff-right">
              <ul className="diff-list">
                <li className="negative">❌ Traditional cards are static</li>
                <li className="positive">✅ Prism QR is dynamic & smart</li>
                <li>📊 Trackable networking</li>
                <li>🔄 Always updated profile</li>
                <li>🎨 Premium digital presence</li>
              </ul>
            </div>
          </div>
        </section>

        {/* DYNAMIC CAPSULES SECTION 👥 */}
        <section className="users-section">
          <div className="section-header reveal">
            <h2>Professionals Using Prism</h2>
            <p>Trusted by professionals across industries</p>
          </div>

          <div className="users-slider-container reveal delay-100">
            <div className="capsules-container">
              {userList.map((user, i) => (
                <div className={`user-capsule ${i % 2 !== 0 ? 'reverse-capsule offset-down' : 'offset-up'}`} key={user.name} style={{ background: user.bg }}>
                  {/* 25% QR - Has forced white background in CSS */}
                  <div className="capsule-part part-qr">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://prismqr.com/${user.name.replace(/\s+/g, '')}&color=00647b`} alt={`${user.name} QR`} />
                  </div>
                  
                  {/* 50% Image - Transparent so it uses capsule bg */}
                  <div className="capsule-part part-image">
                    <img src={user.img} alt={user.name} />
                  </div>

                  {/* 25% Details - Transparent so it uses capsule bg */}
                  <div className="capsule-part part-details">
                    <span className="tiny-brand">prismQR</span>
                    <h3 className="capsule-name">{user.name}</h3>
                    <div className="arrow-btn" style={{ color: user.arrow }}>
                      <span className="material-symbols-outlined">north_east</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION 💰 */}
        <section className="pricing-section">
          <div className="section-header reveal">
            <h2>Pricing Plans</h2>
          </div>
          <div className="pricing-grid">
            {/* Free */}
            <div className="pricing-card tilt-card reveal">
              <h3>Free Demo</h3>
              <div className="pricing-value">3 Days Free</div>
              <p>Perfect for getting started with digital identity.</p>
              <button className="secondary-btn" onClick={() => navigate("/login")}>Start 3-Day Trial</button>
            </div>
            {/* Monthly */}
            <div className="pricing-card pro tilt-card reveal delay-100">
              <div className="badge-modern absolute-badge">Most Popular</div>
              <h3>Monthly</h3>
              <div className="pricing-value">₹250 <small>/mo</small></div>
              <p>Everything you need to grow and track your network.</p>
              <button className="primary-btn large" onClick={() => navigate("/login")}>Upgrade Monthly</button>
            </div>
            {/* Yearly */}
            <div className="pricing-card tilt-card reveal delay-200">
              <h3>Yearly</h3>
              <div className="pricing-value">₹2500 <small>/yr</small></div>
              <p>Everything you need to grow and track your network.</p>
              <button className="secondary-btn" onClick={() => navigate("/login")}>Upgrade Yearly</button>
            </div>
          </div>
        </section>

        {/* CTA SECTION 🚀 */}
        <section className="cta-section reveal">
          <div className="cta-container tilt-card parallax-floater" data-speed="-0.03">
            <div className="cta-bg-blur"></div>
            <div className="cta-content">
              <h2>Start Your Smart Digital Identity Today</h2>
              <p>Create, share, and grow your network with one simple QR.</p>
            </div>
            <div className="cta-action">
              <button className="primary-btn-white large btn-3d-lift" onClick={() => navigate("/login")}>Get Started Now →</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}