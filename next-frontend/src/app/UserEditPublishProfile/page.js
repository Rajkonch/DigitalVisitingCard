"use client";
import React, { useState, useEffect } from "react";
import "../../styles/UserEditPublishProfile.css";
import { useRouter } from "next/navigation";
import API from "../../utils/api";

export default function UserEditPublishProfile() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch existing card if any
    const fetchCard = async () => {
      try {
        const res = await API.get("/cards/my");
        if (res.data && res.data.length > 0) {
          const card = res.data[0];
          setProfile({
            name: card.name || "",
            designation: card.designation || "",
            bio: card.bio || "",
            themeColor: card.themeColor || "#00647b",
            textColor: card.textColor || "#1a1c1e",
            subTextColor: card.subTextColor || "#40484c",
            bgColor: card.bgColor || "#f0f4f8",
            bgPattern: card.bgPattern || "none",
            cardType: card.cardType || "business",
            avatar: card.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBv2Nkrf9QRJosgsuVNxMiFyV3Ww8CcIICG3iyjkqoEllYyJtwiAOxEg7Bz41LY5zL2I3W9r4J_xWXzmcPLSPRv6v7TRvzCS7J6Iln2ObBEpg6M6tMxhBYc5Jb18nLxYpwzZYjIBqYwvbm5XAQKbmAk7ID3dDjXBou8iJsuxquOLOeI3XxIGoFuS6WZdI9_1p3sFxoUwMZWCXKj_yVLxrjKlKzLE2nRMmQQjgih2_9t9_aiwew9XxEMnGrvOemJp4m9WqelHUNQqneG",
            mobile: card.mobile || "",
            showMobile: card.showMobile ?? true,
            email: card.email || "",
            showEmail: card.showEmail ?? true,
            address: card.address || "",
            showAddress: card.showAddress ?? true
          });
          if (card.sectionOrder && card.sectionOrder.length > 0) setSectionOrder(card.sectionOrder);
          if (card.links) setDynamicSections(card.links.map(l => ({ ...l, id: l._id || Date.now() })));
          if (card.products) setProducts(card.products.map(p => ({ ...p, id: p._id || Date.now() })));
          if (card.projects) setProjects(card.projects.map(p => ({ ...p, id: p._id || Date.now() })));
          if (card.experience) setExperiences(card.experience.map(e => ({ ...e, id: e._id || Date.now() })));
          if (card.languages) setLanguages(card.languages.map(l => ({ ...l, id: l._id || Date.now() })));
          if (card.hobbies) setHobbies(card.hobbies.map(h => ({ ...h, id: h._id || Date.now() })));
          if (card.dailyActivities) setDailyActivities(card.dailyActivities.map(a => ({ ...a, id: a._id || Date.now() })));
          if (card.customHeadings) setCustomHeadings(card.customHeadings.map(h => ({ ...h, id: h._id || Date.now(), items: h.items.map(it => ({ ...it, id: it._id || Date.now() })) })));
        }
      } catch (err) {
        console.error("Error fetching card:", err);
      }
    };

    fetchCard();
  }, [router]);

  const [profile, setProfile] = useState({
    name: "Alex Prism",
    designation: "Creative Technologist",
    bio: "Building the future of interactive identity. Passionate about glassmorphism and 3D web experiences.",
    themeColor: "#00647b",
    textColor: "#1a1c1e",
    subTextColor: "#40484c",
    bgColor: "#f0f4f8",
    bgPattern: "none",
    cardType: "business",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBv2Nkrf9QRJosgsuVNxMiFyV3Ww8CcIICG3iyjkqoEllYyJtwiAOxEg7Bz41LY5zL2I3W9r4J_xWXzmcPLSPRv6v7TRvzCS7J6Iln2ObBEpg6M6tMxhBYc5Jb18nLxYpwzZYjIBqYwvbm5XAQKbmAk7ID3dDjXBou8iJsuxquOLOeI3XxIGoFuS6WZdI9_1p3sFxoUwMZWCXKj_yVLxrjKlKzLE2nRMmQQjgih2_9t9_aiwew9XxEMnGrvOemJp4m9WqelHUNQqneG",
    mobile: "+91 98765 43210",
    showMobile: true,
    email: "contact@prismqr.com",
    showEmail: true,
    address: "Skyline Business Park, Mumbai, India",
    showAddress: true
  });

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      // Automatic boundary detection by removing manual headers
      const res = await API.post("/upload", formData);
      return res.data.url;
    } catch (err) {
      console.error("Upload failed", err);
      return null;
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    setSaveStatus("Publishing...");
    try {
      const payload = {
        ...profile,
        sectionOrder,
        links: dynamicSections,
        products,
        projects,
        experience: experiences,
        languages,
        hobbies,
        dailyActivities,
        customHeadings
      };

      await API.post("/cards/publish", payload);
      setSaveStatus("Published Successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
      router.push("/UserDashboard");
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Unknown Error";
      console.error("Publish failed details:", err.response?.data || err.message || err);
      alert("Error while publishing: " + errMsg);
      setSaveStatus("Failed to publish. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const [sectionOrder, setSectionOrder] = useState([
    "links", "products", "projects", "experience", "custom", "daily", "languages", "hobbies"
  ]);

  const [products, setProducts] = useState([
    { id: 1, title: "Premium Watch", price: "299", offer: "10", stock: "150", icon: "", isActive: true, isOutOfStock: false }
  ]);

  const themes = [
    { name: "Ocean Glass", primary: "#00647b", text: "#001f24", sub: "#40484c", bg: "#e0f1f4", pattern: "mesh" },
    { name: "Sunset Portfolio", primary: "#a03929", text: "#3d0700", sub: "#6b3b35", bg: "#fdf1f0", pattern: "dots" },
    { name: "Midnight Pro", primary: "#8E44AD", text: "#f0f0f0", sub: "#b0b0b0", bg: "#121212", pattern: "none" },
    { name: "Minimalist", primary: "#2c3e50", text: "#1a1a1a", sub: "#666666", bg: "#ffffff", pattern: "none" }
  ];

  const applyTheme = (theme) => {
    setProfile({ ...profile, themeColor: theme.primary, textColor: theme.text, subTextColor: theme.sub, bgColor: theme.bg, bgPattern: theme.pattern });
  };

  const moveSection = (direction, index) => {
    const newOrder = [...sectionOrder];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newOrder.length) return;
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    setSectionOrder(newOrder);
  };

  const today = new Date().toISOString().split("T")[0];

  const [dynamicSections, setDynamicSections] = useState([
    { id: 1, title: "Instagram", content: "instagram.com/alex_prism", icon: null, isActive: true },
    { id: 2, title: "LinkedIn", content: "linkedin.com/in/alexprism", icon: null, isActive: true }
  ]);

  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [dailyActivities, setDailyActivities] = useState([]);
  const [customHeadings, setCustomHeadings] = useState([]);
  const [previewMode, setPreviewMode] = useState("mobile");

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const moveItem = (list, setList, index, direction) => {
    const newList = [...list];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setList(newList);
  };

  const canAddMore = (list, fields) => {
    if (list.length === 0) return true;
    const lastItem = list[list.length - 1];
    return fields.every(field => lastItem[field] && lastItem[field].toString().trim() !== "");
  };

  const toggleActive = (list, setList, id) => {
    setList(list.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item));
  };

  const addSection = () => {
    if (dynamicSections.length < 8 && canAddMore(dynamicSections, ["title", "content"])) {
      setDynamicSections([...dynamicSections, { id: Date.now(), title: "", content: "", icon: null, isActive: true }]);
    }
  };

  const handleIconUpload = async (id, file) => {
    if (file) {
      // Show local preview immediately
      setDynamicSections(dynamicSections.map(s => s.id === id ? { ...s, icon: URL.createObjectURL(file) } : s));
      
      const url = await uploadImage(file);
      if (url) {
        setDynamicSections(prev => prev.map(s => s.id === id ? { ...s, icon: url } : s));
      }
    }
  };

  const addProject = () => {
    if (projects.length < 50 && canAddMore(projects, ["title", "description"])) {
      setProjects([...projects, { id: Date.now(), type: "", title: "", description: "", link: "", isActive: true }]);
    }
  };

  const addExperience = () => {
    if (canAddMore(experiences, ["company", "role", "start"])) {
      setExperiences([...experiences, { id: Date.now(), company: "", role: "", start: "", end: "", isCurrent: false, isActive: true }]);
    }
  };

  const addCustomHeading = () => {
    if (canAddMore(customHeadings, ["title"])) {
      setCustomHeadings([...customHeadings, { id: Date.now(), title: "", items: [], isActive: true }]);
    }
  };

  const addCustomItem = (headingId) => {
    setCustomHeadings(customHeadings.map(h => {
      if (h.id === headingId && canAddMore(h.items, ["title", "subtitle"])) {
        return { ...h, items: [...h.items, { id: Date.now(), title: "", subtitle: "", isActive: true }] };
      }
      return h;
    }));
  };

  const handleCurrentToggle = (id) => {
    setExperiences(experiences.map(e => e.id === id ? { ...e, isCurrent: !e.isCurrent, end: !e.isCurrent ? "" : e.end } : e));
  };

  return (
    <div className="profile-editor-container">
      <header className="editor-nav">
        <img src="/logo.png" alt="Logo" onClick={() => router.push("/UserDashboard")} style={{ height: '32px', cursor: "pointer", objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {saveStatus && <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{saveStatus}</span>}
          <button className="publish-btn" onClick={handlePublish} disabled={loading}>
            {loading ? "Publishing..." : "Publish Profile"}
          </button>
        </div>
      </header>

      <main className="editor-main">
        <section className="editor-content">
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Design Identity</h1>
            <p style={{ color: "var(--on-surface-variant)" }}>Build your high-fidelity digital profile.</p>
          </div>

          {/* Card Type Switch */}
          <div className="editor-section">
            <div className="section-title">
              <span className="material-symbols-outlined">badge</span>
              <h2>Profile Card Type</h2>
            </div>
            <div className="card-type-toggle">
              <button className={`type-btn ${profile.cardType === 'business' ? 'active' : ''}`} onClick={() => setProfile({ ...profile, cardType: 'business' })}>
                <span className="material-symbols-outlined">person</span> Digital Business
              </button>
              <button className={`type-btn ${profile.cardType === 'shopkeeper' ? 'active' : ''}`} onClick={() => setProfile({ ...profile, cardType: 'shopkeeper' })}>
                <span className="material-symbols-outlined">storefront</span> Shopkeeper Card
              </button>
            </div>
          </div>

          {/* Profile Basics */}
          <div className="editor-section">
            <div className="section-title">
              <span className="material-symbols-outlined">person</span>
              <h2>Profile Basics</h2>
            </div>
            <div className="avatar-upload-main">
              <div className="avatar-preview-wrapper" onClick={() => document.getElementById('avatar-input').click()}>
                <img src={profile.avatar} alt="Avatar" />
                <div className="avatar-overlay"><span className="material-symbols-outlined">camera_alt</span></div>
              </div>
              <input id="avatar-input" type="file" accept="image/*" style={{ display: 'none' }}
                onChange={async (e) => { 
                  if (e.target.files[0]) {
                    const file = e.target.files[0];
                    // Local preview
                    setProfile({ ...profile, avatar: URL.createObjectURL(file) });
                    
                    const url = await uploadImage(file);
                    if (url) setProfile(prev => ({ ...prev, avatar: url }));
                  }
                }} />
              <div style={{ flex: 1 }}>
                <p className="field-label" style={{ marginBottom: '0.5rem' }}>Profile Photo</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Upload a professional photo or avatar for your card.</p>
              </div>
            </div>
            <div className="input-grid mt-2">
              <div className="input-field">
                <label className="field-label">Full Name</label>
                <input type="text" name="name" className="field-input" value={profile.name} onChange={handleProfileChange} />
              </div>
              <div className="input-field">
                <label className="field-label">{profile.cardType === 'shopkeeper' ? 'Shop Category / Specialty' : 'Designation'}</label>
                <input type="text" name="designation" className="field-input" placeholder={profile.cardType === 'shopkeeper' ? "e.g. Electronic Store" : "e.g. Creative Technologist"} value={profile.designation} onChange={handleProfileChange} />
              </div>
              <div className="input-field full">
                <p className="field-label" style={{ margin: '1rem 0 0.5rem' }}>Contact Information</p>
                <div className="contact-inputs-grid">
                  <div className="contact-row">
                    <span className="material-symbols-outlined">call</span>
                    <input type="text" name="mobile" placeholder="Mobile Number" className="field-input" value={profile.mobile} onChange={handleProfileChange} />
                    <label className="switch mini"><input type="checkbox" checked={profile.showMobile} onChange={() => setProfile({ ...profile, showMobile: !profile.showMobile })} /><span className="slider round"></span></label>
                  </div>
                  <div className="contact-row">
                    <span className="material-symbols-outlined">mail</span>
                    <input type="email" name="email" placeholder="Email Address" className="field-input" value={profile.email} onChange={handleProfileChange} />
                    <label className="switch mini"><input type="checkbox" checked={profile.showEmail} onChange={() => setProfile({ ...profile, showEmail: !profile.showEmail })} /><span className="slider round"></span></label>
                  </div>
                  <div className="contact-row">
                    <span className="material-symbols-outlined">location_on</span>
                    <input type="text" name="address" placeholder="Physical Address" className="field-input" value={profile.address} onChange={handleProfileChange} />
                    <label className="switch mini"><input type="checkbox" checked={profile.showAddress} onChange={() => setProfile({ ...profile, showAddress: !profile.showAddress })} /><span className="slider round"></span></label>
                  </div>
                </div>
              </div>
              <div className="input-field full">
                <label className="field-label">{profile.cardType === 'shopkeeper' ? 'About Shop' : 'Bio'}</label>
                <textarea name="bio" className="field-input" rows="3" placeholder={profile.cardType === 'shopkeeper' ? "Tell customers about your shop..." : "Build your professional bio..."} value={profile.bio} onChange={handleProfileChange} />
              </div>
            </div>
          </div>

          {/* Design Themes */}
          <div className="editor-section">
            <div className="section-title">
              <span className="material-symbols-outlined">auto_awesome</span>
              <h2>Brand Design & Themes</h2>
            </div>
            <p className="field-label" style={{ marginBottom: '1rem' }}>Design Presets</p>
            <div className="theme-presets-grid">
              {themes.map(t => (
                <div key={t.name} className={`theme-card ${profile.themeColor === t.primary ? 'active' : ''}`} onClick={() => applyTheme(t)}>
                  <div className="theme-preview-box" style={{ background: t.bg }}>
                    <div style={{ width: '40%', height: '4px', background: t.primary, borderRadius: '2px' }}></div>
                    <div style={{ width: '60%', height: '4px', background: t.text, borderRadius: '2px', marginTop: '4px' }}></div>
                  </div>
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
            <div style={{ margin: '2rem 0', height: '1px', background: 'var(--surface-container-high)' }}></div>
            <p className="field-label" style={{ marginBottom: '1rem' }}>Custom Color Palette</p>
            <div className="color-picker-grid">
              <div className="picker-item">
                <input type="color" value={profile.themeColor} onChange={(e) => setProfile({ ...profile, themeColor: e.target.value })} />
                <div className="picker-label"><h5>Heading</h5><span>Accents & Icons</span></div>
              </div>
              <div className="picker-item">
                <input type="color" value={profile.textColor} onChange={(e) => setProfile({ ...profile, textColor: e.target.value })} />
                <div className="picker-label"><h5>Title Color</h5><span>Main text</span></div>
              </div>
              <div className="picker-item">
                <input type="color" value={profile.subTextColor} onChange={(e) => setProfile({ ...profile, subTextColor: e.target.value })} />
                <div className="picker-label"><h5>Subtitle</h5><span>Descriptions</span></div>
              </div>
              <div className="picker-item">
                <input type="color" value={profile.bgColor} onChange={(e) => setProfile({ ...profile, bgColor: e.target.value })} />
                <div className="picker-label"><h5>Background</h5><span>Page color</span></div>
              </div>
            </div>
          </div>

          {/* Dynamic Sections */}
          {sectionOrder.map((sectionKey, orderIndex) => {
            const moveControls = (
              <div className="section-move-controls">
                <button title="Move Section Up" onClick={() => moveSection("up", orderIndex)} className="material-symbols-outlined">arrow_upward</button>
                <button title="Move Section Down" onClick={() => moveSection("down", orderIndex)} className="material-symbols-outlined">arrow_downward</button>
              </div>
            );

            if (profile.cardType === 'shopkeeper' && (sectionKey === "projects" || sectionKey === "experience" || sectionKey === "hobbies")) return null;
            if (profile.cardType === 'business' && sectionKey === "products") return null;

            if (sectionKey === "products") {
              return (
                <div key="products" className="editor-section">
                  <div className="section-header">
                    <div className="section-title">{moveControls}<span className="material-symbols-outlined">shopping_basket</span><h2>Product Catalog ({products.length}/50)</h2></div>
                    <button className={`add-btn ${products.length >= 50 ? "disabled" : ""}`} onClick={() => setProducts([...products, { id: Date.now(), title: "", price: "", offer: "", stock: "", icon: "", isActive: true, isOutOfStock: false }])}>+ Add Product</button>
                  </div>
                  <div className="dynamic-list">
                    {products.map((prod, pIdx) => (
                      <div key={prod.id} className="dynamic-item complex">
                        <div className="item-row">
                          <div className="move-controls"><button className="material-symbols-outlined" onClick={() => moveItem(products, setProducts, pIdx, "up")}>expand_less</button></div>
                          <div className="icon-upload-mini">
                            <input type="file" accept="image/*" onChange={async (e) => { 
                              const file = e.target.files[0]; 
                              if (file) { 
                                // Local preview
                                setProducts(products.map(p => p.id === prod.id ? { ...p, icon: URL.createObjectURL(file) } : p));
                                
                                const url = await uploadImage(file);
                                if (url) setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, icon: url } : p));
                              } 
                            }} />
                            {prod.icon ? <img src={prod.icon} alt="prod" /> : <span className="material-symbols-outlined">image</span>}
                          </div>
                          <div className="item-inputs">
                            <input type="text" placeholder="Product Name" className="field-input bold-input" value={prod.title} onChange={(e) => setProducts(products.map(p => p.id === prod.id ? { ...p, title: e.target.value } : p))} />
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <input type="number" placeholder="Price" className="field-input" value={prod.price} onChange={(e) => setProducts(products.map(p => p.id === prod.id ? { ...p, price: e.target.value } : p))} style={{ width: '80px' }} />
                              <input type="number" placeholder="Offer %" className="field-input" value={prod.offer} onChange={(e) => setProducts(products.map(p => p.id === prod.id ? { ...p, offer: e.target.value } : p))} style={{ width: '70px' }} />
                              <input type="number" placeholder="Stock" className="field-input" value={prod.stock} onChange={(e) => setProducts(products.map(p => p.id === prod.id ? { ...p, stock: e.target.value } : p))} style={{ width: '70px' }} />
                            </div>
                          </div>
                        </div>
                        <div className="item-row flex-between mt-2" style={{ padding: '0.5rem 0.75rem', background: 'var(--surface-container-low)', borderRadius: '8px' }}>
                          <div className="flex-center gap-2">
                            <label className="switch mini"><input type="checkbox" checked={prod.isOutOfStock} onChange={() => setProducts(products.map(p => p.id === prod.id ? { ...p, isOutOfStock: !p.isOutOfStock } : p))} /><span className="slider round"></span></label>
                            <span className="field-label" style={{ color: prod.isOutOfStock ? 'var(--error)' : 'green', fontStyle: 'italic' }}>{prod.isOutOfStock ? "Out of Stock" : "Available"}</span>
                          </div>
                          <div className="flex-center gap-2">
                            <label className="switch mini"><input type="checkbox" checked={prod.isActive} onChange={() => toggleActive(products, setProducts, prod.id)} /><span className="slider round"></span></label>
                            <button className="delete-btn material-symbols-outlined" onClick={() => setProducts(products.filter(p => p.id !== prod.id))}>delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === "links") {
              return (
                <div key="links" className="editor-section">
                  <div className="section-header">
                    <div className="section-title">{moveControls}<span className="material-symbols-outlined">link</span><h2>Social links & Icons ({dynamicSections.length}/8)</h2></div>
                    <button className={`add-btn ${!canAddMore(dynamicSections, ["title", "content"]) ? "disabled" : ""}`} onClick={addSection}>Add Link</button>
                  </div>
                  <div className="dynamic-list">
                    {dynamicSections.map((section, index) => (
                      <div key={section.id} className="dynamic-item">
                        <div className="move-controls">
                          <button className="material-symbols-outlined" onClick={() => moveItem(dynamicSections, setDynamicSections, index, "up")}>expand_less</button>
                          <button className="material-symbols-outlined" onClick={() => moveItem(dynamicSections, setDynamicSections, index, "down")}>expand_more</button>
                        </div>
                        <div className="icon-upload-mini">
                          <input type="file" accept="image/*" onChange={(e) => handleIconUpload(section.id, e.target.files[0])} />
                          {section.icon ? <img src={section.icon} alt="icon" /> : <span className="material-symbols-outlined">add_photo_alternate</span>}
                        </div>
                        <div className="item-inputs">
                          <input type="text" placeholder="Title" className="field-input" value={section.title} onChange={(e) => setDynamicSections(dynamicSections.map(s => s.id === section.id ? { ...s, title: e.target.value } : s))} />
                          <input type="text" placeholder="URL" className="field-input" value={section.content} onChange={(e) => setDynamicSections(dynamicSections.map(s => s.id === section.id ? { ...s, content: e.target.value } : s))} />
                        </div>
                        <label className="switch"><input type="checkbox" checked={section.isActive} onChange={() => toggleActive(dynamicSections, setDynamicSections, section.id)} /><span className="slider round"></span></label>
                        <button className="delete-btn material-symbols-outlined" onClick={() => setDynamicSections(dynamicSections.filter(s => s.id !== section.id))}>delete</button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === "projects") {
              return (
                <div key="projects" className="editor-section">
                  <div className="section-header">
                    <div className="section-title">{moveControls}<span className="material-symbols-outlined">rocket_launch</span><h2>Projects Portfolio ({projects.length}/50)</h2></div>
                    <button className={`add-btn ${!canAddMore(projects, ["title", "description"]) ? "disabled" : ""}`} onClick={addProject}>Add Project</button>
                  </div>
                  <div className="dynamic-list">
                    {projects.map((proj, index) => (
                      <div key={proj.id} className="dynamic-item complex">
                        <div className="item-row">
                          <div className="move-controls">
                            <button className="material-symbols-outlined" onClick={() => moveItem(projects, setProjects, index, "up")}>expand_less</button>
                            <button className="material-symbols-outlined" onClick={() => moveItem(projects, setProjects, index, "down")}>expand_more</button>
                          </div>
                          <input type="text" placeholder="Project Type" className="field-input" value={proj.type} onChange={(e) => setProjects(projects.map(p => p.id === proj.id ? { ...p, type: e.target.value } : p))} />
                          <input type="text" placeholder="Project Title" className="field-input" value={proj.title} onChange={(e) => setProjects(projects.map(p => p.id === proj.id ? { ...p, title: e.target.value } : p))} />
                        </div>
                        <textarea placeholder="Description" className="field-input" value={proj.description} onChange={(e) => setProjects(projects.map(p => p.id === proj.id ? { ...p, description: e.target.value } : p))} />
                        <div className="item-row flex-between">
                          <input type="text" placeholder="Project Link" className="field-input" style={{ flex: 1 }} value={proj.link} onChange={(e) => setProjects(projects.map(p => p.id === proj.id ? { ...p, link: e.target.value } : p))} />
                          <label className="switch mini"><input type="checkbox" checked={proj.isActive} onChange={() => toggleActive(projects, setProjects, proj.id)} /><span className="slider round"></span></label>
                          <button className="delete-btn material-symbols-outlined" onClick={() => setProjects(projects.filter(p => p.id !== proj.id))}>delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === "experience") {
              return (
                <div key="experience" className="editor-section">
                  <div className="section-header">
                    <div className="section-title">{moveControls}<span className="material-symbols-outlined">work</span><h2>Work Experience</h2></div>
                    <button className={`add-btn ${!canAddMore(experiences, ["company", "role", "start"]) ? "disabled" : ""}`} onClick={addExperience}>Add Experience</button>
                  </div>
                  <div className="dynamic-list">
                    {experiences.map((exp, index) => (
                      <div key={exp.id} className="dynamic-item complex">
                        <div className="item-row">
                          <div className="move-controls">
                            <button className="material-symbols-outlined" onClick={() => moveItem(experiences, setExperiences, index, "up")}>expand_less</button>
                            <button className="material-symbols-outlined" onClick={() => moveItem(experiences, setExperiences, index, "down")}>expand_more</button>
                          </div>
                          <input type="text" placeholder="Company" className="field-input" value={exp.company} onChange={(e) => setExperiences(experiences.map(ex => ex.id === exp.id ? { ...ex, company: e.target.value } : ex))} />
                          <input type="text" placeholder="Role" className="field-input" value={exp.role} onChange={(e) => setExperiences(experiences.map(ex => ex.id === exp.id ? { ...ex, role: e.target.value } : ex))} />
                        </div>
                        <div className="item-row">
                          <div className="input-field half"><label className="field-label">Start Date</label><input type="date" className="field-input" max={today} value={exp.start} onChange={(e) => setExperiences(experiences.map(ex => ex.id === exp.id ? { ...ex, start: e.target.value } : ex))} /></div>
                          {!exp.isCurrent && (<div className="input-field half"><label className="field-label">End Date</label><input type="date" className="field-input" max={today} value={exp.end} onChange={(e) => setExperiences(experiences.map(ex => ex.id === exp.id ? { ...ex, end: e.target.value } : ex))} /></div>)}
                        </div>
                        <div className="item-row flex-between">
                          <label className="flex-center gap-2" style={{ fontSize: '0.75rem', fontWeight: 600 }}><input type="checkbox" checked={exp.isCurrent} onChange={() => handleCurrentToggle(exp.id)} /> Currently Working here</label>
                          <div className="flex-center gap-2">
                            <label className="switch mini"><input type="checkbox" checked={exp.isActive} onChange={() => toggleActive(experiences, setExperiences, exp.id)} /><span className="slider round"></span></label>
                            <button className="delete-btn material-symbols-outlined" onClick={() => setExperiences(experiences.filter(ex => ex.id !== exp.id))}>delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === "custom") {
              return (
                <div key="custom" className="editor-section">
                  <div className="section-header">
                    <div className="section-title">{moveControls}<span className="material-symbols-outlined">view_agenda</span><h2>Custom Headings & Items</h2></div>
                    <button className={`add-btn ${!canAddMore(customHeadings, ["title"]) ? "disabled" : ""}`} onClick={addCustomHeading}>New Heading</button>
                  </div>
                  <div className="dynamic-list">
                    {customHeadings.map((h, hIndex) => (
                      <div key={h.id} className="dynamic-item-wrapper custom-heading-container">
                        <div className="heading-main-row">
                          <div className="move-controls" style={{ flexDirection: 'row' }}>
                            <button className="material-symbols-outlined" onClick={() => moveItem(customHeadings, setCustomHeadings, hIndex, "up")}>expand_less</button>
                            <button className="material-symbols-outlined" onClick={() => moveItem(customHeadings, setCustomHeadings, hIndex, "down")}>expand_more</button>
                          </div>
                          <input type="text" placeholder="Heading Title" className="field-input bold-input" value={h.title} onChange={(e) => setCustomHeadings(customHeadings.map(ch => ch.id === h.id ? { ...ch, title: e.target.value } : ch))} />
                          <div className="flex-center gap-2">
                            <button className="add-btn mini" onClick={() => addCustomItem(h.id)}>+ Item</button>
                            <label className="switch mini"><input type="checkbox" checked={h.isActive} onChange={() => toggleActive(customHeadings, setCustomHeadings, h.id)} /><span className="slider round"></span></label>
                            <button className="delete-btn material-symbols-outlined" onClick={() => setCustomHeadings(customHeadings.filter(ch => ch.id !== h.id))}>delete</button>
                          </div>
                        </div>
                        <div className="custom-items-list">
                          {h.items.map((item, iIndex) => (
                            <div key={item.id} className="dynamic-item mini">
                              <div className="move-controls">
                                <button className="material-symbols-outlined" onClick={() => { const newH = [...customHeadings]; const newItems = [...newH[hIndex].items]; if (iIndex > 0) { [newItems[iIndex], newItems[iIndex-1]] = [newItems[iIndex-1], newItems[iIndex]]; newH[hIndex].items = newItems; setCustomHeadings(newH); } }}>expand_less</button>
                              </div>
                              <input type="text" placeholder="Title" className="field-input transparent" value={item.title} onChange={(e) => setCustomHeadings(customHeadings.map(ch => ch.id === h.id ? { ...ch, items: ch.items.map(it => it.id === item.id ? { ...it, title: e.target.value } : it) } : ch))} />
                              <input type="text" placeholder="Subtitle" className="field-input transparent" value={item.subtitle} onChange={(e) => setCustomHeadings(customHeadings.map(ch => ch.id === h.id ? { ...ch, items: ch.items.map(it => it.id === item.id ? { ...it, subtitle: e.target.value } : it) } : ch))} />
                              <button className="delete-btn material-symbols-outlined" onClick={() => setCustomHeadings(customHeadings.map(ch => ch.id === h.id ? { ...ch, items: ch.items.filter(it => it.id !== item.id) } : ch))}>delete</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === "daily") {
              return (
                <div key="daily" className="editor-section">
                  <div className="section-header">
                    <div className="section-title">{moveControls}<span className="material-symbols-outlined">event_repeat</span><h2>Daily Activity</h2></div>
                    <button className={`add-btn ${!canAddMore(dailyActivities, ["title"]) ? "disabled" : ""}`} onClick={() => setDailyActivities([...dailyActivities, { id: Date.now(), title: "", time: "", isActive: true }])}>Add Activity</button>
                  </div>
                  <div className="dynamic-list">
                    {dailyActivities.map((act, index) => (
                      <div key={act.id} className="dynamic-item">
                        <div className="move-controls">
                          <button className="material-symbols-outlined" onClick={() => moveItem(dailyActivities, setDailyActivities, index, "up")}>expand_less</button>
                          <button className="material-symbols-outlined" onClick={() => moveItem(dailyActivities, setDailyActivities, index, "down")}>expand_more</button>
                        </div>
                        <div className="item-inputs">
                          <input type="text" placeholder="Activity Title" className="field-input" value={act.title} onChange={(e) => setDailyActivities(dailyActivities.map(a => a.id === act.id ? { ...a, title: e.target.value } : a))} />
                          <input type="text" placeholder="Time" className="field-input" value={act.time} onChange={(e) => setDailyActivities(dailyActivities.map(a => a.id === act.id ? { ...a, time: e.target.value } : a))} />
                        </div>
                        <label className="switch"><input type="checkbox" checked={act.isActive} onChange={() => toggleActive(dailyActivities, setDailyActivities, act.id)} /><span className="slider round"></span></label>
                        <button className="delete-btn material-symbols-outlined" onClick={() => setDailyActivities(dailyActivities.filter(a => a.id !== act.id))}>delete</button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === "languages") {
              return (
                <div key="languages" className="editor-section">
                  <div className="section-header">
                    <div className="section-title">{moveControls}<span className="material-symbols-outlined">language</span><h2>Languages</h2></div>
                    <button className={`add-btn ${!canAddMore(languages, ["name"]) ? "disabled" : ""}`} onClick={() => setLanguages([...languages, { id: Date.now(), name: "", isActive: true }])}>+</button>
                  </div>
                  {languages.map((l, index) => (
                    <div key={l.id} className="dynamic-item mini">
                      <div className="move-controls"><button className="material-symbols-outlined" onClick={() => moveItem(languages, setLanguages, index, "up")}>expand_less</button></div>
                      <input type="text" placeholder="Language" className="field-input transparent" value={l.name} onChange={(e) => setLanguages(languages.map(lx => lx.id === l.id ? { ...lx, name: e.target.value } : lx))} />
                      <label className="switch mini"><input type="checkbox" checked={l.isActive} onChange={() => toggleActive(languages, setLanguages, l.id)} /><span className="slider round"></span></label>
                      <button className="delete-btn material-symbols-outlined" onClick={() => setLanguages(languages.filter(lx => lx.id !== l.id))}>delete</button>
                    </div>
                  ))}
                </div>
              );
            }

            if (sectionKey === "hobbies") {
              return (
                <div key="hobbies" className="editor-section">
                  <div className="section-header">
                    <div className="section-title">{moveControls}<span className="material-symbols-outlined">sports_esports</span><h2>Hobbies</h2></div>
                    <button className={`add-btn ${!canAddMore(hobbies, ["name"]) ? "disabled" : ""}`} onClick={() => setHobbies([...hobbies, { id: Date.now(), name: "", isActive: true }])}>+</button>
                  </div>
                  {hobbies.map((h, index) => (
                    <div key={h.id} className="dynamic-item mini">
                      <div className="move-controls"><button className="material-symbols-outlined" onClick={() => moveItem(hobbies, setHobbies, index, "up")}>expand_less</button></div>
                      <input type="text" placeholder="Hobby" className="field-input transparent" value={h.name} onChange={(e) => setHobbies(hobbies.map(hx => hx.id === h.id ? { ...hx, name: e.target.value } : hx))} />
                      <label className="switch mini"><input type="checkbox" checked={h.isActive} onChange={() => toggleActive(hobbies, setHobbies, h.id)} /><span className="slider round"></span></label>
                      <button className="delete-btn material-symbols-outlined" onClick={() => setHobbies(hobbies.filter(hx => hx.id !== h.id))}>delete</button>
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          })}
        </section>

        {/* Sticky Sidebar Preview */}
        <aside className={`editor-sidebar ${previewMode}`}>
          <div className="sticky-preview-body">
            <div className="preview-mode-toggle">
              <button className={previewMode === 'mobile' ? 'active' : ''} onClick={() => setPreviewMode('mobile')}>
                <span className="material-symbols-outlined">smartphone</span> Mobile
              </button>
              <button className={previewMode === 'web' ? 'active' : ''} onClick={() => setPreviewMode('web')}>
                <span className="material-symbols-outlined">laptop</span> Web
              </button>
            </div>

            {previewMode === 'mobile' ? (
              <div className="phone-mockup">
                <div className="phone-screen-scroll-area no-scrollbar" style={{ background: profile.bgColor }}>
                  <div className="phone-screen-fixed" style={{ padding: '3rem 2rem 1.5rem', borderBottom: `1px solid ${profile.subTextColor}20` }}>
                    <div className="preview-avatar circle" style={{ borderColor: profile.themeColor, width: '80px', height: '80px' }}>
                      <img src={profile.avatar} alt="Profile" />
                    </div>
                    <div className="preview-text">
                      <h4 style={{ color: profile.textColor, fontSize: '1.25rem' }}>{profile.name}</h4>
                      <p className="designation" style={{ color: profile.themeColor, fontWeight: 800 }}>{profile.designation}</p>
                      <p className="bio" style={{ color: profile.subTextColor, fontSize: '0.8rem' }}>{profile.bio}</p>
                    </div>
                    {(profile.showMobile || profile.showEmail || profile.showAddress) && (
                      <div className="contact-info-preview-grid" style={{ padding: '0 2rem' }}>
                        {profile.showMobile && profile.mobile && (<div className="contact-preview-item" style={{ color: profile.subTextColor }}><span className="material-symbols-outlined" style={{ fontSize: '1rem', color: profile.themeColor }}>call</span>{profile.mobile}</div>)}
                        {profile.showEmail && profile.email && (<div className="contact-preview-item" style={{ color: profile.subTextColor }}><span className="material-symbols-outlined" style={{ fontSize: '1rem', color: profile.themeColor }}>mail</span>{profile.email}</div>)}
                        {profile.showAddress && profile.address && (<div className="contact-preview-item" style={{ color: profile.subTextColor }}><span className="material-symbols-outlined" style={{ fontSize: '1rem', color: profile.themeColor }}>location_on</span><span style={{ fontSize: '0.75rem', lineHeight: 1.3 }}>{profile.address}</span></div>)}
                      </div>
                    )}
                  </div>
                  <div className="preview-content-sections" style={{ padding: '0 2rem 4rem' }}>
                    {sectionOrder.map(sectionKey => {
                      if (profile.cardType === 'shopkeeper' && ["projects", "experience", "hobbies"].includes(sectionKey)) return null;
                      if (profile.cardType === 'business' && sectionKey === "products") return null;
                      if (sectionKey === "links" && dynamicSections.some(s => s.isActive)) {
                        return (<div key="links" className="preview-links-grid">{dynamicSections.filter(s => s.isActive).map(s => (<div key={s.id} className="preview-link-circle" style={{ color: profile.themeColor, background: `${profile.themeColor}15` }}>{s.icon ? <img src={s.icon} className="custom-icon" /> : <span className="material-symbols-outlined">link</span>}</div>))}</div>);
                      }
                      if (sectionKey === "products" && products.some(p => p.isActive)) {
                        return (<div key="products" className="preview-list-section"><h5 style={{ color: profile.themeColor }}>Product Catalog</h5><div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>{products.filter(p => p.isActive).map(p => (<div key={p.id} className="mini-card-preview" style={{ background: `${profile.textColor}08`, display: 'flex', gap: '0.75rem', opacity: p.isOutOfStock ? 0.6 : 1 }}><div style={{ width:'50px',height:'50px',background:'white',borderRadius:'8px',overflow:'hidden',flexShrink:0 }}>{p.icon?<img src={p.icon} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span className="material-symbols-outlined" style={{fontSize:'1.5rem',color:'#ccc',display:'flex',justifyContent:'center',height:'100%',alignItems:'center'}}>image</span>}</div><div style={{flex:1}}><p className="p-bold" style={{color:profile.textColor}}>{p.title}</p><span style={{fontSize:'0.7rem',fontWeight:800,color:profile.themeColor}}>₹{p.price}</span></div></div>))}</div></div>);
                      }
                      if (sectionKey === "experience" && experiences.some(e => e.isActive)) {
                        return (<div key="experience" className="preview-list-section"><h5 style={{ color: profile.themeColor }}>Professional Exp.</h5>{experiences.filter(e => e.isActive).map(e => (<div key={e.id} className="mini-card-preview" style={{ background: `${profile.textColor}08` }}><p className="p-bold" style={{ color: profile.textColor }}>{e.role}</p><p className="p-sub" style={{ color: profile.subTextColor }}>{e.company} • {e.start} - {e.isCurrent ? "Present" : e.end}</p></div>))}</div>);
                      }
                      if (sectionKey === "languages" && languages.some(l => l.isActive)) {
                        return (<div key="languages" className="preview-list-section"><h5 style={{ color: profile.themeColor }}>Languages</h5><div className="tags-preview">{languages.filter(l => l.isActive).map(l => <span key={l.id} style={{ color: profile.textColor, background: `${profile.themeColor}15` }}>{l.name}</span>)}</div></div>);
                      }
                      if (sectionKey === "hobbies" && hobbies.some(h => h.isActive)) {
                        return (<div key="hobbies" className="preview-list-section"><h5 style={{ color: profile.themeColor }}>Hobbies</h5><div className="tags-preview">{hobbies.filter(h => h.isActive).map(h => <span key={h.id} style={{ color: profile.textColor, background: `${profile.themeColor}15` }}>{h.name}</span>)}</div></div>);
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="web-mockup">
                <div className="web-preview-header">
                  <div className="web-dot"></div><div className="web-dot"></div><div className="web-dot"></div>
                  <div style={{ marginLeft: 'auto', fontSize: '10px', color: profile.subTextColor, opacity: 0.6 }}>prism.qr/{profile.name.toLowerCase().replace(/\s+/g, '-')}</div>
                </div>
                <div className="web-preview-container" style={{ background: profile.bgColor, overflowY: 'auto', maxHeight: '70vh' }}>
                  <div className="web-preview-content" style={{ background: 'white', padding: '2rem' }}>
                    <div className="web-profile-intro" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                      <div className="preview-avatar circle" style={{ width: '140px', height: '140px', borderColor: profile.themeColor, margin: '0 auto' }}>
                        <img src={profile.avatar} alt="Profile" />
                      </div>
                      <h2 style={{ fontSize: '2.5rem', marginTop: '1.5rem', fontWeight: 800, color: profile.textColor }}>{profile.name}</h2>
                      <p className="designation" style={{ color: profile.themeColor, fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{profile.designation}</p>
                      {(profile.showMobile || profile.showEmail || profile.showAddress) && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                          {profile.showMobile && profile.mobile && (<div className="contact-preview-item" style={{ color: profile.subTextColor }}><span className="material-symbols-outlined" style={{ color: profile.themeColor, fontSize: '1.1rem' }}>call</span>{profile.mobile}</div>)}
                          {profile.showEmail && profile.email && (<div className="contact-preview-item" style={{ color: profile.subTextColor }}><span className="material-symbols-outlined" style={{ color: profile.themeColor, fontSize: '1.1rem' }}>mail</span>{profile.email}</div>)}
                          {profile.showAddress && profile.address && (<div className="contact-preview-item" style={{ color: profile.subTextColor }}><span className="material-symbols-outlined" style={{ color: profile.themeColor, fontSize: '1.1rem' }}>location_on</span>{profile.address}</div>)}
                        </div>
                      )}
                      <p className="bio" style={{ fontSize: '0.95rem', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0', lineHeight: 1.6, color: profile.subTextColor }}>{profile.bio}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem', marginTop: '2rem', textAlign: 'left' }}>
                      {sectionOrder.map(sectionKey => {
                        if (profile.cardType === 'shopkeeper' && ["projects", "experience", "hobbies"].includes(sectionKey)) return null;
                        if (profile.cardType === 'business' && sectionKey === "products") return null;

                        if (sectionKey === "links" && dynamicSections.some(s => s.isActive)) {
                          return (
                            <div key="links" style={{ gridColumn: '1 / -1' }}>
                              <div className="preview-links-grid" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                                {dynamicSections.filter(s => s.isActive).map(s => (
                                  <div key={s.id} className="preview-link-circle" style={{ width: '56px', height: '56px', color: profile.themeColor, background: `${profile.themeColor}15` }}>
                                    {s.icon ? <img src={s.icon} className="custom-icon" /> : <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>link</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        if (sectionKey === "products" && products.some(p => p.isActive)) {
                          return (
                            <div key="products" style={{ gridColumn: '1 / -1' }}>
                              <h5 style={{ color: profile.themeColor, fontSize: '1.1rem', marginBottom: '1rem' }}>Product Catalog</h5>
                              <div className="web-product-grid">
                                {products.filter(p => p.isActive).map(p => (
                                  <div key={p.id} className="web-product-card" style={{ opacity: p.isOutOfStock ? 0.7 : 1 }}>
                                    <div className="web-product-img">
                                      {p.icon ? <img src={p.icon} /> : <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#eee' }}>image</span>}
                                    </div>
                                    <div className="web-product-info">
                                      <p className="p-bold" style={{ color: profile.textColor }}>{p.title}</p>
                                      <div className="price-row">
                                        <span className="current-price" style={{ color: profile.themeColor }}>₹{p.price - (p.price * (p.offer || 0) / 100)}</span>
                                        {p.offer > 0 && <span className="original-price">₹{p.price}</span>}
                                        {p.offer > 0 && <span className="product-tag offer">{p.offer}% OFF</span>}
                                      </div>
                                      {p.isOutOfStock && <span className="product-tag out">Out of Stock</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        if (sectionKey === "projects" && projects.some(p => p.isActive)) {
                          return (
                            <div key="projects" className="preview-list-section">
                              <h5 style={{ color: profile.themeColor, fontSize: '1.1rem' }}>Projects Portfolio</h5>
                              {projects.filter(p => p.isActive).map(p => (
                                <div key={p.id} className="mini-card-preview" style={{ background: `${profile.textColor}05`, padding: '1rem' }}>
                                  <p className="p-bold" style={{ color: profile.textColor }}>{p.title}</p>
                                  <p className="p-sub" style={{ color: profile.subTextColor }}>{p.type}</p>
                                  <p style={{ fontSize: '0.8rem', color: profile.subTextColor, lineHeight: 1.4 }}>{p.description}</p>
                                </div>
                              ))}
                            </div>
                          );
                        }

                        if (sectionKey === "experience" && experiences.some(e => e.isActive)) {
                          return (
                            <div key="experience" className="preview-list-section">
                              <h5 style={{ color: profile.themeColor, fontSize: '1.1rem' }}>Work Experience</h5>
                              {experiences.filter(e => e.isActive).map(e => (
                                <div key={e.id} className="mini-card-preview" style={{ background: `${profile.textColor}05`, padding: '1rem' }}>
                                  <p className="p-bold" style={{ color: profile.textColor }}>{e.role}</p>
                                  <p className="p-sub" style={{ color: profile.subTextColor }}>{e.company} • {e.start} - {e.isCurrent ? 'Present' : e.end}</p>
                                </div>
                              ))}
                            </div>
                          );
                        }

                        if (sectionKey === "custom" && customHeadings.some(h => h.isActive)) {
                          return (
                            <div key="custom">
                              {customHeadings.filter(h => h.isActive).map(h => (
                                <div key={h.id} className="preview-list-section">
                                  <h5 style={{ color: profile.themeColor, fontSize: '1.1rem' }}>{h.title}</h5>
                                  {h.items.filter(it => it.isActive).map(it => (
                                    <div key={it.id} className="mini-card-preview" style={{ background: `${profile.textColor}05`, padding: '0.75rem 1rem' }}>
                                      <p className="p-bold" style={{ color: profile.textColor }}>{it.title}</p>
                                      <p className="p-sub" style={{ color: profile.subTextColor }}>{it.subtitle}</p>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          );
                        }

                        if (sectionKey === "daily" && dailyActivities.some(a => a.isActive)) {
                          return (
                            <div key="daily" className="preview-list-section">
                              <h5 style={{ color: profile.themeColor, fontSize: '1.1rem' }}>Daily Routine</h5>
                              {dailyActivities.filter(a => a.isActive).map(a => (
                                <div key={a.id} className="mini-card-preview" style={{ background: `${profile.textColor}05`, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between' }}>
                                  <p className="p-bold" style={{ color: profile.textColor }}>{a.title}</p>
                                  <span style={{ fontSize: '0.75rem', color: profile.themeColor, fontWeight: 800 }}>{a.time}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }

                        if (sectionKey === "languages" && languages.some(l => l.isActive)) {
                          return (
                            <div key="languages" className="preview-list-section">
                              <h5 style={{ color: profile.themeColor, fontSize: '1.1rem' }}>Languages</h5>
                              <div className="tags-preview">{languages.filter(l => l.isActive).map(l => <span key={l.id} style={{ color: profile.textColor, background: `${profile.themeColor}15` }}>{l.name}</span>)}</div>
                            </div>
                          );
                        }

                        if (sectionKey === "hobbies" && hobbies.some(h => h.isActive)) {
                          return (
                            <div key="hobbies" className="preview-list-section">
                              <h5 style={{ color: profile.themeColor, fontSize: '1.1rem' }}>Hobbies</h5>
                              <div className="tags-preview">{hobbies.filter(h => h.isActive).map(h => <span key={h.id} style={{ color: profile.textColor, background: `${profile.themeColor}15` }}>{h.name}</span>)}</div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
