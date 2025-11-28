export function createPageUrl(page) {
  const routes = {
    Home: "/",
    Gyms: "/gyms",
    Map: "/map",
    Pricing: "/pricing",
    Profile: "/profile",
    GymRegistration: "/register-gym",
    GymOwnerDashboard: "/gym-dashboard",
    ScanMember: "/scan-member",
    GymDetail: "/gym-detail"
  };
  return routes[page] || "/";
}