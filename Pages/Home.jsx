import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import {
  Shield,
  Users,
  Moon,
  ChevronRight,
  Plus,
  Zap,
  AlertCircle,
} from "lucide-react";

import apiClient from "../api/apiClient";
import { startSOS } from "../Layout.js/Functions/StartSOS";


import SOSButton from "@/Components/sos/SOSButton";
import StatusCard from "@/components/ui/StatusCard";
import BottomNav from "@/components/ui/BottomNav";
import SOSActiveAlert from "@/components/alerts/SOSActiveAlerts";
import SOSInstructions from "@/components/sos/SOSInstruction";

export default function Home() {
  const CREATED_BY = "test@gmail.com"; // 🔴 temp auth

  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlert, setActiveAlert] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ---------- CONTACTS ---------- */
  const { data: contactsData } = useQuery({
    queryKey: ["contacts"],
    queryFn: () =>
      apiClient.entities.TrustedContact.list(CREATED_BY),
  });

  const contacts = contactsData?.contacts || [];

  /* ---------- SOS HANDLER ---------- */
  const handleSOSTrigger = async () => {
    const res = await startSOS();

    if (res.success) {
      setActiveAlert(res.data);
    } else {
      alert(res.message);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Stay Safe Tonight";
  };

  const isNightTime = currentTime.getHours() >= 19 || currentTime.getHours() < 6;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      {/* Active SOS Overlay */}
      <AnimatePresence>
        {activeAlert && (
          <SOSActiveAlert
            alert={activeAlert}
            contacts={contacts}
            onResolve={() => setActiveAlert(null)}
            onCancel={() => setActiveAlert(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-transparent" />
        <div className="relative px-6 pt-12 pb-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-gray-400 text-sm mb-1">{getGreeting()}</p>
              <h1 className="text-2xl font-bold">Welcome</h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-800/50 border border-gray-700/50">
              {isNightTime ? (
                <>
                  <Moon className="w-4 h-4 text-violet-400" />
                  <span className="text-sm text-gray-300">Night Mode</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-gray-300">Day Mode</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatusCard
              icon={Users}
              title="Trusted Contacts"
              value={contacts.length}
              subtitle="Ready"
              color="violet"
            />
            <StatusCard
              icon={Shield}
              title="Safety"
              value="Safe"
              subtitle="Monitoring"
              color="emerald"
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 space-y-8">
        {/* SOS Button */}
        <section className="flex flex-col items-center py-8">
          <p className="text-gray-400 text-sm mb-6">
            Hold to activate emergency alert
          </p>
          <SOSButton onTrigger={handleSOSTrigger} />
          <p className="text-gray-500 text-xs mt-6">
            Alerts will be sent to {contacts.length} contact(s)
          </p>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to={createPageUrl("Contacts")}>
              <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-medium mb-1">Add Contact</h3>
                <p className="text-sm text-gray-400">Emergency contacts</p>
              </div>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Emergency System</h2>
          <SOSInstructions />
        </section>

        {isNightTime && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Night Safety Tips</h2>
            <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <p className="text-sm text-gray-400">
                  Stay in well-lit areas and keep phone charged.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <BottomNav currentPage="Home" />
    </div>
  );
}
