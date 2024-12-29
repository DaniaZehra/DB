import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './sign-in/sign-in';
import SignUpCustomer from './sign-up/customer';
import SignUpTransporter from './sign-up/transporter';
import NavigationAppBar from './customer/SearchAppBar';
import Dashboard from './transporter/dashboard';
import LandingPage from './landing-page/landing-page';
import AdminLandingPage from './admin/adminWelcomePage';
import ProfilePage from './customer/ProfilePage';
import AdminSignIn from './admin/adminSign-In';
import AdminCRUD from './admin/adminDashboard';
import AdminAnalytics from './admin/analytics';
import SettingsPage from './customer/settingsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up-customer" element={<SignUpCustomer />} />
        <Route path="/sign-up-transporter" element={<SignUpTransporter />} />
        <Route path="/navigation-app-bar" element={<NavigationAppBar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminSignIn />} />
        <Route path="/adminDashboard" element={<AdminLandingPage />} />
        <Route path="/customer-profile-page" element={<ProfilePage />} />
        <Route path="/admin-crud" element={<AdminCRUD />} />
        <Route path="/admin-analytics" element={<AdminAnalytics />} />
        <Route path="/SettingsPage" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
