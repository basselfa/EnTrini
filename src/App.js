import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles.css';
import Layout from './Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Auth guard component
const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={createPageUrl("Login")} replace />;
  }

  return children;
};

// Public routes component
const PublicRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to={createPageUrl("Home")} replace />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path={createPageUrl("Login")} element={<Login />} />
        <Route path={createPageUrl("Register")} element={<Register />} />
        <Route path="*" element={<Navigate to={createPageUrl("Login")} replace />} />
      </Routes>
    </Suspense>
  );
};

// Protected routes component
const ProtectedRoutes = () => (
  <AuthGuard>
    <Layout>
      <Suspense fallback={<LoadingScreen />}>
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
          <Route path="*" element={<Navigate to={createPageUrl("Home")} replace />} />
        </Routes>
      </Suspense>
    </Layout>
  </AuthGuard>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login/*" element={<PublicRoutes />} />
            <Route path="/register/*" element={<PublicRoutes />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;