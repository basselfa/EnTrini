import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "../api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Card, CardContent } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";
import { MapPin, Navigation, Phone, Clock, ExternalLink, Loader2 } from "lucide-react";
import { useLanguage } from "../Layout";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const gymIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const translations = {
  en: {
    mapView: "Map View",
    findNearbyGyms: "Find gyms near you on the map",
    locatingYou: "Locating you...",
    yourLocation: "Your Location",
    gymDetails: "Gym Details",
    viewDetails: "View Full Details",
    phone: "Phone",
    hours: "Hours",
    distance: "Distance",
    km: "km away",
    enableLocation: "Enable Location",
    locationDisabled: "Location services are disabled. Please enable them to see nearby gyms.",
    loading: "Loading map...",
    noGyms: "No gyms found on the map",
  },
  fr: {
    mapView: "Vue Carte",
    findNearbyGyms: "Trouvez les gymnases près de vous sur la carte",
    locatingYou: "Localisation...",
    yourLocation: "Votre Position",
    gymDetails: "Détails du Gymnase",
    viewDetails: "Voir les Détails",
    phone: "Téléphone",
    hours: "Horaires",
    distance: "Distance",
    km: "km",
    enableLocation: "Activer la Localisation",
    locationDisabled: "Les services de localisation sont désactivés. Veuillez les activer.",
    loading: "Chargement de la carte...",
    noGyms: "Aucun gymnase trouvé sur la carte",
  },
  ar: {
    mapView: "عرض الخريطة",
    findNearbyGyms: "ابحث عن النوادي القريبة منك على الخريطة",
    locatingYou: "جاري تحديد موقعك...",
    yourLocation: "موقعك",
    gymDetails: "تفاصيل النادي",
    viewDetails: "عرض التفاصيل الكاملة",
    phone: "الهاتف",
    hours: "الساعات",
    distance: "المسافة",
    km: "كم",
    enableLocation: "تفعيل الموقع",
    locationDisabled: "خدمات الموقع معطلة. يرجى تفعيلها.",
    loading: "جاري تحميل الخريطة...",
    noGyms: "لم يتم العثور على نوادي على الخريطة",
  }
};

// Approximate coordinates for Algerian wilayas (you can refine these)
const wilayaCoordinates = {
  "Adrar": [27.8745, -0.2843],
  "Chlef": [36.1650, 1.3347],
  "Laghouat": [33.8000, 2.8667],
  "Oum El Bouaghi": [35.8753, 7.1130],
  "Batna": [35.5558, 6.1743],
  "Béjaïa": [36.7525, 5.0556],
  "Biskra": [34.8481, 5.7244],
  "Béchar": [31.6169, -2.2289],
  "Blida": [36.4703, 2.8277],
  "Bouira": [36.3689, 3.9014],
  "Tamanrasset": [22.7850, 5.5228],
  "Tébessa": [35.4042, 8.1242],
  "Tlemcen": [34.8783, -1.3150],
  "Tiaret": [35.3711, 1.3225],
  "Tizi Ouzou": [36.7117, 4.0494],
  "Alger": [36.7538, 3.0588],
  "Djelfa": [34.6703, 3.2500],
  "Jijel": [36.8167, 5.7667],
  "Sétif": [36.1905, 5.4131],
  "Saïda": [34.8417, 0.1500],
  "Skikda": [36.8667, 6.9083],
  "Sidi Bel Abbès": [35.2100, -0.6400],
  "Annaba": [36.9000, 7.7667],
  "Guelma": [36.4628, 7.4331],
  "Constantine": [36.3650, 6.6147],
  "Médéa": [36.2686, 2.7536],
  "Mostaganem": [35.9317, 0.0892],
  "M'Sila": [35.7058, 4.5425],
  "Mascara": [35.3967, 0.1403],
  "Ouargla": [31.9490, 5.3250],
  "Oran": [35.6969, -0.6331],
  "El Bayadh": [33.6833, 1.0167],
  "Illizi": [26.4833, 8.4833],
  "Bordj Bou Arreridj": [36.0686, 4.7681],
  "Boumerdès": [36.7667, 3.4667],
  "El Tarf": [36.7672, 8.3139],
  "Tindouf": [27.6714, -8.1475],
  "Tissemsilt": [35.6075, 1.8103],
  "El Oued": [33.3608, 6.8517],
  "Khenchela": [35.4358, 7.1433],
  "Souk Ahras": [36.2861, 7.9511],
  "Tipaza": [36.5892, 2.4475],
  "Mila": [36.4503, 6.2647],
  "Aïn Defla": [36.2639, 1.9681],
  "Naâma": [33.2667, -0.3167],
  "Aïn Témouchent": [35.2989, -1.1397],
  "Ghardaïa": [32.4911, 3.6736],
  "Relizane": [35.7378, 0.5558],
  "Timimoun": [29.2631, 0.2411],
  "Bordj Badji Mokhtar": [21.3333, 0.9500],
  "Ouled Djellal": [34.4167, 4.9667],
  "Béni Abbès": [30.1333, -2.1667],
  "In Salah": [27.2167, 2.4667],
  "In Guezzam": [19.5667, 5.7667],
  "Touggourt": [33.1067, 6.0589],
  "Djanet": [24.5542, 9.4844],
  "El M'Ghair": [33.9500, 5.9167],
  "El Meniaa": [30.5833, 2.8833]
};

