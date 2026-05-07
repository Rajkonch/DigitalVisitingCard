"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import "../../styles/Cards.css";

const templates = [
  // 1-15: LUXURY DARK (Mix of back types)
  ...Array.from({ length: 15 }, (_, i) => ({ id: i + 1, name: `Luxury Dark ${i + 1}`, class: `ld ld${i + 1}`, backType: (i % 4) + 1 })),
  // 16-30: SIMPLE COLORFUL
  ...Array.from({ length: 15 }, (_, i) => ({ id: i + 16, name: `Modern Color ${i + 1}`, class: `sc sc${i + 1}`, backType: (i % 4) + 1 })),
  // 31-45: MULTI-COLOR MIX
  ...Array.from({ length: 15 }, (_, i) => ({ id: i + 31, name: `Elite Mix ${i + 1}`, class: `mc mc${i + 1}`, backType: (i % 4) + 1 })),
];

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

  const handleDownload = (e, id, side) => {
    e.stopPropagation();
    if (!window.html2canvas) {
      alert("Loading engine... Try again in a moment.");
      return;
    }

    const cardContainer = cardRefs.current[id];
    const target = side === 'front' 
      ? cardContainer.querySelector('.p-card-front') 
      : cardContainer.querySelector('.p-card-back');

    const originalTransform = target.style.transform;
    if (side === 'back') {
      target.style.transform = 'none';
      target.style.backfaceVisibility = 'visible';
    }

    window.html2canvas(target, {
      scale: 4,
      useCORS: true,
      logging: false,
      backgroundColor: null,
    }).then(canvas => {
      if (side === 'back') {
        target.style.transform = originalTransform;
        target.style.backfaceVisibility = 'hidden';
      }
      const link = document.createElement('a');
      link.download = `PrismCard_${id}_${side}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const data = {
    name: profile?.name || "Somendra Singh",
    role: profile?.designation || "Creative UI/UX Designer",
    email: profile?.email || "somendra@prismqr.com",
    mobile: profile?.mobile || "+91 63877 18208",
    website: "www.prismqr.com",
    address: profile?.address || "Gandhi Nagar, Konch, Jalaun, UP, India",
    photo: profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Somendra",
    qr: profile?.qrCodeUrl || profile?.qrCode || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PrismQR"
  };

  return (
    <div className="dashboard-container">
      {/* SideNavBar - EXACT SAME AS USERDASHBOARD */}
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
          <button className="upgrade-btn">Upgrade Plan</button>
          <a className="nav-item" onClick={() => router.push('/login')} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      <div className="main-wrapper">
        <main className="cards-scroll-view">
          <div className="cards-header-section">
            <h1>Signature Premium Series</h1>
            <p>45 Professional handcrafted cards with varied front and back designs.</p>
          </div>

          <div className="cards-grid-display">
            {templates.map((t) => (
              <CardWrapper 
                key={t.id} 
                id={t.id} 
                flipped={flippedCards[t.id]} 
                toggle={toggleFlip} 
                data={data}
                templateClass={t.class}
                backType={t.backType}
                onDownload={handleDownload}
                innerRef={el => cardRefs.current[t.id] = el}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function CardWrapper({ id, flipped, toggle, data, templateClass, backType, onDownload, innerRef }) {
  return (
    <div className={`p-card-card ${flipped ? "is-flipped" : ""}`} ref={innerRef}>
      <div className="p-tools">
         <button onClick={(e) => onDownload(e, id, 'front')}>Image F</button>
         <button onClick={(e) => onDownload(e, id, 'back')}>Image B</button>
      </div>
      <div className="p-card-inner" onClick={() => toggle(id)}>
        {/* FRONT */}
        <div className={`p-card-front ${templateClass}`}>
           <div className="p-card-body">
              <div className="p-card-head">
                 <img src={data.photo} className="p-card-img" alt="" crossOrigin="anonymous" />
                 <div className="p-card-title">
                    <h2 className="p-card-name">{data.name}</h2>
                    <span className="p-card-role">{data.role}</span>
                 </div>
              </div>
              <div className="p-card-info">
                 <div><span className="material-symbols-outlined" style={{fontSize: '0.8rem'}}>call</span> {data.mobile}</div>
                 <div><span className="material-symbols-outlined" style={{fontSize: '0.8rem'}}>mail</span> {data.email}</div>
                 <div><span className="material-symbols-outlined" style={{fontSize: '0.8rem'}}>language</span> {data.website}</div>
              </div>
           </div>
           <div className="p-card-qr-side">
              <div className="p-card-qr-box">
                 <img src={data.qr} alt="QR" crossOrigin="anonymous" />
              </div>
           </div>
        </div>

        {/* BACK - Varied layouts */}
        <div className={`p-card-back ${templateClass} back-type-${backType}`}>
           <BackContent type={backType} data={data} />
           <div className="p-powered">POWERED BY PRISM QR</div>
        </div>
      </div>
    </div>
  );
}

function BackContent({ type, data }) {
  if (type === 1) {
    return (
      <>
        <div className="back-qr-large">
          <img src={data.qr} alt="QR" crossOrigin="anonymous" />
        </div>
        <h3 className="back-name">{data.name}</h3>
        <span className="back-role">{data.role}</span>
        <div className="back-address">{data.address}</div>
      </>
    );
  }
  if (type === 2) {
    return (
      <div className="back-type-2">
         <div className="back-info-side">
            <h3 className="back-name">{data.name}</h3>
            <span className="back-role">{data.role}</span>
            <div className="back-address">{data.address}</div>
         </div>
         <div className="back-qr-side">
            <img src={data.qr} alt="QR" crossOrigin="anonymous" />
         </div>
      </div>
    );
  }
  // Default to Type 3
  return (
    <>
      <div style={{ flex: 1 }}>
        <h3 className="back-name">{data.name}</h3>
        <span className="back-role">{data.role}</span>
        <div className="back-address">{data.address}</div>
      </div>
      <div className="back-qr-large" style={{ margin: 0 }}>
        <img src={data.qr} alt="QR" crossOrigin="anonymous" />
      </div>
    </>
  );
}
