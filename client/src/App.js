import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './sign-in/sign-in';
import SignUpCustomer from './sign-up/customer';
import SignUpTransporter from './sign-up/transporter';
import NavigationAppBar from './components/SearchAppBar';
import Dashboard from './transporter/dashboard';
import LandingPage from './landing-page/landing-page';
import AdminDashboard from './admin/adminDashboard';
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
    <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
    </Router> 
  )

}

export default App;
