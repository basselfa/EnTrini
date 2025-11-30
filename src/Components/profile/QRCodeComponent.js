import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../Components/ui/card";
import { QrCode } from "lucide-react";
import { useLanguage } from "../../Layout";

const translations = {
  en: {
    membershipQRCode: "Your Membership QR Code",
    showQRCodeAtGyms: "Show this QR code at any TRini213 partner gym to check in",
    memberID: "Member ID",
  },
  fr: {
    membershipQRCode: "Votre QR Code d'Adhésion",
    showQRCodeAtGyms: "Montrez ce QR code dans n'importe quelle salle partenaire TRini213 pour vous enregistrer",
    memberID: "ID Membre",
  },
  ar: {
    membershipQRCode: "رمز QR الخاص بعضويتك",
    showQRCodeAtGyms: "اعرض رمز QR هذا في أي نادي شريك لـ TRini213 للتسجيل",
    memberID: "معرف العضو",
  }
};

export default function QRCodeComponent({ user }) {
  const { language, isRTL } = useLanguage();
  const t = translations[language];

  if (!user) return null;

  // Generate QR code URL using a QR code API
  const qrCodeData = `TRINI213:${user.id}:${user.email}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeData)}`;

  return (
    <Card className="border-none shadow-lg overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-emerald-600 via-black to-amber-500" />
      <CardHeader className="bg-gradient-to-br from-emerald-50 to-amber-50">
        <CardTitle className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2 text-lg`}>
          <QrCode className="w-5 h-5 text-emerald-600" />
          {t.membershipQRCode}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-emerald-200">
            <img 
              src={qrCodeUrl} 
              alt="QR Code"
              className="w-48 h-48"
            />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-gray-700">
            {t.memberID}: {user.id?.slice(0, 8)}
          </p>
          <p className="text-xs text-gray-500 px-4">
            {t.showQRCodeAtGyms}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
            <div className="w-3 h-3 rounded-full bg-white border-2 border-black"></div>
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}