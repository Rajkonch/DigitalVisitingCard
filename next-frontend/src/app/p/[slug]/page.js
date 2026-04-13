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
        padding: '1rem 5%', 
        background: 'rgba(255,255,255,0.8)', 
        backdropFilter: 'blur(20px)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: themeColor }}>waving_hand</span>
          <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Hi! {getGreeting()}</span>
        </div>
        <div style={{ fontWeight: 900, fontSize: '1rem', color: themeColor }}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="web-preview-container" style={{ maxWidth: '800px', margin: '0 auto', background: 'white', minHeight: '100vh', boxShadow: '0 0 50px rgba(0,0,0,0.1)' }}>
        
        {/* Profile Header - Same as Preview */}
        <div className="web-preview-content reveal-anim" style={{ padding: '4rem 2rem' }}>
          <div className="web-profile-intro" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="preview-avatar circle" style={{ width: '150px', height: '150px', borderColor: themeColor, margin: '0 auto', border: `4px solid ${themeColor}` }}>
              <img src={avatar || "https://via.placeholder.com/150"} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <h1 style={{ fontSize: '2.5rem', marginTop: '1.5rem', fontWeight: 800, color: textColor }}>{name}</h1>
            <p className="designation" style={{ color: themeColor, fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{designation}</p>
            
            {(showMobile || showEmail || showAddress) && (
              <div className="contact-info-preview-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
                {showMobile && mobile && (
                  <div className="contact-preview-item" style={{ color: subTextColor, fontWeight: 600 }}>
                    <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.2rem' }}>call</span>
                    {mobile}
                  </div>
                )}
                {showEmail && email && (
                  <div className="contact-preview-item" style={{ color: subTextColor, fontWeight: 600 }}>
                    <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.2rem' }}>mail</span>
                    {email}
                  </div>
                )}
              </div>
            )}
            <p className="bio" style={{ fontSize: '1rem', marginTop: '1.5rem', maxWidth: '600px', margin: '1.5rem auto 0', lineHeight: 1.6, color: subTextColor, wordBreak: 'break-word' }}>{bio}</p>
          </div>

          {!isLimited && (
            <div className="preview-content-sections" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              
              {/* Links Grid - Same as Preview */}
              {links && links.length > 0 && links.some(l => l.isActive) && (
                <div className="preview-links-grid">
                  {links.filter(l => l.isActive).map((l, i) => (
                    <a key={i} href={l.content.startsWith('http') ? l.content : `https://${l.content}`} target="_blank" rel="noopener noreferrer" className="preview-link-circle" style={{ width: '56px', height: '56px', background: `${themeColor}15`, color: themeColor }}>
                      {l.icon ? <img src={l.icon} style={{ width: '28px', height: '28px', objectFit: 'contain' }} className="custom-icon" /> : <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>link</span>}
                    </a>
                  ))}
                </div>
              )}

              {/* Dynamic Content - Same structure as Preview */}
              {sectionOrder.map(sectionKey => {
                if (cardType === 'shopkeeper' && ["projects", "experience", "hobbies"].includes(sectionKey)) return null;
                if (cardType === 'business' && sectionKey === "products") return null;

                if (sectionKey === "products" && showProducts && products && products.some(p => p.isActive)) {
                  return (
                    <div key="products" className="preview-list-section reveal-anim">
                      <h5 style={{ color: themeColor, borderBottom: `2px solid ${themeColor}20`, paddingBottom: '0.5rem' }}>Product Catalog</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                        {products.filter(p => p.isActive).map((p, i) => (
                          <div key={i} className="mini-card-preview" style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #eee' }}>
                            <div style={{ height: '200px', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1rem' }}>
                              <img src={p.icon || "https://via.placeholder.com/300"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800 }}>{p.title}</h4>
                            <span style={{ color: themeColor, fontWeight: 900, fontSize: '1.2rem' }}>₹{p.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (sectionKey === "experience" && showExperience && experience && experience.some(e => e.isActive)) {
                  return (
                    <div key="experience" className="preview-list-section reveal-anim">
                      <h5 style={{ color: themeColor }}>Experience</h5>
                      {experience.filter(e => e.isActive).map((e, i) => (
                        <div key={i} className="mini-card-preview" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.25rem' }}>
                          <p className="p-bold" style={{ fontSize: '1rem' }}>{e.role}</p>
                          <p className="p-sub" style={{ fontSize: '0.85rem' }}>{e.company} • {e.start} - {e.isCurrent ? 'Present' : e.end}</p>
                        </div>
                      ))}
                    </div>
                  );
                }

                return null;
              })}

            </div>
          )}

          <footer style={{ marginTop: '6rem', pt: '3rem', borderTop: '1px solid #eee', textAlign: 'center' }}>
             <p style={{ fontWeight: 800, color: themeColor, fontSize: '1.2rem' }}>Powered by Rajkumar</p>
             <div style={{ marginTop: '1rem' }}>
                <a href="tel:6387718208" style={{ background: themeColor, color: 'white', padding: '10px 24px', borderRadius: '99px', textDecoration: 'none', fontWeight: 800 }}>Contact Help: 6387718208</a>
             </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
