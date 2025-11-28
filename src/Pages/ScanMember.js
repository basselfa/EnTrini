import React, { useState } from "react";
import { base44 } from "../api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { QrCode, Search, CheckCircle, XCircle, Calendar, Mail, Phone, AlertCircle, Loader2, Ticket, Coins, CreditCard } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { enUS, fr, arSA } from "date-fns/locale";
import { useLanguage } from "../Layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const translations = {
  en: {
    scanMember: "Scan Member",
    verifyMembership: "Verify membership and check-in members",
    memberID: "Member ID",
    enterMemberID: "Enter member ID from QR code",
    scanButton: "Verify Member",
    scanning: "Verifying...",
    memberNotFound: "Member not found",
    noMembershipFound: "No active membership found",
    membershipExpired: "Membership expired",
    noVisitsLeft: "No visits remaining",
    membershipValid: "Valid Membership",
    checkInSuccess: "Check-in successful!",
    memberInfo: "Member Information",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    membershipPlan: "Plan",
    validUntil: "Valid Until",
    daysLeft: "Days Left",
    visitsRemaining: "Visits Remaining",
    checkInButton: "Check In Member (Free)",
    checkingIn: "Checking In...",
    recentCheckIns: "Recent Check-Ins",
    today: "Today",
    noCheckIns: "No check-ins yet today",
    payPerVisit: "Pay Per Visit",
    payPerVisitTitle: "No Visits Available - Pay Per Visit",
    payPerVisitDesc: "This member has no visits remaining or membership expired. They can still access by paying:",
    clientPays: "Client Pays",
    gymReceives: "Gym Receives",
    commission: "TRini213 Commission",
    paymentMethod: "Payment Method",
    cash: "Cash",
    baridimob: "Baridimob",
    ccp: "CCP",
    dahabia: "Dahabia",
    creditCard: "Credit Card",
    confirmPayment: "Confirm Payment & Check In",
    processingPayment: "Processing...",
    cancel: "Cancel",
    paymentRequired: "Payment Required (300 DZD)",
  },
  fr: {
    scanMember: "Scanner Membre",
    verifyMembership: "Vérifier l'adhésion et enregistrer les membres",
    memberID: "ID Membre",
    enterMemberID: "Entrez l'ID du membre depuis le QR code",
    scanButton: "Vérifier le Membre",
    scanning: "Vérification...",
    memberNotFound: "Membre non trouvé",
    noMembershipFound: "Aucun abonnement actif trouvé",
    membershipExpired: "Abonnement expiré",
    noVisitsLeft: "Plus de visites",
    membershipValid: "Abonnement Valide",
    checkInSuccess: "Enregistrement réussi!",
    memberInfo: "Informations du Membre",
    fullName: "Nom Complet",
    email: "Email",
    phone: "Téléphone",
    membershipPlan: "Forfait",
    validUntil: "Valable Jusqu'au",
    daysLeft: "Jours Restants",
    visitsRemaining: "Visites Restantes",
    checkInButton: "Enregistrer le Membre (Gratuit)",
    checkingIn: "Enregistrement...",
    recentCheckIns: "Enregistrements Récents",
    today: "Aujourd'hui",
    noCheckIns: "Aucun enregistrement aujourd'hui",
    payPerVisit: "Paiement par Visite",
    payPerVisitTitle: "Plus de Visites - Paiement par Visite",
    payPerVisitDesc: "Ce membre n'a plus de visites ou son abonnement a expiré. Il peut toujours accéder en payant:",
    clientPays: "Client Paie",
    gymReceives: "Salle Reçoit",
    commission: "Commission TRini213",
    paymentMethod: "Méthode de Paiement",
    cash: "Espèces",
    baridimob: "Baridimob",
    ccp: "CCP",
    dahabia: "Dahabia",
    creditCard: "Carte Bancaire",
    confirmPayment: "Confirmer Paiement & Enregistrer",
    processingPayment: "Traitement...",
    cancel: "Annuler",
    paymentRequired: "Paiement Requis (300 DZD)",
  },
  ar: {
    scanMember: "مسح العضو",
    verifyMembership: "تحقق من العضوية وسجل الأعضاء",
    memberID: "معرف العضو",
    enterMemberID: "أدخل معرف العضو من رمز QR",
    scanButton: "تحقق من العضو",
    scanning: "جاري التحقق...",
    memberNotFound: "لم يتم العثور على العضو",
    noMembershipFound: "لا يوجد اشتراك نشط",
    membershipExpired: "انتهت صلاحية الاشتراك",
    noVisitsLeft: "لا توجد زيارات متبقية",
    membershipValid: "اشتراك صالح",
    checkInSuccess: "تم التسجيل بنجاح!",
    memberInfo: "معلومات العضو",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    membershipPlan: "الباقة",
    validUntil: "صالح حتى",
    daysLeft: "الأيام المتبقية",
    visitsRemaining: "الزيارات المتبقية",
    checkInButton: "تسجيل دخول العضو (مجاني)",
    checkingIn: "جاري التسجيل...",
    recentCheckIns: "التسجيلات الأخيرة",
    today: "اليوم",
    noCheckIns: "لا توجد تسجيلات اليوم",
    payPerVisit: "الدفع لكل زيارة",
    payPerVisitTitle: "لا توجد زيارات - الدفع لكل زيارة",
    payPerVisitDesc: "هذا العضو ليس لديه زيارات متبقية أو انتهت صلاحية اشتراكه. لا يزال بإمكانه الوصول عن طريق الدفع:",
    clientPays: "العميل يدفع",
    gymReceives: "النادي يستلم",
    commission: "عمولة TRini213",
    paymentMethod: "طريقة الدفع",
    cash: "نقداً",
    baridimob: "بريدي موب",
    ccp: "CCP",
    dahabia: "الذهبية",
    creditCard: "بطاقة ائتمان",
    confirmPayment: "تأكيد الدفع والتسجيل",
    processingPayment: "جاري المعالجة...",
    cancel: "إلغاء",
    paymentRequired: "الدفع مطلوب (300 دج)",
  }
};

