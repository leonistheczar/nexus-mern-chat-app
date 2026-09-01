"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChatContacts } from "@/lib/providers/ChatProvider";
import { X, UserPlus, Search, AtSign, Phone, Check } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Contact } from "@/app/types/types";
import { lockBodyScroll } from "@/lib/bodyScrollLock";

interface NewUserProps {
  onContactSelect?: (contact: Contact) => void;
}

export default function NewUser({ onContactSelect }: NewUserProps) {
  const { openNewUser, setOpenNewUser, contacts } = useChatContacts();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setFilteredContacts([]);
    setOpenNewUser(false);
  }, [setOpenNewUser]);

  const newUserModalRef = useClickOutside<HTMLDivElement>({
    enabled: openNewUser,
    onOutsideClick: handleReset,
    onEscape: handleReset,
  });

  // Focus search input when modal opens
  useEffect(() => {
    if (openNewUser) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [openNewUser]);

  // Filter contacts based on search query
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setFilteredContacts([]);
      return;
    }

    const filtered = contacts.filter(
      (contact) =>
        contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.contact.includes(searchQuery),
    );

    setFilteredContacts(filtered);
  }, [searchQuery, contacts]);

  const handleAddContact = (contactId: number) => {
    // TODO: Implement actual contact addition logic
    console.log("Adding contact:", contactId);
    handleReset();
  };
  const handleContactClick = (contact: Contact) => {
    // If contact is already added, select them and close modal
    if (contact.isContact) {
      onContactSelect?.(contact);
      handleReset();
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!openNewUser) return;
    const unlockScroll = lockBodyScroll();
    return unlockScroll;
  }, [openNewUser]);

  return (
    <AnimatePresence>
      {openNewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            className="relative z-10 w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-primary-100 shadow-2xl border border-background-200 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            ref={newUserModalRef}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-background-200 shrink-0">
              <div className="flex items-center gap-x-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <UserPlus className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-800 leading-tight">
                    Add New Contact
                  </h2>
                  <p className="text-xs text-text-600 leading-tight">
                    Search contacts by name or number
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="p-1.5 hover:bg-background-200 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-text-400" />
              </button>
            </div>

            {/* Search Section */}
            <div className="p-4 border-b border-background-200 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name or number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-primary-200/60 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-text-700 placeholder-text-600 text-sm"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto">
              {searchQuery.trim().length > 0 ? (
                <div className="p-2">
                  {filteredContacts.length > 0 ? (
                    <div className="space-y-1">
                      {filteredContacts.map((contact) => (
                        <button
                          key={contact.id}
                          onClick={() => handleContactClick(contact)}
                          className="flex w-full cursor-pointer items-center justify-between p-3 hover:bg-primary-200/40 rounded-lg transition-colors group"
                        >
                          {/* Contact Info */}
                          <div className="flex items-center gap-x-3 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
                              {contact.profile_pic ? (
                                <Image
                                  src={contact.profile_pic}
                                  alt={`${contact.first_name} ${contact.last_name}`}
                                  className="w-full h-full object-cover"
                                  width={25}
                                  height={25}
                                  unoptimized
                                />
                              ) : (
                                <span className="text-sm font-medium text-primary-600">
                                  {getInitials(
                                    contact.first_name,
                                    contact.last_name,
                                  )}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-medium text-text-800 truncate">
                                {contact.first_name} {contact.last_name}
                              </h3>
                              <p className="text-xs text-text-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {contact.contact}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* If contact is already added */}
                          {!contact.isContact ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddContact(contact.id);
                              }}
                              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white text-xs font-medium rounded-md hover:bg-primary-600 active:scale-95 transition-all ml-2 cursor-pointer"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              Add
                            </button>
                          ) : (
                            <span className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white text-xs font-medium rounded-md ml-2">
                              <Check className="w-3.5 h-3.5" />
                              Added
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-12 h-12 rounded-full bg-background-200 flex items-center justify-center mb-3">
                        <Search className="w-6 h-6 text-text-400" />
                      </div>
                      <h3 className="text-sm font-medium text-text-700 mb-1">
                        No contacts found
                      </h3>
                      <p className="text-xs text-text-500 max-w-md">
                        No contacts match "{searchQuery}". Try a different name
                        or number.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                    <AtSign className="w-8 h-8 text-primary-400" />
                  </div>
                  <h3 className="text-base font-medium text-text-700 mb-2">
                    Find contacts
                  </h3>
                  <p className="text-sm text-text-500 max-w-md">
                    Enter a name or phone number in the search field above to
                    find and add contacts
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-background-200 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                className="w-full cursor-pointer px-4 py-2.5 bg-primary-400 rounded-lg hover:bg-primary-400/80 transition-colors font-medium text-sm text-white"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
