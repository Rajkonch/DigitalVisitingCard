"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import "../../styles/Cards.css";

const templates = [
  { id: 1, name: "Matte Gold Luxury", class: "t-luxury-gold" },
  { id: 2, name: "Frosted Glass", class: "t-glassmorphism" },
  { id: 3, name: "Midnight Mesh", class: "t-midnight-mesh" },
  { id: 4, name: "Cyber Neon", class: "t-cyber-neon" },
  { id: 5, name: "Bauhaus Primary", class: "t-bauhaus" },
  { id: 6, name: "Carbon Pro", class: "t-carbon-pro" },
  { id: 7, name: "Minimalist Slate", class: "t-slate-clean" },
  { id: 8, name: "Clay Soft 3D", class: "t-claymorphism" },
  { id: 9, name: "Royal Leather", class: "t-leather" },
  { id: 10, name: "Brutalist Raw", class: "t-brutalist" },
  { id: 11, name: "Holographic Wave", class: "t-holographic" },
  { id: 12, name: "Oceanic Gradient", class: "t-oceanic" },
  { id: 13, name: "Eco Leaf", class: "t-eco-leaf" },
  { id: 14, name: "Space Orbit", class: "t-space-orbit" },
  { id: 15, name: "Retro Vibe", class: "t-retro" },
  { id: 16, name: "Marble Elegant", class: "t-marble" },
  { id: 17, name: "Sunset Glow", class: "t-sunset" },
  { id: 18, name: "Corporate Duo", class: "t-corp-duo" },
  { id: 19, name: "Minimal Dot", class: "t-minimal-dot" },
  { id: 20, name: "Elite Mono", class: "t-elite-mono" },
  { id: 21, name: "Prism Reflect", class: "t-prism-reflect" },
  { id: 22, name: "Deep Forest", class: "t-deep-forest" },
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

  const data = {
    name: profile?.name || "Somendra Singh",
    role: profile?.designation || "Product Architect",
    email: profile?.email || "somendra@prismqr.com",
    mobile: profile?.mobile || "+91 63877 18208",
    website: "www.prismqr.com",
    address: profile?.address || "Cyber Hub, Gurgaon, HR",
    photo: profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Somendra",
    qr: profile?.qrCodeUrl || profile?.qrCode || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PrismQR"
  };

  return (
    <div className="cards-screen-wrapper">
      {/* Fixed Sidebar */}
      <aside className="fixed-sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" style={{ height: '50px' }} />
        </div>
        <nav className="sidebar-nav">
          <div className="nav-group">
            <a className="nav-link" onClick={() => router.push('/UserDashboard')}>
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </a>
            <a className="nav-link active">
              <span className="material-symbols-outlined">style</span>
              <span>Designs</span>
            </a>
            <a className="nav-link" onClick={() => router.push('/UserProfile')}>
              <span className="material-symbols-outlined">person</span>
              <span>Profile</span>
            </a>
          </div>
          <div className="nav-footer">
            <a className="nav-link logout" onClick={() => router.push('/login')}>
              <span className="material-symbols-outlined">logout</span>
              <span>Sign Out</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Scrollable Content Area */}
      <div className="scrollable-content">
        <header className="content-header">
          <h1>2026 Signature Series</h1>
          <p>Over 20+ world-class digital visiting card templates.</p>
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CardWrapper({ id, flipped, toggle, data, templateClass }) {
  return (
    <div className={`premium-card-item ${flipped ? "is-flipped" : ""}`} onClick={() => toggle(id)}>
      <div className="p-card-inner">
        {/* FRONT */}
        <div className={`p-card-front ${templateClass}`}>
          <div className="design-element"></div>
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
          <div className="p-qr-small">
             <img src={data.qr} alt="QR" />
          </div>
        </div>

        {/* BACK */}
        <div className="p-card-back">
          <div className="back-wrap">
            <div className="back-info-side">
               <h3 className="back-name">{data.name}</h3>
               <p className="back-role">{data.role}</p>
               <div className="back-address">
                 <span className="material-symbols-outlined">location_on</span>
                 {data.address}
               </div>
            </div>
            <div className="back-qr-side">
               <img src={data.qr} className="large-qr" alt="QR" />
               <span className="qr-label">PRO MEMBER</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
