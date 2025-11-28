import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, Phone, Clock, Users, Image as ImageIcon, CheckCircle, Loader2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from "../Layout";

const ALGERIAN_WILAYAS = [
  { code: "01", name: "Adrar", nameAr: "أدرار" },
  { code: "02", name: "Chlef", nameAr: "الشلف" },
  { code: "03", name: "Laghouat", nameAr: "الأغواط" },
  { code: "04", name: "Oum El Bouaghi", nameAr: "أم البواقي" },
  { code: "05", name: "Batna", nameAr: "باتنة" },
  { code: "06", name: "Béjaïa", nameAr: "بجاية" },
  { code: "07", name: "Biskra", nameAr: "بسكرة" },
  { code: "08", name: "Béchar", nameAr: "بشار" },
  { code: "09", name: "Blida", nameAr: "البليدة" },
  { code: "10", name: "Bouira", nameAr: "البويرة" },
  { code: "11", name: "Tamanrasset", nameAr: "تمنراست" },
  { code: "12", name: "Tébessa", nameAr: "تبسة" },
  { code: "13", name: "Tlemcen", nameAr: "تلمسان" },
  { code: "14", name: "Tiaret", nameAr: "تيارت" },
  { code: "15", name: "Tizi Ouzou", nameAr: "تيزي وزو" },
  { code: "16", name: "Alger", nameAr: "الجزائر" },
  { code: "17", name: "Djelfa", nameAr: "الجلفة" },
  { code: "18", name: "Jijel", nameAr: "جيجل" },
  { code: "19", name: "Sétif", nameAr: "سطيف" },
  { code: "20", name: "Saïda", nameAr: "سعيدة" },
  { code: "21", name: "Skikda", nameAr: "سكيكدة" },
  { code: "22", name: "Sidi Bel Abbès", nameAr: "سيدي بلعباس" },
  { code: "23", name: "Annaba", nameAr: "عنابة" },
  { code: "24", name: "Guelma", nameAr: "قالمة" },
  { code: "25", name: "Constantine", nameAr: "قسنطينة" },
  { code: "26", name: "Médéa", nameAr: "المدية" },
  { code: "27", name: "Mostaganem", nameAr: "مستغانم" },
  { code: "28", name: "M'Sila", nameAr: "المسيلة" },
  { code: "29", name: "Mascara", nameAr: "معسكر" },
  { code: "30", name: "Ouargla", nameAr: "ورقلة" },
  { code: "31", name: "Oran", nameAr: "وهران" },
  { code: "32", name: "El Bayadh", nameAr: "البيض" },
  { code: "33", name: "Illizi", nameAr: "إليزي" },
  { code: "34", name: "Bordj Bou Arreridj", nameAr: "برج بوعريريج" },
  { code: "35", name: "Boumerdès", nameAr: "بومرداس" },
  { code: "36", name: "El Tarf", nameAr: "الطارف" },
  { code: "37", name: "Tindouf", nameAr: "تندوف" },
  { code: "38", name: "Tissemsilt", nameAr: "تيسمسيلت" },
  { code: "39", name: "El Oued", nameAr: "الوادي" },
  { code: "40", name: "Khenchela", nameAr: "خنشلة" },
  { code: "41", name: "Souk Ahras", nameAr: "سوق أهراس" },
  { code: "42", name: "Tipaza", nameAr: "تيبازة" },
  { code: "43", name: "Mila", nameAr: "ميلة" },
  { code: "44", name: "Aïn Defla", nameAr: "عين الدفلى" },
  { code: "45", name: "Naâma", nameAr: "النعامة" },
  { code: "46", name: "Aïn Témouchent", nameAr: "عين تموشنت" },
  { code: "47", name: "Ghardaïa", nameAr: "غرداية" },
  { code: "48", name: "Relizane", nameAr: "غليزان" },
  { code: "49", name: "Timimoun", nameAr: "تيميمون" },
  { code: "50", name: "Bordj Badji Mokhtar", nameAr: "برج باجي مختار" },
  { code: "51", name: "Ouled Djellal", nameAr: "أولاد جلال" },
  { code: "52", name: "Béni Abbès", nameAr: "بني عباس" },
  { code: "53", name: "In Salah", nameAr: "عين صالح" },
  { code: "54", name: "In Guezzam", nameAr: "عين قزام" },
  { code: "55", name: "Touggourt", nameAr: "تقرت" },
  { code: "56", name: "Djanet", nameAr: "جانت" },
  { code: "57", name: "El M'Ghair", nameAr: "المغير" },
  { code: "58", name: "El Meniaa", nameAr: "المنيعة" }
];

