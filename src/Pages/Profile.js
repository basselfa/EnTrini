import React, { useState } from "react";
import { base44 } from "../api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { Textarea } from "../Components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../Components/ui/avatar";
import { User, Mail, Phone, MapPin, Calendar, Heart, Save, Loader2, QrCode } from "lucide-react";
import { Skeleton } from "../Components/ui/skeleton";
import { useLanguage } from "../Layout";
import QRCodeComponent from "../Components/profile/QRCodeComponent";

const translations = {
  en: {
    myProfile: "My Profile",
    manageInfo: "Manage your personal information",
    editProfile: "Edit Profile",
    cancel: "Cancel",
    personalInfo: "Personal Information",
    phone: "Phone",
    birthDate: "Birth Date",
    city: "City",
    address: "Address",
    emergencyContact: "Emergency Contact",
    emergencyPhone: "Emergency Phone",
    fitnessGoals: "Fitness Goals",
    fitnessGoalsPlaceholder: "Tell us about your fitness goals...",
    saveChanges: "Save Changes",
    saving: "Saving...",
    yourPhone: "Your phone number",
    yourCity: "Your city",
    yourAddress: "Your address",
    contactName: "Contact name",
    emergencyNumber: "Emergency number",
    membershipQRCode: "Your Membership QR Code",
    showQRCodeAtGyms: "Show this QR code at any TRini213 partner gym to check in",
  },
  fr: {
    myProfile: "Mon Profil",
    manageInfo: "Gérez vos informations personnelles",
    editProfile: "Modifier le Profil",
    cancel: "Annuler",
    personalInfo: "Informations Personnelles",
    phone: "Téléphone",
    birthDate: "Date de Naissance",
    city: "Ville",
    address: "Adresse",
    emergencyContact: "Contact d'Urgence",
    emergencyPhone: "Téléphone d'Urgence",
    fitnessGoals: "Objectifs Fitness",
    fitnessGoalsPlaceholder: "Parlez-nous de vos objectifs fitness...",
    saveChanges: "Enregistrer les Modifications",
    saving: "Enregistrement...",
    yourPhone: "Votre numéro de téléphone",
    yourCity: "Votre ville",
    yourAddress: "Votre adresse",
    contactName: "Nom du contact",
    emergencyNumber: "Numéro d'urgence",
    membershipQRCode: "Votre QR Code d'Adhésion",
    showQRCodeAtGyms: "Montrez ce QR code dans n'importe quelle salle partenaire TRini213 pour vous enregistrer",
  },
  ar: {
    myProfile: "ملفي الشخصي",
    manageInfo: "إدارة معلوماتك الشخصية",
    editProfile: "تعديل الملف الشخصي",
    cancel: "إلغاء",
    personalInfo: "المعلومات الشخصية",
    phone: "الهاتف",
    birthDate: "تاريخ الميلاد",
    city: "المدينة",
    address: "العنوان",
    emergencyContact: "جهة اتصال الطوارئ",
    emergencyPhone: "هاتف الطوارئ",
    fitnessGoals: "أهداف اللياقة",
    fitnessGoalsPlaceholder: "أخبرنا عن أهدافك في اللياقة البدنية...",
    saveChanges: "حفظ التغييرات",
    saving: "جاري الحفظ...",
    yourPhone: "رقم هاتفك",
    yourCity: "مدينتك",
    yourAddress: "عنوانك",
    contactName: "اسم جهة الاتصال",
    emergencyNumber: "رقم الطوارئ",
    membershipQRCode: "رمز QR الخاص بعضويتك",
    showQRCodeAtGyms: "اعرض رمز QR هذا في أي نادي شريك لـ TRini213 للتسجيل",
  }
};

const FormField = ({ label, icon: Icon, children, isRTL }) => (
  <div className="space-y-2">
    <Label className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      {label}
    </Label>
    {children}
  </div>
);

