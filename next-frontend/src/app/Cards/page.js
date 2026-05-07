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
    name: profile?.name || "Somendra Singh",
    role: profile?.designation || "Executive Director",
    bio: profile?.bio || "Transforming digital landscapes with innovative QR solutions and modern branding.",
    mobile: profile?.mobile || "+91 63877 18208",
    email: profile?.email || "somendra@prismqr.com",
    address: profile?.address || "Building 4B, Cyber City, Phase III, Gurgaon, HR",
    photo: profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Somendra",
    qr: profile?.qrCodeUrl || profile?.qrCode || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PrismQR",
    website: "www.prismqr.com",
    socials: profile?.links?.slice(0, 3) || [{icon: 'public', content: 'facebook.com'}, {icon: 'share', content: 'instagram.com'}]
  };

  return (
    <div className="dashboard-container">
      {/* SideNavBar */}
      <aside className="sidebar">
        <div className="sidebar-logo-section">
          <img src="/logo.png" alt="Logo" style={{ height: '50px' }} />
        </div>
        <nav className="nav-links">
          <a className="nav-item" onClick={() => router.push('/UserDashboard')} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a className="nav-item active" href="#">
            <span className="material-symbols-outlined">style</span>
            <span>Card Collection</span>
          </a>
          <a className="nav-item" onClick={() => router.push('/UserProfile')} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">person</span>
            <span>My Profile</span>
          </a>
        </nav>
        <div className="sidebar-footer">
          <button className="upgrade-btn">Unlock All Designs</button>
          <a className="nav-item" onClick={() => router.push('/login')} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      <div className="main-wrapper">
        <main className="cards-page-container">
          <div className="cards-header">
            <h1>Signature Card Collection</h1>
            <p>World-class professional designs tailored to your identity.</p>
          </div>

          <div className="cards-grid">
            
            {/* 1. Premium Dark & Gold */}
            <CardWrapper id={1} flipped={flippedCards[1]} toggle={toggleFlip} back={data}>
              <div className="card-front t1-front">
                <img src={data.photo} className="card-photo" alt="" />
                <h2 className="c-name">{data.name}</h2>
                <span className="c-role" style={{letter-spacing: '4px'}}>{data.role}</span>
                <div style={{marginTop: '1rem', fontSize: '0.8rem', opacity: 0.8}}>
                  {data.mobile} • {data.website}
                </div>
              </div>
            </CardWrapper>

            {/* 2. Corporate Geometric */}
            <CardWrapper id={2} flipped={flippedCards[2]} toggle={toggleFlip} back={data}>
              <div className="card-front t2-front">
                <div className="t2-accent">
                  <img src={data.photo} style={{width: '70px', height: '70px', borderRadius: '12px', border: '3px solid #fff'}} alt="" />
                </div>
                <div className="t2-info">
                  <h2 className="c-name" style={{color: '#000080'}}>{data.name}</h2>
                  <span className="c-role">{data.role}</span>
                  <div className="c-detail"><span className="material-symbols-outlined" style={{fontSize: '1rem', color: '#000080'}}>call</span> {data.mobile}</div>
                  <div className="c-detail"><span className="material-symbols-outlined" style={{fontSize: '1rem', color: '#000080'}}>mail</span> {data.email}</div>
                </div>
              </div>
            </CardWrapper>

            {/* 3. Clean Minimalist */}
            <CardWrapper id={3} flipped={flippedCards[3]} toggle={toggleFlip} back={data}>
              <div className="card-front t3-front">
                <div className="t3-border"></div>
                <div className="t3-content">
                  <h2 className="c-name" style={{fontSize: '1.8rem'}}>{data.name}</h2>
                  <span className="c-role" style={{color: '#e11d48'}}>{data.role}</span>
                  <div style={{marginTop: '1.5rem'}}>
                    <div className="c-detail">{data.mobile}</div>
                    <div className="c-detail" style={{opacity: 0.6}}>{data.email}</div>
                    <div className="c-detail" style={{opacity: 0.6}}>{data.website}</div>
                  </div>
                </div>
              </div>
            </CardWrapper>

            {/* 4. Tech Gradient */}
            <CardWrapper id={4} flipped={flippedCards[4]} toggle={toggleFlip} back={data}>
              <div className="card-front t4-front">
                <div className="t4-mesh"></div>
                <div className="t4-content">
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h2 className="c-name">{data.name}</h2>
                    <span className="material-symbols-outlined" style={{color: '#00f2fe'}}>qr_code_2</span>
                  </div>
                  <span className="c-role" style={{color: '#00f2fe'}}>{data.role}</span>
                  <div style={{marginTop: 'auto'}}>
                    <p style={{fontSize: '0.75rem', marginBottom: '5px', opacity: 0.7}}>DIGITAL HUB • {new Date().getFullYear()}</p>
                    <div className="c-detail" style={{fontWeight: 700}}>{data.mobile}</div>
                  </div>
                </div>
              </div>
            </CardWrapper>

            {/* 5. Architectural Vertical */}
            <CardWrapper id={5} flipped={flippedCards[5]} toggle={toggleFlip} back={data}>
              <div className="card-front t5-front">
                <div className="t5-sidebar">
                  <div className="t5-v-text">ESTABLISHED 2024</div>
                </div>
                <div className="t5-main">
                  <h2 className="c-name">{data.name}</h2>
                  <span className="c-role">{data.role}</span>
                  <div style={{marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '1rem'}}>
                    <div className="c-detail">{data.mobile}</div>
                    <div className="c-detail">{data.email}</div>
                  </div>
                </div>
              </div>
            </CardWrapper>

            {/* 6. Creative Brush */}
            <CardWrapper id={6} flipped={flippedCards[6]} toggle={toggleFlip} back={data}>
              <div className="card-front t6-front">
                <div className="t6-circle"></div>
                <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
                  <img src={data.photo} className="card-photo" style={{width: '60px', height: '60px'}} alt="" />
                  <div className="info-group">
                    <h2 className="c-name">{data.name}</h2>
                    <span className="c-role">{data.role}</span>
                  </div>
                </div>
                <div style={{marginTop: 'auto'}}>
                  <p style={{fontSize: '0.7rem', color: '#666', marginBottom: '10px'}}>{data.bio}</p>
                  <div style={{display: 'flex', gap: '15px'}}>
                    <span className="c-detail" style={{fontWeight: 700}}>{data.mobile}</span>
                    <span className="c-detail">{data.website}</span>
                  </div>
                </div>
              </div>
            </CardWrapper>

            {/* 7. Slate Duo */}
            <CardWrapper id={7} flipped={flippedCards[7]} toggle={toggleFlip} back={data}>
              <div className="card-front t7-front">
                <img src={data.photo} className="t7-photo" alt="" />
                <div className="info-group">
                  <h2 className="c-name">{data.name}</h2>
                  <span className="c-role" style={{color: '#00f2fe', marginBottom: '0.5rem'}}>{data.role}</span>
                  <div className="c-detail">{data.mobile}</div>
                  <div className="c-detail">{data.email}</div>
                  <div className="c-detail" style={{opacity: 0.5}}>{data.address.split(',')[0]}</div>
                </div>
              </div>
            </CardWrapper>

            {/* 8. Neo-Modern Black */}
            <CardWrapper id={8} flipped={flippedCards[8]} toggle={toggleFlip} back={data}>
              <div className="card-front t8-front">
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                   <div className="info-group">
                      <h2 className="c-name" style={{fontSize: '2rem'}}>{data.name.split(' ')[0]}<br />{data.name.split(' ')[1]}</h2>
                      <span className="c-role" style={{marginTop: '5px'}}>{data.role}</span>
                   </div>
                   <div style={{textAlign: 'right'}}>
                      <div className="c-detail" style={{fontWeight: 900}}>{data.mobile}</div>
                      <div className="c-detail">{data.email}</div>
                      <div className="c-detail" style={{marginTop: '2rem'}}>PRISM DIGITAL • {new Date().getFullYear()}</div>
                   </div>
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
          <div className="back-layout">
            <div className="back-info">
              <h3 style={{fontSize: '1.2rem', fontWeight: 900, color: '#1e293b', marginBottom: '4px'}}>{back.name}</h3>
              <p style={{fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem'}}>{back.role}</p>
              
              <div className="c-detail">
                <span className="material-symbols-outlined" style={{fontSize: '1.1rem', color: '#1e293b'}}>call</span>
                <span style={{fontWeight: 700}}>{back.mobile}</span>
              </div>
              <div className="c-detail">
                <span className="material-symbols-outlined" style={{fontSize: '1.1rem', color: '#1e293b'}}>mail</span>
                {back.email}
              </div>
              <div className="c-detail">
                <span className="material-symbols-outlined" style={{fontSize: '1.1rem', color: '#1e293b'}}>location_on</span>
                {back.address}
              </div>
            </div>
            <div className="back-qr-zone">
              <span className="qr-tag">Scan for Profile</span>
              <img src={back.qr} alt="QR" />
              <span className="qr-tag" style={{color: '#00647b', fontWeight: 900}}>Prism Digital</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
