import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, Calendar, QrCode, MapPin, Phone, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { enUS, fr, arSA } from "date-fns/locale";
import { useLanguage } from "../Layout";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const translations = {
  en: {
    dashboard: "Gym Owner Dashboard",
    manageGym: "Manage your gym and track member visits",
    myGym: "My Gym",
    gymInfo: "Gym Information",
    todayCheckIns: "Today's Check-Ins",
    monthlyCheckIns: "Monthly Check-Ins",
    totalMembers: "Total Members",
    scanMembers: "Scan Members",
    editGym: "Edit Gym",
    address: "Address",
    phone: "Phone",
    hours: "Hours",
    capacity: "Capacity",
    people: "people",
    status: "Status",
    active: "Active",
    pending: "Pending Review",
    suspended: "Suspended",
    noGym: "No Gym Registered",
    registerGym: "Register your gym to start managing members",
    registerButton: "Register My Gym",
    recentActivity: "Recent Activity",
    noActivity: "No recent activity",
    viewAllCheckIns: "View All Check-Ins",
  },
  fr: {
    dashboard: "Tableau de Bord Propriétaire",
    manageGym: "Gérez votre salle et suivez les visites",
    myGym: "Ma Salle",
    gymInfo: "Informations de la Salle",
    todayCheckIns: "Enregistrements du Jour",
    monthlyCheckIns: "Enregistrements Mensuels",
    totalMembers: "Total Membres",
    scanMembers: "Scanner Membres",
    editGym: "Modifier la Salle",
    address: "Adresse",
    phone: "Téléphone",
    hours: "Horaires",
    capacity: "Capacité",
    people: "personnes",
    status: "Statut",
    active: "Actif",
    pending: "En Attente",
    suspended: "Suspendu",
    noGym: "Aucune Salle Enregistrée",
    registerGym: "Enregistrez votre salle pour commencer",
    registerButton: "Enregistrer Ma Salle",
    recentActivity: "Activité Récente",
    noActivity: "Aucune activité récente",
    viewAllCheckIns: "Voir Tous les Enregistrements",
  },
  ar: {
    dashboard: "لوحة تحكم مالك النادي",
    manageGym: "إدارة ناديك وتتبع زيارات الأعضاء",
    myGym: "نادي الخاص بي",
    gymInfo: "معلومات النادي",
    todayCheckIns: "تسجيلات اليوم",
    monthlyCheckIns: "التسجيلات الشهرية",
    totalMembers: "إجمالي الأعضاء",
    scanMembers: "مسح الأعضاء",
    editGym: "تعديل النادي",
    address: "العنوان",
    phone: "الهاتف",
    hours: "الساعات",
    capacity: "السعة",
    people: "أشخاص",
    status: "الحالة",
    active: "نشط",
    pending: "قيد المراجعة",
    suspended: "معلق",
    noGym: "لا يوجد نادي مسجل",
    registerGym: "سجل ناديك لبدء إدارة الأعضاء",
    registerButton: "تسجيل نادي",
    recentActivity: "النشاط الأخير",
    noActivity: "لا يوجد نشاط حديث",
    viewAllCheckIns: "عرض جميع التسجيلات",
  }
};