const planNames = {
  en: { classic: "Classic", professional: "Professional" },
  fr: { classic: "Classique", professional: "Professionnel" },
  ar: { classic: "كلاسيك", professional: "احترافي" }
};

export default function ScanMember() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const locale = language === 'fr' ? fr : language === 'ar' ? arSA : enUS;
  const queryClient = useQueryClient();

  const [memberId, setMemberId] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [membershipData, setMembershipData] = useState(null);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: userGym } = useQuery({
    queryKey: ['userGym', currentUser?.email],
    queryFn: async () => {
      if (!currentUser?.email) return null;
      const gyms = await base44.entities.Gym.filter({ owner_email: currentUser.email });
      return gyms[0] || null;
    },
    enabled: !!currentUser?.email,
  });

  const { data: todayCheckIns, isLoading: loadingCheckIns } = useQuery({
    queryKey: ['todayCheckIns', userGym?.id],
    queryFn: async () => {
      if (!userGym?.id) return [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkIns = await base44.entities.CheckIn.filter({ gym_id: userGym.id }, '-check_in_time', 50);
      return checkIns.filter(ci => new Date(ci.check_in_time) >= today);
    },
    enabled: !!userGym?.id,
    initialData: [],
  });

  const checkInMutation = useMutation({
    mutationFn: async ({ checkInData, membershipId, newRemainingVisits, isPaid, paymentMethod }) => {
      // Create check-in
      const checkIn = await base44.entities.CheckIn.create(checkInData);
      
      if (isPaid) {
        // Create single visit payment record
        await base44.entities.SingleVisitPayment.create({
          user_email: checkInData.user_email,
          gym_id: checkInData.gym_id,
          gym_name: checkInData.gym_name,
          check_in_id: checkIn.id,
          amount_paid: 300,
          gym_amount: 200,
          commission: 100,
          payment_status: "completed",
          payment_date: new Date().toISOString(),
          payment_method: paymentMethod,
        });
      } else if (membershipId && newRemainingVisits !== undefined) {
        // Update membership remaining visits (only if using plan visit)
        await base44.entities.Membership.update(membershipId, {
          remaining_visits: newRemainingVisits
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayCheckIns'] });
      setShowSuccess(true);
      setShowPaymentDialog(false);
      setTimeout(() => {
        setShowSuccess(false);
        setMemberData(null);
        setMembershipData(null);
        setMemberId("");
      }, 3000);
    },
  });

  const handleScan = async () => {
    if (!memberId.trim()) return;

    setError("");
    setIsScanning(true);
    setMemberData(null);
    setMembershipData(null);

    try {
      const parts = memberId.includes(':') ? memberId.split(':') : [null, memberId, null];
      const userId = parts[1];

      const users = await base44.entities.User.list();
      const user = users.find(u => u.id === userId);

      if (!user) {
        setError(t.memberNotFound);
        setIsScanning(false);
        return;
      }

      setMemberData(user);

      const memberships = await base44.entities.Membership.filter(
        { user_email: user.email, status: 'active' },
        '-created_date',
        1
      );

      if (memberships.length > 0) {
        const membership = memberships[0];
        setMembershipData(membership);
      } else {
        setMembershipData(null);
      }
    } catch (err) {
      console.error("Error scanning member:", err);
      setError(t.memberNotFound);
    }

    setIsScanning(false);
  };

  const handleCheckIn = async (isPaid = false) => {
    if (!memberData || !userGym) return;

    const daysLeft = membershipData && membershipData.expiry_date && !isNaN(new Date(membershipData.expiry_date).getTime())
      ? differenceInDays(new Date(membershipData.expiry_date), new Date())
      : -1;
    
    const canUsePlanVisit = membershipData && daysLeft >= 0 && membershipData.remaining_visits > 0;

    if (!canUsePlanVisit && !isPaid) {
      // Show payment dialog
      setShowPaymentDialog(true);
      return;
    }

    await checkInMutation.mutateAsync({
      checkInData: {
        user_email: memberData.email,
        user_name: memberData.full_name,
        gym_id: userGym.id,
        gym_name: userGym.name,
        check_in_time: new Date().toISOString(),
        membership_status: canUsePlanVisit ? 'active' : 'paid_single',
      },
      membershipId: canUsePlanVisit ? membershipData.id : null,
      newRemainingVisits: canUsePlanVisit ? membershipData.remaining_visits - 1 : undefined,
      isPaid: isPaid,
      paymentMethod: isPaid ? paymentMethod : undefined,
    });
  };

  const handlePaymentConfirm = () => {
    handleCheckIn(true);
  };

  const daysLeft = membershipData && membershipData.expiry_date && !isNaN(new Date(membershipData.expiry_date).getTime())
    ? differenceInDays(new Date(membershipData.expiry_date), new Date())
    : -1;

  const canUsePlanVisit = membershipData && daysLeft >= 0 && membershipData.remaining_visits > 0;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
            {t.scanMember}
          </h1>
          <p className="text-gray-600">{t.verifyMembership}</p>
          {userGym && (
            <Badge className="mt-2 bg-gradient-to-r from-emerald-600 to-amber-500">
              {userGym.name}
            </Badge>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Scan Input Card */}
            <div>
              <Card className="border-none shadow-xl">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-amber-50">
                  <CardTitle className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                    <QrCode className="w-6 h-6 text-emerald-600" />
                    {t.memberID}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="memberId">{t.enterMemberID}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="memberId"
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                        placeholder="TRINI213:..."
                        onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleScan}
                        disabled={isScanning || !memberId.trim()}
                        className="bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-90"
                      >
                        {isScanning ? (
                          <>
                            <Loader2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t.scanning}
                          </>
                        ) : (
                          <>
                            <Search className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t.scanButton}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <p className="text-red-800 font-medium">{error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Member Info Card */}
            <div>
              {memberData && (
                <div>
                  <Card className={`border-2 shadow-xl ${
                    canUsePlanVisit
                      ? membershipData.remaining_visits <= 3
                        ? 'border-amber-500' 
                        : 'border-emerald-500'
                      : 'border-blue-500'
                  }`}>
                    <div className={`h-2 bg-gradient-to-r ${
                      canUsePlanVisit
                        ? membershipData.remaining_visits <= 3
                          ? 'from-amber-600 to-amber-400' 
                          : 'from-emerald-600 to-emerald-400'
                        : 'from-blue-600 to-blue-400'
                    }`} />
                    <CardHeader className="bg-gradient-to-br from-white to-gray-50">
                      <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-4`}>
                        <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                          <AvatarImage src={memberData.profile_image} />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-amber-500 text-white text-2xl font-bold">
                            {memberData.full_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-1">{memberData.full_name}</CardTitle>
                          {canUsePlanVisit ? (
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <CheckCircle className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {t.membershipValid}
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-500 hover:bg-blue-600">
                              <Coins className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                              {t.payPerVisit}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                          <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">{t.email}</p>
                            <p className="font-medium">{memberData.email}</p>
                          </div>
                        </div>

                        {memberData.phone && (
                          <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                            <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-600">{t.phone}</p>
                              <p className="font-medium">{memberData.phone}</p>
                            </div>
                          </div>
                        )}

                        {membershipData && (
                          <>
                            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                              <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                              <div>
                                <p className="text-sm text-gray-600">{t.membershipPlan}</p>
                                <p className="font-medium">
                                  {planNames[language][membershipData.plan_type]}
                                </p>
                              </div>
                            </div>

                            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                              <Ticket className="w-5 h-5 text-blue-600 mt-0.5" />
                              <div>
                                <p className="text-sm text-gray-600">{t.visitsRemaining}</p>
                                <p className="font-medium text-xl">
                                  {membershipData.remaining_visits} / {membershipData.total_visits}
                                </p>
                              </div>
                            </div>

                            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-sm text-gray-600">{t.validUntil}</p>
                                <p className="font-medium">
                                  {membershipData.expiry_date && !isNaN(new Date(membershipData.expiry_date).getTime())
                                    ? format(new Date(membershipData.expiry_date), 'PPP', { locale })
                                    : 'N/A'}
                                </p>
                                {daysLeft >= 0 && (
                                  <Badge variant="outline" className="mt-1">
                                    {daysLeft} {t.daysLeft}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {!canUsePlanVisit && (
                        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                          <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2 mb-2`}>
                            <Coins className="w-5 h-5 text-blue-600" />
                            <p className="font-semibold text-blue-900">{t.paymentRequired}</p>
                          </div>
                          <p className="text-sm text-blue-700">
                            {membershipData && daysLeft < 0 
                              ? t.membershipExpired 
                              : membershipData?.remaining_visits === 0
                              ? t.noVisitsLeft
                              : t.noMembershipFound}
                          </p>
                        </div>
                      )}

                      {!showSuccess && (
                        <Button
                          onClick={() => handleCheckIn(false)}
                          disabled={checkInMutation.isPending}
                          className={`w-full h-12 text-lg ${
                            canUsePlanVisit
                              ? 'bg-gradient-to-r from-emerald-600 to-amber-500'
                              : 'bg-gradient-to-r from-blue-600 to-purple-600'
                          } hover:opacity-90 shadow-lg`}
                        >
                          {checkInMutation.isPending ? (
                            <>
                              <Loader2 className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t.checkingIn}
                            </>
                          ) : canUsePlanVisit ? (
                            <>
                              <CheckCircle className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t.checkInButton}
                            </>
                          ) : (
                            <>
                              <CreditCard className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t.payPerVisit} (300 DZD)
                            </>
                          )}
                        </Button>
                      )}

                      {showSuccess && (
                        <div className="p-4 bg-green-50 border-2 border-green-500 rounded-xl text-center">
                          <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
                          <p className="text-green-800 font-bold text-lg">{t.checkInSuccess}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Recent Check-Ins Sidebar */}
          <div>
            <Card className="border-none shadow-xl sticky top-8">
              <CardHeader className="bg-gradient-to-br from-emerald-50 to-amber-50">
                <CardTitle className="text-lg">{t.recentCheckIns}</CardTitle>
                <p className="text-sm text-gray-600">{t.today}</p>
              </CardHeader>
              <CardContent className="p-4">
                {loadingCheckIns ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                ) : todayCheckIns.length > 0 ? (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {todayCheckIns.map((checkIn) => (
                      <div
                        key={checkIn.id}
                        className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3`}>
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-amber-500 text-white font-bold">
                              {checkIn.user_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{checkIn.user_name}</p>
                            <p className="text-xs text-gray-500">
                              {checkIn.check_in_time && !isNaN(new Date(checkIn.check_in_time).getTime())
                                ? format(new Date(checkIn.check_in_time), 'HH:mm')
                                : 'N/A'}
                            </p>
                          </div>
                          {checkIn.membership_status === 'paid_single' ? (
                            <Coins className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">{t.noCheckIns}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                <Coins className="w-6 h-6 text-blue-600" />
                {t.payPerVisitTitle}
              </DialogTitle>
              <DialogDescription className="text-left">
                {t.payPerVisitDesc}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl space-y-3">
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                  <span className="text-gray-700 font-medium">{t.clientPays}:</span>
                  <span className="text-2xl font-bold text-blue-600">300 DZD</span>
                </div>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                  <span className="text-gray-700 font-medium">{t.gymReceives}:</span>
                  <span className="text-xl font-bold text-green-600">200 DZD</span>
                </div>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center border-t pt-2`}>
                  <span className="text-gray-600 text-sm">{t.commission}:</span>
                  <span className="text-sm font-semibold text-amber-600">100 DZD</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">{t.paymentMethod}</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">{t.cash}</SelectItem>
                    <SelectItem value="baridimob">{t.baridimob}</SelectItem>
                    <SelectItem value="ccp">{t.ccp}</SelectItem>
                    <SelectItem value="dahabia">{t.dahabia}</SelectItem>
                    <SelectItem value="credit_card">{t.creditCard}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPaymentDialog(false)}
                disabled={checkInMutation.isPending}
              >
                {t.cancel}
              </Button>
              <Button
                onClick={handlePaymentConfirm}
                disabled={checkInMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
              >
                {checkInMutation.isPending ? (
                  <>
                    <Loader2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t.processingPayment}
                  </>
                ) : (
                  <>
                    <CreditCard className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t.confirmPayment}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}