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
      background: bgColor || '#f0f4f8', 
      minHeight: '100vh', 
      overflowX: 'hidden', 
      fontFamily: "'Plus Jakarta Sans', sans-serif" 
    }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
      
      {/* Dynamic Ribbon */}
      <div style={{ 
        width: '100%', 
        padding: '0.75rem 5%', 
        background: 'rgba(255,255,255,0.85)', 
        backdropFilter: 'blur(15px)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: themeColor }}>waving_hand</span>
          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: subTextColor }}>Hi! {getGreeting()}</span>
        </div>
        <div style={{ fontWeight: 900, fontSize: '0.9rem', color: themeColor, fontFamily: 'monospace' }}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      <div className="web-preview-container" style={{ width: '100%', margin: '0 auto', background: bgColor, minHeight: '100vh' }}>
        
        {/* Profile Content - EXACT SAME AS PREVIEW */}
        <div className="web-preview-content reveal-anim" style={{ 
          background: 'white', 
          width: '100%',
          maxWidth: '1000px', 
          margin: '2rem auto', 
          padding: '4rem 2rem', 
          borderRadius: '2.5rem',
          boxShadow: '0 30px 60px rgba(0,0,0,0.05)',
          boxSizing: 'border-box'
        }}>
          
          <div className="web-profile-intro" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="preview-avatar circle reveal-anim" style={{ width: '160px', height: '160px', borderColor: themeColor, margin: '0 auto', border: `4px solid ${themeColor}` }}>
              <img src={avatar || "https://via.placeholder.com/150"} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <h1 className="reveal-anim" style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', marginTop: '2rem', fontWeight: 900, color: textColor, letterSpacing: '-0.02em' }}>{name}</h1>
            <p className="designation reveal-anim" style={{ color: themeColor, fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '0.5rem' }}>{designation}</p>
            
            {(showMobile || showEmail || showAddress) && (
              <div className="reveal-anim" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem' }}>
                {showMobile && mobile && (
                  <div className="contact-preview-item" style={{ color: subTextColor, gap: '0.5rem', fontWeight: 600 }}>
                    <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.2rem' }}>call</span>
                    {mobile}
                  </div>
                )}
                {showEmail && email && (
                  <div className="contact-preview-item" style={{ color: subTextColor, gap: '0.5rem', fontWeight: 600 }}>
                    <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.2rem' }}>mail</span>
                    {email}
                  </div>
                )}
                {showAddress && address && (
                  <div className="contact-preview-item" style={{ color: subTextColor, gap: '0.5rem', fontWeight: 600 }}>
                    <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.2rem' }}>location_on</span>
                    {address}
                  </div>
                )}
              </div>
            )}
            <p className="bio reveal-anim" style={{ fontSize: '1.1rem', marginTop: '2rem', maxWidth: '700px', margin: '2rem auto 0', lineHeight: 1.7, color: subTextColor, wordBreak: 'break-word' }}>{bio}</p>
          </div>

          {!isLimited && (
            <div className="preview-content-sections" style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
              
              {/* Social Links - Same as Preview */}
              {links && links.length > 0 && links.some(l => l.isActive) && (
                <div className="preview-links-grid" style={{ justifyContent: 'center' }}>
                  {links.filter(l => l.isActive).map((l, i) => (
                    <a key={i} href={l.content.startsWith('http') ? l.content : `https://${l.content}`} target="_blank" rel="noopener noreferrer" className="preview-link-circle" style={{ width: '64px', height: '64px', background: `${themeColor}12`, color: themeColor }}>
                      {l.icon ? <img src={l.icon} style={{ width: '30px', height: '30px', objectFit: 'contain' }} /> : <span className="material-symbols-outlined" style={{ fontSize: '1.8rem' }}>link</span>}
                    </a>
                  ))}
                </div>
              )}

              {/* Other sections - Same hierarchy as Preview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))', gap: '4rem' }}>
                {sectionOrder.map(sectionKey => {
                  if (cardType === 'shopkeeper' && ["projects", "experience", "hobbies"].includes(sectionKey)) return null;
                  if (cardType === 'business' && sectionKey === "products") return null;

                  if (sectionKey === "products" && showProducts && products && products.some(p => p.isActive)) {
                    return (
                      <div key="products" className="reveal-anim" style={{ gridColumn: '1 / -1' }}>
                        <h5 style={{ color: themeColor, fontSize: '1.4rem', borderBottom: `2px solid ${themeColor}15`, paddingBottom: '0.75rem', marginBottom: '2rem' }}>Product Catalog</h5>
                        <div className="web-product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                          {products.filter(p => p.isActive).map((p, i) => (
                            <div key={i} className="web-product-card" style={{ opacity: p.isOutOfStock ? 0.7 : 1, background: '#fcfcfc', border: '1px solid #f0f0f0' }}>
                              <div className="web-product-img" style={{ height: '240px' }}>
                                {p.icon ? <img src={p.icon} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#eee' }}>image</span>}
                              </div>
                              <div className="web-product-info" style={{ padding: '1.5rem' }}>
                                <p className="p-bold" style={{ color: textColor, fontSize: '1.2rem', fontWeight: 800 }}>{p.title}</p>
                                <div className="price-row" style={{ marginTop: '0.75rem' }}>
                                  <span className="current-price" style={{ color: themeColor, fontSize: '1.4rem', fontWeight: 900 }}>₹{p.price - (p.price * (p.offer || 0) / 100)}</span>
                                  {p.offer > 0 && <span className="original-price" style={{ fontSize: '0.9rem' }}>₹{p.price}</span>}
                                  {p.offer > 0 && <span className="product-tag offer" style={{ background: '#e8f5e9', color: '#2e7d32', fontWeight: 800 }}>{p.offer}% OFF</span>}
                                </div>
                                {p.isOutOfStock && <span className="product-tag out" style={{ background: '#ffebee', color: '#c62828', fontWeight: 800 }}>Out of Stock</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (sectionKey === "experience" && showExperience && experience && experience.some(e => e.isActive)) {
                    return (
                      <div key="experience" className="preview-list-section reveal-anim">
                        <h5 style={{ color: themeColor, fontSize: '1.3rem', marginBottom: '1.5rem' }}>Experience</h5>
                        {experience.filter(e => e.isActive).map((e, i) => (
                          <div key={i} className="mini-card-preview" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #f1f5f9' }}>
                            <p className="p-bold" style={{ fontWeight: 800, color: textColor, fontSize: '1.1rem' }}>{e.role}</p>
                            <p className="p-sub" style={{ color: subTextColor, marginTop: '0.25rem' }}>{e.company} • {e.start} - {e.isCurrent ? "Present" : e.end}</p>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  if (sectionKey === "projects" && showProjects && projects && projects.some(p => p.isActive)) {
                    return (
                      <div key="projects" className="preview-list-section reveal-anim">
                        <h5 style={{ color: themeColor, fontSize: '1.3rem', marginBottom: '1.5rem' }}>Projects</h5>
                        {projects.filter(p => p.isActive).map((p, i) => (
                          <div key={i} className="mini-card-preview" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #f1f5f9' }}>
                            <p className="p-bold" style={{ fontWeight: 800, color: textColor, fontSize: '1.1rem' }}>{p.title}</p>
                            <p className="p-sub" style={{ color: themeColor, fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>{p.type}</p>
                            <p style={{ color: subTextColor, fontSize: '0.95rem', lineHeight: 1.6, wordBreak: 'break-word' }}>{p.description}</p>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          )}

          <footer style={{ marginTop: '8rem', pt: '3rem', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
             <p style={{ fontWeight: 900, color: themeColor, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>Powered by Rajkumar</p>
             <div style={{ marginTop: '2rem' }}>
                <a href="tel:6387718208" style={{ background: themeColor, color: 'white', padding: '12px 32px', borderRadius: '99px', textDecoration: 'none', fontWeight: 800, boxShadow: `0 10px 25px ${themeColor}40` }}>Contact Help</a>
             </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
