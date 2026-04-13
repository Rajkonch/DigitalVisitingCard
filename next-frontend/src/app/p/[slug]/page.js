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
      
      <style>{`
        .public-page-wrapper {
          width: 100%;
          max-width: 1000px;
          margin: 2rem auto;
          background: white;
          border-radius: 2.5rem;
          box-shadow: 0 30px 100px rgba(0,0,0,0.08);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .products-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .responsive-product-card {
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          border-radius: 1.5rem;
          overflow: hidden;
          border: 1px solid #f1f5f9;
        }

        .responsive-product-img {
          width: 100%;
          height: 240px;
          object-fit: cover;
        }

        .responsive-product-info {
          padding: 1.5rem;
        }

        @media (max-width: 768px) {
          .public-page-wrapper {
            margin: 0;
            border-radius: 0;
            box-shadow: none;
          }
          
          .web-preview-content {
            padding: 3rem 1.25rem !important;
          }

          .products-grid-container {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .responsive-product-card {
            flex-direction: row;
            height: 100px;
            border-radius: 1rem;
            align-items: center;
            padding: 0.75rem;
            background: rgba(255,255,255,0.7);
          }

          .responsive-product-img {
            width: 80px;
            height: 80px;
            border-radius: 0.75rem;
          }

          .responsive-product-info {
            padding: 0 1rem;
          }

          .responsive-product-info h4 {
            font-size: 1rem !important;
            margin-bottom: 0.25rem !important;
          }

          .current-price {
            font-size: 1.1rem !important;
          }
        }
      `}</style>
      
      {/* Dynamic Ribbon */}
      <div style={{ 
        width: '100%', 
        padding: '0.75rem 5%', 
        background: 'rgba(255,255,255,0.9)', 
        backdropFilter: 'blur(15px)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: themeColor }}>waving_hand</span>
          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: subTextColor }}>Hi! {getGreeting()}</span>
        </div>
        <div style={{ fontWeight: 900, fontSize: '0.9rem', color: themeColor }}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="public-page-wrapper">
        
        {/* Profile Content */}
        <div className="web-preview-content reveal-anim" style={{ padding: '4rem 2rem' }}>
          
          <div className="web-profile-intro" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="preview-avatar circle reveal-anim" style={{ width: '150px', height: '150px', borderColor: themeColor, margin: '0 auto', border: `4px solid ${themeColor}` }}>
              <img src={avatar || "https://via.placeholder.com/150"} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <h1 className="reveal-anim" style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', marginTop: '2rem', fontWeight: 900, color: textColor, letterSpacing: '-0.02em', lineHeight: 1 }}>{name}</h1>
            <p className="designation reveal-anim" style={{ color: themeColor, fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '0.5rem' }}>{designation}</p>
            
            {(showMobile || showEmail || showAddress) && (
              <div className="reveal-anim" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                {showMobile && mobile && (
                  <div className="contact-preview-item" style={{ color: subTextColor, gap: '0.5rem', fontWeight: 600 }}>
                    <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.1rem' }}>call</span>
                    {mobile}
                  </div>
                )}
                {showEmail && email && (
                  <div className="contact-preview-item" style={{ color: subTextColor, gap: '0.5rem', fontWeight: 600 }}>
                    <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.1rem' }}>mail</span>
                    {email}
                  </div>
                )}
                {showAddress && address && (
                   <div style={{ width: '100%', color: subTextColor, display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                     <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.1rem' }}>location_on</span>
                     {address}
                   </div>
                )}
              </div>
            )}
            <p className="bio reveal-anim" style={{ fontSize: '1.05rem', marginTop: '2rem', maxWidth: '700px', margin: '2rem auto 0', lineHeight: 1.7, color: subTextColor, wordBreak: 'break-word' }}>{bio}</p>
          </div>

          {!isLimited && (
            <div className="preview-content-sections" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              
              {/* Social Links */}
              {links && links.length > 0 && links.some(l => l.isActive) && (
                <div className="preview-links-grid" style={{ justifyContent: 'center' }}>
                  {links.filter(l => l.isActive).map((l, i) => (
                    <a key={i} href={l.content.startsWith('http') ? l.content : `https://${l.content}`} target="_blank" rel="noopener noreferrer" className="preview-link-circle" style={{ width: '60px', height: '60px', background: `${themeColor}12`, color: themeColor }}>
                      {l.icon ? <img src={l.icon} style={{ width: '28px', height: '28px', objectFit: 'contain' }} /> : <span className="material-symbols-outlined" style={{ fontSize: '1.6rem' }}>link</span>}
                    </a>
                  ))}
                </div>
              )}

              {/* Other sections with proper responsive class names */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                {sectionOrder.map(sectionKey => {
                  if (cardType === 'shopkeeper' && ["projects", "experience", "hobbies"].includes(sectionKey)) return null;
                  if (cardType === 'business' && sectionKey === "products") return null;

                  if (sectionKey === "products" && showProducts && products && products.some(p => p.isActive)) {
                    return (
                      <div key="products" className="reveal-anim">
                        <h5 style={{ color: themeColor, fontSize: '1.3rem', borderBottom: `2px solid ${themeColor}15`, paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Product Catalog</h5>
                        <div className="products-grid-container">
                          {products.filter(p => p.isActive).map((p, i) => (
                            <div key={i} className="responsive-product-card" style={{ opacity: p.isOutOfStock ? 0.7 : 1 }}>
                              <img src={p.icon || "https://via.placeholder.com/300"} className="responsive-product-img" />
                              <div className="responsive-product-info">
                                <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.15rem', color: textColor }}>{p.title}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span className="current-price" style={{ color: themeColor, fontSize: '1.25rem', fontWeight: 900 }}>₹{p.price}</span>
                                  {p.offer > 0 && <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>{p.offer}% OFF</span>}
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
                        <h5 style={{ color: themeColor, fontSize: '1.3rem', marginBottom: '1.5rem' }}>Experience</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {experience.filter(e => e.isActive).map((e, i) => (
                            <div key={i} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                              <p style={{ fontWeight: 800, color: textColor, margin: 0 }}>{e.role}</p>
                              <p style={{ color: subTextColor, fontSize: '0.9rem', margin: '4px 0' }}>{e.company} • {e.start} - {e.isCurrent ? "Present" : e.end}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (sectionKey === "projects" && showProjects && projects && projects.some(p => p.isActive)) {
                    return (
                      <div key="projects" className="reveal-anim">
                        <h5 style={{ color: themeColor, fontSize: '1.3rem', marginBottom: '1.5rem' }}>Projects</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {projects.filter(p => p.isActive).map((p, i) => (
                            <div key={i} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                              <p style={{ fontWeight: 800, color: textColor, margin: 0 }}>{p.title}</p>
                              <p style={{ color: themeColor, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>{p.type}</p>
                              <p style={{ color: subTextColor, fontSize: '0.9rem', lineHeight: 1.6 }}>{p.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          )}

          <footer style={{ marginTop: '6rem', pt: '3rem', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
             <p style={{ fontWeight: 900, color: themeColor, fontSize: '1.3rem' }}>Powered by Rajkumar</p>
             <div style={{ marginTop: '1.5rem' }}>
                <a href="tel:6387718208" style={{ background: themeColor, color: 'white', padding: '12px 30px', borderRadius: '99px', textDecoration: 'none', fontWeight: 800 }}>Contact Help</a>
             </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
