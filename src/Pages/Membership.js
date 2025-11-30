import React from "react";
import { base44 } from "../api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../Components/ui/skeleton";
import MembershipCard from "../Components/home/MembershipCard";
import { useLanguage } from "../Layout";

const translations = {
  en: {
    myMembership: "My Membership",
    manageMembership: "Manage your gym membership",
  },
  fr: {
    myMembership: "Mon Abonnement",
    manageMembership: "Gérez votre abonnement de salle",
  },
  ar: {
    myMembership: "عضويتي",
    manageMembership: "إدارة عضوية النادي",
  }
};

export default function Membership() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: membership, isLoading } = useQuery({
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
            {t.myMembership}
          </h1>
          <p className="text-gray-600">{t.manageMembership}</p>
        </div>

        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : (
          <MembershipCard membership={membership} />
        )}
      </div>
    </div>
  );
}