export default function GymOwnerDashboard() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const locale = language === 'fr' ? fr : language === 'ar' ? arSA : enUS;

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: gym, isLoading: loadingGym } = useQuery({
    queryKey: ['userGym', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const gyms = await base44.entities.Gym.filter({ owner_email: user.email });
      return gyms[0] || null;
    },
    enabled: !!user?.email,
  });

  const { data: allCheckIns, isLoading: loadingCheckIns } = useQuery({
    queryKey: ['gymCheckIns', gym?.id],
    queryFn: async () => {
      if (!gym?.id) return [];
      return await base44.entities.CheckIn.filter({ gym_id: gym.id }, '-check_in_time', 100);
    },
    enabled: !!gym?.id,
    initialData: [],
  });

  const { data: allMemberships } = useQuery({
    queryKey: ['allMemberships'],
    queryFn: () => base44.entities.Membership.filter({ status: 'active' }),
    initialData: [],
  });

  if (loadingGym) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <Building2 className="w-20 h-20 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">{t.noGym}</h2>
          <p className="text-gray-500 mb-6">{t.registerGym}</p>
          <Link to={createPageUrl("GymRegistration")}>
            <Button className="bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-90">
              {t.registerButton}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCheckIns = allCheckIns.filter(ci => new Date(ci.check_in_time) >= today);
  
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const monthlyCheckIns = allCheckIns.filter(ci => {
    const checkInDate = new Date(ci.check_in_time);
    return checkInDate >= monthStart && checkInDate <= monthEnd;
  });

  const statusColors = {
    active: 'bg-green-500 hover:bg-green-600',
    pending: 'bg-yellow-500 hover:bg-yellow-600',
    suspended: 'bg-red-500 hover:bg-red-600',
  };

  const statusText = {
    active: t.active,
    pending: t.pending,
    suspended: t.suspended,
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
            {t.dashboard}
          </h1>
          <p className="text-gray-600">{t.manageGym}</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-none shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-emerald-600 to-emerald-400" />
              <CardContent className="p-6">
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-start mb-4`}>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t.todayCheckIns}</p>
                    <p className="text-4xl font-bold text-gray-900">{todayCheckIns.length}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-amber-600 to-amber-400" />
              <CardContent className="p-6">
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-start mb-4`}>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t.monthlyCheckIns}</p>
                    <p className="text-4xl font-bold text-gray-900">{monthlyCheckIns.length}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-none shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400" />
              <CardContent className="p-6">
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-start mb-4`}>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t.totalMembers}</p>
                    <p className="text-4xl font-bold text-gray-900">{allMemberships.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Gym Info Card */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-none shadow-xl overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={gym.image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200'}
                    alt={gym.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <Badge className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} ${statusColors[gym.status]}`}>
                    {statusText[gym.status]}
                  </Badge>
                  <h2 className={`absolute bottom-4 ${isRTL ? 'right-6' : 'left-6'} text-3xl font-bold text-white`}>
                    {gym.name}
                  </h2>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">{t.address}</p>
                        <p className="font-medium">{gym.address}, {gym.city}</p>
                      </div>
                    </div>

                    <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                      <Phone className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">{t.phone}</p>
                        <p className="font-medium">{gym.phone}</p>
                      </div>
                    </div>

                    {gym.hours && (
                      <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                        <Clock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">{t.hours}</p>
                          <p className="font-medium">{gym.hours}</p>
                        </div>
                      </div>
                    )}

                    {gym.capacity && (
                      <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                        <Users className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">{t.capacity}</p>
                          <p className="font-medium">{gym.capacity} {t.people}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {gym.description && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-gray-700">{gym.description}</p>
                    </div>
                  )}

                  <Link to={createPageUrl("ScanMember")}>
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-90 shadow-lg">
                      <QrCode className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t.scanMembers}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity Sidebar */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-none shadow-xl sticky top-8">
                <CardHeader className="bg-gradient-to-br from-emerald-50 to-amber-50">
                  <CardTitle>{t.recentActivity}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {loadingCheckIns ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                  ) : todayCheckIns.length > 0 ? (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {todayCheckIns.slice(0, 10).map((checkIn) => (
                        <div
                          key={checkIn.id}
                          className="p-3 bg-white rounded-lg border border-gray-200"
                        >
                          <p className="font-semibold text-sm">{checkIn.user_name}</p>
                          <p className="text-xs text-gray-500">
                            {checkIn.check_in_time && !isNaN(new Date(checkIn.check_in_time).getTime())
                              ? format(new Date(checkIn.check_in_time), 'PPp', { locale })
                              : 'Recently'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">{t.noActivity}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}