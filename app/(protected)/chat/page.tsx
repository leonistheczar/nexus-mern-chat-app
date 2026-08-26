"use client";
import { useEffect, useState } from "react";
import { Contact } from "@/app/types/types";
import ContactLeft from "@/components/ChatPage/ContactsLeft/ContactLeft";
import MainChat from "@/components/ChatPage/MainChat/MainChat";
import UserProfileRight from "@/components/ChatPage/UserProfileRight";
import Settings from "@/components/ChatPage/ContactsLeft/DropDown/DropDownSettings/Settings";
import { useChatContacts } from "@/lib/providers/ChatProvider";
import NewUser from "@/components/ChatPage/ContactsLeft/AddNew/NewUser";
import NewGroup from "@/components/ChatPage/ContactsLeft/AddNew/NewGroup";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { AnimatePresence, motion } from "framer-motion";

export default function Chat() {
  const { contacts, showContacts, setShowContacts, open, setOpen } = useChatContacts();

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showProfileOnTablet, setShowProfileOnTablet] = useState(false);

  // Sync selected contact with contacts data
  useEffect(() => {
    setSelectedContact((current) => {
      if (!current) return null;
      return contacts.find(({ id }) => id === current.id) ?? current;
    });
  }, [contacts]);

  // Reset profile view when selecting a new contact
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setShowProfileOnTablet(false);
  };

  // Handle avatar click for tablet
  const handleAvatarClick = () => {
    if(window.innerWidth < 1024){
      setShowProfileOnTablet(true);
    }
  };

  // Handle back from profile on tablet
  const handleBackToChat = () => {
    setShowProfileOnTablet(false);
  };

  return (
    <div className="relative grid h-full grid-cols-1 md:grid-cols-[0.8fr_1.2fr] lg:grid-cols-[0.8fr_1.4fr_0.8fr] xl:grid-cols-[0.7fr_1.6fr_0.7fr]">
      {/* Modals and Overlays */}
      <NewUser onContactSelect={handleContactSelect} />
      <NewGroup />
      <Settings />
      <ConfirmationDialog
        isOpen={open}
        setOpen={setOpen}
        title="Logout"
        description="Are you sure you want to logout from your account?"
        confirmText="Logout"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          window.location.href = "/";
        }}
      />

      {/* Contact List Sidebar */}
      <section className="relative z-20 md:col-span-1 min-w-0">
        <ContactLeft
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={handleContactSelect}
          showContacts={showContacts}
          setShowContacts={setShowContacts}
          setOpen={setOpen}
        />
      </section>

      <section className="md:col-span-1 lg:col-span-1 relative overflow-hidden min-w-0">
        {showProfileOnTablet ? (
          <AnimatePresence mode="wait">
            <motion.div
              key="profile-view"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full lg:hidden"
            >
              <UserProfileRight
                selectedContact={selectedContact}
                onBack={handleBackToChat}
              />
            </motion.div>
          </AnimatePresence>
        ) : selectedContact ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`chat-${selectedContact.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              <MainChat
                selectedContact={selectedContact}
                showContacts={showContacts}
                setShowContacts={setShowContacts}
                onAvatarClick={handleAvatarClick}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          // No animation for empty state
          <div className="h-full">
            <MainChat
              selectedContact={selectedContact}
              showContacts={showContacts}
              setShowContacts={setShowContacts}
              onAvatarClick={handleAvatarClick}
            />
          </div>
        )}
      </section>

      {/* User Profile - Always visible */}
      <section className="hidden lg:block lg:col-span-1 min-w-0">
        <UserProfileRight selectedContact={selectedContact} />
      </section>
    </div>
  );
}
