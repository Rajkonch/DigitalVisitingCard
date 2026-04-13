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
      color: textColor
    }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
      
      <style>{`
        .immersive-container {
          width: 100%;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }

        .hero-section {
          width: 100%;
          padding: 6rem 10% 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-sizing: border-box;
          background: ${bgColor}A0;
          backdrop-filter: blur(10px);
        }

        .content-width {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .product-list-modern {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2.5rem;
          padding: 2rem 0;
        }

        .product-card-premium {
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 2rem;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.03);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(0,0,0,0.02);
        }

        .product-card-premium:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
        }

        .tag-badge {
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 4rem 1.5rem 3rem;
          }

          .product-list-modern {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }

          .product-card-premium {
            flex-direction: row;
            height: 120px;
            border-radius: 1.5rem;
            align-items: center;
            padding: 0.75rem;
          }

          .product-card-premium img {
            width: 100px !important;
            height: 100px !important;
            border-radius: 1rem;
            object-fit: cover;
          }

          .product-data {
            padding: 0 1rem !important;
            flex: 1;
            overflow: hidden;
          }

          .p-name {
            font-size: 1.05rem !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .p-bio {
             font-size: 0.95rem !important;
             word-break: break-word;
             padding: 0 5%;
          }
        }

        .reveal-anim {
          animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* Dynamic Ribbon */}
      <div style={{ 
        width: '100%', 
        padding: '1rem 5%', 
        background: 'rgba(255,255,255,0.95)', 
        backdropFilter: 'blur(20px)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 30px rgba(0,0,0,0.04)',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.4rem', color: themeColor }}>waving_hand</span>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: subTextColor, letterSpacing: '-0.01em' }}>Hi! {getGreeting()}</span>
        </div>
        <div style={{ fontWeight: 900, fontSize: '1rem', color: themeColor, fontFamily: 'monospace' }}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="immersive-container">
        
        {/* HERO SECTION - Immersive Website Look */}
        <section className="hero-section">
          <div className="reveal-anim" style={{ 
            width: '180px', 
            height: '180px', 
            borderRadius: '50%', 
            padding: '8px', 
            background: 'white', 
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <img src={avatar || "https://via.placeholder.com/150"} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: `4px solid ${themeColor}10` }} />
          </div>
          
          <h1 className="reveal-anim" style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: 900, margin: '0 0 1rem', color: textColor, letterSpacing: '-0.04em', lineHeight: 0.9 }}>{name}</h1>
          <p className="reveal-anim" style={{ color: themeColor, fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '2.5rem' }}>{designation}</p>
          
          {(showMobile || showEmail || showAddress) && (
            <div className="reveal-anim" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
              {showMobile && mobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: subTextColor, fontWeight: 600 }}>
                  <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.3rem' }}>call</span> {mobile}
                </div>
              )}
              {showEmail && email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: subTextColor, fontWeight: 600 }}>
                  <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.3rem' }}>mail</span> {email}
                </div>
              )}
              {showAddress && address && (
                <div style={{ width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '10px', color: subTextColor, fontWeight: 600, fontSize: '1rem' }}>
                  <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.3rem' }}>location_on</span> {address}
                </div>
              )}
            </div>
          )}
          
          <p className="p-bio reveal-anim" style={{ fontSize: '1.2rem', lineHeight: 1.8, color: subTextColor, maxWidth: '800px', margin: '0 auto' }}>{bio}</p>
        </section>

        {/* CONTENT SECTIONS */}
        <main className="content-width" style={{ padding: '4rem 2rem' }}>
          
          {!isLimited && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
              
              {/* Links - Modern Pill design */}
              {links && links.length > 0 && links.some(l => l.isActive) && (
                <div className="reveal-anim" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
                  {links.filter(l => l.isActive).map((l, i) => (
                    <a key={i} href={l.content.startsWith('http') ? l.content : `https://${l.content}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <div style={{ 
                        width: '70px', 
                        height: '70px', 
                        borderRadius: '24px', 
                        background: 'white', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        border: '1px solid #f0f0f0',
                        color: themeColor,
                        transition: 'all 0.3s ease'
                      }}>
                        {l.icon ? <img src={l.icon} style={{ width: '32px', height: '32px', objectFit: 'contain' }} /> : <span className="material-symbols-outlined" style={{ fontSize: '1.8rem' }}>link</span>}
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
                      <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', color: textColor, textAlign: 'center', letterSpacing: '-0.03em' }}>Curated Store</h2>
                      <div className="product-list-modern">
                        {products.filter(p => p.isActive).map((p, i) => (
                          <div key={i} className="product-card-premium" style={{ opacity: p.isOutOfStock ? 0.6 : 1 }}>
                            <div style={{ position: 'relative' }}>
                               <img src={p.icon || "https://via.placeholder.com/400"} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                               {p.offer > 0 && <span style={{ position: 'absolute', top: '15px', left: '15px', background: themeColor, color: 'white' }} className="tag-badge">{p.offer}% OFF</span>}
                               {p.isOutOfStock && <span style={{ position: 'absolute', top: '15px', right: '15px', background: '#ff4b2b', color: 'white' }} className="tag-badge">Sold Out</span>}
                            </div>
                            <div className="product-data" style={{ padding: '2rem' }}>
                              <h3 className="p-name" style={{ margin: '0 0 1rem', fontSize: '1.4rem', fontWeight: 800 }}>{p.title}</h3>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: themeColor }}>₹{p.price}</span>
                                {!p.isOutOfStock && <button style={{ marginLeft: 'auto', background: themeColor, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Buy Now</button>}
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
                      <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '2.5rem', color: textColor }}>Professional Journey</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {experience.filter(e => e.isActive).map((e, i) => (
                          <div key={i} style={{ background: 'white', padding: '2.5rem', borderRadius: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f5f5f5' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{e.role}</h4>
                                    <p style={{ color: themeColor, fontWeight: 700, fontSize: '1.1rem', margin: '4px 0' }}>{e.company}</p>
                                </div>
                                <span style={{ background: '#f0f0f0', padding: '6px 16px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700 }}>{e.start} - {e.isCurrent ? "Present" : e.end}</span>
                            </div>
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

          <footer style={{ marginTop: '10rem', padding: '5rem 0', textAlign: 'center', background: '#f9f9f9', borderRadius: '4rem' }}>
             <h2 style={{ fontWeight: 900, color: themeColor, fontSize: '2.5rem', letterSpacing: '-0.04em' }}>Powered by Rajkumar</h2>
             <p style={{ color: subTextColor, fontSize: '1.1rem', marginTop: '1rem' }}>Building innovative digital experiences.</p>
             <div style={{ marginTop: '3rem' }}>
                <a href="tel:6387718208" style={{ background: `${themeColor}`, color: 'white', padding: '15px 45px', borderRadius: '99px', textDecoration: 'none', fontWeight: 800, fontSize: '1.1rem', boxShadow: `0 20px 40px ${themeColor}40` }}>Talk to Us</a>
             </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