const translations = {
  en: {
    registerGym: "Register a Gym",
    joinNetwork: "Join our network and grow your business",
    gymInfo: "Gym Information",
    gymName: "Gym Name",
    gymNamePlaceholder: "e.g. FitLife Gym",
    description: "Description",
    descriptionPlaceholder: "Describe your gym, equipment and services...",
    address: "Address",
    addressPlaceholder: "Street and number",
    city: "City",
    cityPlaceholder: "Your city",
    wilaya: "Wilaya",
    wilayaPlaceholder: "Select wilaya",
    phone: "Phone",
    hours: "Hours",
    hoursPlaceholder: "Mon-Fri: 6am-10pm",
    capacity: "Maximum Capacity",
    capacityPlaceholder: "Number of people",
    gymImage: "Gym Image",
    amenities: "Services & Equipment",
    registerButton: "Register Gym",
    registering: "Registering...",
    reviewNote: "Your gym will be reviewed by our team and activated within 24-48 hours",
  },
  fr: {
    registerGym: "Enregistrer un Gymnase",
    joinNetwork: "Rejoignez notre réseau et développez votre entreprise",
    gymInfo: "Informations du Gymnase",
    gymName: "Nom du Gymnase",
    gymNamePlaceholder: "Ex: FitLife Gym",
    description: "Description",
    descriptionPlaceholder: "Décrivez votre gymnase, équipement et services...",
    address: "Adresse",
    addressPlaceholder: "Rue et numéro",
    city: "Ville",
    cityPlaceholder: "Votre ville",
    wilaya: "Wilaya",
    wilayaPlaceholder: "Sélectionnez la wilaya",
    phone: "Téléphone",
    hours: "Horaires",
    hoursPlaceholder: "Lun-Ven: 6h-22h",
    capacity: "Capacité Maximale",
    capacityPlaceholder: "Nombre de personnes",
    gymImage: "Image du Gymnase",
    amenities: "Services et Équipements",
    registerButton: "Enregistrer le Gymnase",
    registering: "Enregistrement...",
    reviewNote: "Votre gymnase sera examiné par notre équipe et activé sous 24-48 heures",
  },
  ar: {
    registerGym: "تسجيل نادي رياضي",
    joinNetwork: "انضم إلى شبكتنا وقم بتنمية عملك",
    gymInfo: "معلومات النادي",
    gymName: "اسم النادي",
    gymNamePlaceholder: "مثال: نادي FitLife",
    description: "الوصف",
    descriptionPlaceholder: "صف ناديك والمعدات والخدمات...",
    address: "العنوان",
    addressPlaceholder: "الشارع والرقم",
    city: "المدينة",
    cityPlaceholder: "مدينتك",
    wilaya: "الولاية",
    wilayaPlaceholder: "اختر الولاية",
    phone: "الهاتف",
    hours: "ساعات العمل",
    hoursPlaceholder: "الإثنين-الجمعة: 6ص-10م",
    capacity: "السعة القصوى",
    capacityPlaceholder: "عدد الأشخاص",
    gymImage: "صورة النادي",
    amenities: "الخدمات والمعدات",
    registerButton: "تسجيل النادي",
    registering: "جاري التسجيل...",
    reviewNote: "سيتم مراجعة ناديك من قبل فريقنا وتفعيله خلال 24-48 ساعة",
  }
};

