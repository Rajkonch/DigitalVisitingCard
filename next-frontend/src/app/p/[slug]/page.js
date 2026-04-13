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
      
      {/* Top Dynamic Ribbon */}
      <div style={{ 
        width: '100%', 
        padding: '0.75rem 5%', 
        background: 'rgba(255,255,255,0.7)', 
        backdropFilter: 'blur(10px)', 
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
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: themeColor }}>wb_sunny</span>
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: subTextColor }}>{getGreeting()}, {name.split(' ')[0]}</span>
        </div>
        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: themeColor, fontFamily: 'monospace' }}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      <div className="full-website-wrapper" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        
        {/* Hero Section */}
        <section className="reveal-anim" style={{ 
          padding: '4rem 1.5rem', 
          textAlign: 'center',
          background: `radial-gradient(circle at top right, ${themeColor}15, transparent), radial-gradient(circle at bottom left, ${themeColor}05, transparent)`
        }}>
          <div className="preview-avatar circle-glow" style={{ 
            width: '160px', 
            height: '160px', 
            margin: '0 auto', 
            borderRadius: '50%',
            border: `6px solid white`,
            boxShadow: `0 20px 50px ${themeColor}30`,
            position: 'relative'
          }}>
            <img src={avatar || "https://via.placeholder.com/150"} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '24px', height: '24px', background: '#22c55e', border: '3px solid white', borderRadius: '50%' }}></div>
          </div>
          
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginTop: '2rem', fontWeight: 900, color: textColor, letterSpacing: '-0.03em', lineHeight: 1 }}>{name}</h1>
          <p style={{ color: themeColor, fontSize: '1.25rem', fontWeight: 800, marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>{designation}</p>
          <div style={{ width: '60px', height: '4px', background: themeColor, margin: '2rem auto', borderRadius: '2px' }}></div>
          
          <p style={{ 
            fontSize: '1.15rem', 
            maxWidth: '700px', 
            margin: '0 auto', 
            lineHeight: 1.7, 
            color: subTextColor, 
            wordBreak: 'break-word',
            padding: '0 1rem'
          }}>{bio}</p>

          {(showMobile || showEmail || showAddress) && (
            <div className="hero-contacts" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
              {showMobile && mobile && (
                <a href={`tel:${mobile}`} style={{ color: textColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                  <div style={{ background: themeColor, color: 'white', padding: '10px', borderRadius: '12px' }}><span className="material-symbols-outlined">call</span></div>
                  {mobile}
                </a>
              )}
              {showEmail && email && (
                <a href={`mailto:${email}`} style={{ color: textColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                  <div style={{ background: themeColor, color: 'white', padding: '10px', borderRadius: '12px' }}><span className="material-symbols-outlined">mail</span></div>
                  {email}
                </a>
              )}
            </div>
          )}
        </section>

        {/* Content Body */}
        <main style={{ padding: '0 1.5rem 5rem' }}>
          {!isLimited && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              
              {/* Links strip */}
              {links && links.length > 0 && links.some(l => l.isActive) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
                   {links.filter(l => l.isActive).map((l, i) => (
                    <a key={i} href={l.content.startsWith('http') ? l.content : `https://${l.content}`} target="_blank" rel="noopener noreferrer" 
                       className="reveal-anim"
                       style={{ 
                         padding: '1rem 2rem', 
                         background: 'white', 
                         borderRadius: '1.5rem', 
                         display: 'flex', 
                         alignItems: 'center', 
                         gap: '12px', 
                         textDecoration: 'none', 
                         color: textColor,
                         fontWeight: 700,
                         boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                         transition: 'transform 0.3s ease'
                       }}>
                      {l.icon ? <img src={l.icon} style={{ width: '24px', height: '24px', objectFit: 'contain' }} /> : <span className="material-symbols-outlined">link</span>}
                      {l.title}
                    </a>
                   ))}
                </div>
              )}

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', 
                gap: '2.5rem' 
              }}>
                {sectionOrder.map(sectionKey => {
                  if (cardType === 'shopkeeper' && ["projects", "experience", "hobbies"].includes(sectionKey)) return null;
                  if (cardType === 'business' && sectionKey === "products") return null;

                  if (sectionKey === "products" && showProducts && products && products.some(p => p.isActive)) {
                    return (
                      <div key="products" className="reveal-anim" style={{ gridColumn: '1 / -1' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem', fontWeight: 800 }}>Product Catalog</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                          {products.filter(p => p.isActive).map((p, i) => (
                            <div key={i} className="glass-card" style={{ background: 'white', borderRadius: '2rem', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
                              <div style={{ height: '220px', borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '1.25rem' }}>
                                <img src={p.icon || "https://via.placeholder.com/300"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 800 }}>{p.title}</h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ color: themeColor, fontSize: '1.5rem', fontWeight: 900 }}>₹{p.price}</span>
                                {p.offer > 0 && <span style={{ background: `${themeColor}15`, color: themeColor, padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>{p.offer}% OFF</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (sectionKey === "projects" && showProjects && projects && projects.some(p => p.isActive)) {
                    return (
                      <div key="projects" className="reveal-anim">
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', fontWeight: 800 }}>Projects</h2>
                        {projects.filter(p => p.isActive).map((p, i) => (
                          <div key={i} style={{ background: 'white', padding: '2rem', borderRadius: '2rem', marginBottom: '1.5rem', boxShadow: '0 15px 35px rgba(0,0,0,0.03)' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 800 }}>{p.title}</h4>
                            <p style={{ color: themeColor, fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' }}>{p.type}</p>
                            <p style={{ color: subTextColor, lineHeight: 1.6, wordBreak: 'break-word' }}>{p.description}</p>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  if (sectionKey === "experience" && showExperience && experience && experience.some(e => e.isActive)) {
                    return (
                      <div key="experience" className="reveal-anim">
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', fontWeight: 800 }}>Experience</h2>
                        {experience.filter(e => e.isActive).map((e, i) => (
                          <div key={i} style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '4px', background: themeColor, borderRadius: '2px' }}></div>
                            <div>
                               <h4 style={{ margin: 0, fontWeight: 800 }}>{e.role}</h4>
                               <p style={{ color: subTextColor, margin: '4px 0' }}>{e.company}</p>
                               <span style={{ fontSize: '0.85rem', color: themeColor, fontWeight: 700 }}>{e.start} - {e.isCurrent ? 'Present' : e.end}</span>
                            </div>
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

          <footer style={{ marginTop: '8rem', textAlign: 'center', opacity: 0.8 }}>
             <p style={{ margin: 0, fontWeight: 800, color: themeColor, fontSize: '1.2rem' }}>Powered by Rajkumar</p>
             <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <a href="tel:6387718208" style={{ background: themeColor, color: 'white', padding: '12px 24px', borderRadius: '99px', textDecoration: 'none', fontWeight: 800, boxShadow: `0 10px 20px ${themeColor}40` }}>Contact Help</a>
             </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
