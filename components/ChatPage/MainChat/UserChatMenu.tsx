"use client";

import { Contact } from "@/app/types/types";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  Ban,
  Bell,
  BellOff,
  ImageIcon,
  Info,
  Phone,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

type UserChatMenuProps = {
  selectedContact: Contact;
  isMuted: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
};

// Menu items configuration
const menuItemsConfig = [
  {
    key: "info",
    icon: Info,
    label: "View Contact Info",
    danger: false,
  },
  {
    key: "media",
    icon: ImageIcon,
    label: "Shared Media",
    danger: false,
  },
  {
    key: "notifications",
    icon: Bell,
    label: "Mute Notifications",
    alternateIcon: BellOff,
    alternateLabel: "Unmute Notifications",
    danger: false,
  },
  {
    key: "block",
    icon: Ban,
    label: "Block Contact",
    danger: true,
  },
  {
    key: "delete",
    icon: Trash2,
    label: "Delete Chat",
    danger: true,
  },
] as const;

export default function UserChatMenu({
  selectedContact,
  isMenuOpen,
  setIsMenuOpen,
  setIsMuted,
  isMuted,
}: UserChatMenuProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Use universal click outside hook for header menu
  const userChatMenuRef = useClickOutside<HTMLDivElement>({
    enabled: isMenuOpen,
    onOutsideClick: () => setIsMenuOpen(false),
    onEscape: () => setIsMenuOpen(false),
  });

  const handleMenuAction = useCallback(
    (key: string) => {
      switch (key) {
        case "info":
          console.log("View contact info");
          break;
        case "media":
          console.log("View shared media");
          break;
        case "notifications":
          setIsMuted((prev) => !prev);
          break;
        case "block":
          console.log("Block contact");
          break;
        case "delete":
          console.log("Delete chat");
          break;
      }
      setIsMenuOpen(false);
    },
    [setIsMuted, setIsMenuOpen],
  );

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          ref={userChatMenuRef}
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{
            duration: 0.1,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="absolute right-0 top-full mt-1 w-56 bg-secondary-100 rounded-xl flex flex-col justify-center shadow-lg border border-background-200 py-2 z-20 origin-top-right"
        >
          {/* Contact Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="px-4 py-3 border-b border-background-100"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-full">
                {selectedContact?.profile_pic ? (
                  <Image
                    src={selectedContact.profile_pic}
                    alt={`${selectedContact.first_name} ${selectedContact.last_name}`}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {getInitials(
                        selectedContact.first_name,
                        selectedContact.last_name,
                      )}
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-800 truncate">
                  {selectedContact.first_name} {selectedContact.last_name}
                </p>
                <p className="text-xs text-text-500 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 shrink-0" />
                  <span className="truncate">{selectedContact.contact}</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Menu Items */}
          <div className="p-1">
            {menuItemsConfig
              .filter((item) => !item.danger)
              .map((item, index) => (
                <motion.button
                  key={item.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.03 }}
                  onClick={() => handleMenuAction(item.key)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-700 hover:bg-background-100 rounded-lg transition-colors cursor-pointer"
                >
                  {item.key === "notifications" ? (
                    <>
                      {isMuted ? (
                        <BellOff
                          size={18}
                          strokeWidth={1.5}
                          className="text-text-500 shrink-0"
                        />
                      ) : (
                        <Bell
                          size={18}
                          strokeWidth={1.5}
                          className="text-text-500 shrink-0"
                        />
                      )}
                      <span>
                        {isMuted
                          ? "Unmute Notifications"
                          : "Mute Notifications"}
                      </span>
                    </>
                  ) : (
                    <>
                      <item.icon
                        size={18}
                        strokeWidth={1.5}
                        className="text-text-500 shrink-0"
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </motion.button>
              ))}
          </div>
          {/* Seperator */}
            <div className="w-48 h-px bg-slate-800/40 my-1 mx-auto" />
          {/* Danger Zone */}
          <div className="p-1">
            {menuItemsConfig
              .filter((item) => item.danger)
              .map((item, index) => (
                <motion.button
                  key={item.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.03 }}
                  onClick={() => handleMenuAction(item.key)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  <item.icon size={18} strokeWidth={1.5} className="shrink-0" />
                  <span>{item.label}</span>
                </motion.button>
              ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
