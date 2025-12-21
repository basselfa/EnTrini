import React, { useState } from "react";
import { api } from "../api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";
import { Search, MapPin, Filter, Map } from "lucide-react";
import { Skeleton } from "../Components/ui/skeleton";
import GymCard from "../Components/gyms/GymCard";
import { useLanguage } from "../Layout";

const translations = {
  en: {
    findGym: "Find Your Perfect Gym",
    gymsAvailable: "gyms available in your TRini213 network",
    searchPlaceholder: "Search by name or wilaya...",
    allWilayas: "All Wilayas",
    noGymsFound: "No Gyms Found",
    adjustFilters: "Try adjusting your search filters",
    filterByWilaya: "Filter by Wilaya",
  },
  fr: {
    findGym: "Trouvez Votre Gymnase Parfait",
    gymsAvailable: "gymnases disponibles dans votre réseau TRini213",
    searchPlaceholder: "Rechercher par nom ou wilaya...",
    allWilayas: "Toutes les Wilayas",
    noGymsFound: "Aucun gymnase trouvé",
    adjustFilters: "Essayez d'ajuster vos filtres",
    filterByWilaya: "Filtrer par Wilaya",
  },
  ar: {
    findGym: "اعثر على النادي المثالي",
    gymsAvailable: "نادي متاح في شبكة TRini213",
    searchPlaceholder: "البحث بالاسم أو الولاية...",
    allWilayas: "جميع الولايات",
    noGymsFound: "لم يتم العثور على نوادي",
    adjustFilters: "حاول تعديل فلاتر البحث",
    filterByWilaya: "تصفية حسب الولاية",
  }
};

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

export default function Gyms() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("all");

  const { data: gyms, isLoading } = useQuery({
    queryKey: ['gyms'],
    queryFn: () => api.entities.Gym.list('-created_date'),
    initialData: [],
  });

  const filterGyms = (gyms, searchQuery, selectedWilaya) => {
    return gyms.filter(gym => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = gym.name.toLowerCase().includes(query) ||
                            gym.city?.toLowerCase().includes(query) ||
                            gym.area?.toLowerCase().includes(query) ||
                            gym.description?.toLowerCase().includes(query);
      const matchesWilaya = selectedWilaya === "all" || gym.area === selectedWilaya;
      return matchesSearch && matchesWilaya && gym.status === 'active';
    });
  };

  const filteredGyms = filterGyms(gyms, searchQuery, selectedWilaya);

  const getWilayaName = (wilaya) => {
    if (language === 'ar') return wilaya.nameAr;
    return wilaya.name;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
            {t.findGym}
          </h1>
          <p className="text-gray-600">
            {filteredGyms.length} {t.gymsAvailable}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-8 border-2 border-emerald-100">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-emerald-600 w-5 h-5`} />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${isRTL ? 'pr-10' : 'pl-10'} h-12 border-2 border-gray-200 focus:border-emerald-500`}
              />
            </div>

            <div className="relative">
              <Map className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-red-600 w-5 h-5 z-10`} />
              <Select value={selectedWilaya} onValueChange={setSelectedWilaya}>
                <SelectTrigger className={`${isRTL ? 'pr-10' : 'pl-10'} h-12 border-2 border-gray-200 focus:border-emerald-500`}>
                  <SelectValue placeholder={t.allWilayas} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">{t.allWilayas}</SelectItem>
                  {ALGERIAN_WILAYAS.map(wilaya => (
                    <SelectItem key={wilaya.code} value={wilaya.name}>
                      {getWilayaName(wilaya)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : filteredGyms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGyms.map((gym, index) => (
              <GymCard key={gym.id} gym={gym} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {t.noGymsFound}
            </h3>
            <p className="text-gray-500">
              {t.adjustFilters}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}