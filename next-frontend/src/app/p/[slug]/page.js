"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import API from "../../../utils/api";
import "../../../styles/UserEditPublishProfile.css"; // Reuse existing styles

export default function PublicProfile() {
  const { slug } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
  if (!card) return <div className="flex-center" style={{ height: '100vh' }}>Profile Not Found</div>;

  const {
    name, designation, bio, themeColor, textColor, subTextColor, bgColor, avatar,
    mobile, showMobile, email, showEmail, address, showAddress, cardType,
    sectionOrder, links, products, projects, experience, languages, hobbies, dailyActivities, customHeadings
  } = card;

  return (
    <div className="public-profile-view" style={{ background: bgColor, minHeight: '100vh', overflowX: 'hidden' }}>
      <div className="web-preview-container" style={{ maxWidth: '800px', margin: '0 auto', background: 'white', minHeight: '100vh', boxShadow: '0 0 50px rgba(0,0,0,0.1)' }}>
        
        {/* Profile Header */}
        <div className="web-preview-content" style={{ padding: '3rem 2rem' }}>
          <div className="web-profile-intro" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="preview-avatar circle" style={{ width: '150px', height: '150px', borderColor: themeColor, margin: '0 auto', border: `4px solid ${themeColor}` }}>
              <img src={avatar || "https://via.placeholder.com/150"} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <h1 style={{ fontSize: '2.5rem', marginTop: '1.5rem', fontWeight: 800, color: textColor }}>{name}</h1>
            <p className="designation" style={{ color: themeColor, fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{designation}</p>
            
            {(showMobile || showEmail || showAddress) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
                {showMobile && mobile && (
                  <a href={`tel:${mobile}`} className="contact-preview-item" style={{ color: subTextColor, textDecoration: 'none' }}>
                    <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.2rem' }}>call</span>
                    {mobile}
                  </a>
                )}
                {showEmail && email && (
                  <a href={`mailto:${email}`} className="contact-preview-item" style={{ color: subTextColor, textDecoration: 'none' }}>
                    <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.2rem' }}>mail</span>
                    {email}
                  </a>
                )}
                {showAddress && address && (
                  <div className="contact-preview-item" style={{ color: subTextColor }}>
                    <span className="material-symbols-outlined" style={{ color: themeColor, fontSize: '1.2rem' }}>location_on</span>
                    {address}
                  </div>
                )}
              </div>
            )}
            <p className="bio" style={{ fontSize: '1rem', marginTop: '1.5rem', maxWidth: '600px', margin: '1.5rem auto 0', lineHeight: 1.6, color: subTextColor }}>{bio}</p>
          </div>

          {/* Social Links Grid */}
          {links && links.length > 0 && links.some(l => l.isActive) && (
            <div className="preview-links-grid" style={{ justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
              {links.filter(l => l.isActive).map((l, i) => (
                <a key={i} href={l.content.startsWith('http') ? l.content : `https://${l.content}`} target="_blank" rel="noopener noreferrer" className="preview-link-circle" style={{ width: '60px', height: '60px', color: themeColor, background: `${themeColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', textDecoration: 'none' }}>
                  {l.icon ? <img src={l.icon} style={{ width: '30px', height: '30px', objectFit: 'contain' }} /> : <span className="material-symbols-outlined" style={{ fontSize: '1.8rem' }}>link</span>}
                </a>
              ))}
            </div>
          )}

          {/* Dynamic Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem', marginTop: '2rem' }}>
            {sectionOrder.map(sectionKey => {
              if (cardType === 'shopkeeper' && ["projects", "experience", "hobbies"].includes(sectionKey)) return null;
              if (cardType === 'business' && sectionKey === "products") return null;

              if (sectionKey === "products" && products && products.some(p => p.isActive)) {
                return (
                  <div key="products" style={{ gridColumn: '1 / -1' }}>
                    <h5 style={{ color: themeColor, fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: `2px solid ${themeColor}20`, paddingBottom: '0.5rem' }}>Product Catalog</h5>
                    <div className="web-product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                      {products.filter(p => p.isActive).map((p, i) => (
                        <div key={i} className="web-product-card" style={{ border: '1px solid #eee', borderRadius: '12px', padding: '1rem', opacity: p.isOutOfStock ? 0.7 : 1, background: '#fafafa' }}>
                          <div className="web-product-img" style={{ height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', background: '#fff' }}>
                            {p.icon ? <img src={p.icon} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#eee' }}>image</span></div>}
                          </div>
                          <p className="p-bold" style={{ fontWeight: 700, fontSize: '1.1rem', color: textColor, marginBottom: '0.5rem' }}>{p.title}</p>
                          <div className="price-row" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="current-price" style={{ color: themeColor, fontWeight: 800, fontSize: '1.1rem' }}>₹{p.price - (p.price * (p.offer || 0) / 100)}</span>
                            {p.offer > 0 && <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9rem' }}>₹{p.price}</span>}
                            {p.offer > 0 && <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>{p.offer}% OFF</span>}
                          </div>
                          {p.isOutOfStock && <div style={{ color: '#d32f2f', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.5rem' }}>Out of Stock</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (sectionKey === "projects" && projects && projects.some(p => p.isActive)) {
                return (
                  <div key="projects" className="preview-list-section">
                    <h5 style={{ color: themeColor, fontSize: '1.2rem', marginBottom: '1rem' }}>Projects Portfolio</h5>
                    {projects.filter(p => p.isActive).map((p, i) => (
                      <div key={i} className="mini-card-preview" style={{ background: `${textColor}05`, padding: '1.25rem', borderRadius: '12px', marginBottom: '1rem' }}>
                        <p className="p-bold" style={{ fontWeight: 700, color: textColor }}>{p.title}</p>
                        <p className="p-sub" style={{ color: themeColor, fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>{p.type}</p>
                        <p style={{ fontSize: '0.9rem', color: subTextColor, lineHeight: 1.5 }}>{p.description}</p>
                        {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: themeColor, fontSize: '0.85rem', marginTop: '0.5rem', display: 'inline-block', fontWeight: 700 }}>View Project →</a>}
                      </div>
                    ))}
                  </div>
                );
              }

              if (sectionKey === "experience" && experience && experience.some(e => e.isActive)) {
                return (
                  <div key="experience" className="preview-list-section">
                    <h5 style={{ color: themeColor, fontSize: '1.2rem', marginBottom: '1rem' }}>Work Experience</h5>
                    {experience.filter(e => e.isActive).map((e, i) => (
                      <div key={i} className="mini-card-preview" style={{ background: `${textColor}05`, padding: '1.25rem', borderRadius: '12px', marginBottom: '1rem' }}>
                        <p className="p-bold" style={{ fontWeight: 700, color: textColor }}>{e.role}</p>
                        <p className="p-sub" style={{ color: subTextColor, fontSize: '0.9rem' }}>{e.company} • {e.start} - {e.isCurrent ? 'Present' : e.end}</p>
                      </div>
                    ))}
                  </div>
                );
              }

              if (sectionKey === "custom" && customHeadings && customHeadings.some(h => h.isActive)) {
                return (
                  <React.Fragment key="custom">
                    {customHeadings.filter(h => h.isActive).map((h, hi) => (
                      <div key={hi} className="preview-list-section">
                        <h5 style={{ color: themeColor, fontSize: '1.2rem', marginBottom: '1rem' }}>{h.title}</h5>
                        {h.items.filter(it => it.isActive).map((it, ii) => (
                          <div key={ii} className="mini-card-preview" style={{ background: `${textColor}05`, padding: '1rem', borderRadius: '12px', marginBottom: '0.75rem' }}>
                            <p className="p-bold" style={{ fontWeight: 700, color: textColor }}>{it.title}</p>
                            <p className="p-sub" style={{ color: subTextColor, fontSize: '0.9rem' }}>{it.subtitle}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </React.Fragment>
                );
              }

              if (sectionKey === "daily" && dailyActivities && dailyActivities.length > 0) {
                 return (
                  <div key="daily" className="preview-list-section">
                    <h5 style={{ color: themeColor, fontSize: '1.2rem', marginBottom: '1rem' }}>Daily Routine</h5>
                    {dailyActivities.filter(a => a.isActive).map((a, i) => (
                      <div key={i} className="mini-card-preview" style={{ background: `${textColor}05`, padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <p className="p-bold" style={{ fontWeight: 700, color: textColor }}>{a.title}</p>
                        <span style={{ fontSize: '0.85rem', color: themeColor, fontWeight: 800 }}>{a.time}</span>
                      </div>
                    ))}
                  </div>
                );
              }

              if (sectionKey === "languages" && languages && languages.length > 0) {
                 return (
                  <div key="languages" className="preview-list-section">
                    <h5 style={{ color: themeColor, fontSize: '1.2rem', marginBottom: '1rem' }}>Languages</h5>
                    <div className="tags-preview" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {languages.filter(l => l.isActive).map((l, i) => <span key={i} style={{ color: textColor, background: `${themeColor}12`, padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 }}>{l.name}</span>)}
                    </div>
                  </div>
                );
              }

              if (sectionKey === "hobbies" && hobbies && hobbies.length > 0) {
                 return (
                  <div key="hobbies" className="preview-list-section">
                    <h5 style={{ color: themeColor, fontSize: '1.2rem', marginBottom: '1rem' }}>Hobbies</h5>
                    <div className="tags-preview" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {hobbies.filter(h => h.isActive).map((h, i) => <span key={i} style={{ color: textColor, background: `${themeColor}12`, padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 }}>{h.name}</span>)}
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>

          <footer style={{ marginTop: '5rem', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
            <p>Powered by Prism QR • Create your digital identity</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
