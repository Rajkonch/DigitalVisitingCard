"use client";
import React, { useState } from "react";
import "../../styles/UserEditPublishProfile.css";
import { useRouter } from "next/navigation";
import API from "../../utils/api";

export default function EditProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "Alex Prism",
    designation: "Creative Technologist",
    bio: "Building the future of interactive identity.",
    themeColor: "#00647b",
    textColor: "#1a1c1e",
    subTextColor: "#40484c",
    bgColor: "#f0f4f8",
    bgPattern: "none",
    cardType: "business",
    avatar: "https://api.dicebear.com/9.x/micah/svg?seed=Alex",
    mobile: "+91 98765 43210",
    showMobile: true,
    email: "contact@prismqr.com",
    showEmail: true,
    address: "Skyline Business Park, Mumbai, India",
    showAddress: true
  });

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file, type, id = null) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = res.data.url;

      if (type === "avatar") {
        setProfile({ ...profile, avatar: imageUrl });
      }
      // handle products/links similarly
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed. Check your Cloudinary config.");
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async () => {
    try {
      await API.post("/cards", profile);
      alert("Profile Published Successfully! 🚀");
      router.push("/dashboard");
    } catch (err) {
      alert("Error publishing profile: " + err.message);
    }
  };

  return (
    <div className="profile-editor-container">
      <header className="editor-nav">
        <span className="nav-brand" onClick={() => router.push("/dashboard")} style={{ cursor: "pointer" }}>Prism QR</span>
        <button className="publish-btn" onClick={handlePublish}>Publish Profile</button>
      </header>

      <main className="editor-main">
        <section className="editor-content">
          <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Design Identity</h1>
          
          <div className="editor-section">
            <div className="avatar-upload-main">
              <div className="avatar-preview-wrapper" onClick={() => document.getElementById('avatar-input').click()}>
                <img src={profile.avatar} alt="Avatar" />
                <div className="avatar-overlay">
                  <span className="material-symbols-outlined">{uploading ? 'sync' : 'camera_alt'}</span>
                </div>
              </div>
              <input 
                id="avatar-input"
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e.target.files[0], "avatar")} 
              />
              <div style={{ flex: 1 }}>
                <p className="field-label">Profile Photo (Live Cloudinary)</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Upload once and it scales across all CDNs.</p>
              </div>
            </div>
          </div>

          {/* Other sections like links, products, etc. would go here */}
          <div className="editor-section">
             <h3>Fast UI with Next.js</h3>
             <p>This editor is now running on Next.js for maximum performance and SEO readiness.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
