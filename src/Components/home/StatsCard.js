import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
        <CardHeader className="relative pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium text-gray-600">
              {title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} shadow-md`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {value}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}