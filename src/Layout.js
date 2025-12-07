import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Home, Dumbbell, User, Building2, Menu, Globe, Map, QrCode, CreditCard, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./Components/ui/avatar";
import { Button } from "./Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./Components/ui/dropdown-menu";
import { useAuth } from "./contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import ChatWidget from "./Components/chat/ChatWidget";

const translations = {
  en: {
    home: "Home",
    membership: "Membership",
    gyms: "Gyms",
    map: "Map",
    profile: "My Profile",
    registerGym: "Register Gym",
    pricing: "Pricing",
    universalAccess: "Universal Access",
    language: "Language",
    gymDashboard: "Gym Dashboard",
    scanMember: "Scan Member",
    login: "Login",
    register: "Register",
    logout: "Logout",
  },
  fr: {
    home: "Accueil",
    membership: "Abonnement",
    gyms: "Gymnases",
    map: "Carte",
    profile: "Mon Profil",
    registerGym: "Enregistrer Salle",
    pricing: "Tarifs",
    universalAccess: "Accès Universel",
    language: "Langue",
    gymDashboard: "Tableau de Bord",
    scanMember: "Scanner Membre",
    login: "Connexion",
    register: "S'inscrire",
    logout: "Déconnexion",
  },
  ar: {
    home: "الرئيسية",
    membership: "العضوية",
    gyms: "النوادي الرياضية",
    map: "الخريطة",
    profile: "ملفي الشخصي",
    registerGym: "تسجيل نادي",
    pricing: "الأسعار",
    universalAccess: "دخول شامل",
    language: "اللغة",
    gymDashboard: "لوحة التحكم",
    scanMember: "مسح عضو",
    login: "تسجيل الدخول",
    register: "التسجيل",
    logout: "تسجيل الخروج",
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export default function Layout({ children }) {
  const location = useLocation();
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('trini213_language') || 'en';
  });
  const { user, logout, loading: authLoading } = useAuth();

  const { data: userGym } = useQuery({
    queryKey: ['userGym', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const gyms = await base44.entities.Gym.filter({ owner_email: user.email });
      return gyms[0] || null;
    },
    enabled: !!user?.email,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    localStorage.setItem('trini213_language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];
  const isRTL = language === 'ar';

  const navigationItems = useMemo(() => {
    const items = [
      {
        title: t.home,
        url: createPageUrl("Home"),
        icon: Home,
      },
      {
        title: t.gyms,
        url: createPageUrl("Gyms"),
        icon: Dumbbell,
      },
      {
        title: t.map,
        url: createPageUrl("Map"),
        icon: Map,
      },
      {
        title: t.pricing,
        url: createPageUrl("Pricing"),
        icon: Building2,
      },
      {
        title: t.profile,
        url: createPageUrl("Profile"),
        icon: User,
      },
      {
        title: t.membership,
        url: createPageUrl("Membership"),
        icon: CreditCard,
      },
      {
        title: t.gymDashboard,
        url: createPageUrl("GymOwnerDashboard"),
        icon: Building2,
      },
      {
        title: t.scanMember,
        url: createPageUrl("ScanMember"),
        icon: QrCode,
      },
    ];
    return items;
  }, [t]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div className={`min-h-screen flex flex-col w-full bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        <style>{`
          .rtl {
            direction: rtl;
          }
        `}</style>

        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex-shrink-0 bg-red-600 flex items-center justify-center rounded-lg">
                  <Dumbbell className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  ENTRINI
                </h1>
              </div>

              {user && (
                <nav className="hidden md:flex items-center gap-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                        location.pathname === item.url
                          ? 'bg-red-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </nav>
              )}
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="md:hidden gap-2">
                      <Menu className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {navigationItems.map((item) => (
                      <DropdownMenuItem key={item.title} asChild>
                        <Link to={item.url} className="flex items-center gap-3 cursor-pointer">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="w-4 h-4 text-red-600" />
                    <span className="hidden sm:inline">{t.language}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer">
                    <span className="text-2xl mr-2">🇬🇧</span> English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('fr')} className="cursor-pointer">
                    <span className="text-2xl mr-2">🇫🇷</span> Français
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('ar')} className="cursor-pointer">
                    <span className="text-2xl mr-2">🇩🇿</span> العربية
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 cursor-pointer">
                      <Avatar className="w-8 h-8 border-2 border-red-600">
                        <AvatarImage src={user?.profile_image} />
                        <AvatarFallback className="bg-red-600 text-white font-bold text-sm">
                          {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block">
                        <p className="font-semibold text-gray-900 text-sm">
                          {user?.full_name || (language === 'fr' ? 'Utilisateur' : language === 'ar' ? 'مستخدم' : 'User')}
                        </p>
                        <p className="text-xs text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      {t.logout || 'Logout'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={createPageUrl('Login')}>
                      {t.login || 'Login'}
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="bg-red-600 hover:bg-red-700">
                    <Link to={createPageUrl('Register')}>
                      {t.register || 'Register'}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </LanguageContext.Provider>
  );
}