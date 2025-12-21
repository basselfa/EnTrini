import React, { useState, useEffect } from "react";
import { api } from "../api/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { Textarea } from "../Components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../Components/ui/avatar";
import { User, Mail, Phone, MapPin, Calendar, Save, Loader2, QrCode } from "lucide-react";
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
    firstName: "First Name",
    lastName: "Last Name",
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
    firstName: "Prénom",
    lastName: "Nom de Famille",
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
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
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
    queryFn: () => api.auth.me(),
  });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    birth_date: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        birth_date: user.birth_date || '',
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data) => api.auth.updateMe(data),
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
                    {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User'}</h2>
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
                    </div>

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