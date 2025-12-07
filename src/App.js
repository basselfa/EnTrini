import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles.css';
import Layout from './Layout';
import { AuthProvider } from './contexts/AuthContext';
import { createPageUrl } from './utils';

import Home from './Pages/Home';
const Membership = React.lazy(() => import('./Pages/Membership'));
const Gyms = React.lazy(() => import('./Pages/Gyms'));
const Map = React.lazy(() => import('./Pages/Map'));
const Pricing = React.lazy(() => import('./Pages/Pricing'));
const Profile = React.lazy(() => import('./Pages/Profile'));
const GymRegistration = React.lazy(() => import('./Pages/GymRegistration'));
const GymOwnerDashboard = React.lazy(() => import('./Pages/GymOwnerDashboard'));
const ScanMember = React.lazy(() => import('./Pages/ScanMember'));
const GymDetail = React.lazy(() => import('./Pages/GymDetail'));
const Login = React.lazy(() => import('./Pages/Login'));
const Register = React.lazy(() => import('./Pages/Register'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
              <Routes>
                <Route path={createPageUrl("Home")} element={<Home />} />
                <Route path={createPageUrl("Membership")} element={<Membership />} />
                <Route path={createPageUrl("Gyms")} element={<Gyms />} />
                <Route path={createPageUrl("Map")} element={<Map />} />
                <Route path={createPageUrl("Pricing")} element={<Pricing />} />
                <Route path={createPageUrl("Profile")} element={<Profile />} />
                <Route path={createPageUrl("GymRegistration")} element={<GymRegistration />} />
                <Route path={createPageUrl("GymOwnerDashboard")} element={<GymOwnerDashboard />} />
                <Route path={createPageUrl("ScanMember")} element={<ScanMember />} />
                <Route path={createPageUrl("GymDetail")} element={<GymDetail />} />
                <Route path={createPageUrl("Login")} element={<Login />} />
                <Route path={createPageUrl("Register")} element={<Register />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;