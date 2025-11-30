import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../Components/ui/card";

export default function StatsCard({ title, value, icon: Icon }) {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div className="p-2 rounded-lg bg-red-600">
            <Icon className="w-4 h-4 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-3xl font-bold text-gray-900">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}