"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import "../../styles/Cards.css";

const signatureTemplates = Array.from({ length: 15 }, (_, i) => ({
  id: `sig-${i + 1}`,
  class: `sig${i + 1}`,
  layout: `sig-l${i + 1}`,
  back: `sig-b${i + 1}`
}));

const colorfulTemplates = Array.from({ length: 15 }, (_, i) => ({
  id: `sc-${i + 1}`,
  class: `sc${i + 1}`,
  layout: (i % 4) + 1,
  back: (i % 3) + 1
}));

const darkTemplates = Array.from({ length: 15 }, (_, i) => ({
  id: `ld-${i + 1}`,
  class: `ld${i + 1}`,
  layout: (i % 4) + 1,
  back: (i % 3) + 1
}));

const allTemplates = [...signatureTemplates, ...colorfulTemplates, ...darkTemplates];

export default function CardsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const cardRefs = useRef({});

  useEffect(() => {
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
    name: profile?.name || "Shivam Kushwaha",
    role: profile?.designation || "Creative Professional",
    email: profile?.email || "Shivam1999kushwahaji@gmail.com",
    mobile: profile?.mobile || "+91 9682499470",
    website: "www.prismqr.com",
    address: profile?.address || "Gandhi Nagar konch Jalaun 285205, UP",
    photo: profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Shivam",
    qr: profile?.qrCodeUrl || profile?.qrCode || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PrismQR"
  };

  return (
    <div className="dashboard-container">
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
        <div className="sidebar-footer" style={{marginTop: 'auto'}}>
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
            <div style={{display:'inline-flex', alignItems:'center', gap:'4px', padding:'4px 12px', background:'rgba(46, 91, 255, 0.1)', border:'1px solid rgba(46, 91, 255, 0.2)', borderRadius:'100px', marginBottom:'16px'}}>
               <span style={{width:'8px', height:'8px', background:'#2e5bff', borderRadius:'50%'}}></span>
               <span style={{fontSize:'12px', fontWeight:'600', color:'#2e5bff', letterSpacing:'1px'}}>PREMIUM GALLERY</span>
            </div>
            <h1>Signature Series <span style={{color:'#2e5bff', fontStyle:'italic'}}>2026</span></h1>
            <p>45 Unique high-fidelity templates arranged professionally in 85x55mm.</p>
          </div>

          <div className="cards-grid-display">
            {allTemplates.map((t) => (
              <div key={t.id} className={`p-card-card ${flippedCards[t.id] ? "is-flipped" : ""}`} ref={el => cardRefs.current[t.id] = el}>
                <div className="p-tools">
                   <button onClick={(e) => handleDownload(e, t.id, 'front')}>F</button>
                   <button onClick={(e) => handleDownload(e, t.id, 'back')}>B</button>
                </div>
                <div className="p-card-inner" onClick={() => toggleFlip(t.id)}>
                   <div className={`p-card-front ${t.class}`}>
                      <CardFront layout={t.layout} data={data} />
                   </div>
                   <div className={`p-card-back ${t.class}`}>
                      <CardBack type={t.back || t.layout} data={data} />
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
  if (layout === 'sig-l1' || layout === 'sig-l2') return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
       <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
          <img src={data.photo} className="p-img" alt="" crossOrigin="anonymous" />
          <div className="p-qr"><img src={data.qr} alt="" crossOrigin="anonymous" /></div>
       </div>
       <div>
          <h2 className="p-name">{data.name}</h2>
          <span className="p-role">Creative Professional</span>
          <div className="p-info">
             <div>{data.address}</div>
             <div>{data.mobile}</div>
             <div>{data.email}</div>
          </div>
       </div>
    </div>
  );
  if (layout === 'sig-l3' || layout === 'sig-l4') return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
       <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
          <div>
             <h2 className="p-name">{data.name}</h2>
             <span className="p-role">Executive Manager</span>
          </div>
          <img src={data.photo} className="p-img" style={{borderRadius:'8px'}} alt="" crossOrigin="anonymous" />
       </div>
       <div style={{display:'flex', justifyContent:'space-between', alignItems:'end'}}>
          <div className="p-info">
             <div>{data.address}</div>
             <div>{data.mobile}</div>
          </div>
          <div className="p-qr"><img src={data.qr} alt="" crossOrigin="anonymous" /></div>
       </div>
    </div>
  );

  // Standard Catalog Layouts
  if (layout === 1) return (
    <div className="l-wrap">
       <div className="l-main">
          <div style={{overflow:'hidden'}}>
             <h2 className="p-name">{data.name}</h2>
             <span className="p-role">Product Specialist</span>
          </div>
          <div className="p-info">
             <div>{data.mobile}</div>
             <div>{data.email}</div>
          </div>
       </div>
       <div className="l-side">
          <img src={data.photo} className="p-img" alt="" crossOrigin="anonymous" />
          <div className="p-qr"><img src={data.qr} alt="" crossOrigin="anonymous" /></div>
       </div>
    </div>
  );

  return (
    <div className="l-wrap" style={{flexDirection:'column'}}>
       <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <img src={data.photo} className="p-img" alt="" crossOrigin="anonymous" />
          <div style={{textAlign:'right'}}>
             <h2 className="p-name">{data.name}</h2>
             <span className="p-role">Tech Consultant</span>
          </div>
       </div>
       <div style={{marginTop:'auto', display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
          <div className="p-info">
             <div>{data.mobile}</div>
             <div>{data.email}</div>
          </div>
          <div className="p-qr"><img src={data.qr} alt="" crossOrigin="anonymous" /></div>
       </div>
    </div>
  );
}

function CardBack({ type, data }) {
  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', gap:'8px'}}>
       <div className="p-qr" style={{width:'80px', height:'80px'}}><img src={data.qr} alt="" crossOrigin="anonymous" /></div>
       <div>
          <h2 className="p-name">{data.name}</h2>
          <span className="p-role" style={{marginBottom:0}}>Creative Identity</span>
       </div>
       <div className="p-info" style={{opacity:0.8}}>
          <div>{data.mobile}</div>
          <div>{data.website}</div>
       </div>
    </div>
  );
}
