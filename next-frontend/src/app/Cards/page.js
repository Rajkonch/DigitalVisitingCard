"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import "../../styles/Cards.css";

const templates = [
  { id: 1, name: "Premium Gold", class: "m1" },
  { id: 2, name: "Corporate Blue", class: "m2" },
  { id: 3, name: "Sunset Minimal", class: "m3" },
  { id: 4, name: "Tech Indigo", class: "m4" },
  { id: 5, name: "Emerald Luxe", class: "m5" },
  { id: 6, name: "Cyber Neon", class: "m6" },
  { id: 7, name: "Matte Slate", class: "m7" },
  { id: 8, name: "Industrial Carbon", class: "m8" },
  { id: 9, name: "Organic Green", class: "m9" },
  { id: 10, name: "Modern Purple", class: "m10" },
  { id: 11, name: "Glassmorphism", class: "m11" },
  { id: 12, name: "Bauhaus Bold", class: "m12" },
  { id: 13, name: "Royal Leather", class: "m13" },
  { id: 14, name: "Clean White", class: "m14" },
  { id: 15, name: "Oceanic Wave", class: "m15" },
  { id: 16, name: "Minimal Dot", class: "m16" },
  { id: 17, name: "Sunset Gradient", class: "m17" },
  { id: 18, name: "Deep Crimson", class: "m18" },
  { id: 19, name: "Holographic", class: "m19" },
  { id: 20, name: "Brutalist", class: "m20" },
  { id: 21, name: "Marble Elegant", class: "m21" },
  { id: 22, name: "Neon Violet", class: "m22" },
  { id: 23, name: "Sky Dual", class: "m23" },
  { id: 24, name: "Professional Grey", class: "m24" },
  { id: 25, name: "Eco Leaf", class: "m25" },
  { id: 26, name: "Space Glow", class: "m26" },
  { id: 27, name: "Retro Wave", class: "m27" },
  { id: 28, name: "Prism Reflect", class: "m28" },
  { id: 29, name: "Soft Clay", class: "m29" },
  { id: 30, name: "Financial Elite", class: "m30" },
];

export default function CardsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const cardRefs = useRef({});

  useEffect(() => {
    // Inject html2canvas CDN
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
      alert("Loading engine... Please wait 2 seconds.");
      return;
    }

    const cardContainer = cardRefs.current[id];
    const target = side === 'front' ? cardContainer.querySelector('.p-card-front') : cardContainer.querySelector('.p-card-back');

    // To prevent "inverted text" on the back side, we temporarily remove the flip transform
    const originalTransform = target.style.transform;
    if (side === 'back') {
      target.style.transform = 'none';
      target.style.backfaceVisibility = 'visible';
    }

    window.html2canvas(target, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: null,
    }).then(canvas => {
      // Restore styles
      if (side === 'back') {
        target.style.transform = originalTransform;
        target.style.backfaceVisibility = 'hidden';
      }
      
      const link = document.createElement('a');
      link.download = `Card_${id}_${side}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const data = {
    name: profile?.name || "Somendra Singh",
    role: profile?.designation || "Executive Product Manager",
    email: profile?.email || "somendra@prismqr.com",
    mobile: profile?.mobile || "+91 63877 18208",
    website: "www.prismqr.com",
    address: profile?.address || "Cyber Park, Gurgaon, HR, India",
    photo: profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Somendra",
    qr: profile?.qrCodeUrl || profile?.qrCode || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PrismQR"
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar - EXACT SAME as UserDashboard */}
      <aside className="sidebar">
        <div className="sidebar-logo-section">
          <img src="/logo.png" alt="Logo" style={{ height: '50px' }} />
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

      {/* Main Content */}
      <div className="main-wrapper">
        <main className="cards-scroll-container">
          <div className="cards-page-header">
            <h1>Elite Card Collection</h1>
            <p>30+ Handcrafted professional templates for your digital presence.</p>
          </div>

          <div className="cards-grid-auto">
            {templates.map((t) => (
              <CardWrapper 
                key={t.id} 
                id={t.id} 
                flipped={flippedCards[t.id]} 
                toggle={toggleFlip} 
                data={data}
                templateClass={t.class}
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

function CardWrapper({ id, flipped, toggle, data, templateClass, onDownload, innerRef }) {
  return (
    <div className={`p-card-container ${flipped ? "is-flipped" : ""}`} ref={innerRef}>
      <div className="p-dl-overlay">
         <button onClick={(e) => onDownload(e, id, 'front')}>Front</button>
         <button onClick={(e) => onDownload(e, id, 'back')}>Back</button>
      </div>
      <div className="p-card-inner" onClick={() => toggle(id)}>
        {/* FRONT */}
        <div className={`p-card-front ${templateClass}`}>
          <div className="p-design-area">
            <div className="p-info-box">
               <h2 className="p-name">{data.name}</h2>
               <span className="p-role">{data.role}</span>
               <div className="p-contact">
                 <div><span className="material-symbols-outlined">call</span> {data.mobile}</div>
                 <div><span className="material-symbols-outlined">mail</span> {data.email}</div>
                 <div><span className="material-symbols-outlined">language</span> {data.website}</div>
               </div>
            </div>
            <div className="p-graphic-side">
               <div className="p-photo-wrap">
                 <img src={data.photo} className="p-photo" alt="" crossOrigin="anonymous" />
               </div>
               <div className="p-qr-wrap">
                 <img src={data.qr} className="p-qr" alt="QR" crossOrigin="anonymous" />
               </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className={`p-card-back ${templateClass}`}>
           <div className="p-back-content">
              <h3 className="back-name">{data.name}</h3>
              <p className="back-role">{data.role}</p>
              <div className="back-qr-large">
                <img src={data.qr} alt="QR" crossOrigin="anonymous" />
              </div>
              <div className="back-address">{data.address}</div>
           </div>
        </div>
      </div>
    </div>
  );
}
