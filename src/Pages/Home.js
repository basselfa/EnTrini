import React from "react";
import { base44 } from "../api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Dumbbell, Building2, TrendingUp, MapPin, CreditCard } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import MembershipCard from "../Components/home/MembershipCard";
import StatsCard from "../Components/home/StatsCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "../components/ui/button";
import { useLanguage } from "../Layout";

const translations = {
  en: {
    welcome: "Welcome to ENTRINI",
    subtitle: "Pay per visit - Access to all gyms in Algeria",
    availableGyms: "Available Gyms",
    visitsThisMonth: "Visits This Month",
    activeCities: "Active Cities",
    quickActions: "Quick Actions",
    exploreGyms: "Explore Gyms",
    viewPricing: "View Pricing",
    editProfile: "Edit Profile",
    registerGym: "Register Gym",
    gymOwner: "Are you a gym owner?",
    gymOwnerText: "Join our network and attract more clients. No upfront costs.",
    moreInfo: "More Information",
    featuredGyms: "Featured Gyms",
    viewAll: "View All",
  },
  fr: {
    welcome: "Bienvenue sur ENTRINI",
    subtitle: "Paiement par visite - Accès à toutes les salles en Algérie",
    availableGyms: "Gymnases Disponibles",
    visitsThisMonth: "Visites ce Mois",
    activeCities: "Villes Actives",
    quickActions: "Actions Rapides",
    exploreGyms: "Explorer les Gymnases",
    viewPricing: "Voir les Tarifs",
    editProfile: "Modifier le Profil",
    registerGym: "Enregistrer Salle",
    gymOwner: "Vous êtes propriétaire?",
    gymOwnerText: "Rejoignez notre réseau et attirez plus de clients. Sans frais initiaux.",
    moreInfo: "Plus d'Informations",
    featuredGyms: "Gymnases en Vedette",
    viewAll: "Voir Tout",
  },
  ar: {
    welcome: "مرحباً بك في ENTRINI",
    subtitle: "الدفع حسب الزيارة - دخول لجميع النوادي في الجزائر",
    availableGyms: "النوادي المتاحة",
    visitsThisMonth: "الزيارات هذا الشهر",
    activeCities: "المدن النشطة",
    quickActions: "إجراءات سريعة",
    exploreGyms: "استكشف النوادي",
    viewPricing: "عرض الأسعار",
    editProfile: "تعديل الملف",
    registerGym: "تسجيل نادي",
    gymOwner: "هل أنت صاحب نادي؟",
    gymOwnerText: "انضم إلى شبكتنا واجذب المزيد من العملاء. بدون تكاليف.",
    moreInfo: "المزيد من المعلومات",
    featuredGyms: "نوادي مميزة",
    viewAll: "عرض الكل",
  }
};

export default function Home() {
  const { language, isRTL } = useLanguage();
  const t = translations[language] || translations.en;

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: membership, isLoading: loadingMembership } = useQuery({
    queryKey: ['myMembership', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const memberships = await base44.entities.Membership.filter(
        { user_email: user.email, status: 'active' },
        '-created_date',
        1
      );
      return memberships[0] || null;
    },
    enabled: !!user?.email,
  });

  const { data: gyms, isLoading: loadingGyms } = useQuery({
    queryKey: ['gyms'],
    queryFn: () => base44.entities.Gym.filter({ status: 'active' }),
    initialData: [],
  });

  const { data: payments, isLoading: loadingPayments } = useQuery({
    queryKey: ['myPayments', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.Payment.filter({ user_email: user.email });
    },
    enabled: !!user?.email,
    initialData: [],
  });

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 via-black to-red-800 bg-clip-text text-transparent">
            {t.welcome}
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title={t.availableGyms}
            value={loadingGyms ? <Skeleton className="h-8 w-16" /> : gyms.length}
            icon={Building2}
            gradient="from-red-600 to-red-400"
            delay={0}
          />
          <StatsCard
            title={t.visitsThisMonth}
            value={loadingPayments ? <Skeleton className="h-8 w-16" /> : payments.filter(p => p.status === 'completed').length}
            icon={TrendingUp}
            gradient="from-black to-gray-700"
            delay={0.1}
          />
          <StatsCard
            title={t.activeCities}
            value={loadingGyms ? <Skeleton className="h-8 w-16" /> : new Set(gyms.map(g => g.city)).size}
            icon={MapPin}
            gradient="from-red-700 to-red-500"
            delay={0.2}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loadingMembership ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              <MembershipCard 
                membership={membership}
                onRenew={() => {}}
              />
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border-2 border-red-100">
              <h3 className="text-lg font-bold mb-4 text-gray-900">{t.quickActions}</h3>
              <div className="space-y-3">
                <Link to={createPageUrl("Gyms")}>
                  <Button className={`w-full bg-gradient-to-r from-red-600 to-red-500 hover:opacity-90 ${isRTL ? 'flex-row-reverse' : ''} shadow-md`}>
                    <Dumbbell className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t.exploreGyms}
                  </Button>
                </Link>
                
                <Link to={createPageUrl("Pricing")}>
                  <Button variant="outline" className={`w-full hover:bg-gray-50 border-2 border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <CreditCard className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t.viewPricing}
                  </Button>
                </Link>
                
                <Link to={createPageUrl("Profile")}>
                  <Button variant="outline" className={`w-full hover:bg-red-50 border-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {t.editProfile}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600 via-black to-red-900 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">{t.gymOwner}</h3>
              <p className="text-sm text-white/90 mb-4">
                {t.gymOwnerText}
              </p>
              <Link to={createPageUrl("GymRegistration")}>
                <Button variant="secondary" className="w-full bg-white text-black hover:bg-gray-100 font-semibold">
                  {t.moreInfo}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20"
        >
          <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center mb-6`}>
            <h2 className="text-2xl font-bold text-gray-900">{t.featuredGyms}</h2>
            <Link to={createPageUrl("Gyms")}>
              <Button variant="outline" className="hover:bg-red-50">
                {t.viewAll}
              </Button>
            </Link>
          </div>
          
          {loadingGyms ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {gyms.slice(0, 3).map((gym) => (
                <div key={gym.id} className="group cursor-pointer">
                  <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                    <img
                      src={gym.image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'}
                      alt={gym.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <p className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'} text-white font-semibold`}>{gym.name}</p>
                  </div>
                  <p className={`text-sm text-gray-600 flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-1`}>
                    <MapPin className="w-4 h-4 text-purple-500" />
                    {gym.city}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}