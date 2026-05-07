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

const standardTemplates = Array.from({ length: 45 }, (_, i) => {
  let cat = i < 15 ? "ld" : i < 30 ? "sc" : "mc";
  return {
    id: i + 1,
    class: `${cat} ${cat}${(i % 15) + 1}`,
    layout: (i % 4) + 1,
    back: (i % 3) + 1
  };
});

const allTemplates = [...signatureTemplates, ...standardTemplates];

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
    name: profile?.name || "Rajkumar Konch",
    role: profile?.designation || "Creative Professional",
    email: profile?.email || "konchshivam111@gmail.com",
    mobile: profile?.mobile || "6387718208",
    website: "www.prismqr.com",
    address: profile?.address || "Gandhi Nagar Konch",
    photo: profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Raj",
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
            <h1>Modern <span style={{color:'#2e5bff', fontStyle:'italic'}}>Signature</span> Collection</h1>
            <p>15 Signature Series exhibition followed by our professional catalog.</p>
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
                      <CardBack type={t.back || t.layout} data={data} themeClass={t.class} />
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
  // Signature Collection Layouts
  if (layout === 'sig-l1') return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
       <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
          <img src={data.photo} className="p-img" alt="" crossOrigin="anonymous" />
          <div className="p-qr"><img src={data.qr} alt="" crossOrigin="anonymous" /></div>
       </div>
       <div>
          <h2 className="p-name">{data.name}</h2>
          <span className="p-role">Creative Professional</span>
          <div className="p-info">
             <div><span className="material-symbols-outlined" style={{fontSize:'14px'}}>location_on</span> {data.address}</div>
             <div><span className="material-symbols-outlined" style={{fontSize:'14px'}}>call</span> {data.mobile}</div>
             <div><span className="material-symbols-outlined" style={{fontSize:'14px'}}>mail</span> {data.email}</div>
          </div>
       </div>
    </div>
  );
  if (layout === 'sig-l2') return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
       <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
          <img src={data.photo} className="p-img" alt="" crossOrigin="anonymous" />
          <div className="p-qr" style={{background:'rgba(255,255,255,0.8)'}}><img src={data.qr} alt="" crossOrigin="anonymous" /></div>
       </div>
       <div>
          <h2 className="p-name" style={{color:'#111'}}>{data.name}</h2>
          <div className="p-info" style={{color:'#333', marginTop:'8px'}}>
             <div>{data.address}</div>
             <div>{data.mobile} | {data.email}</div>
          </div>
       </div>
    </div>
  );
  if (layout === 'sig-l3') return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
       <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
          <div>
             <h2 className="p-name">{data.name}</h2>
             <span className="p-role">Executive Manager</span>
          </div>
          <img src={data.photo} className="p-img" style={{borderRadius:'8px', width:'45px', height:'45px'}} alt="" crossOrigin="anonymous" />
       </div>
       <div style={{display:'flex', justifyContent:'space-between', alignItems:'end'}}>
          <div className="p-info">
             <div>{data.address}</div>
             <div>{data.mobile}</div>
             <div>{data.email}</div>
          </div>
          <div className="p-qr" style={{width:'45px', height:'45px'}}><img src={data.qr} alt="" crossOrigin="anonymous" /></div>
       </div>
    </div>
  );
  // Default and Standard Layouts
  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
       <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
          <h2 className="p-name">{data.name}</h2>
          <img src={data.photo} className="p-img" alt="" crossOrigin="anonymous" />
       </div>
       <div style={{display:'flex', justifyContent:'space-between', alignItems:'end'}}>
          <div className="p-info">
             <span className="p-role" style={{marginBottom:'4px'}}>{data.role}</span>
             <div>{data.mobile}</div>
             <div>{data.email}</div>
          </div>
          <div className="p-qr"><img src={data.qr} alt="" crossOrigin="anonymous" /></div>
       </div>
    </div>
  );
}

function CardBack({ type, data, themeClass }) {
  const isSignature = typeof type === 'string' && type.startsWith('sig');
  
  if (isSignature) return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', gap:'12px'}}>
       <div className="p-qr" style={{width:'80px', height:'80px'}}><img src={data.qr} alt="" crossOrigin="anonymous" /></div>
       <div>
          <h2 className="p-name">{data.name}</h2>
          <span className="p-role" style={{marginBottom:0}}>{data.role}</span>
       </div>
       <div className="p-info" style={{opacity:0.8}}>
          <div>{data.mobile}</div>
          <div>{data.website}</div>
       </div>
    </div>
  );

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', gap:'10px'}}>
       <div className="p-qr" style={{width:'70px', height:'70px'}}><img src={data.qr} alt="" crossOrigin="anonymous" /></div>
       <h2 className="p-name">{data.name}</h2>
       <div className="p-info" style={{opacity:0.7}}>
          <div>{data.address}</div>
          <div>{data.website}</div>
       </div>
    </div>
  );
}
