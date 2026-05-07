"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import "../../styles/Cards.css";

const templates = [
  { id: 1, name: "Vinkur Gold", class: "v1" },
  { id: 2, name: "Karan Blue Wave", class: "v2" },
  { id: 3, name: "Rahul Split", class: "v3" },
  { id: 4, name: "Rajesh Purple", class: "v4" },
  { id: 5, name: "Neha Emerald", class: "v5" },
  { id: 6, name: "Rohit Cyber", class: "v6" },
  { id: 7, name: "Pooja Swirl", class: "v7" },
  { id: 8, name: "Amit Tech", class: "v8" },
  { id: 9, name: "Anjali Eco", class: "v9" },
  { id: 10, name: "Siddharth Neon", class: "v10" },
  { id: 11, name: "Yash City", class: "v11" },
  { id: 12, name: "Manish Finance", class: "v12" },
  { id: 13, name: "Elite Gold", class: "t-gold-elite" },
  { id: 14, name: "Sky Mix", class: "t-blue-mix" },
  { id: 15, name: "Mint Fresh", class: "t-mint-mix" },
  { id: 16, name: "Crimson Night", class: "t-crimson-dark" },
  { id: 17, name: "Pure White", class: "t-white-pure" },
  { id: 18, name: "Slate Pro", class: "t-slate-modern" },
  { id: 19, name: "Sunset Glow", class: "t-sunset-glow" },
  { id: 20, name: "Eco Forest", class: "t-eco-forest" },
  { id: 21, name: "Neon Cyber", class: "t-neon-blue" },
  { id: 22, name: "Classic Leather", class: "t-leather-brown" },
  { id: 23, name: "Marble Elegant", class: "t-marble-white" },
  { id: 24, name: "Navy Corp", class: "t-corp-navy" },
  { id: 25, name: "Lavender Soft", class: "t-lavender" },
  { id: 26, name: "Charcoal Slate", class: "t-charcoal" },
  { id: 27, name: "Geometric Red", class: "t-geo-red" },
  { id: 28, name: "Orange Burst", class: "t-orange-burst" },
  { id: 29, name: "Tech Grid", class: "t-tech-mesh" },
  { id: 30, name: "Teal Ocean", class: "t-teal-wave" },
];

export default function CardsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const cardRefs = useRef({});

  useEffect(() => {
    // Inject html2canvas via CDN
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
      alert("Loading engine... Please try in 2 seconds.");
      return;
    }

    const cardElement = cardRefs.current[id];
    if (!cardElement) return;

    // Determine which face to capture
    const elementToCapture = side === 'front' 
      ? cardElement.querySelector('.p-card-front') 
      : cardElement.querySelector('.p-card-back');

    window.html2canvas(elementToCapture, {
      scale: 3, // High quality
      useCORS: true,
      backgroundColor: null,
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `BusinessCard_${id}_${side}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const data = {
    name: profile?.name || "Somendra Singh",
    role: profile?.designation || "Creative Director",
    email: profile?.email || "somendra@prismqr.com",
    mobile: profile?.mobile || "+91 63877 18208",
    website: "www.prismqr.com",
    address: profile?.address || "Gandhi Nagar, Konch, Jalaun, UP",
    photo: profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Somendra",
    qr: profile?.qrCodeUrl || profile?.qrCode || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PrismQR",
    company: "Prism Digital Solutions"
  };

  return (
    <div className="cards-screen-wrapper">
      <aside className="fixed-sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" style={{ height: '50px' }} />
        </div>
        <nav className="sidebar-nav">
          <a className="nav-link" onClick={() => router.push('/UserDashboard')}>
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a className="nav-link active">
            <span className="material-symbols-outlined">style</span>
            <span>Signature Series</span>
          </a>
          <a className="nav-link" onClick={() => router.push('/UserProfile')}>
            <span className="material-symbols-outlined">person</span>
            <span>My Profile</span>
          </a>
          <a className="nav-link logout" onClick={() => router.push('/login')}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      <div className="scrollable-content">
        <header className="content-header">
          <h1>Premium Business Cards</h1>
          <p>Professional grade designs with instant high-quality download.</p>
        </header>

        <div className="cards-grid-main">
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
      </div>
    </div>
  );
}

function CardWrapper({ id, flipped, toggle, data, templateClass, onDownload, innerRef }) {
  return (
    <div className={`premium-card-item ${flipped ? "is-flipped" : ""}`} ref={innerRef}>
      {/* Floating Download Buttons */}
      <div className="download-controls">
         <button className="dl-btn" onClick={(e) => onDownload(e, id, 'front')}>
           <span className="material-symbols-outlined">image</span> F
         </button>
         <button className="dl-btn" onClick={(e) => onDownload(e, id, 'back')}>
           <span className="material-symbols-outlined">image</span> B
         </button>
      </div>

      <div className="p-card-inner" onClick={() => toggle(id)}>
        {/* FRONT */}
        <div className={`p-card-front ${templateClass}`}>
          <div className="p-content">
            <div className="p-header">
               <img src={data.photo} className="p-avatar" alt="" />
               <div className="p-title-group">
                  <h2 className="p-name">{data.name}</h2>
                  <span className="p-role">{data.role}</span>
               </div>
            </div>
            <div className="p-details">
               <div className="p-row"><span className="material-symbols-outlined">call</span> {data.mobile}</div>
               <div className="p-row"><span className="material-symbols-outlined">mail</span> {data.email}</div>
               <div className="p-row"><span className="material-symbols-outlined">language</span> {data.website}</div>
            </div>
          </div>
          <div className="p-qr-box">
             <img src={data.qr} alt="QR" crossOrigin="anonymous" />
          </div>
        </div>

        {/* BACK */}
        <div className={`p-card-back ${templateClass}`}>
           <div className="back-layout">
              <div className="back-info">
                 <h3 className="back-name">{data.name}</h3>
                 <p className="back-role">{data.role}</p>
                 <div className="back-address">
                    <span className="material-symbols-outlined">location_on</span>
                    {data.address}
                 </div>
              </div>
              <div className="back-qr-zone">
                 <img src={data.qr} alt="QR" crossOrigin="anonymous" />
                 <span style={{fontSize: '0.5rem', fontWeight: 900}}>VERIFIED</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
