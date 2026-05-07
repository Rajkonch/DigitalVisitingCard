"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import "../../styles/Cards.css";

export default function CardsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    API.get("/cards/my")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setProfile(res.data[0]);
        }
      })
      .catch((err) => console.error("Profile fetch error:", err));
  }, [router]);

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const data = {
    name: profile?.name || "Raj Kumar",
    role: profile?.designation || "Full Stack Developer",
    bio: profile?.bio || "Creating high-fidelity digital experiences and modern business identities.",
    mobile: profile?.mobile || "+91 63877 18208",
    email: profile?.email || "hello@prismqr.com",
    address: profile?.address || "Cyber Hub, Lucknow, Uttar Pradesh, 226001",
    photo: profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Raj",
    qr: profile?.qrCodeUrl || profile?.qrCode || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PrismQR",
    website: "www.prismqr.com",
    socials: profile?.links?.slice(0, 3) || [{icon: 'public', content: 'facebook.com'}, {icon: 'share', content: 'instagram.com'}]
  };

  return (
    <div className="dashboard-container">
      {/* SideNavBar - Simplified for this page */}
      <aside className="sidebar">
        <div className="sidebar-logo-section">
          <img src="/logo.png" alt="Logo" style={{ height: '50px' }} />
        </div>
        <nav className="nav-links">
          <a className="nav-item" onClick={() => router.push('/UserDashboard')} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">home</span>
            <span>Dashboard</span>
          </a>
          <a className="nav-item active" href="#">
            <span className="material-symbols-outlined">style</span>
            <span>Card Styles</span>
          </a>
          <a className="nav-item" onClick={() => router.push('/UserProfile')} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">person</span>
            <span>My Profile</span>
          </a>
        </nav>
        <div className="sidebar-footer">
          <button className="upgrade-btn">Get Pro Templates</button>
          <a className="nav-item" onClick={() => router.push('/login')} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      <div className="main-wrapper">
        <main className="cards-page-container">
          <div className="cards-header">
            <div>
              <h1>Premium Card Styles</h1>
              <p>Explore 8 ultra-modern designs for your digital identity.</p>
            </div>
            <button className="custom-card-btn" onClick={() => router.push("/UserEditPublishProfile")}>
              <span className="material-symbols-outlined">auto_fix_high</span>
              Customize Design
            </button>
          </div>

          <div className="cards-grid">
            
            {/* 1. Neo-Glass */}
            <CardWrapper id={1} flipped={flippedCards[1]} toggle={toggleFlip} back={data}>
              <div className="card-front t1-front">
                <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
                  <img src={data.photo} className="card-photo" alt="" />
                  <div className="info-group">
                    <h2 className="c-name">{data.name}</h2>
                    <span className="c-role">{data.role}</span>
                  </div>
                </div>
                <div style={{marginTop: 'auto'}}>
                  <div className="c-detail"><span className="material-symbols-outlined" style={{fontSize: '1rem'}}>call</span> {data.mobile}</div>
                  <div className="c-detail"><span className="material-symbols-outlined" style={{fontSize: '1rem'}}>mail</span> {data.email}</div>
                </div>
              </div>
            </CardWrapper>

            {/* 2. Dark Mesh */}
            <CardWrapper id={2} flipped={flippedCards[2]} toggle={toggleFlip} back={data}>
              <div className="card-front t2-front">
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                  <div className="info-group">
                    <h2 className="c-name">{data.name}</h2>
                    <span className="c-role" style={{color: '#00cffc'}}>{data.role}</span>
                  </div>
                  <img src={data.photo} className="card-photo" alt="" />
                </div>
                <div style={{marginTop: 'auto', display: 'flex', gap: '1.5rem'}}>
                   <span className="c-detail">{data.mobile}</span>
                   <span className="c-detail" style={{opacity: 0.6}}>{data.website}</span>
                </div>
              </div>
            </CardWrapper>

            {/* 3. Corporate Split */}
            <CardWrapper id={3} flipped={flippedCards[3]} toggle={toggleFlip} back={data}>
              <div className="card-front t3-front">
                <div className="t3-left">
                  <img src={data.photo} className="card-photo" style={{borderRadius: '50%', marginBottom: '10px'}} alt="" />
                  <span style={{fontSize: '0.7rem', fontWeight: 900}}>{data.name.split(' ')[0]}</span>
                </div>
                <div className="t3-right">
                  <h2 className="c-name">{data.name}</h2>
                  <span className="c-role">{data.role}</span>
                  <hr style={{width: '30px', margin: '10px 0', border: '1px solid #00647b'}} />
                  <div className="c-detail"><span className="material-symbols-outlined">call</span> {data.mobile}</div>
                  <div className="c-detail"><span className="material-symbols-outlined">mail</span> {data.email}</div>
                </div>
              </div>
            </CardWrapper>

            {/* 4. Tech Stripe */}
            <CardWrapper id={4} flipped={flippedCards[4]} toggle={toggleFlip} back={data}>
              <div className="card-front t4-front">
                <div className="info-group">
                  <span className="c-role" style={{color: '#00ffcc'}}>Live Profile</span>
                  <h2 className="c-name" style={{fontSize: '1.8rem'}}>{data.name}</h2>
                </div>
                <div style={{marginTop: 'auto'}}>
                   <div className="c-detail"><span className="material-symbols-outlined" style={{color: '#00ffcc'}}>language</span> {data.website}</div>
                   <div className="c-detail"><span className="material-symbols-outlined" style={{color: '#00ffcc'}}>call</span> {data.mobile}</div>
                </div>
              </div>
            </CardWrapper>

            {/* 5. Luxury Centered */}
            <CardWrapper id={5} flipped={flippedCards[5]} toggle={toggleFlip} back={data}>
              <div className="card-front t5-front">
                <img src={data.photo} className="card-photo" alt="" />
                <h2 className="c-name">{data.name}</h2>
                <span className="c-role">{data.role}</span>
                <p style={{fontSize: '0.7rem', marginTop: '1rem', opacity: 0.6}}>ESTD 2024 • PREMIUM MEMBER</p>
              </div>
            </CardWrapper>

            {/* 6. Bio Social */}
            <CardWrapper id={6} flipped={flippedCards[6]} toggle={toggleFlip} back={data}>
              <div className="card-front t6-front">
                <div className="t6-header">
                  <img src={data.photo} className="card-photo" style={{width: '50px', height: '50px'}} alt="" />
                  <div className="info-group">
                    <h2 className="c-name" style={{fontSize: '1.1rem'}}>{data.name}</h2>
                    <span className="c-role">{data.role}</span>
                  </div>
                </div>
                <p className="t6-bio">"{data.bio}"</p>
                <div className="t6-socials">
                  {data.socials.map((s, idx) => (
                    <span key={idx} className="material-symbols-outlined">{s.icon || 'link'}</span>
                  ))}
                  <span style={{marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 800}}>{data.mobile}</span>
                </div>
              </div>
            </CardWrapper>

            {/* 7. Diagonal Split */}
            <CardWrapper id={7} flipped={flippedCards[7]} toggle={toggleFlip} back={data}>
              <div className="card-front t7-front">
                <div className="t7-right-content">
                  <h2 className="c-name">{data.name}</h2>
                  <span className="c-role">{data.role}</span>
                  <div style={{marginTop: '15px'}}>
                    <div className="c-detail" style={{fontSize: '0.75rem'}}>{data.mobile}</div>
                    <div className="c-detail" style={{fontSize: '0.75rem'}}>{data.email}</div>
                  </div>
                </div>
              </div>
            </CardWrapper>

            {/* 8. Eco Minimal */}
            <CardWrapper id={8} flipped={flippedCards[8]} toggle={toggleFlip} back={data}>
              <div className="card-front t8-front">
                <div className="t8-left">
                  <h2 className="c-name" style={{fontSize: '1.5rem'}}>{data.name}</h2>
                  <span className="c-role" style={{color: '#22c55e'}}>{data.role}</span>
                </div>
                <div style={{textAlign: 'right'}}>
                  <img src={data.photo} className="card-photo" style={{width: '80px', height: '80px', borderRadius: '24px'}} alt="" />
                </div>
              </div>
            </CardWrapper>

          </div>
        </main>
      </div>
    </div>
  );
}

function CardWrapper({ id, flipped, toggle, children, back }) {
  return (
    <div className={`card-wrapper ${flipped ? "flipped" : ""}`} onClick={() => toggle(id)}>
      <div className="card-inner">
        {children}
        <div className="card-back">
          <div className="back-container">
            <div className="back-info">
              <h3 style={{fontSize: '1rem', fontWeight: 800, margin: 0}}>{back.name}</h3>
              <p style={{fontSize: '0.7rem', color: '#64748b', marginBottom: '10px'}}>{back.role}</p>
              <div className="c-detail" style={{fontSize: '0.75rem'}}>
                <span className="material-symbols-outlined" style={{fontSize: '0.9rem'}}>location_on</span>
                {back.address}
              </div>
              <div className="c-detail" style={{fontSize: '0.75rem'}}>
                <span className="material-symbols-outlined" style={{fontSize: '0.9rem'}}>call</span>
                {back.mobile}
              </div>
            </div>
            <div className="back-qr-wrapper">
              <span className="qr-label">Scan Me</span>
              <img src={back.qr} className="back-qr" alt="QR" />
              <span className="qr-label" style={{color: '#00647b'}}>Prism QR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
