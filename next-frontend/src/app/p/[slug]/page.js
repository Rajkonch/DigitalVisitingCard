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

  const escapeVCardValue = (value = "") => {
    return String(value)
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  };

  const handleSaveContact = () => {
    if (!card) return;

    const profileUrl = typeof window !== "undefined" ? window.location.href : "";
    const visiblePhone = card.showMobile && card.mobile ? card.mobile : "";
    const visibleEmail = card.showEmail && card.email ? card.email : "";
    const visibleAddress = card.showAddress && card.address ? card.address : "";
    const fileName = `${card.name || "contact"}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "contact";

    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${escapeVCardValue(card.name || "Digital Contact")}`,
      card.designation ? `TITLE:${escapeVCardValue(card.designation)}` : "",
      visiblePhone ? `TEL;TYPE=CELL:${escapeVCardValue(visiblePhone)}` : "",
      visibleEmail ? `EMAIL;TYPE=INTERNET:${escapeVCardValue(visibleEmail)}` : "",
      visibleAddress ? `ADR;TYPE=WORK:;;${escapeVCardValue(visibleAddress)};;;;` : "",
      profileUrl ? `URL:${escapeVCardValue(profileUrl)}` : "",
      card.bio ? `NOTE:${escapeVCardValue(card.bio)}` : "",
      "END:VCARD"
    ].filter(Boolean).join("\r\n");

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    showProjects, showProducts, showExperience, showDaily, showHobby, showLanguage
  } = card;

  const isLimited = card.user_permission === 0;

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
          background: ${bgColor}12;
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
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
          padding: 2rem 0;
        }

        .product-card-premium {
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 1.25rem;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }

        .product-card-premium:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        }

        .desktop-p-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .tag-pill {
          padding: 8px 20px;
          border-radius: 99px;
          font-weight: 700;
          font-size: 0.9rem;
          display: inline-block;
          margin: 5px;
        }

        .custom-item-row {
          padding: 1rem;
          background: white;
          border-radius: 1rem;
          margin-bottom: 0.75rem;
          border: 1px solid #f2f2f2;
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

          .desktop-p-img {
            width: 80px !important;
            height: 80px !important;
            border-radius: 1rem;
            flex-shrink: 0;
          }

          .product-data {
            padding: 0 1rem !important;
            flex: 1;
          }

          .out-of-stock-dim {
            opacity: 0.5;
            filter: grayscale(0.5);
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

          <button
            type="button"
            onClick={handleSaveContact}
            className="reveal-anim"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              border: 'none',
              borderRadius: '999px',
              padding: '0.95rem 1.5rem',
              marginBottom: '2rem',
              background: themeColor || '#00647b',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: `0 12px 28px ${themeColor || '#00647b'}30`
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>person_add</span>
            Save Contact
          </button>
          
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

              {/* Dynamic Sections Based on Order */}
              {sectionOrder && sectionOrder.map(sectionKey => {
                const cardTypeFiltered = cardType || 'business';
                if (cardTypeFiltered === 'shopkeeper' && ["projects", "experience", "hobbies"].includes(sectionKey)) return null;
                if (cardTypeFiltered === 'business' && sectionKey === "products") return null;

                // 1. PRODUCTS
                if (sectionKey === "products" && (showProducts ?? true) && products && products.some(p => p.isActive)) {
                  return (
                    <div key="products" className="reveal-anim">
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', color: textColor, textAlign: 'center' }}>Product Catalog</h2>
                      <div className="product-list-modern">
                        {products.filter(p => p.isActive).map((p, i) => (
                          <div key={i} className={`product-card-premium ${p.isOutOfStock ? 'out-of-stock-dim' : ''}`}>
                            <div style={{ position: 'relative', overflow: 'hidden' }}>
                               <img src={p.icon || "https://via.placeholder.com/400"} className="desktop-p-img" />
                               {p.isOutOfStock && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '0.9rem' }}>SOLD OUT</div>}
                            </div>
                            <div className="product-data" style={{ padding: '1.25rem' }}>
                              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 800 }}>{p.title}</h3>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: themeColor }}>₹{p.price}</span>
                                {p.offer > 0 && <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>{p.offer}% OFF</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                // 2. EXPERIENCE
                if (sectionKey === "experience" && (showExperience ?? true) && experience && experience.some(e => e.isActive)) {
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

                // 3. PROJECTS
                if (sectionKey === "projects" && (showProjects ?? true) && projects && projects.some(p => p.isActive)) {
                  return (
                    <div key="projects" className="reveal-anim">
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1.5rem', color: textColor }}>Featured Projects</h2>
                      <div className="web-product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {projects.filter(p => p.isActive).map((p, i) => (
                          <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #f2f2f2' }}>
                            <span style={{ color: themeColor, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>{p.type}</span>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '5px 0' }}>{p.title}</h4>
                            <p style={{ color: subTextColor, fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>{p.description}</p>
                            {p.link && <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} target="_blank" rel="noopener noreferrer" style={{ color: themeColor, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>View Project →</a>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                // 4. LANGUAGES
                if (sectionKey === "languages" && (showLanguage ?? true) && languages && languages.some(l => l.isActive)) {
                  return (
                    <div key="languages" className="reveal-anim" style={{ textAlign: 'center' }}>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1rem', color: textColor }}>Languages</h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {languages.filter(l => l.isActive).map((l, i) => (
                          <span key={i} className="tag-pill" style={{ background: `${themeColor}12`, color: themeColor }}>{l.name}</span>
                        ))}
                      </div>
                    </div>
                  );
                }

                // 5. HOBBIES
                if (sectionKey === "hobbies" && (showHobby ?? true) && hobbies && hobbies.some(h => h.isActive)) {
                  return (
                    <div key="hobbies" className="reveal-anim" style={{ textAlign: 'center' }}>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1rem', color: textColor }}>Interests & Hobbies</h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {hobbies.filter(h => h.isActive).map((h, i) => (
                          <span key={i} className="tag-pill" style={{ background: `${themeColor}08`, color: textColor }}>{h.name}</span>
                        ))}
                      </div>
                    </div>
                  );
                }

                // 6. DAILY ACTIVITY
                if (sectionKey === "daily" && (showDaily ?? true) && dailyActivities && dailyActivities.some(d => d.isActive)) {
                  return (
                    <div key="daily" className="reveal-anim">
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1.5rem', color: textColor }}>Daily Routine</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {dailyActivities.filter(d => d.isActive).map((d, i) => (
                          <div key={i} style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid #f2f2f2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700 }}>{d.title}</span>
                            <span style={{ color: themeColor, fontWeight: 800, fontSize: '0.8rem' }}>{d.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                // 7. CUSTOM HEADINGS
                if (sectionKey === "custom" && customHeadings && customHeadings.some(h => h.isActive)) {
                  return (
                    <div key="custom" className="reveal-anim">
                      {customHeadings.filter(h => h.isActive).map((h, i) => (
                        <div key={i} style={{ marginBottom: '3rem' }}>
                          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '1.5rem', color: textColor, textAlign: 'center' }}>{h.title}</h2>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                            {h.items && h.items.filter(it => it.isActive).map((it, j) => (
                              <div key={j} className="custom-item-row">
                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{it.title}</h4>
                                <p style={{ margin: '5px 0 0', color: subTextColor, fontSize: '0.9rem' }}>{it.subtitle}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
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