function LocationMarker({ position }) {
  const { language } = useLanguage();
  const t = translations[language];
  
  return position === null ? null : (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div className="text-center">
          <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <p className="font-bold">{t.yourLocation}</p>
        </div>
      </Popup>
    </Marker>
  );
}

function MapController({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  
  return null;
}

export default function Map() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(true);
  const [locationError, setLocationError] = useState(false);

  const { data: gyms, isLoading } = useQuery({
    queryKey: ['gyms'],
    queryFn: () => base44.entities.Gym.list(),
    initialData: [],
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLocating(false);
        },
        (error) => {
          console.warn("Error getting location:", error);
          setLocationError(true);
          setLocating(false);
          // Default to Algiers if location is denied
          setUserLocation([36.7538, 3.0588]);
        }
      );
    } else {
      setLocationError(true);
      setLocating(false);
      setUserLocation([36.7538, 3.0588]);
    }
  }, []);

  // Assign coordinates to gyms based on their area/wilaya
  const gymsWithCoordinates = useMemo(() => gyms.map(gym => {
    const coords = wilayaCoordinates[gym.area] || wilayaCoordinates[gym.city] || [36.7538, 3.0588];
    // Add small random offset to avoid exact overlap
    const lat = coords[0] + (Math.random() - 0.5) * 0.05;
    const lng = coords[1] + (Math.random() - 0.5) * 0.05;
    return { ...gym, coordinates: [lat, lng] };
  }).filter(gym => gym.status === 'active'), [gyms]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d.toFixed(1);
  };

  if (isLoading || locating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
          <p className="text-gray-600">{locating ? t.locatingYou : t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
            {t.mapView}
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-600" />
            {t.findNearbyGyms}
          </p>
        </div>

        {locationError && (
          <div className="mb-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
            <p className="text-amber-800 text-sm">{t.locationDisabled}</p>
          </div>
        )}

        <div>
          <Card className="overflow-hidden border-none shadow-2xl">
            <CardContent className="p-0">
              <div className="h-[600px] w-full">
                {userLocation && (
                  <MapContainer
                    center={userLocation}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapController center={userLocation} />
                    <LocationMarker position={userLocation} />
                    
                    {gymsWithCoordinates.map((gym) => {
                      const distance = userLocation 
                        ? calculateDistance(userLocation[0], userLocation[1], gym.coordinates[0], gym.coordinates[1])
                        : null;
                      
                      return (
                        <Marker 
                          key={gym.id} 
                          position={gym.coordinates}
                          icon={gymIcon}
                        >
                          <Popup className="custom-popup">
                            <div className="p-2 min-w-[250px]">
                              <h3 className="font-bold text-lg mb-2 text-emerald-700">{gym.name}</h3>
                              <div className="space-y-2 text-sm">
                                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-2`}>
                                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">{gym.address}, {gym.city}</span>
                                </div>
                                {gym.phone && (
                                  <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                                    <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-gray-700">{gym.phone}</span>
                                  </div>
                                )}
                                {gym.hours && (
                                  <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                                    <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-gray-700">{gym.hours}</span>
                                  </div>
                                )}
                                {distance && (
                                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                                    {distance} {t.km}
                                  </Badge>
                                )}
                              </div>
                              <Link to={`${createPageUrl("GymDetail")}?id=${gym.id}`}>
                                <Button 
                                  className="w-full mt-3 bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-90 text-white"
                                  size="sm"
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  {t.viewDetails}
                                </Button>
                              </Link>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
            <CardContent className="p-4">
              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3`}>
                <div className="p-3 bg-emerald-600 rounded-xl">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.yourLocation}</p>
                  <p className="font-bold text-gray-900">
                    {userLocation ? `${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}` : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
            <CardContent className="p-4">
              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3`}>
                <div className="p-3 bg-amber-500 rounded-xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{language === 'fr' ? 'Gymnases sur la carte' : language === 'ar' ? 'النوادي على الخريطة' : 'Gyms on Map'}</p>
                  <p className="font-bold text-gray-900">{gymsWithCoordinates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}