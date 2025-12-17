import React, { useState } from "react";
import { base44 } from "../api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";
import { Check, Crown, CreditCard, Loader2, Ticket, Star, Info, Banknote, QrCode } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../Layout";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";

const translations = {
  en: {
    title: "Choose Your Plan",
    subtitle: "Pay per visit - Access to all gyms in Algeria",
    visits: "visits",
    selectPlan: "Select Plan",
    currentPlan: "Current Plan",
    processing: "Processing...",
    popularPlan: "Most Popular",
    bestValue: "Best Value",

    paymentInfo: "Payment Information",
    paymentInfoDesc: "After selecting your membership category, you will be redirected to a detailed page containing:",
    bankAccount: "Bank account information for transfers",
    qrPayment: "QR code for quick payment",
    paymentInstructions: "Instructions on how to complete the registration",
    planDetails: "All important details about the app and your selected plan",
    features: {
      classic: [
      "Access to Classic gyms",
      "Basic equipment access",
      "Mobile app access",
      ],
      professional: [
      "Access to Professional + Classic gyms",
      "Premium equipment access",
      "Priority booking",
      "Fitness tracking",
      ],
      royal: [
      "Access to Royal + Professional + Classic gyms",
      "VIP equipment access",
      "Priority booking",
      "Personal trainer sessions",
      "Nutrition consultation",
      ]
    },
    planNames: {
      classic: "Classic",
      professional: "Professional",
      royal: "Royal"
    },
    validityNote: "All plans are valid for 30 days (1 month) from purchase date"
  },
  fr: {
    title: "Choisissez Votre Forfait",
    subtitle: "Paiement par visite - Accès à toutes les salles en Algérie",
    visits: "visites",
    selectPlan: "Choisir le Forfait",
    currentPlan: "Forfait Actuel",
    processing: "Traitement...",
    popularPlan: "Le Plus Populaire",
    bestValue: "Meilleur Rapport",

    paymentInfo: "Informations de Paiement",
    paymentInfoDesc: "Après avoir sélectionné votre catégorie d'abonnement, vous serez redirigé vers une page détaillée contenant:",
    bankAccount: "Informations bancaires pour les virements",
    qrPayment: "Code QR pour paiement rapide",
    paymentInstructions: "Instructions pour compléter l'inscription",
    planDetails: "Tous les détails importants sur l'application et votre forfait",
    features: {
      classic: [
      "Accès aux salles Classiques",
      "Accès équipement de base",
      "Accès application mobile",
      ],
      professional: [
      "Accès aux salles Professional + Classic",
      "Accès équipement premium",
      "Réservation prioritaire",
      "Suivi fitness",
      ],
      royal: [
      "Accès aux salles Royal + Professional + Classic",
      "Accès équipement VIP",
      "Réservation prioritaire",
      "Sessions coach personnel",
      "Consultation nutrition",
      ]
    },
    planNames: {
      classic: "Classique",
      professional: "Professionnel",
      royal: "Royal"
    },
    validityNote: "Tous les forfaits sont valables 30 jours (1 mois) à partir de la date d'achat"
  },
  ar: {
    title: "اختر باقتك",
    subtitle: "الدفع حسب الزيارة - دخول لجميع النوادي في الجزائر",
    visits: "زيارات",
    selectPlan: "اختر الباقة",
    currentPlan: "الباقة الحالية",
    processing: "جاري المعالجة...",
    popularPlan: "الأكثر شعبية",
    bestValue: "أفضل قيمة",

    paymentInfo: "معلومات الدفع",
    paymentInfoDesc: "بعد اختيار فئة عضويتك، سيتم توجيهك إلى صفحة مفصلة تحتوي على:",
    bankAccount: "معلومات الحساب البنكي للتحويلات",
    qrPayment: "رمز QR للدفع السريع",
    paymentInstructions: "تعليمات لإكمال التسجيل",
    planDetails: "جميع التفاصيل المهمة عن التطبيق وباقتك المختارة",
    features: {
      classic: [
      "الوصول للنوادي الكلاسيكية",
      "الوصول للمعدات الأساسية",
      "الوصول للتطبيق",
      ],
      professional: [
      "الوصول للنوادي الاحترافية + الكلاسيكية",
      "الوصول للمعدات المتميزة",
      "حجز أولوية",
      "تتبع اللياقة",
      ],
      royal: [
      "الوصول للنوادي الملكية + الاحترافية + الكلاسيكية",
      "الوصول لمعدات VIP",
      "حجز أولوية",
      "جلسات مدرب شخصي",
      "استشارة تغذية",
      ]
    },
    planNames: {
      classic: "كلاسيك",
      professional: "احترافي",
      royal: "ملكي"
    },
    validityNote: "جميع الباقات صالحة لمدة 30 يوماً (شهر واحد) من تاريخ الشراء"
  }
};

