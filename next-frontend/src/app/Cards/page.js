"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import "../../styles/Cards.css";

const templates = Array.from({ length: 45 }, (_, i) => {
  let cat = "ld";
  if (i >= 15) cat = "sc";
  if (i >= 30) cat = "mc";
  return {
    id: i + 1,
    cat: cat,
    class: `${cat} ${cat}${ (i % 15) + 1 }`,
    layout: (i % 4) + 1,
    back: (i % 3) + 1
  };
});

export default function CardsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const cardRefs = useRef({});

  useEffect(() => {
    // Inject html2canvas
    const script = document.createElement("script");
    script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
    script.async = true;
    document.body.appendChild(script);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    API.get("/cards/my").then((res) => {
      if (res.data && res.data.length > 0) setProfile(res.data[0]);
    }).catch((err) => console.error(err));
  }, [router]);

  const toggleFlip = (id) => {
    setFlippedCards(p => ({ ...p, [id]: !p[id] }));
  };

  const handleDownload = (e, id, side) => {
    e.stopPropagation();
    if (!window.html2canvas) return alert("Engine loading...");
    const card = cardRefs.current[id];
    const target = side === 'front' ? card.querySelector('.p-card-front') : card.querySelector('.p-card-back');
    
    const oldTransform = target.style.transform;
    if (side === 'back') { target.style.transform = 'none'; target.style.backfaceVisibility = 'visible'; }

    window.html2canvas(target, { scale: 4, useCORS: true, backgroundColor: null }).then(canvas => {
      if (side === 'back') { target.style.transform = oldTransform; target.style.backfaceVisibility = 'hidden'; }
      const link = document.createElement('a');
      link.download = `BusinessCard_${id}_${side}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const data = {
    name: profile?.name || "Rajkumar Konch",
    role: profile?.designation || "Creative UI/UX Architect",
    email: profile?.email || "rajkumar@prismqr.com",
    mobile: profile?.mobile || "+91 63877 18208",
    website: "www.prismqr.com",
    address: profile?.address || "Gandhi Nagar, Konch, Jalaun, UP",
    photo: profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Raj",
    qr: profile?.qrCodeUrl || profile?.qrCode || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PrismQR"
  };

  return (
    <div className="dashboard-container">
      {/* FIXED SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
          </div>
        </div>
        <nav className="nav-links">
          <a className="nav-item" onClick={() => router.push('/UserDashboard')} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </a>
          <a className="nav-item" onClick={() => router.push('/UserProfile')} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">person</span>
            <span>Profile</span>
          </a>
          <a className="nav-item active">
            <span className="material-symbols-outlined">style</span>
            <span>My Cards</span>
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

      {/* SCROLLABLE CONTENT */}
      <div className="main-wrapper">
        <main className="cards-scroll-view">
          <div className="cards-header-section">
            <h1>Signature Collection 2026</h1>
            <p>45 Premium business card templates • 85×55mm Standard • High Quality Export</p>
          </div>

          <div className="cards-grid-display">
            {templates.map((t) => (
              <div key={t.id} className={`p-card-card ${flippedCards[t.id] ? "is-flipped" : ""}`} ref={el => cardRefs.current[t.id] = el}>
                <div className="p-tools">
                   <button onClick={(e) => handleDownload(e, t.id, 'front')}>F</button>
                   <button onClick={(e) => handleDownload(e, t.id, 'back')}>B</button>
                </div>
                <div className="p-card-inner" onClick={() => toggleFlip(t.id)}>
                   {/* FRONT */}
                   <div className={`p-card-front ${t.class}`}>
                      <CardFront layout={t.layout} data={data} />
                   </div>
                   {/* BACK */}
                   <div className={`p-card-back ${t.class} back-type-${t.back}`}>
                      <CardBack type={t.back} data={data} />
                      <div className="p-powered">POWERED BY PRISM QR</div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function CardFront({ layout, data }) {
  // Layout 1: Split Side
  if (layout === 1) return (
    <div className="l-wrap">
       <div className="l-main">
          <div>
             <h2 className="p-name">{data.name}</h2>
             <span className="p-role">{data.role}</span>
          </div>
          <div className="p-contact">
             <div><span className="material-symbols-outlined" style={{fontSize:'0.8rem'}}>call</span> {data.mobile}</div>
             <div><span className="material-symbols-outlined" style={{fontSize:'0.8rem'}}>mail</span> {data.email}</div>
          </div>
       </div>
       <div className="l-side">
          <img src={data.photo} className="p-card-img" alt="" crossOrigin="anonymous" />
          <div className="p-card-qr-box">
             <img src={data.qr} alt="QR" crossOrigin="anonymous" />
          </div>
       </div>
    </div>
  );
  // Layout 2: Vertical Banner
  if (layout === 2) return (
    <div className="l-wrap" style={{flexDirection: 'column'}}>
       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <img src={data.photo} className="p-card-img" alt="" crossOrigin="anonymous" />
          <div style={{textAlign: 'right'}}>
             <h2 className="p-name">{data.name}</h2>
             <span className="p-role">{data.role}</span>
          </div>
       </div>
       <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div className="p-contact">
             <div>{data.mobile}</div>
             <div>{data.website}</div>
          </div>
          <div className="p-card-qr-box" style={{width: '50px', height: '50px'}}>
             <img src={data.qr} alt="QR" crossOrigin="anonymous" />
          </div>
       </div>
    </div>
  );
  // Layout 3: Center Minimal
  if (layout === 3) return (
    <div className="l-wrap" style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
       <img src={data.photo} className="p-card-img" style={{marginBottom: '8px'}} alt="" crossOrigin="anonymous" />
       <h2 className="p-name">{data.name}</h2>
       <span className="p-role">{data.role}</span>
       <div className="p-card-qr-box" style={{marginTop: '10px', width: '45px', height: '45px'}}>
          <img src={data.qr} alt="QR" crossOrigin="anonymous" />
       </div>
    </div>
  );
  // Default: Modern Split
  return (
    <div className="l-wrap">
       <div className="l-main">
          <h2 className="p-name" style={{fontSize: '1.4rem'}}>{data.name}</h2>
          <span className="p-role" style={{marginBottom: '2rem'}}>{data.role}</span>
          <div className="p-contact">
             <div>{data.mobile}</div>
             <div>{data.email}</div>
          </div>
       </div>
       <div style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center'}}>
          <div className="p-card-qr-box">
             <img src={data.qr} alt="QR" crossOrigin="anonymous" />
          </div>
          <img src={data.photo} className="p-card-img" style={{width: '40px', height: '40px'}} alt="" crossOrigin="anonymous" />
       </div>
    </div>
  );
}

function CardBack({ type, data }) {
  if (type === 1) return (
    <div className="back-type-1" style={{display:'flex', flexDirection:'column', height:'100%'}}>
       <div className="back-qr-l" style={{margin: 'auto auto 10px auto'}}>
          <img src={data.qr} alt="QR" crossOrigin="anonymous" />
       </div>
       <h3 className="back-title">{data.name}</h3>
       <p className="back-desc">{data.role}</p>
       <div className="back-addr" style={{marginTop: 'auto'}}>{data.address}</div>
    </div>
  );
  if (type === 2) return (
    <div className="back-type-2" style={{height:'100%'}}>
       <div style={{flex: 1}}>
          <h3 className="back-title">{data.name}</h3>
          <p className="back-desc">{data.role}</p>
          <div className="back-addr">{data.address}</div>
       </div>
       <div className="back-qr-l">
          <img src={data.qr} alt="QR" crossOrigin="anonymous" />
       </div>
    </div>
  );
  return (
    <div className="back-type-3" style={{display:'flex', flexDirection:'column', height:'100%'}}>
       <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <h3 className="back-title">{data.name}</h3>
          <div className="back-qr-l" style={{width: '50px', height: '50px'}}>
             <img src={data.qr} alt="QR" crossOrigin="anonymous" />
          </div>
       </div>
       <div style={{marginTop: 'auto'}}>
          <p className="back-desc" style={{marginBottom: '5px'}}>{data.role}</p>
          <div className="back-addr">{data.address}</div>
       </div>
    </div>
  );
}
