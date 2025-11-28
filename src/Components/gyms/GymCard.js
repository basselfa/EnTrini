import React from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { MapPin, Clock, Users, Phone, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
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

const getStatusProps = (status) => {
  const props = {
    active: { text: 'Active', className: 'bg-green-500 hover:bg-green-600' },
    pending: { text: 'Pending', className: 'bg-yellow-500 hover:bg-yellow-600' },
    suspended: { text: 'Suspended', className: 'bg-red-500 hover:bg-red-600' },
  };
  return props[status] || { text: status, className: 'bg-gray-500' };
};

const GymInfoItem = ({ icon: Icon, children, isRTL }) => (
  <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-2 text-sm text-gray-600`}>
    <Icon className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
    <span className="line-clamp-1">{children}</span>
  </div>
);

const getDescription = (gym, language) => {
  if (gym.description) return gym.description;
  return language === 'fr' ? 'Gymnase équipé avec les meilleures installations' : language === 'ar' ? 'نادي مجهز بأفضل المرافق' : 'Equipped gym with the best facilities';
};

export default function GymCard({ gym, index }) {
  const { language, isRTL } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <div>
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={gym.image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'}
            alt={gym.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} ${getStatusProps(gym.status).className}`}>
            {getStatusProps(gym.status).text}
          </Badge>
        </div>
        
        <CardHeader className="pb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
            {gym.name}
          </h3>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            {getDescription(gym, language)}
          </p>
          
          <div className="space-y-2">
            <GymInfoItem icon={MapPin} isRTL={isRTL}>
              {gym.address}, {gym.city}
            </GymInfoItem>

            {gym.hours && (
              <GymInfoItem icon={Clock} isRTL={isRTL}>
                {gym.hours}
              </GymInfoItem>
            )}

            {gym.capacity && (
              <GymInfoItem icon={Users} isRTL={isRTL}>
                {t.capacity}: {gym.capacity} {t.people}
              </GymInfoItem>
            )}

            {gym.phone && (
              <GymInfoItem icon={Phone} isRTL={isRTL}>
                {gym.phone}
              </GymInfoItem>
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
    </div>
  );
}