const plans = [
  {
    id: "classic",
    name: "Classic",
    price: 3000,
    visits: 15,
    icon: Ticket,
    color: "from-[#1F3A93] to-[#4169E1]",
    bgColor: "bg-[#1F3A93]",
    popular: false,
    badge: null,
  },
  {
    id: "professional",
    name: "Professional",
    price: 4900,
    visits: 15,
    icon: Crown,
    color: "from-[#FF4B3E] to-[#FF6B5E]",
    bgColor: "bg-[#FF4B3E]",
    popular: true,
    badge: "popularPlan",
  },
  {
    id: "royal",
    name: "Royal",
    price: 7500,
    visits: 15,
    icon: Star,
    color: "from-[#FFC107] to-[#FFD54F]",
    bgColor: "bg-[#FFC107]",
    popular: false,
    badge: "bestValue",
  },
];

export default function Pricing() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [processingPlan, setProcessingPlan] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: membership } = useQuery({
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

  const createMembershipMutation = useMutation({
    mutationFn: async (planType) => {
      const plan = plans.find(p => p.id === planType);
      const purchaseDate = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      await base44.entities.Membership.create({
        user_email: user.email,
        plan_type: planType,
        status: 'active',
        total_visits: plan.visits,
        remaining_visits: plan.visits,
        price: plan.price,
        purchase_date: purchaseDate.toISOString().split('T')[0],
        expiry_date: expiryDate.toISOString().split('T')[0],
      });

      await base44.entities.Payment.create({
        user_email: user.email,
        amount: plan.price,
        payment_method: 'credit_card',
        status: 'completed',
        payment_date: new Date().toISOString(),
        transaction_id: `TRN-${Date.now()}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myMembership'] });
      setProcessingPlan(null);
      navigate(createPageUrl("Home"));
    },
  });

  const handleSelectPlan = async (planId) => {
    setProcessingPlan(planId);
    await createMembershipMutation.mutateAsync(planId);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#FF4B3E] via-[#1F3A93] to-[#FFC107] bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-lg text-[#333333] max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>



        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isCurrentPlan = membership?.plan_type === plan.id;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Card className={`relative overflow-hidden border-2 h-full ${
                  plan.popular ? 'border-[#FF4B3E] shadow-2xl scale-105 z-10' : 'border-gray-200 shadow-lg'
                } hover:shadow-2xl transition-all duration-300 bg-white`}>
                  {plan.badge && (
                    <div className={`absolute top-0 left-0 right-0 ${plan.bgColor} text-white text-center py-2 text-sm font-bold`}>
                      {t[plan.badge]}
                    </div>
                  )}
                  
                  <CardHeader className={`${plan.badge ? 'pt-12' : 'pt-6'} pb-6`}>
                    <div className="flex justify-center mb-4">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    
                    <CardTitle className="text-center">
                      <div className="text-2xl font-bold text-[#333333] mb-2">
                        {t.planNames[plan.id]}
                      </div>
                      <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className={`text-5xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                          {plan.price}
                        </span>
                        <span className="text-[#333333] text-lg">DZD</span>
                      </div>
                      </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {t.features[plan.id].map((feature, i) => (
                        <li key={i} className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                          <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 text-[#FF4B3E]`} />
                          <span className="text-[#333333] text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={isCurrentPlan || processingPlan === plan.id}
                      className={`w-full h-12 text-lg font-semibold ${
                        isCurrentPlan
                          ? 'bg-gray-400 cursor-not-allowed'
                          : `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white shadow-lg`
                      }`}
                    >
                      {processingPlan === plan.id ? (
                        <>
                          <Loader2 className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                          {t.processing}
                        </>
                      ) : isCurrentPlan ? (
                        t.currentPlan
                      ) : (
                        <>
                          <CreditCard className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {t.selectPlan}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-none shadow-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-[#FFC107]/20 to-[#1F3A93]/20">
              <CardTitle className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3 text-[#333333]`}>
                <Info className="w-6 h-6 text-[#1F3A93]" />
                {t.paymentInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-[#333333] mb-6">{t.paymentInfoDesc}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3 p-4 bg-[#F5F5F5] rounded-xl`}>
                  <Banknote className="w-6 h-6 text-[#FF4B3E]" />
                  <span className="text-[#333333]">{t.bankAccount}</span>
                </div>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3 p-4 bg-[#F5F5F5] rounded-xl`}>
                  <QrCode className="w-6 h-6 text-[#1F3A93]" />
                  <span className="text-[#333333]">{t.qrPayment}</span>
                </div>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3 p-4 bg-[#F5F5F5] rounded-xl`}>
                  <CreditCard className="w-6 h-6 text-[#FFC107]" />
                  <span className="text-[#333333]">{t.paymentInstructions}</span>
                </div>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3 p-4 bg-[#F5F5F5] rounded-xl`}>
                  <Info className="w-6 h-6 text-[#FF4B3E]" />
                  <span className="text-[#333333]">{t.planDetails}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Validity Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-[#FF4B3E]/10 to-[#1F3A93]/10 rounded-2xl p-6 border border-[#FF4B3E]/20">
            <p className="text-[#333333] text-sm max-w-2xl">
              {t.validityNote}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}