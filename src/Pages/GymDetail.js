import React, { useState } from "react";
import { api } from "../api/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";
import { Textarea } from "../Components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../Components/ui/avatar";
import { ArrowLeft, MapPin, Phone, Clock, Users, Mail, CheckCircle, Star, MessageSquare, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Skeleton } from "../Components/ui/skeleton";
import { format } from "date-fns";
import { enUS, fr, arSA } from "date-fns/locale";
import { useLanguage } from "../Layout";

const translations = {
  en: {
    back: "Back",
    about: "About the Gym",
    services: "Services & Equipment",
    contactInfo: "Contact Information",
    phone: "Phone",
    hours: "Hours",
    capacity: "Capacity",
    people: "people",
    contact: "Contact",
    visitGym: "Visit Gym",
    gymNotFound: "Gym Not Found",
    backToGyms: "Back to Gyms",
    feedbackTitle: "Member Reviews",
    yourReview: "Your Review",
    rating: "Rating",
    writeReview: "Write your review...",
    submitReview: "Submit Review",
    submitting: "Submitting...",
    noReviews: "No reviews yet. Be the first to review!",
  },
  fr: {
    back: "Retour",
    about: "À propos du Gymnase",
    services: "Services et Équipements",
    contactInfo: "Informations de Contact",
    phone: "Téléphone",
    hours: "Horaires",
    capacity: "Capacité",
    people: "personnes",
    contact: "Contact",
    visitGym: "Visiter le Gymnase",
    gymNotFound: "Gymnase non trouvé",
    backToGyms: "Retour aux Gymnases",
    feedbackTitle: "Avis des Membres",
    yourReview: "Votre Avis",
    rating: "Note",
    writeReview: "Écrivez votre avis...",
    submitReview: "Soumettre l'Avis",
    submitting: "Envoi...",
    noReviews: "Pas encore d'avis. Soyez le premier!",
  },
  ar: {
    back: "رجوع",
    about: "حول النادي",
    services: "الخدمات والمعدات",
    contactInfo: "معلومات الاتصال",
    phone: "الهاتف",
    hours: "الساعات",
    capacity: "السعة",
    people: "أشخاص",
    contact: "الاتصال",
    visitGym: "زيارة النادي",
    gymNotFound: "لم يتم العثور على النادي",
    backToGyms: "العودة للنوادي",
    feedbackTitle: "تقييمات الأعضاء",
    yourReview: "تقييمك",
    rating: "التقييم",
    writeReview: "اكتب تقييمك...",
    submitReview: "إرسال التقييم",
    submitting: "جاري الإرسال...",
    noReviews: "لا توجد تقييمات بعد. كن أول من يقيّم!",
  }
};

