"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import "../../styles/Cards.css";

const templates = Array.from({ length: 45 }, (_, i) => {
  let category = "ld";
  if (i >= 15 && i < 30) category = "sc";
  if (i >= 30) category = "mc";

  return {
    id: i + 1,
    name: `Premium Card ${i + 1}`,
    class: `${category} m${i + 1}`,
    layoutType: `l${(i % 5) + 1}`, // Cycled through 5 unique layouts
    backType: (i % 3) + 1,
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
    }).catch((err) => console.error("Profile fetch error:", err));
  }, [router]);

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownload = (e, id, side) => {
    e.stopPropagation();
    if (!window.html2canvas) return alert("Loading engine...");

    const cardContainer = cardRefs.current[id];
    const target = side === 'front' 
      ? cardContainer.querySelector('.p-card-front') 
      : cardContainer.querySelector('.p-card-back');

    const originalTransform = target.style.transform;
    if (side === 'back') {
      target.style.transform = 'none';
      target.style.backfaceVisibility = 'visible';
    }

    window.html2canvas(target, { scale: 4, useCORS: true, backgroundColor: null }).then(canvas => {
      if (side === 'back') {
        target.style.transform = originalTransform;
        target.style.backfaceVisibility = 'hidden';
      }
      const link = document.createElement('a');
      link.download = `BusinessCard_${id}_${side}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const data = {
    name: profile?.name || "Somendra Singh",
    role: profile?.designation || "Creative UI Designer",
    email: profile?.email || "somendra@prismqr.com",
    mobile: profile?.mobile || "+91 63877 18208",
    website: "www.prismqr.com",
    address: profile?.address || "Building 4, Cyber City, Gurgaon, HR",
    photo: profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Somendra",
    qr: profile?.qrCodeUrl || profile?.qrCode || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PrismQR"
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Sync */}
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

      <div className="main-wrapper">
        <main className="cards-scroll-view">
          <div className="cards-header-section">
            <h1>Elite Signature Collection</h1>
            <p>45 Professional "Market-Ready" templates for your digital identity.</p>
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
                layoutType={t.layoutType}
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

function CardWrapper({ id, flipped, toggle, data, templateClass, layoutType, backType, onDownload, innerRef }) {
  return (
    <div className={`p-card-card ${flipped ? "is-flipped" : ""}`} ref={innerRef}>
      <div className="p-tools">
         <button onClick={(e) => onDownload(e, id, 'front')}>Front</button>
         <button onClick={(e) => onDownload(e, id, 'back')}>Back</button>
      </div>
      <div className="p-card-inner" onClick={() => toggle(id)}>
        <div className={`p-card-front ${templateClass} layout-${layoutType}`}>
           <FrontContent type={layoutType} data={data} />
        </div>
        <div className={`p-card-back ${templateClass} back-type-${backType}`}>
           <BackContent type={backType} data={data} />
           <div className="p-powered">POWERED BY PRISM QR</div>
        </div>
      </div>
    </div>
  );
}

function FrontContent({ type, data }) {
  if (type === 'l1') {
    return (
      <>
        <div className="p-card-body">
           <img src={data.photo} className="p-card-img" alt="" crossOrigin="anonymous" />
           <h2 className="p-card-name">{data.name}</h2>
           <span className="p-role">{data.role}</span>
           <div className="p-contact" style={{marginTop: 'auto'}}>
              <div>{data.mobile}</div>
              <div>{data.email}</div>
           </div>
        </div>
        <div className="p-card-qr-box" style={{marginRight: '1rem'}}>
           <img src={data.qr} alt="QR" crossOrigin="anonymous" />
        </div>
      </>
    );
  }
  if (type === 'l2') {
    return (
      <>
        <div className="p-sidebar">
           <img src={data.photo} className="p-card-img" alt="" crossOrigin="anonymous" />
           <div className="p-card-qr-box">
              <img src={data.qr} alt="QR" crossOrigin="anonymous" />
           </div>
        </div>
        <div className="p-main">
           <h2 className="p-card-name">{data.name}</h2>
           <span className="p-role">{data.role}</span>
           <div className="p-contact" style={{marginTop: '1rem'}}>
              <div>{data.mobile}</div>
              <div>{data.email}</div>
              <div>{data.website}</div>
           </div>
        </div>
      </>
    );
  }
  if (type === 'l3') {
    return (
      <div style={{width: '100%', textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
         <img src={data.photo} className="p-card-img" style={{marginBottom: '10px'}} alt="" crossOrigin="anonymous" />
         <h2 className="p-card-name">{data.name}</h2>
         <span className="p-role">{data.role}</span>
         <div className="p-card-qr-box" style={{marginTop: '15px'}}>
            <img src={data.qr} alt="QR" crossOrigin="anonymous" />
         </div>
      </div>
    );
  }
  if (type === 'l4') {
    return (
      <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
         <div style={{flex: 1, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
               <h2 className="p-card-name">{data.name}</h2>
               <span className="p-role">{data.role}</span>
            </div>
            <img src={data.photo} className="p-card-img" alt="" crossOrigin="anonymous" />
         </div>
         <div style={{height: '40px', background: 'rgba(255,255,255,0.1)', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6rem'}}>
            <span>{data.mobile}</span>
            <div className="p-card-qr-box" style={{width: '30px', height: '30px', padding: '2px'}}>
               <img src={data.qr} alt="QR" crossOrigin="anonymous" />
            </div>
         </div>
      </div>
    );
  }
  // Default to L5
  return (
    <div style={{padding: '1.2rem', display: 'flex', flexDirection: 'column', height: '100%'}}>
       <h2 className="p-card-name" style={{fontSize: '1.4rem'}}>{data.name}</h2>
       <span className="p-role">{data.role}</span>
       <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div className="p-contact">
             <div>{data.mobile}</div>
             <div>{data.email}</div>
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
             <img src={data.photo} className="p-card-img" style={{width: '35px', height: '35px'}} alt="" crossOrigin="anonymous" />
             <div className="p-card-qr-box" style={{width: '45px', height: '45px'}}>
                <img src={data.qr} alt="QR" crossOrigin="anonymous" />
             </div>
          </div>
       </div>
    </div>
  );
}

function BackContent({ type, data }) {
  if (type === 1) {
    return (
      <div className="back-type-1">
        <div className="back-qr-large">
          <img src={data.qr} alt="QR" crossOrigin="anonymous" />
        </div>
        <h3 className="back-name">{data.name}</h3>
        <span className="back-role">{data.role}</span>
        <div className="back-address">{data.address}</div>
      </div>
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
         <div className="back-qr-large">
            <img src={data.qr} alt="QR" crossOrigin="anonymous" />
         </div>
      </div>
    );
  }
  return (
    <div className="back-type-3">
       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
             <h3 className="back-name">{data.name}</h3>
             <span className="back-role">{data.role}</span>
          </div>
          <div className="back-qr-large" style={{width: '50px', height: '50px'}}>
             <img src={data.qr} alt="QR" crossOrigin="anonymous" />
          </div>
       </div>
       <div className="back-address">{data.address}</div>
    </div>
  );
}
