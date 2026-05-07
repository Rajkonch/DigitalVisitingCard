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
    address: profile?.address || "Building 4B, Cyber City, Gurgaon, HR",
    photo: profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Somendra",
    qr: profile?.qrCodeUrl || profile?.qrCode || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PrismQR",
    website: "www.prismqr.com",
    company: "Prism Digital Solutions"
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
            <span>My Designs</span>
          </a>
          <a className="nav-item" onClick={() => router.push('/UserProfile')} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">person</span>
            <span>Profile</span>
          </a>
        </nav>
        <div className="sidebar-footer">
          <button className="upgrade-btn">Get Premium</button>
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
            <p>Premium professional designs curated for your digital identity.</p>
          </div>

          <div className="cards-grid-two-col">
            
            {/* 1. Red & Black Wave */}
            <CardWrapper id={1} flipped={flippedCards[1]} toggle={toggleFlip} back={data}>
              <div className="card-front t1-front">
                <h2 className="c-name">{data.name}</h2>
                <span className="c-role" style={{color: '#e11d48'}}>{data.role}</span>
                <div style={{marginTop: '1.5rem'}}>
                  <div className="c-detail"><span className="material-symbols-outlined" style={{fontSize: '1rem'}}>call</span> {data.mobile}</div>
                  <div className="c-detail"><span className="material-symbols-outlined" style={{fontSize: '1rem'}}>mail</span> {data.email}</div>
                  <div className="c-detail"><span className="material-symbols-outlined" style={{fontSize: '1rem'}}>language</span> {data.website}</div>
                </div>
                <div className="t1-wave"></div>
                <div className="t1-qr-overlay">
                  <img src={data.qr} style={{width: '100%'}} alt="QR" />
                </div>
              </div>
            </CardWrapper>

            {/* 2. Minimalist Large QR */}
            <CardWrapper id={2} flipped={flippedCards[2]} toggle={toggleFlip} back={data}>
              <div className="card-front t2-front">
                <div className="t2-left">
                  <h2 className="c-name" style={{fontSize: '1.8rem'}}>{data.name}</h2>
                  <span className="c-role" style={{fontStyle: 'italic', color: '#666'}}>{data.role}</span>
                  <div style={{marginTop: '2rem'}}>
                    <div className="c-detail" style={{fontWeight: 700}}>{data.mobile}</div>
                    <div className="c-detail">{data.email}</div>
                    <div className="c-detail" style={{opacity: 0.7}}>{data.website}</div>
                  </div>
                </div>
                <div className="t2-right">
                  <img src={data.qr} className="t2-qr-large" alt="QR" />
                </div>
              </div>
            </CardWrapper>

            {/* 3. Green & Black Corporate */}
            <CardWrapper id={3} flipped={flippedCards[3]} toggle={toggleFlip} back={data}>
              <div className="card-front t3-front">
                <div className="t3-left">
                   <h2 className="c-name" style={{fontSize: '1.5rem', textAlign: 'center'}}>{data.name}</h2>
                   <span className="c-role">{data.role}</span>
                   <img src={data.qr} style={{width: '80px', marginTop: '1rem'}} alt="QR" />
                </div>
                <div className="t3-right">
                   <div className="t3-right-accent">
                      <span className="material-symbols-outlined" style={{marginRight: '10px'}}>apartment</span>
                      <span style={{fontWeight: 800, fontSize: '0.8rem'}}>{data.company}</span>
                   </div>
                   <div className="c-detail"><span className="material-symbols-outlined" style={{fontSize: '1rem'}}>location_on</span> {data.address}</div>
                   <div className="c-detail"><span className="material-symbols-outlined" style={{fontSize: '1rem'}}>call</span> {data.mobile}</div>
                   <div className="c-detail"><span className="material-symbols-outlined" style={{fontSize: '1rem'}}>language</span> {data.website}</div>
                </div>
              </div>
            </CardWrapper>

            {/* 4. Aviato Red Strip */}
            <CardWrapper id={4} flipped={flippedCards[4]} toggle={toggleFlip} back={data}>
              <div className="card-front t4-front">
                <div className="t4-top">
                  <img src={data.photo} className="card-photo" style={{width: '80px', height: '80px', borderRadius: '50%'}} alt="" />
                  <div className="info-group">
                    <div className="c-detail"><span className="material-symbols-outlined" style={{fontSize: '1rem'}}>call</span> {data.mobile}</div>
                    <div className="c-detail"><span className="material-symbols-outlined" style={{fontSize: '1rem'}}>mail</span> {data.email}</div>
                    <div className="c-detail" style={{fontSize: '0.7rem'}}><span className="material-symbols-outlined" style={{fontSize: '1rem'}}>location_on</span> {data.address}</div>
                  </div>
                </div>
                <div className="t4-bottom">
                  <div>
                    <h2 className="c-name" style={{fontSize: '1.2rem'}}>{data.name}</h2>
                    <span className="c-role" style={{fontSize: '0.65rem'}}>{data.role}</span>
                  </div>
                  <img src={data.qr} style={{width: '50px', background: '#fff', padding: '2px', borderRadius: '4px'}} alt="QR" />
                </div>
              </div>
            </CardWrapper>

            {/* 5. Teal Geometric */}
            <CardWrapper id={5} flipped={flippedCards[5]} toggle={toggleFlip} back={data}>
              <div className="card-front t5-front">
                <div className="t5-info">
                  <h2 className="c-name" style={{color: '#008080'}}>{data.name}</h2>
                  <span className="c-role">{data.role}</span>
                  <div style={{marginTop: '1rem'}}>
                    <div className="c-detail">{data.mobile}</div>
                    <div className="c-detail">{data.email}</div>
                    <div className="c-detail" style={{fontSize: '0.75rem'}}>{data.address}</div>
                  </div>
                </div>
                <div className="t5-accent">
                   <div style={{textAlign: 'center', color: '#fff'}}>
                      <img src={data.qr} style={{width: '70px', background: '#fff', padding: '3px', marginBottom: '10px'}} alt="QR" />
                      <p style={{fontSize: '0.6rem', fontWeight: 900}}>{data.company}</p>
                   </div>
                </div>
              </div>
            </CardWrapper>

            {/* 6. Luxury Gold */}
            <CardWrapper id={6} flipped={flippedCards[6]} toggle={toggleFlip} back={data}>
              <div className="card-front t6-front">
                <img src={data.photo} className="card-photo" style={{border: '2px solid #d4af37', marginBottom: '1rem'}} alt="" />
                <h2 className="c-name">{data.name}</h2>
                <span className="c-role">{data.role}</span>
                <div style={{marginTop: '1rem', fontSize: '0.8rem'}}>
                  {data.email} • {data.mobile}
                </div>
              </div>
            </CardWrapper>

            {/* 7. Tech Mesh */}
            <CardWrapper id={7} flipped={flippedCards[7]} toggle={toggleFlip} back={data}>
              <div className="card-front t7-front">
                <div className="t7-mesh"></div>
                <div style={{position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column'}}>
                  <h2 className="c-name">{data.name}</h2>
                  <span className="c-role" style={{color: '#00f2fe'}}>{data.role}</span>
                  <div style={{marginTop: 'auto'}}>
                    <div className="c-detail">{data.mobile}</div>
                    <div className="c-detail">{data.website}</div>
                  </div>
                </div>
              </div>
            </CardWrapper>

            {/* 8. Vertical Slate */}
            <CardWrapper id={8} flipped={flippedCards[8]} toggle={toggleFlip} back={data}>
              <div className="card-front t8-front">
                <img src={data.photo} className="card-photo" style={{width: '90px', height: '90px'}} alt="" />
                <div className="info-group">
                  <h2 className="c-name">{data.name}</h2>
                  <span className="c-role" style={{color: '#00f2fe'}}>{data.role}</span>
                  <div className="c-detail">{data.mobile}</div>
                  <div className="c-detail">{data.email}</div>
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
