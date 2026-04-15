"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "../../styles/auth.css";
import API from "../../utils/api";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "", // Added
  });
  const [loading, setLoading] = useState(false);
  const [showPendingDialog, setShowPendingDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Added for toggle

  // Modern Stylish Toast State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    if (searchParams.get("register") === "true") {
      setIsRegister(true);
    }
  }, [searchParams]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };
      const res = await API.post("/auth/login", payload);

      const userData = res.data;
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));

      showToast("Login successful! 🚀", "success");

      setTimeout(() => {
        if (userData.role === "admin") {
          router.push("/AdminDashboard");
        } else {
          router.push("/UserDashboard");
        }
      }, 1200);

    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate Password match
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match! ❌", "error");
      return;
    }

    // Validate Mobile Number (Exactly 10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      showToast("Please enter a valid 10-digit mobile number! 📱", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      };
      const res = await API.post("/auth/register", payload);

      const userData = res.data;
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setShowPendingDialog(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Pending Approval Dialog */}
      {showPendingDialog && (
        <div className="modern-dialog-overlay">
          <div className="modern-dialog">
            <div className="dialog-icon-wrapper">
              <span className="material-symbols-outlined pending-icon">hourglass_top</span>
            </div>
            <h2>Your Request is Pending</h2>
            <p>
              Soon Inform Confirmation Activate your Accounts Thankyou !
            </p>
            <button className="auth-btn solid-btn primary-gradient-btn" onClick={() => {
              setShowPendingDialog(false);
              setIsRegister(false);
            }}>
              Back to Login
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Animated Background Elements */}
      <div className="modern-bg-elements">
        <div className="qr-float q1"><span className="material-symbols-outlined">qr_code_2</span></div>
        <div className="qr-float q2"><span className="material-symbols-outlined">qr_code_scanner</span></div>
        <div className="qr-float q3"><span className="material-symbols-outlined">qr_code_2</span></div>
        <div className="qr-float q4"><span className="material-symbols-outlined">document_scanner</span></div>
        <div className="balloon b1"></div>
        <div className="balloon b2"></div>
        <div className="balloon b3"></div>
      </div>

      {/* Modern Stylish Toast */}
      {toast.show && (
        <div className={`modern-toast ${toast.type}`}>
          <span className="material-symbols-outlined">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <p>{toast.message}</p>
        </div>
      )}

      <div className="login-animation-wrapper">
        <div className={`auth-container entrance-bounce-active ${isRegister ? "right-panel-active" : ""}`}>

          {/* Register Form */}
          <div className="form-container sign-up-container">
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="content-wrapper">
                <img src="/logo.png" alt="Logo" style={{ height: '50px', marginBottom: '1rem', objectFit: 'contain' }} />
                <span className="subtitle-badge">Join Us</span>
                <h2>Create your identity</h2>
                <p className="auth-subtitle">Design dynamic QR codes in high-fidelity.</p>

                <div className="input-field">
                  <div className="icon-input">
                    <span className="material-symbols-outlined">person</span>
                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="input-field">
                  <div className="icon-input">
                    <span className="material-symbols-outlined">mail</span>
                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="input-field">
                  <div className="icon-input">
                    <span className="material-symbols-outlined">call</span>
                    <input type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="input-field">
                  <div className="icon-input relative">
                    <span className="material-symbols-outlined">lock</span>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      placeholder="Password" 
                      value={formData.password} 
                      onChange={handleInputChange} 
                      required 
                    />
                    <span 
                      className="material-symbols-outlined eye-icon" 
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </div>
                </div>
                {/* Confirm Password Field */}
                <div className="input-field">
                  <div className="icon-input relative">
                    <span className="material-symbols-outlined">lock_reset</span>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="confirmPassword" 
                      placeholder="Confirm Password" 
                      value={formData.confirmPassword} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>

                <button className="auth-btn solid-btn primary-gradient-btn" type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Start for Free"}
                </button>
                <p className="mobile-toggle">Already have an account? <span onClick={() => setIsRegister(false)}>Log In</span></p>
              </div>
            </form>
          </div>

          {/* Login Form */}
          <div className="form-container sign-in-container">
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="content-wrapper">
                <img src="/logo.png" alt="Logo" style={{ height: '50px', marginBottom: '1rem', objectFit: 'contain' }} />
                <span className="subtitle-badge">Welcome Back</span>
                <h2>Sign in to Prism</h2>
                <div className="input-field">
                  <div className="icon-input">
                    <span className="material-symbols-outlined">mail</span>
                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="input-field">
                  <div className="icon-input relative">
                    <span className="material-symbols-outlined">lock</span>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      placeholder="Password" 
                      value={formData.password} 
                      onChange={handleInputChange} 
                      required 
                    />
                    <span 
                      className="material-symbols-outlined eye-icon" 
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </div>
                </div>
                <button className="auth-btn solid-btn primary-gradient-btn" type="submit" disabled={loading}>
                  {loading ? "Signing In..." : "Enter Prism"}
                </button>
                <p className="mobile-toggle">New Here? <span onClick={() => setIsRegister(true)}>Sign Up</span></p>
              </div>
            </form>
          </div>

          {/* Overlay */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h2>Already Registered?</h2>
                <button className="ghost-btn" onClick={() => setIsRegister(false)}>Log In</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h2>New Here?</h2>
                <button className="ghost-btn" onClick={() => setIsRegister(true)}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
