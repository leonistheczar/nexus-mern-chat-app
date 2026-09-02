"use client";
import React, { createContext, useContext, useState } from "react";

type ChatType = {
  showContacts: boolean;
  setShowContacts: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  open: boolean, 
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  openSettings: boolean, 
  setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>
  openNewUser: boolean,
  setOpenNewUser: React.Dispatch<React.SetStateAction<boolean>>
  // New group states
  isCreateGroupOpen: boolean;
  setIsCreateGroupOpen: React.Dispatch<React.SetStateAction<boolean>>
};

const ChatContactsContext =
  createContext<ChatType | null>(null);

export function ChatContactsProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [showContacts, setShowContacts] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openNewUser, setOpenNewUser] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  return (
    <ChatContactsContext.Provider
      value={{
        showContacts,
        setShowContacts,
        open,
        setOpen,
        openSettings,
        setOpenSettings,
        openNewUser,
        setOpenNewUser,
        isCreateGroupOpen, 
        setIsCreateGroupOpen
      }}
    >
      {children}
    </ChatContactsContext.Provider>
  );
}

export function useChatContacts() {
  const context = useContext(ChatContactsContext);

  if (!context) {
    throw new Error(
      "useChatContacts must be used inside ChatContactsProvider"
    );
  }

  return context;
}