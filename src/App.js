import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles.css';
import Layout from './Layout';
import Home from './Pages/Home';
import Gyms from './Pages/Gyms';
import Map from './Pages/Map';
import Pricing from './Pages/Pricing';
import Profile from './Pages/Profile';
import GymRegistration from './Pages/GymRegistration';
import GymOwnerDashboard from './Pages/GymOwnerDashboard';
import ScanMember from './Pages/ScanMember';
import GymDetail from './Pages/GymDetail';
import { createPageUrl } from './utils';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
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
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;