export default function GymDetail() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const locale = language === 'fr' ? fr : language === 'ar' ? arSA : enUS;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const gymId = urlParams.get('id');

  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.auth.me(),
  });

  const { data: gyms, isLoading } = useQuery({
    queryKey: ['gyms'],
    queryFn: () => api.entities.Gym.list(),
    initialData: [],
  });

  const { data: feedbacks, isLoading: loadingFeedbacks } = useQuery({
    queryKey: ['gym-feedbacks', gymId],
    queryFn: () => api.entities.GymFeedback.filter({ gym_id: gymId }, '-created_date'),
    initialData: [],
    enabled: !!gymId,
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: (feedbackData) => api.entities.GymFeedback.create(feedbackData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym-feedbacks', gymId] });
      setNewReview({ rating: 5, comment: "" });
    },
  });

  const gym = gyms.find(g => g.id === gymId);

  const handleSubmitReview = () => {
    if (!user || !newReview.comment.trim()) return;
    
    submitFeedbackMutation.mutate({
      gym_id: gymId,
      user_email: user.email,
      user_name: user.full_name,
      rating: newReview.rating,
      comment: newReview.comment,
    });
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'fill-amber-500 text-amber-500' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  const averageRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">{t.gymNotFound}</h2>
          <Button onClick={() => navigate(createPageUrl("Gyms"))}>
            {t.backToGyms}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Gyms"))}
          className={`mb-6 hover:bg-emerald-50 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t.back}
        </Button>

        <div className="space-y-6">
          {/* Hero Image */}
          <Card className="overflow-hidden border-none shadow-2xl">
            <div className="relative h-96">
              <img
                src={gym.image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200'}
                alt={gym.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className={`absolute bottom-0 ${isRTL ? 'right-0' : 'left-0'} p-8 text-white`}>
                <Badge 
                  className={`mb-4 ${
                    gym.status === 'active' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-yellow-500 hover:bg-yellow-600'
                  }`}
                >
                  {gym.status === 'active' ? 'Actif' : 'Pending'}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{gym.name}</h1>
                <p className={`text-xl text-white/90 flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                  <MapPin className="w-5 h-5" />
                  {gym.address}, {gym.city}
                </p>
                {feedbacks.length > 0 && (
                  <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2 mt-2`}>
                    {renderStars(Math.round(averageRating))}
                    <span className="text-lg font-semibold">
                      {averageRating} ({feedbacks.length} {language === 'ar' ? 'تقييم' : language === 'fr' ? 'avis' : 'reviews'})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Info Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">{t.about}</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {gym.description || (language === 'ar' ? 'نادي مجهز بأفضل المرافق للتدريب الخاص بك.' : language === 'fr' ? 'Gymnase équipé avec les meilleures installations pour votre entraînement.' : 'Gym equipped with the best facilities for your training.')}
                  </p>
                </CardContent>
              </Card>

              {/* Amenities */}
              {gym.amenities && gym.amenities.length > 0 && (
                <Card className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <h2 className={`text-2xl font-bold mb-4 flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      {t.services}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-3">
                      {gym.amenities.map((amenity, i) => (
                        <div key={i} className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2 text-gray-700`}>
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-600 to-amber-500" />
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews Section */}
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h2 className={`text-2xl font-bold mb-6 flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2`}>
                    <MessageSquare className="w-6 h-6 text-emerald-600" />
                    {t.feedbackTitle}
                  </h2>

                  {/* Submit Review Form */}
                  {user && (
                    <div className="mb-8 p-4 bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl border-2 border-emerald-100">
                      <h3 className="font-semibold mb-3">{t.yourReview}</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium mb-2 block">{t.rating}</label>
                          {renderStars(newReview.rating, true, (rating) => setNewReview({...newReview, rating}))}
                        </div>
                        <Textarea
                          placeholder={t.writeReview}
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          className="h-24"
                        />
                        <Button
                          onClick={handleSubmitReview}
                          disabled={!newReview.comment.trim() || submitFeedbackMutation.isPending}
                          className={`w-full bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-90 ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          {submitFeedbackMutation.isPending ? (
                            t.submitting
                          ) : (
                            <>
                              <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {t.submitReview}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {loadingFeedbacks ? (
                      [1, 2, 3].map(i => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-16 w-full" />
                        </div>
                      ))
                    ) : feedbacks.length > 0 ? (
                      feedbacks.map((feedback) => (
                        <div key={feedback.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                          <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3 mb-2`}>
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-amber-500 text-white font-bold">
                                {feedback.user_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-start mb-1`}>
                                <div>
                                  <p className="font-semibold">{feedback.user_name}</p>
                                  <p className="text-xs text-gray-500">
                                    {feedback.created_date && !isNaN(new Date(feedback.created_date).getTime())
                                      ? format(new Date(feedback.created_date), 'PPP', { locale })
                                      : 'Recently'}
                                  </p>
                                </div>
                                {renderStars(feedback.rating)}
                              </div>
                              <p className="text-gray-700 mt-2">{feedback.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>{t.noReviews}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Card */}
            <div className="space-y-6">
              <Card className="border-none shadow-lg sticky top-8">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold mb-4">{t.contactInfo}</h3>
                  
                  <div className="space-y-3">
                    <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                      <Phone className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">{t.phone}</p>
                        <p className="font-medium">{gym.phone}</p>
                      </div>
                    </div>

                    {gym.hours && (
                      <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                        <Clock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">{t.hours}</p>
                          <p className="font-medium">{gym.hours}</p>
                        </div>
                      </div>
                    )}

                    {gym.capacity && (
                      <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                        <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">{t.capacity}</p>
                          <p className="font-medium">{gym.capacity} {t.people}</p>
                        </div>
                      </div>
                    )}

                    <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3`}>
                      <Mail className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">{t.contact}</p>
                        <p className="font-medium text-sm">{gym.owner_email}</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-amber-500 hover:opacity-90 text-white shadow-lg mt-6">
                    {t.visitGym}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}