export default function Profile() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    birth_date: user?.birth_date || '',
    emergency_contact: user?.emergency_contact || '',
    emergency_phone: user?.emergency_phone || '',
    fitness_goals: user?.fitness_goals || '',
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setIsEditing(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            {t.myProfile}
          </h1>
          <p className="text-gray-600">{t.manageInfo}</p>
        </div>

        <div>
          <Card className="mb-6 border-none shadow-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-emerald-600 via-black to-amber-500" />
            <CardContent className="relative pt-0 pb-6">
              <div className={`flex flex-col md:flex-row ${isRTL ? 'md:flex-row-reverse' : ''} items-center md:items-end gap-4 -mt-16`}>
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarImage src={user?.profile_image} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-600 via-white to-amber-500 text-4xl font-bold">
                    <svg viewBox="0 0 100 100" className="w-16 h-16">
                      <defs>
                        <linearGradient id="starGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: '#FFD700', stopOpacity: 1}} />
                          <stop offset="100%" style={{stopColor: '#FFA500', stopOpacity: 1}} />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r="18" fill="url(#starGradient2)" opacity="0.3"/>
                      <path 
                        d="M50 25 L57 45 L78 45 L62 57 L69 77 L50 65 L31 77 L38 57 L22 45 L43 45 Z" 
                        fill="url(#starGradient2)" 
                        stroke="#FFFFFF" 
                        strokeWidth="1.5"
                      />
                      <path 
                        d="M35 50 Q35 40, 42 35 M65 50 Q65 40, 58 35" 
                        stroke="#00965E" 
                        strokeWidth="3" 
                        fill="none"
                        strokeLinecap="round"
                      />
                      <circle cx="42" cy="52" r="2" fill="#FF0000"/>
                      <circle cx="58" cy="52" r="2" fill="#FF0000"/>
                      <ellipse cx="50" cy="60" rx="8" ry="4" fill="#00965E" opacity="0.6"/>
                    </svg>
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.full_name}</h2>
                  <p className={`text-gray-500 flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2 justify-center md:justify-start`}>
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className={!isEditing ? "bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-90" : ""}
                >
                  {isEditing ? t.cancel : t.editProfile}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div>
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                    <User className="w-5 h-5 text-emerald-600" />
                    {t.personalInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField label={t.phone} icon={Phone} isRTL={isRTL}>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          disabled={!isEditing}
                          placeholder={t.yourPhone}
                        />
                      </FormField>

                      <FormField label={t.birthDate} icon={Calendar} isRTL={isRTL}>
                        <Input
                          id="birth_date"
                          type="date"
                          value={formData.birth_date}
                          onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                          disabled={!isEditing}
                        />
                      </FormField>

                      <FormField label={t.city} icon={MapPin} isRTL={isRTL}>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          disabled={!isEditing}
                          placeholder={t.yourCity}
                        />
                      </FormField>

                      <FormField label={t.address} isRTL={isRTL}>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          disabled={!isEditing}
                          placeholder={t.yourAddress}
                        />
                      </FormField>

                      <FormField label={t.emergencyContact} isRTL={isRTL}>
                        <Input
                          id="emergency_contact"
                          value={formData.emergency_contact}
                          onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                          disabled={!isEditing}
                          placeholder={t.contactName}
                        />
                      </FormField>

                      <FormField label={t.emergencyPhone} isRTL={isRTL}>
                        <Input
                          id="emergency_phone"
                          value={formData.emergency_phone}
                          onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                          disabled={!isEditing}
                          placeholder={t.emergencyNumber}
                        />
                      </FormField>
                    </div>

                    <FormField label={t.fitnessGoals} icon={Heart} isRTL={isRTL}>
                      <Textarea
                        id="fitness_goals"
                        value={formData.fitness_goals}
                        onChange={(e) => setFormData({...formData, fitness_goals: e.target.value})}
                        disabled={!isEditing}
                        placeholder={t.fitnessGoalsPlaceholder}
                        className="h-24"
                      />
                    </FormField>

                    {isEditing && (
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-90"
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? (
                          <>
                            <Loader2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t.saving}
                          </>
                        ) : (
                          <>
                            <Save className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t.saveChanges}
                          </>
                        )}
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div>
              <QRCodeComponent user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}