import React from "react";
import { base44 } from "../api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Dumbbell, Building2, TrendingUp, MapPin } from "lucide-react";
import { Skeleton } from "../Components/ui/skeleton";
import StatsCard from "../Components/home/StatsCard";
import { Link, Navigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "../Components/ui/button";
import { useLanguage } from "../Layout";
import { useAuth } from "../contexts/AuthContext";

const translations = {
  en: {
    welcome: "Welcome to ENTRINI",
    subtitle: "Pay per visit - Access to all gyms in Algeria",
    availableGyms: "Available Gyms",
    visitsThisMonth: "Visits This Month",
    activeCities: "Active Cities",
    registerGym: "Register Gym",
    gymOwner: "Are you a gym owner?",
    gymOwnerText: "Join our network and attract more clients. No upfront costs.",
    moreInfo: "More Information",
    featuredGyms: "Featured Gyms",
  },
  fr: {
    welcome: "Bienvenue sur ENTRINI",
    subtitle: "Paiement par visite - Accès à toutes les salles en Algérie",
    availableGyms: "Gymnases Disponibles",
    visitsThisMonth: "Visites ce Mois",
    activeCities: "Villes Actives",
    registerGym: "Enregistrer Salle",
    gymOwner: "Vous êtes propriétaire?",
    gymOwnerText: "Rejoignez notre réseau et attirez plus de clients. Sans frais initiaux.",
    moreInfo: "Plus d'Informations",
    featuredGyms: "Gymnases en Vedette",
  },
  ar: {
    welcome: "مرحباً بك في ENTRINI",
    subtitle: "الدفع حسب الزيارة - دخول لجميع النوادي في الجزائر",
    availableGyms: "النوادي المتاحة",
    visitsThisMonth: "الزيارات هذا الشهر",
    activeCities: "المدن النشطة",
    registerGym: "تسجيل نادي",
    gymOwner: "هل أنت صاحب نادي؟",
    gymOwnerText: "انضم إلى شبكتنا واجذب المزيد من العملاء. بدون تكاليف.",
    moreInfo: "المزيد من المعلومات",
    featuredGyms: "نوادي مميزة",
  }
};

export default function Home() {
  const { language, isRTL } = useLanguage();
  const t = translations[language] || translations.en;

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 10 * 60 * 1000,
  });

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to={createPageUrl('Login')} replace />;
  }

  const { data: gyms, isLoading: loadingGyms } = useQuery({
    queryKey: ['featured-gyms'],
    queryFn: async () => {
      const result = await base44.entities.Gym.filter({ status: 'active', featured: true });
      return result;
    },
    initialData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
  });

  const { data: payments, isLoading: loadingPayments } = useQuery({
    queryKey: ['myPayments', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.Payment.filter({ user_email: user.email });
    },
    enabled: !!user?.email,
    initialData: [],
    staleTime: 2 * 60 * 1000,
  });

  return (
    <div className="min-h-screen p-4 md:p-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
            {t.welcome}
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title={t.availableGyms}
            value={loadingGyms ? <Skeleton className="h-8 w-16" /> : gyms.length}
            icon={Building2}
          />
          <StatsCard
            title={t.visitsThisMonth}
            value={loadingPayments ? <Skeleton className="h-8 w-16" /> : payments.filter(p => p.status === 'completed').length}
            icon={TrendingUp}
          />
          <StatsCard
            title={t.activeCities}
            value={loadingGyms ? <Skeleton className="h-8 w-16" /> : new Set(gyms.map(g => g.city)).size}
            icon={MapPin}
          />
        </div>

        <div className="bg-red-600 p-6 text-white max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-2">{t.gymOwner}</h3>
          <p className="text-sm text-white mb-4">
            {t.gymOwnerText}
          </p>
          <Link to={createPageUrl("GymRegistration")}>
            <Button variant="secondary" className="w-full bg-white text-black font-semibold">
              {t.moreInfo}
            </Button>
          </Link>
        </div>

      <div className="bg-white p-6 border border-white/20">
           <h2 className={`text-2xl font-bold text-gray-900 mb-6 ${isRTL ? 'text-right' : ''}`}>{t.featuredGyms}</h2>

           {loadingGyms ? (
             <div className="grid md:grid-cols-3 gap-4">
               {[1, 2, 3].map(i => (
                 <Skeleton key={i} className="h-48 rounded-xl" />
               ))}
             </div>
           ) : (
             <div className="grid md:grid-cols-3 gap-6">
               {gyms.slice(0, 3).map((gym) => (
                 <Link key={gym.id} to={`${createPageUrl("GymDetail")}?id=${gym.id}`}>
                   <div className="group cursor-pointer">
                     <div className="relative h-40 mb-3 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                       <img
                         src={gym.image_url}
                         alt={gym.name}
                         className="w-full h-full object-cover"
                         onError={(e) => {
                           e.target.style.display = 'none';
                           e.target.nextSibling.style.display = 'flex';
                         }}
                       />
                       <p className="text-gray-700 font-semibold" style={{ display: 'none' }}>{gym.name}</p>
                     </div>
                     <p className={`text-sm text-gray-600 flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-1`}>
                       <MapPin className="w-4 h-4 text-purple-500" />
                       {gym.city}
                     </p>
                   </div>
                 </Link>
               ))}
             </div>
           )}
         </div>

       </div>
    </div>
  );
}