const amenitiesList = {
  en: [
    "Free Weights", "Machines", "Cardio", "Group Classes",
    "Spinning", "Yoga", "Pilates", "CrossFit",
    "Pool", "Sauna", "Parking", "WiFi",
    "Lockers", "Showers", "Personal Trainer", "Nutritionist"
  ],
  fr: [
    "Poids Libres", "Machines", "Cardio", "Cours Collectifs",
    "Spinning", "Yoga", "Pilates", "CrossFit",
    "Piscine", "Sauna", "Parking", "WiFi",
    "Casiers", "Douches", "Coach Personnel", "Nutritionniste"
  ],
  ar: [
    "أوزان حرة", "آلات", "كارديو", "دروس جماعية",
    "سبينينغ", "يوغا", "بيلاتس", "كروس فيت",
    "مسبح", "ساونا", "موقف سيارات", "واي فاي",
    "خزائن", "دُش", "مدرب شخصي", "أخصائي تغذية"
  ]
};

export default function GymRegistration() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const [formData, setFormData] = useState({
    name: '',
    owner_email: user?.email || '',
    description: '',
    address: '',
    city: '',
    area: '',
    phone: '',
    hours: '',
    capacity: '',
    amenities: [],
    image_url: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const createGymMutation = useMutation({
    mutationFn: (data) => base44.entities.Gym.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gyms'] });
      navigate(createPageUrl("Gyms"));
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, image_url: file_url });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setUploadingImage(false);
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createGymMutation.mutate({
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      status: 'pending',
    });
  };

  const getWilayaName = (wilaya) => {
    if (language === 'ar') return wilaya.nameAr;
    return wilaya.name;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            {t.registerGym}
          </h1>
          <p className="text-gray-600">
            {t.joinNetwork}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-orange-50">
              <CardTitle className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2 text-2xl`}>
                <Building2 className="w-6 h-6 text-purple-600" />
                {t.gymInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.gymName} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={t.gymNamePlaceholder}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{t.description}</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder={t.descriptionPlaceholder}
                      className="h-24"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {t.address} *
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder={t.addressPlaceholder}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">{t.city} *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder={t.cityPlaceholder}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">{t.wilaya}</Label>
                  <Select value={formData.area} onValueChange={(value) => setFormData({...formData, area: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.wilayaPlaceholder} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {ALGERIAN_WILAYAS.map(wilaya => (
                        <SelectItem key={wilaya.code} value={wilaya.name}>
                          {wilaya.code} - {getWilayaName(wilaya)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                      <Phone className="w-4 h-4 text-gray-500" />
                      {t.phone} *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+213 ..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hours" className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                      <Clock className="w-4 h-4 text-gray-500" />
                      {t.hours}
                    </Label>
                    <Input
                      id="hours"
                      value={formData.hours}
                      onChange={(e) => setFormData({...formData, hours: e.target.value})}
                      placeholder={t.hoursPlaceholder}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity" className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                    <Users className="w-4 h-4 text-gray-500" />
                    {t.capacity}
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder={t.capacityPlaceholder}
                  />
                </div>

                <div className="space-y-2">
                  <Label className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                    {t.gymImage}
                  </Label>
                  <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-4`}>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="flex-1"
                    />
                    {uploadingImage && <Loader2 className="w-5 h-5 animate-spin text-purple-600" />}
                    {formData.image_url && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                  {formData.image_url && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'}`}
                        onClick={() => setFormData({...formData, image_url: ''})}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>{t.amenities}</Label>
                  <div className="flex flex-wrap gap-2">
                    {(amenitiesList[language] || amenitiesList.en).map((amenity) => (
                      <Badge
                        key={amenity}
                        variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          formData.amenities.includes(amenity)
                            ? 'bg-gradient-to-r from-purple-600 to-orange-500 hover:opacity-90'
                            : 'hover:bg-purple-50'
                        }`}
                        onClick={() => toggleAmenity(amenity)}
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:opacity-90 text-white shadow-lg h-12 text-lg"
                  disabled={createGymMutation.isPending}
                >
                  {createGymMutation.isPending ? (
                    <>
                      <Loader2 className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                      {t.registering}
                    </>
                  ) : (
                    <>
                      <CheckCircle className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t.registerButton}
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  {t.reviewNote}
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}