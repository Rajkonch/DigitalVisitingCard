"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import "../../styles/Cards.css";

const templates = [
  { id: 1, name: "Modern Minimal", class: "t1-front" },
  { id: 2, name: "Dark Premium", class: "t2-front" },
  { id: 3, name: "Vibrant Gradient", class: "t3-front" },
  { id: 4, name: "Corporate Slash", class: "t4-front" },
  { id: 5, name: "Luxury Gold", class: "t5-front" },
  { id: 6, name: "Glassmorphism", class: "t6-front" },
  { id: 7, name: "Geometric Red", class: "t7-front" },
  { id: 8, name: "Eco Green", class: "t8-front" },
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
        } else {
          // If no card exists, maybe redirect to editor
          // router.push("/UserEditPublishProfile");
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

  const userData = {
    name: profile?.name || "Your Name",
    designation: profile?.designation || "Designation",
    mobile: profile?.mobile || "9876543210",
    photo: profile?.avatar || "https://via.placeholder.com/150",
    address: profile?.address || "123, Business Hub, City Centre, State, 560001",
    qr: profile?.qrCodeUrl || profile?.qrCode || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PrismQR",
  };

  return (
    <div className="dashboard-container">
      {/* SideNavBar */}
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
          <a className="nav-item active" href="#">
            <span className="material-symbols-outlined">style</span>
            <span>My Cards</span>
          </a>
        </nav>
        <div className="sidebar-footer">
          <a className="nav-item" onClick={() => router.push('/login')} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <main className="main-content">
          <div className="cards-header">
            <div>
              <h1 style={{fontSize: '2rem', fontWeight: 800}}>Digital Business Cards</h1>
              <p>Flip to see your QR and details.</p>
            </div>
            <button className="custom-card-btn" onClick={() => router.push("/UserEditPublishProfile")}>
              <span className="material-symbols-outlined">add_circle</span>
              Custom Card
            </button>
          </div>

          <div className="cards-grid">
            {templates.map((t) => (
              <div 
                key={t.id} 
                className={`card-wrapper ${flippedCards[t.id] ? "flipped" : ""}`}
                onClick={() => toggleFlip(t.id)}
              >
                <div className="card-inner">
                  {/* Front Side */}
                  <div className={`card-front ${t.class}`}>
                    <img src={userData.photo} alt="User" className="card-photo" />
                    <h2 className="card-name">{userData.name}</h2>
                    <p className="card-designation">{userData.designation}</p>
                    <div className="card-mobile">
                      <span className="material-symbols-outlined" style={{fontSize: '1rem'}}>call</span>
                      {userData.mobile}
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="card-back">
                    <div className="card-back-content">
                      <div className="back-left">
                        <p style={{fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem'}}>Contact Details</p>
                        <p className="back-address">
                          <span className="material-symbols-outlined" style={{fontSize: '0.9rem', verticalAlign: 'middle', marginRight: '4px'}}>location_on</span>
                          {userData.address}
                        </p>
                      </div>
                      <div className="back-right">
                        <img src={userData.qr} alt="QR" className="back-qr" />
                      </div>
                    </div>
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
