"use client";

import { useChatContacts } from "@/lib/providers/ChatUIProvider";
import { lockBodyScroll } from "@/lib/bodyScrollLock";
import { useEffect, useState } from "react";
import { ActiveSettingsTabs, useSettings } from "./SettingsStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShieldAlert,
  MessageSquare,
  Lock,
  Bell,
  HelpCircle,
  PanelLeftClose,
  ChevronRight,
  X,
  LucideIcon,
} from "lucide-react";
import ProfileSettings from "./SettingsComponents/ProfileSettings";
import AccountSettings from "./SettingsComponents/AccountSettings";
import ChatsSettings from "./SettingsComponents/ChatsSettings";
import PrivacySettings from "./SettingsComponents/PrivacySettings";
import NotificationsSettings from "./SettingsComponents/NotificationsSettings";
import HelpFeedbackSettings from "./SettingsComponents/HelpFeedbackSettings";
import {
  applyChatFontSize,
  useUserPreferences,
} from "./userPreferencesStore";
import { useClickOutside } from "@/hooks/useClickOutside";

type TabItem = {
  id: ActiveSettingsTabs;
  label: string;
  icon: LucideIcon;
};

export default function Settings() {
  const { activeTab, setActiveTab } = useSettings();
  const { openSettings, setOpenSettings } = useChatContacts();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const settingsRef = useClickOutside({
    enabled: openSettings,
    onEscape: () => setOpenSettings(false),
  })
  // Lock body scroll when settings is open
  useEffect(() => {
    if (openSettings) {
      const unlock = lockBodyScroll();
      return unlock;
    }
  }, [openSettings]);

  // Apply chat font size
  useEffect(() => {
    applyChatFontSize(useUserPreferences.getState().chatFontSize);
  }, []);

  // Reset mobile menu when settings closes
  useEffect(() => {
    if (!openSettings) {
      setIsMobileMenuOpen(false);
    }
  }, [openSettings]);

  const handleTabClick = (tabId: ActiveSettingsTabs) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const tabs: TabItem[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: ShieldAlert },
    { id: "chats", label: "Chats", icon: MessageSquare },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "feedback", label: "Help & Feedback", icon: HelpCircle },
  ];

  const currentTabLabel =
    tabs.find((tab) => tab.id === activeTab)?.label ?? activeTab;

  return (
    <AnimatePresence>
      {openSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}  
          exit={{ opacity: 0}}
          transition={{ duration: 0.15, ease: "linear" }}
          className="fixed inset-0 bg-slate-950/40 z-50 flex justify-start"
        >
          <motion.div
            initial={{ translateX: "-100%" }}
            ref={settingsRef}
            animate={{ translateX: 0 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
            exit={{ translateX: "-100%" }}
            style={{ willChange: "transform" }}
            className="w-full relative z-50 max-w-full sm:max-w-xl md:max-w-2xl h-full bg-primary-100 shadow-2xl flex flex-col md:grid md:grid-cols-[0.5fr_1fr] lg:grid-cols-[0.65fr_1fr] border-r border-slate-200/20"
          >
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-500/20 bg-primary-100 z-10">
              <div className="flex items-center gap-x-2">
                <button
                  className="p-2 rounded-lg hover:bg-background-50 cursor-pointer"
                  aria-label="Close settings"
                >
                  <X size={20} />
                </button>
                <h2 className="text-xl font-bold tracking-tight">Settings</h2>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-background-50 cursor-pointer"
                aria-label="Toggle settings menu"
              >
                <ChevronRight
                  size={20}
                  className={`transition-transform duration-200 ${
                    isMobileMenuOpen ? "rotate-90" : ""
                  }`}
                />
              </button>
            </div>

            {/* Mobile Tab Selector */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden overflow-hidden border-b border-slate-500/20 bg-primary-50/50"
                >
                  <div className="p-2">
                    <div className="flex flex-wrap gap-2">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={(e) => {e.stopPropagation(); handleTabClick(tab.id)}}
                            className={`flex items-center gap-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                              isActive
                                ? "bg-primary-200 text-text-800 shadow-sm"
                                : "bg-transparent text-text-600 hover:bg-primary-100"
                            }`}
                          >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop Sidebar Navigation */}
            <div className="hidden md:flex flex-col border-r border-slate-500/20 bg-primary-50/30">
              <div className="flex items-center gap-x-2 p-4 pb-6">
                <button
                  className="p-2 rounded-lg hover:bg-primary-200/30 cursor-pointer"
                  onClick={() => setOpenSettings(false)}
                  aria-label="Close settings"
                >
                  <PanelLeftClose size={20} />
                </button>
                <h2 className="text-xl font-bold tracking-tight">Settings</h2>
              </div>

              <nav className="flex flex-col gap-y-1 px-3 pb-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={(e) => {e.stopPropagation(); setActiveTab(tab.id)}}
                      className={`flex items-center gap-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer group ${
                        isActive
                          ? "bg-primary-200/70 shadow-sm"
                          : "hover:bg-primary-400/10 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={`transition-colors ${
                          isActive
                            ? "text-primary-600"
                            : "text-text-600 group-hover:text-text-800"
                        }`}
                      />
                      <span>{tab.label}</span>
                      {isActive && (
                        <ChevronRight
                          size={16}
                          className="ml-auto text-primary-600"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content Pane */}
            <div className="flex-1 overflow-y-auto bg-primary-100">
              <div className="p-4 sm:p-5 md:p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.12, ease: "easeOut" }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    {/* Mobile Current Tab Header */}
                    <div className="md:hidden mb-4">
                      <h3 className="text-2xl font-bold">{currentTabLabel}</h3>
                    </div>

                    {/* Desktop Header */}
                    <h3 className="hidden md:block text-2xl lg:text-3xl font-bold mb-6">
                      {currentTabLabel}
                    </h3>

                    <div className="max-w-full md:max-w-2xl lg:max-w-3xl">
                      {activeTab === "profile" && <ProfileSettings />}
                      {activeTab === "account" && <AccountSettings />}
                      {activeTab === "chats" && <ChatsSettings />}
                      {activeTab === "privacy" && <PrivacySettings />}
                      {activeTab === "notifications" && (
                        <NotificationsSettings />
                      )}
                      {activeTab === "feedback" && <HelpFeedbackSettings />}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}