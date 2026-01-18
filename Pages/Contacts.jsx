import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Shield,
  AlertTriangle,
  Info,
} from "lucide-react";

import apiClient from "../api/apiClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/ui/BottomNav";
import ContactCard from "@/components/contacts/ContactCard";
import AddContactModal from "@/components/contacts/AddContactModal";

export default function Contacts() {
  const CREATED_BY = "test@gmail.com"; // TEMP user

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();

  /* ---------------- FETCH CONTACTS ---------------- */
  const { data, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: () =>
      apiClient.entities.TrustedContact.list(CREATED_BY),
  });

  const contacts = data?.contacts || [];

  /* ---------------- ADD CONTACT ---------------- */
  const createContactMutation = useMutation({
    mutationFn: (data) =>
      apiClient.entities.TrustedContact.create({
        ...data,
        created_by: CREATED_BY,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setShowAddModal(false);
    },
  });

  /* ---------------- DELETE CONTACT ---------------- */
  const deleteContactMutation = useMutation({
    mutationFn: (id) =>
      apiClient.entities.TrustedContact.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  /* ---------------- HANDLERS ---------------- */
  const handleSaveContact = (data) => {
    createContactMutation.mutate(data);
  };

  const handleDelete = (contact) => {
    deleteContactMutation.mutate(contact._id);
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery)
  );

  const primaryContact = contacts.find((c) => c.is_primary);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      {/* Header */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-transparent" />
        <div className="relative px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Trusted Contacts</h1>
            <Button
              onClick={() => setShowAddModal(true)}
              size="icon"
              className="w-10 h-10 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-gray-400">
            People who will be alerted in emergencies
          </p>
        </div>
      </header>

      <main className="px-6 space-y-6">
        {/* Empty state */}
        {!isLoading && contacts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-4 border border-amber-500/20"
          >
            <div className="flex gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="font-semibold text-amber-200">
                  No Contacts Added
                </h3>
                <p className="text-sm text-gray-400">
                  Add at least one trusted contact to receive SOS alerts.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Primary contact */}
        {primaryContact && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl p-4 border border-violet-500/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-violet-400" />
              <span className="text-violet-300 font-medium text-sm">
                Primary Emergency Contact
              </span>
            </div>
            <h3 className="font-semibold">{primaryContact.name}</h3>
            <p className="text-gray-400">{primaryContact.phone}</p>
          </motion.div>
        )}

        {/* Search */}
        {contacts.length > 0 && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="pl-12 bg-gray-800/50 border-gray-700 text-white h-12 rounded-xl"
            />
          </div>
        )}

        {/* Contact list */}
        <div className="space-y-3">
          {filteredContacts.map((contact, index) => (
            <ContactCard
              key={contact._id}
              contact={contact}
              index={index}
              onDelete={() => handleDelete(contact)}
            />
          ))}
        </div>

        {/* Info */}
        {contacts.length > 0 && (
          <div className="bg-gray-800/30 rounded-2xl p-4 border border-gray-800">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-gray-400" />
              <div className="text-sm text-gray-400">
                <p>When you trigger an SOS:</p>
                <ul className="mt-1 space-y-1">
                  <li>• All contacts receive an SMS</li>
                  <li>• Location is shared automatically</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveContact}
      />

      <BottomNav currentPage="Contacts" />
    </div>
  );
}
