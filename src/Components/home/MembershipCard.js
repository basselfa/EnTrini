import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, CheckCircle2, AlertCircle, Ticket } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { enUS, fr, arSA } from "date-fns/locale";
import { motion } from "framer-motion";
import { useLanguage } from "../../Layout";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const translations = {
  en: {
    noMembership: "No Active Membership",
    activateMembership: "Purchase a plan to access all gyms",
    activateButton: "View Plans",
    plan: "Plan",
    active: "Active",
    validUntil: "Valid until",
    days: "days",
    visitsRemaining: "Visits Remaining",
    of: "of",
    expiringWarning: "⚠️ Your plan expires soon. Purchase a new one to continue.",
    expiredWarning: "❌ Your plan has expired. Purchase a new plan.",
    noVisitsWarning: "⚠️ No visits remaining. Purchase a new plan.",
    renewNow: "Buy New Plan",
    managePayment: "Manage Plan",
    classic: "Classic",
    professional: "Professional",
  },
  fr: {
    noMembership: "Pas d'Abonnement Actif",
    activateMembership: "Achetez un forfait pour accéder aux salles",
    activateButton: "Voir les Forfaits",
    plan: "Forfait",
    active: "Actif",
    validUntil: "Valable jusqu'au",
    days: "jours",
    visitsRemaining: "Visites Restantes",
    of: "sur",
    expiringWarning: "⚠️ Votre forfait expire bientôt. Achetez-en un nouveau.",
    expiredWarning: "❌ Votre forfait a expiré. Achetez un nouveau forfait.",
    noVisitsWarning: "⚠️ Plus de visites. Achetez un nouveau forfait.",
    renewNow: "Acheter un Nouveau",
    managePayment: "Gérer le Forfait",
    classic: "Classique",
    professional: "Professionnel",
  },
  ar: {
    noMembership: "لا يوجد اشتراك نشط",
    activateMembership: "اشتر باقة للوصول لجميع النوادي",
    activateButton: "عرض الباقات",
    plan: "الباقة",
    active: "نشط",
    validUntil: "صالح حتى",
    days: "أيام",
    visitsRemaining: "الزيارات المتبقية",
    of: "من",
    expiringWarning: "⚠️ باقتك ستنتهي قريباً. اشتر باقة جديدة.",
    expiredWarning: "❌ انتهت صلاحية باقتك. اشتر باقة جديدة.",
    noVisitsWarning: "⚠️ لا توجد زيارات متبقية. اشتر باقة جديدة.",
    renewNow: "شراء باقة جديدة",
    managePayment: "إدارة الباقة",
    classic: "كلاسيك",
    professional: "احترافي",
  }
};

const planColors = {
  classic: "from-blue-500 to-cyan-500",
  professional: "from-emerald-500 to-teal-500",
};

export default function MembershipCard({ membership }) {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const locale = language === 'fr' ? fr : language === 'ar' ? arSA : enUS;

  if (!membership) {
    return (
      <Card className="overflow-hidden border-2 border-dashed border-gray-300">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2 text-gray-700">{t.noMembership}</h3>
          <p className="text-gray-500 mb-4">{t.activateMembership}</p>
          <Link to={createPageUrl("Pricing")}>
            <Button className="bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-90">
              {t.activateButton}
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const expiryDate = membership.expiry_date && !isNaN(new Date(membership.expiry_date).getTime())
    ? new Date(membership.expiry_date)
    : null;
  
  const daysLeft = expiryDate ? differenceInDays(expiryDate, new Date()) : -1;
  const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
  const isExpired = daysLeft < 0;
  const noVisitsLeft = membership.remaining_visits <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden border-none shadow-xl ${isExpired || noVisitsLeft ? 'opacity-70' : ''}`}>
        <div className={`h-2 bg-gradient-to-r ${planColors[membership.plan_type]}`} />
        <CardHeader className="bg-gradient-to-br from-white to-gray-50">
          <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-start`}>
            <div>
              <CardTitle className="text-2xl font-bold mb-2">
                {t.plan} {t[membership.plan_type]}
              </CardTitle>
              <Badge 
                variant={membership.status === 'active' && !isExpired && !noVisitsLeft ? 'default' : 'destructive'}
                className={membership.status === 'active' && !isExpired && !noVisitsLeft
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-red-500'
                }
              >
                {membership.status === 'active' && !isExpired && !noVisitsLeft ? (
                  <><CheckCircle2 className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} /> {t.active}</>
                ) : (
                  <><AlertCircle className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} /> {isExpired ? 'Expired' : noVisitsLeft ? 'No visits' : membership.status}</>
                )}
              </Badge>
            </div>
            <div className={`text-center`}>
              <div className={`text-4xl font-bold bg-gradient-to-r ${planColors[membership.plan_type]} bg-clip-text text-transparent`}>
                {membership.remaining_visits}
              </div>
              <span className="text-sm text-gray-500">{t.of} {membership.total_visits}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3 p-4 bg-gradient-to-br ${planColors[membership.plan_type]} bg-opacity-10 rounded-lg`}>
            <Ticket className="w-8 h-8 text-gray-600" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-semibold">{t.visitsRemaining}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full bg-gradient-to-r ${planColors[membership.plan_type]}`}
                    style={{ width: `${(membership.remaining_visits / membership.total_visits) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {membership.remaining_visits}/{membership.total_visits}
                </span>
              </div>
            </div>
          </div>

          <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3 p-3 bg-gray-50 rounded-lg`}>
            <Calendar className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">{t.validUntil}</p>
              <p className="font-semibold text-gray-900">
                {expiryDate
                  ? format(expiryDate, "d MMMM yyyy", { locale })
                  : 'N/A'}
              </p>
            </div>
            {!isExpired && expiryDate && (
              <Badge variant="outline" className={isExpiringSoon ? 'border-orange-500 text-orange-700' : 'border-green-500 text-green-700'}>
                {daysLeft} {t.days}
              </Badge>
            )}
          </div>

          {noVisitsLeft && !isExpired && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">{t.noVisitsWarning}</p>
            </div>
          )}

          {isExpiringSoon && membership.remaining_visits > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">{t.expiringWarning}</p>
            </div>
          )}

          {isExpired && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{t.expiredWarning}</p>
            </div>
          )}

          <Link to={createPageUrl("Pricing")}>
            <Button 
              className={`w-full bg-gradient-to-r ${planColors[membership.plan_type]} hover:opacity-90 text-white shadow-lg`}
            >
              <CreditCard className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isExpired || noVisitsLeft ? t.renewNow : t.managePayment}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}