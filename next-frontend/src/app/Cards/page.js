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

  const handleFullDownload = async (e, id) => {
    e.stopPropagation();
    if (!window.html2canvas) return alert("Engine loading...");
    
    const card = cardRefs.current[id];
    const front = card.querySelector('.p-card-front');
    const back = card.querySelector('.p-card-back');

    try {
      // 1. Capture Front
      const canvasF = await window.html2canvas(front, { scale: 4, useCORS: true, backgroundColor: null });

      // 2. Capture Back (with flip fix)
      const oldTransform = back.style.transform;
      back.style.transform = 'none';
      back.style.backfaceVisibility = 'visible';
      const canvasB = await window.html2canvas(back, { scale: 4, useCORS: true, backgroundColor: null });
      back.style.transform = oldTransform;
      back.style.backfaceVisibility = 'hidden';

      // 3. Combine into one Vertical Image
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = canvasF.width;
      finalCanvas.height = canvasF.height + canvasB.height + 40; // 40px gap
      const ctx = finalCanvas.getContext('2d');
      
      // Fill background (optional, but good for combined image)
      ctx.fillStyle = '#f8f9fb';
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      
      ctx.drawImage(canvasF, 0, 0);
      ctx.drawImage(canvasB, 0, canvasF.height + 40);

      const link = document.createElement('a');
      link.download = `FullCard_${id}.png`;
      link.href = finalCanvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download Error:", err);
    }
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
            <p>Export your identity in one click • Combined Front & Back High Quality.</p>
          </div>

          <div className="cards-grid-display">
            {allTemplates.map((t) => (
              <div key={t.id} className={`p-card-card ${flippedCards[t.id] ? "is-flipped" : ""}`} ref={el => cardRefs.current[t.id] = el}>
                <div className="p-tools">
                   <button 
                     onClick={(e) => handleFullDownload(e, t.id)} 
                     title="Download Combined Front & Back"
                     style={{display:'flex', alignItems:'center', gap:'4px'}}
                   >
                     <span className="material-symbols-outlined" style={{fontSize:'16px'}}>download</span>
                     Full Card
                   </button>
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
  const InfoBox = () => (
    <div className="p-info">
       <div><span className="material-symbols-outlined" style={{fontSize:'10px'}}>location_on</span> {data.address}</div>
       <div><span className="material-symbols-outlined" style={{fontSize:'10px'}}>call</span> {data.mobile}</div>
       <div><span className="material-symbols-outlined" style={{fontSize:'10px'}}>mail</span> {data.email}</div>
    </div>
  );

  if (layout === 'sig-l1' || layout === 'sig-l2' || layout === 'sig-l3' || layout === 'sig-l4') {
    return (
      <div style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
         <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
            <img src={data.photo} className="p-img" alt="" crossOrigin="anonymous" />
            <div className="p-qr"><img src={data.qr} alt="" crossOrigin="anonymous" /></div>
         </div>
         <div style={{overflow:'hidden'}}>
            <h2 className="p-name">{data.name}</h2>
            <span className="p-role">{data.role}</span>
            <InfoBox />
         </div>
      </div>
    );
  }

  if (layout === 1) return (
    <div className="l-wrap">
       <div className="l-main">
          <div style={{overflow:'hidden'}}>
             <h2 className="p-name">{data.name}</h2>
             <span className="p-role">{data.role}</span>
          </div>
          <InfoBox />
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
          <div style={{textAlign:'right', overflow:'hidden', maxWidth:'65%'}}>
             <h2 className="p-name">{data.name}</h2>
             <span className="p-role">{data.role}</span>
          </div>
       </div>
       <div style={{marginTop:'auto', display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
          <InfoBox />
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
          <span className="p-role" style={{marginBottom:0}}>{data.role}</span>
       </div>
       <div className="p-info" style={{opacity:0.8}}>
          <div>{data.mobile}</div>
          <div>{data.website}</div>
       </div>
    </div>
  );
}
