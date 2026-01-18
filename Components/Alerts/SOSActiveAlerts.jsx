import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Clock, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SOSActiveAlert({
  alert,
  contacts = [],
  onResolve,
  onCancel,
}) {
  const [elapsed, setElapsed] = useState(0);
  const [stoppingSOS, setStoppingSOS] = useState(false);

  /* ================= TIMER (FAIL-SAFE) ================= */
  useEffect(() => {
    // 1️⃣ Best case: backend timestamp
    let startTime =
      alert?.createdAt
        ? new Date(alert.createdAt).getTime()
        : null;

    // 2️⃣ Fallback: local time (GUARANTEED)
    if (!startTime) {
      startTime = Date.now();
    }

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [alert]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  /* ================= UI ================= */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-red-950/95 z-50 flex flex-col"
    >
      <div className="flex-1 flex flex-col p-6 text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">SOS Alert Active</h1>
          <p className="text-red-200">
            Emergency alert is running
          </p>
        </div>

        {/* Timer */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30">
            <Clock className="w-4 h-4 text-red-400" />
            <span className="font-mono text-lg">
              {formatTime(elapsed)}
            </span>
          </div>
        </div>

        {/* Contacts */}
        <div className="mb-8">
          <h3 className="text-sm text-red-200 mb-3">
            Contacts Notified
          </h3>
          <div className="space-y-2">
            {contacts.slice(0, 3).map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-red-300">{c.phone}</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs">
                  <CheckCircle className="w-3 h-3" />
                  Sent
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call */}
        <a
          href="tel:112"
          className="flex items-center justify-center gap-3 p-4 bg-white rounded-2xl text-red-600 font-bold text-lg mb-4"
        >
          <Phone className="w-6 h-6" />
          Call Emergency Services
        </a>

        {/* Actions */}
        <div className="mt-auto space-y-3">
          <Button
            onClick={onResolve}
            disabled={stoppingSOS}
            className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-lg"
          >
            <Shield className="w-5 h-5 mr-2" />
            I’m Safe Now
          </Button>

          <Button
            onClick={onCancel}
            variant="ghost"
            className="w-full h-12 text-red-300 hover:text-white"
          >
            False Alarm
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
