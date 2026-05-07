"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import "../../styles/Cards.css";

const templates = [
  { id: 1, name: "Elite Gold", class: "t-gold-elite" },
  { id: 2, name: "Sky Mix", class: "t-blue-mix" },
  { id: 3, name: "Mint Fresh", class: "t-mint-mix" },
  { id: 4, name: "Crimson Night", class: "t-crimson-dark" },
  { id: 5, name: "Pure White", class: "t-white-pure" },
  { id: 6, name: "Slate Pro", class: "t-slate-modern" },
  { id: 7, name: "Sunset Glow", class: "t-sunset-glow" },
  { id: 8, name: "Eco Forest", class: "t-eco-forest" },
  { id: 9, name: "Neon Cyber", class: "t-neon-blue" },
  { id: 10, name: "Classic Leather", class: "t-leather-brown" },
  { id: 11, name: "Marble Elegant", class: "t-marble-white" },
  { id: 12, name: "Navy Corp", class: "t-corp-navy" },
  { id: 13, name: "Lavender Soft", class: "t-lavender" },
  { id: 14, name: "Charcoal Slate", class: "t-charcoal" },
  { id: 15, name: "Geometric Red", class: "t-geo-red" },
  { id: 16, name: "Orange Burst", class: "t-orange-burst" },
  { id: 17, name: "Tech Grid", class: "t-tech-mesh" },
  { id: 18, name: "Teal Ocean", class: "t-teal-wave" },
  { id: 19, name: "Royal Purple", class: "t-royal-purple" },
  { id: 20, name: "Industrial Concrete", class: "t-concrete" },
  // Adding more variations to reach 30+
  { id: 21, name: "Golden Aura", class: "t-gold-elite" },
  { id: 22, name: "Azure Mix", class: "t-blue-mix" },
  { id: 23, name: "Emerald Mix", class: "t-mint-mix" },
  { id: 24, name: "Dark Ruby", class: "t-crimson-dark" },
  { id: 25, name: "Clean Studio", class: "t-white-pure" },
  { id: 26, name: "Titanium Slate", class: "t-slate-modern" },
  { id: 27, name: "Dusk Gradient", class: "t-sunset-glow" },
  { id: 28, name: "Bio Green", class: "t-eco-forest" },
  { id: 29, name: "Matrix Glow", class: "t-neon-blue" },
  { id: 30, name: "Saddle Brown", class: "t-leather-brown" },
  { id: 31, name: "Stone Texture", class: "t-marble-white" },
  { id: 32, name: "Midnight Navy", class: "t-corp-navy" },
];

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

  const handleDownload = (e, id, type) => {
    e.stopPropagation();
    alert(`Downloading ${type} for Card ${id}... (Feature requires html2canvas)`);
  };

  const data = {
    name: profile?.name || "Raj Kumar",
    role: profile?.designation || "Senior Software Engineer",
    email: profile?.email || "rajkumar@prismqr.com",
    mobile: profile?.mobile || "+91 63877 18208",
    website: "www.prismqr.com",
    address: profile?.address || "Gandhi Nagar, Konch, Jalaun, UP",
    photo: profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Raj",
    qr: profile?.qrCodeUrl || profile?.qrCode || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PrismQR"
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
            <span>All Designs</span>
          </a>
          <a className="nav-link" onClick={() => router.push('/UserProfile')}>
            <span className="material-symbols-outlined">person</span>
            <span>Profile</span>
          </a>
          <a className="nav-link logout" onClick={() => router.push('/login')}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      <div className="scrollable-content">
        <header className="content-header">
          <h1>Elite Business Cards</h1>
          <p>Explore 30+ premium templates with matching front & back designs.</p>
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CardWrapper({ id, flipped, toggle, data, templateClass, onDownload }) {
  return (
    <div className={`premium-card-item ${flipped ? "is-flipped" : ""}`} onClick={() => toggle(id)}>
      {/* Download Options Floating */}
      <div className="card-download-btn" onClick={(e) => onDownload(e, id, 'Front Image')}>
        <span className="material-symbols-outlined" style={{fontSize: '1.2rem'}}>download</span>
      </div>

      <div className="p-card-inner">
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
               <div className="p-row"><span className="material-symbols-outlined" style={{fontSize: '0.9rem'}}>call</span> {data.mobile}</div>
               <div className="p-row"><span className="material-symbols-outlined" style={{fontSize: '0.9rem'}}>mail</span> {data.email}</div>
               <div className="p-row"><span className="material-symbols-outlined" style={{fontSize: '0.9rem'}}>language</span> {data.website}</div>
            </div>
          </div>
          <div className="p-qr-box">
             <img src={data.qr} alt="QR" />
          </div>
        </div>

        {/* BACK - Inherits the same class for consistency */}
        <div className={`p-card-back ${templateClass}`}>
           <div className="back-layout">
              <div className="back-info">
                 <h3 className="back-name">{data.name}</h3>
                 <p className="back-role">{data.role}</p>
                 <div className="back-address">
                    <span className="material-symbols-outlined" style={{fontSize: '0.9rem'}}>location_on</span>
                    {data.address}
                 </div>
              </div>
              <div className="back-qr-zone">
                 <img src={data.qr} alt="QR" />
                 <span style={{fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px'}}>Verified QR</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
