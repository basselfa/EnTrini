import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, CreditCard, Loader2, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../Layout";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const translations = {
  en: {
    title: "Choose Your Plan",
    subtitle: "Pay per visit - Access to all gyms in Algeria",
    visits: "visits",
    selectPlan: "Select Plan",
    currentPlan: "Current Plan",
    processing: "Processing...",
    popularPlan: "Most Popular",
    features: {
      classic: [
        "10 gym visits",
        "Access to all partner gyms",
        "Valid for 90 days",
        "Basic equipment access",
        "Mobile app access",
      ],
      professional: [
        "15 gym visits",
        "Access to all partner gyms",
        "Valid for 90 days",
        "Premium equipment access",
        "Priority booking",
        "Fitness tracking",
      ]
    },
    planNames: {
      classic: "Classic",
      professional: "Professional"
    },
    validityNote: "All plans are valid for 90 days from purchase date"
  },
  fr: {
    title: "Choisissez Votre Forfait",
    subtitle: "Paiement par visite - Accès à toutes les salles en Algérie",
    visits: "visites",
    selectPlan: "Choisir le Forfait",
    currentPlan: "Forfait Actuel",
    processing: "Traitement...",
    popularPlan: "Le Plus Populaire",
    features: {
      classic: [
        "10 visites de gymnase",
        "Accès à toutes les salles partenaires",
        "Valable 90 jours",
        "Accès équipement de base",
        "Accès application mobile",
      ],
      professional: [
        "15 visites de gymnase",
        "Accès à toutes les salles partenaires",
        "Valable 90 jours",
        "Accès équipement premium",
        "Réservation prioritaire",
        "Suivi fitness",
      ]
    },
    planNames: {
      classic: "Classique",
      professional: "Professionnel"
    },
    validityNote: "Tous les forfaits sont valables 90 jours à partir de la date d'achat"
  },
  ar: {
    title: "اختر باقتك",
    subtitle: "الدفع حسب الزيارة - دخول لجميع النوادي في الجزائر",
    visits: "زيارات",
    selectPlan: "اختر الباقة",
    currentPlan: "الباقة الحالية",
    processing: "جاري المعالجة...",
    popularPlan: "الأكثر شعبية",
    features: {
      classic: [
        "10 زيارات للنادي",
        "الوصول لجميع النوادي الشريكة",
        "صالح لمدة 90 يوم",
        "الوصول للمعدات الأساسية",
        "الوصول للتطبيق",
      ],
      professional: [
        "15 زيارة للنادي",
        "الوصول لجميع النوادي الشريكة",
        "صالح لمدة 90 يوم",
        "الوصول للمعدات المتميزة",
        "حجز أولوية",
        "تتبع اللياقة",
      ]
    },
    planNames: {
      classic: "كلاسيك",
      professional: "احترافي"
    },
    validityNote: "جميع الباقات صالحة لمدة 90 يوماً من تاريخ الشراء"
  }
};

const plans = [
  {
    id: "classic",
    name: "Classic",
    price: 3000,
    visits: 10,
    icon: Ticket,
    color: "from-blue-500 to-cyan-500",
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: 3500,
    visits: 15,
    icon: Crown,
    color: "from-emerald-500 to-teal-500",
    popular: true,
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
      expiryDate.setDate(expiryDate.getDate() + 90); // 90 days validity

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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-black to-amber-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isCurrentPlan = membership?.plan_type === plan.id;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative overflow-hidden border-2 ${
                  plan.popular ? 'border-emerald-500 shadow-2xl scale-105' : 'border-gray-200 shadow-lg'
                } hover:shadow-2xl transition-all duration-300`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-600 to-amber-500 text-white text-center py-2 text-sm font-bold">
                      {t.popularPlan}
                    </div>
                  )}
                  
                  <CardHeader className={`${plan.popular ? 'pt-12' : 'pt-6'} pb-8`}>
                    <div className="flex justify-center mb-4">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    
                    <CardTitle className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {t.planNames[plan.id]}
                      </div>
                      <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className={`text-5xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                          {plan.price}
                        </span>
                        <span className="text-gray-600 text-lg">DZD</span>
                      </div>
                      <Badge className={`bg-gradient-to-r ${plan.color} text-white text-lg px-4 py-1`}>
                        {plan.visits} {t.visits}
                      </Badge>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {t.features[plan.id].map((feature, i) => (
                        <li key={i} className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                          <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            plan.popular ? 'text-emerald-600' : 'text-gray-400'
                          }`} />
                          <span className="text-gray-700 text-sm">{feature}</span>
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-emerald-50 to-amber-50 rounded-2xl p-6 border border-emerald-200">
            <p className="text-gray-700 text-sm max-w-2xl">
              {t.validityNote}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}