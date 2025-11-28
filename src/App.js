import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles.css';
import Layout from './Layout';
import { createPageUrl } from './utils';

const Home = React.lazy(() => import('./Pages/Home'));
const Gyms = React.lazy(() => import('./Pages/Gyms'));
const Map = React.lazy(() => import('./Pages/Map'));
const Pricing = React.lazy(() => import('./Pages/Pricing'));
const Profile = React.lazy(() => import('./Pages/Profile'));
const GymRegistration = React.lazy(() => import('./Pages/GymRegistration'));
const GymOwnerDashboard = React.lazy(() => import('./Pages/GymOwnerDashboard'));
const ScanMember = React.lazy(() => import('./Pages/ScanMember'));
const GymDetail = React.lazy(() => import('./Pages/GymDetail'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Routes>
              <Route path={createPageUrl("Home")} element={<Home />} />
              <Route path={createPageUrl("Gyms")} element={<Gyms />} />
              <Route path={createPageUrl("Map")} element={<Map />} />
              <Route path={createPageUrl("Pricing")} element={<Pricing />} />
              <Route path={createPageUrl("Profile")} element={<Profile />} />
              <Route path={createPageUrl("GymRegistration")} element={<GymRegistration />} />
              <Route path={createPageUrl("GymOwnerDashboard")} element={<GymOwnerDashboard />} />
              <Route path={createPageUrl("ScanMember")} element={<ScanMember />} />
              <Route path={`${createPageUrl("GymDetail")}?id=:id`} element={<GymDetail />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;