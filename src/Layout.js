import React, { createContext, useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Home, Dumbbell, User, Building2, Menu, Globe, Map, QrCode } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { base44 } from "./api/base44Client";
import { useQuery } from "@tanstack/react-query";
import ChatWidget from "./Components/chat/ChatWidget";

const translations = {
  en: {
    home: "Home",
    gyms: "Gyms",
    map: "Map",
    profile: "My Profile",
    registerGym: "Register Gym",
    pricing: "Pricing",
    universalAccess: "Universal Access",
    language: "Language",
    gymDashboard: "Gym Dashboard",
    scanMember: "Scan Member",
  },
  fr: {
    home: "Accueil",
    gyms: "Gymnases",
    map: "Carte",
    profile: "Mon Profil",
    registerGym: "Enregistrer Salle",
    pricing: "Tarifs",
    universalAccess: "Accès Universel",
    language: "Langue",
    gymDashboard: "Tableau de Bord",
    scanMember: "Scanner Membre",
  },
  ar: {
    home: "الرئيسية",
    gyms: "النوادي الرياضية",
    map: "الخريطة",
    profile: "ملفي الشخصي",
    registerGym: "تسجيل نادي",
    pricing: "الأسعار",
    universalAccess: "دخول شامل",
    language: "اللغة",
    gymDashboard: "لوحة التحكم",
    scanMember: "مسح عضو",
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

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const { data: userGym } = useQuery({
    queryKey: ['userGym', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const gyms = await base44.entities.Gym.filter({ owner_email: user.email });
      return gyms[0] || null;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    localStorage.setItem('trini213_language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];
  const isRTL = language === 'ar';

  const navigationItems = [
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
  ];

  // Add gym owner navigation if user owns a gym
  if (userGym) {
    navigationItems.push({
      title: t.gymDashboard,
      url: createPageUrl("GymOwnerDashboard"),
      icon: Building2,
    });
    navigationItems.push({
      title: t.scanMember,
      url: createPageUrl("ScanMember"),
      icon: QrCode,
    });
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <SidebarProvider>
        <div className={`min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-white to-red-50 ${isRTL ? 'rtl' : 'ltr'}`}>
          <style>{`
            :root {
              --primary: 0 70% 45%;
              --primary-foreground: 0 0% 100%;
              --secondary: 0 0% 10%;
              --secondary-foreground: 0 0% 100%;
              --accent: 0 85% 45%;
            }
            
            .rtl {
              direction: rtl;
            }
          `}</style>
          
          <Sidebar className={`border-${isRTL ? 'l' : 'r'} border-white/20 bg-white/90 backdrop-blur-xl`}>
            <SidebarHeader className="border-b border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 flex-shrink-0 bg-gradient-to-br from-red-600 to-black rounded-xl shadow-xl flex items-center justify-center">
                  <Dumbbell className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="font-bold text-2xl bg-gradient-to-r from-red-600 via-black to-red-800 bg-clip-text text-transparent tracking-wide">
                    ENTRINI
                  </h2>
                  <p className="text-xs text-gray-600 font-medium">{t.universalAccess}</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-3">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`
                            hover:bg-gradient-to-r hover:from-red-50 hover:to-gray-50
                            transition-all duration-300 rounded-xl mb-1 group
                            ${location.pathname === item.url ? 'bg-gradient-to-r from-red-600 to-black text-white shadow-lg' : ''}
                          `}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                              location.pathname === item.url ? 'text-white' : 'text-gray-700'
                            }`} />
                            <span className={`font-semibold ${
                              location.pathname === item.url ? 'text-white' : 'text-gray-800'
                            }`}>
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <div className="px-3 mt-6 pt-6 border-t border-gray-200">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2 border-2 hover:border-red-600 hover:bg-red-50 transition-all">
                      <Globe className="w-4 h-4 text-red-600" />
                      <span className="font-semibold">{t.language}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isRTL ? "end" : "start"} className="w-48">
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
              </div>
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-100 p-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-50 to-gray-50">
                <Avatar className="w-10 h-10 border-2 border-red-600 shadow-md">
                  <AvatarImage src={user?.profile_image} />
                  <AvatarFallback className="bg-gradient-to-br from-red-600 to-black text-white font-bold text-lg">
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {user?.full_name || (language === 'fr' ? 'Utilisateur' : language === 'ar' ? 'مستخدم' : 'User')}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4 lg:hidden sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="hover:bg-red-100 p-2 rounded-lg transition-colors">
                    <Menu className="w-5 h-5" />
                  </SidebarTrigger>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-black rounded-lg flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
                      ENTRINI
                    </h1>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Globe className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLanguage('en')}>🇬🇧 EN</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('fr')}>🇫🇷 FR</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('ar')}>🇩🇿 AR</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
      
      {/* Chat Widget */}
      <ChatWidget />
    </LanguageContext.Provider>
  );
}