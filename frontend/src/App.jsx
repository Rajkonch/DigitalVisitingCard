import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import CreateCard from "./pages/CreateCard";
import UserEditPublishProfile from "./pages/UserEditPublishProfile";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/create" element={<CreateCard />} />
        <Route path="/profile-editor" element={<UserEditPublishProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
