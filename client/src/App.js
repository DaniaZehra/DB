import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './sign-in/sign-in';
import SignUpCustomer from './sign-up/customer';
import SignUpTransporter from './sign-up/transporter';
import NavigationAppBar from './components/SearchAppBar';
import Dashboard from './transporter/dashboard';
import LandingPage from './landing-page/landing-page';
import AdminDashboard from './admin/adminDashboard';
import ProfilePage from './components/ProfilePage';
import AdminSignIn from './admin/adminSign-In';
import './App.css';

function App() {
  return (
    <Router>
    <Routes>
    <Route path="/" element={<LandingPage />} /> 
    <Route path="/sign-in" element={<SignIn/>}/>
    <Route path="/sign-up-customer" element={<SignUpCustomer/>}/>
    <Route path="/sign-up-transporter" element={<SignUpTransporter/>}/>
    <Route path="/navigation-app-bar" element={<NavigationAppBar />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/admin" element={<AdminSignIn />} />
    <Route path="/adminDashboard" element={<AdminDashboard/>}/>
    <Route path="/customer-profile-page" element={<ProfilePage/>}/>
    </Routes>
    </Router> 
  )

}

export default App;
