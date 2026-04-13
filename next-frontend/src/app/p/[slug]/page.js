"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import API from "../../../utils/api";
import "../../../styles/UserEditPublishProfile.css"; // Reuse existing styles

export default function PublicProfile() {
  const { slug } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (slug) {
      API.get(`/cards/${slug}`)
        .then(res => {
          setCard(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Card not found", err);
          setLoading(false);
        });
    }
  }, [slug]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7f9' }}>
      <div className="loader"></div>
    </div>
  );

  if (!card) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h2>Profile not found.</h2>
    </div>
  );

  const {
    name, designation, bio, themeColor, textColor, subTextColor, bgColor, avatar,
    mobile, showMobile, email, showEmail, address, showAddress, cardType,
    sectionOrder, links, products, projects, experience, languages, hobbies, dailyActivities, customHeadings,
    activePermission, showProjects, showProducts, showExperience, showDaily, showHobby, showLanguage
  } = card;

  const isLimited = activePermission === false || activePermission === 0;

  return (
    <div className="public-profile-view" style={{ 
      background: bgColor || '#fdfdfd', 
      minHeight: '100vh', 
      width: '100%',
      overflowX: 'hidden', 
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: textColor,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
      
      <style>{`
        .immersive-container {
          width: 100%;
          flex: 1;
          position: relative;
        }

        .hero-section {
          width: 100%;
          padding: 6rem 10% 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-sizing: border-box;
          background: ${bgColor}15;
          backdrop-filter: blur(10px);
        }

        .content-width {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .product-list-modern {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          padding: 2rem 0;
        }

        .product-card-premium {
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 1.5rem;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 4rem 1.5rem 3rem;
          }

          .product-list-modern {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .product-card-premium {
            flex-direction: row;
            height: auto;
            min-height: 100px;
            border-radius: 1.25rem;
            align-items: center;
            padding: 0.75rem;
            background: #fff;
            box-shadow: 0 4px 15px rgba(0,0,0,0.02);
            border: 1px solid #f5f5f5;
          }

          .product-card-premium img {
            width: 80px !important;
            height: 80px !important;
            border-radius: 1rem;
            object-fit: cover;
            flex-shrink: 0;
          }

          .product-data {
            padding: 0 1rem !important;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .p-name {
            font-size: 1.05rem !important;
            font-weight: 700 !important;
            margin-bottom: 4px !important;
          }

          .price-row-mobile {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          .out-of-stock-dim {
            opacity: 0.45;
            filter: grayscale(0.5);
            pointer-events: none;
          }
        }

        .reveal-anim {
          animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* Dynamic Ribbon */}
      <div style={{ 
        width: '100%', 
        padding: '0.85rem 5%', 
        background: 'rgba(255,255,255,0.95)', 
        backdropFilter: 'blur(20px)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: themeColor }}>waving_hand</span>
          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: subTextColor }}>Hi! {getGreeting()}</span>
        </div>
        <div style={{ fontWeight: 900, fontSize: '0.9rem', color: themeColor, fontFamily: 'monospace' }}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="immersive-container">
        
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="reveal-anim" style={{ 
            width: '160px', 
            height: '160px', 
            borderRadius: '50%', 
            padding: '4px', 
            background: 'white', 
            boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
            marginBottom: '1.5rem',
            border: `2px solid ${themeColor}15`
          }}>
            <img src={avatar || "https://via.placeholder.com/150"} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
          
          <h1 className="reveal-anim" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, margin: '0 0 0.5rem', color: textColor, letterSpacing: '-0.03em' }}>{name}</h1>
          <p className="reveal-anim" style={{ color: themeColor, fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '2rem' }}>{designation}</p>
          
          {(showMobile || showEmail || showAddress) && (
            <div className="reveal-anim" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {showMobile && mobile && (
                <a href={`tel:${mobile}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: subTextColor, fontWeight: 600, fontSize: '0.95rem' }}>
                  <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.1rem' }}>call</span> {mobile}
                </a>
              )}
              {showEmail && email && (
                <a href={`mailto:${email}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: subTextColor, fontWeight: 600, fontSize: '0.95rem' }}>
                  <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.1rem' }}>mail</span> {email}
                </a>
              )}
              {showAddress && address && (
                <div style={{ width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '8px', color: subTextColor, fontWeight: 600, fontSize: '0.95rem' }}>
                  <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.1rem' }}>location_on</span> {address}
                </div>
              )}
            </div>
          )}
          
          <p className="p-bio reveal-anim" style={{ fontSize: '1.1rem', lineHeight: 1.7, color: subTextColor, maxWidth: '700px', margin: '0 auto' }}>{bio}</p>
        </section>

        {/* CONTENT SECTIONS */}
        <main className="content-width" style={{ padding: '3rem 1.5rem' }}>
          
          {!isLimited && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              
              {/* Modern Links */}
              {links && links.length > 0 && links.some(l => l.isActive) && (
                <div className="reveal-anim" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.25rem' }}>
                  {links.filter(l => l.isActive).map((l, i) => (
                    <a key={i} href={l.content.startsWith('http') ? l.content : `https://${l.content}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '1.25rem', 
                        background: 'white', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
                        border: '1px solid #f0f0f0',
                        color: themeColor
                      }}>
                        {l.icon ? <img src={l.icon} style={{ width: '28px', height: '28px', objectFit: 'contain' }} /> : <span className="material-symbols-outlined" style={{ fontSize: '1.6rem' }}>link</span>}
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Dynamic Sections */}
              {sectionOrder.map(sectionKey => {
                if (cardType === 'shopkeeper' && ["projects", "experience", "hobbies"].includes(sectionKey)) return null;
                if (cardType === 'business' && sectionKey === "products") return null;

                if (sectionKey === "products" && showProducts && products && products.some(p => p.isActive)) {
                  return (
                    <div key="products" className="reveal-anim">
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', color: textColor, textAlign: 'center' }}>Featured Catalog</h2>
                      <div className="product-list-modern">
                        {products.filter(p => p.isActive).map((p, i) => (
                          <div key={i} className={`product-card-premium ${p.isOutOfStock ? 'out-of-stock-dim' : ''}`}>
                            <div style={{ position: 'relative', overflow: 'hidden' }}>
                               <img src={p.icon || "https://via.placeholder.com/400"} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                               {p.isOutOfStock && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.1rem' }}>SOLD OUT</div>}
                            </div>
                            <div className="product-data" style={{ padding: '1.25rem' }}>
                              <h3 className="p-name" style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 800 }}>{p.title}</h3>
                              <div className="price-row-mobile">
                                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: themeColor }}>₹{p.price}</span>
                                {p.offer > 0 && <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>{p.offer}% OFF</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (sectionKey === "experience" && showExperience && experience && experience.some(e => e.isActive)) {
                  return (
                    <div key="experience" className="reveal-anim">
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1.5rem', color: textColor }}>Professional History</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {experience.filter(e => e.isActive).map((e, i) => (
                          <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #f2f2f2' }}>
                            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{e.role}</h4>
                            <p style={{ color: themeColor, fontWeight: 700, fontSize: '0.95rem', margin: '4px 0' }}>{e.company}</p>
                            <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600 }}>{e.start} - {e.isCurrent ? "Present" : e.end}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return null;
              })}

            </div>
          )}

        </main>
      </div>

      {/* MINIMALIST FOOTER */}
      <footer style={{ 
        padding: '3rem 1.5rem', 
        textAlign: 'center', 
        background: 'transparent',
        borderTop: '1px solid #f0f0f0',
        marginTop: '2rem'
      }}>
        <p style={{ fontWeight: 800, color: themeColor, fontSize: '1rem', margin: 0 }}>Designed by Rajkumar</p>
        <p style={{ color: '#aaa', fontSize: '0.75rem', marginTop: '8px' }}>&copy; {new Date().getFullYear()} Digital Visiting Card Platform. All rights reserved.</p>
        <div style={{ marginTop: '1.5rem' }}>
          <a href="tel:6387718208" style={{ color: themeColor, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', border: `1.5px solid ${themeColor}`, padding: '8px 20px', borderRadius: '99px' }}>Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
