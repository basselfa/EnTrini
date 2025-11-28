import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Phone, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from "../../Layout";

const translations = {
  en: {
    active: "Active",
    pending: "Pending",
    suspended: "Suspended",
    capacity: "Capacity",
    people: "people",
    viewDetails: "View Details",
  },
  fr: {
    active: "Actif",
    pending: "En Attente",
    suspended: "Suspendu",
    capacity: "Capacité",
    people: "personnes",
    viewDetails: "Voir les Détails",
  },
  ar: {
    active: "نشط",
    pending: "قيد الانتظار",
    suspended: "معلق",
    capacity: "السعة",
    people: "أشخاص",
    viewDetails: "عرض التفاصيل",
  }
};

export default function GymCard({ gym, index }) {
  const { language, isRTL } = useLanguage();
  const t = translations[language] || translations.en;

  const statusText = {
    active: t.active,
    pending: t.pending,
    suspended: t.suspended,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={gym.image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'}
            alt={gym.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge 
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} ${
              gym.status === 'active' 
                ? 'bg-green-500 hover:bg-green-600' 
                : gym.status === 'pending'
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {statusText[gym.status] || gym.status}
          </Badge>
        </div>
        
        <CardHeader className="pb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
            {gym.name}
          </h3>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            {gym.description || (language === 'fr' ? 'Gymnase équipé avec les meilleures installations' : language === 'ar' ? 'نادي مجهز بأفضل المرافق' : 'Equipped gym with the best facilities')}
          </p>
          
          <div className="space-y-2">
            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-2 text-sm text-gray-600`}>
              <MapPin className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
              <span className="line-clamp-1">{gym.address}, {gym.city}</span>
            </div>
            
            {gym.hours && (
              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2 text-sm text-gray-600`}>
                <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>{gym.hours}</span>
              </div>
            )}
            
            {gym.capacity && (
              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2 text-sm text-gray-600`}>
                <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>{t.capacity}: {gym.capacity} {t.people}</span>
              </div>
            )}
            
            {gym.phone && (
              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2 text-sm text-gray-600`}>
                <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{gym.phone}</span>
              </div>
            )}
          </div>

          {gym.amenities && gym.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {gym.amenities.slice(0, 3).map((amenity, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {gym.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{gym.amenities.length - 3}
                </Badge>
              )}
            </div>
          )}

          <Link to={`${createPageUrl("GymDetail")}?id=${gym.id}`}>
            <Button className={`w-full mt-4 bg-gradient-to-r from-purple-600 to-orange-500 hover:opacity-90 text-white shadow-md ${isRTL ? 'flex-row-reverse' : ''}`}>
              {t.viewDetails}
              <ExternalLink className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}