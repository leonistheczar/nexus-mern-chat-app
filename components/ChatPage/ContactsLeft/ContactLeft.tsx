"use client";

import { Contact } from "@/app/types/types";
import { ChevronLeft, CirclePlus, EllipsisVertical } from "lucide-react";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useChatContacts } from "@/lib/providers/ChatUIProvider";
import SettingsDropDown from "./DropDown/SettingsDropDown";
import AddNew from "./AddNew/AddNew";
import ThemeToggler from "@/components/SharedComponents/ThemeToggler";
import { SyncLoader } from "react-spinners";
type ContactLeftProps = {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  isPending: boolean;
  isError: boolean;
  showContacts: boolean;
  setShowContacts: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PRIORITY_COUNT = 10; // only avatars likely visible

function formatMessagePreview(message: string | undefined | null): string {
  const text = message ?? "";
  if (text.length <= 30) return text;
  return `${text.slice(0, 30)}...`;
}

type ContactItemProps = {
  contact: Contact;
  isSelected: boolean;
  isPriority: boolean;
  onSelect: (contact: Contact) => void;
};

const ContactItem = memo(function ContactItem({
  contact,
  isSelected,
  isPriority,
  onSelect,
}: ContactItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(contact)}
        className={`flex items-center text-left w-full gap-3 p-2 rounded-xl transition-colors cursor-pointer hover:bg-secondary-200/40 ${
          isSelected ? "bg-secondary-200/50" : ""
        }`}
      >
        <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-full shadow-sm">
          <Image
            src={`${contact.profile_pic}`}
            alt={`${contact.first_name} ${contact.last_name}`}
            fill
            className="object-cover"
            sizes="48px"
            priority={isPriority}
            loading={isPriority ? undefined : "lazy"}
          />
        </div>
        <div className="flex flex-col">
          <p className="font-medium truncate">
            {contact.first_name} {contact.last_name}
          </p>
          <p className="text-[12px] text-text-600">
            {formatMessagePreview(contact.message)}
          </p>
        </div>
      </button>
    </li>
  );
});

// Extracted list + search, shared by desktop and mobile
type SidebarBodyProps = {
  search: string;
  setSearch: (v: string) => void;
  filteredContacts: Contact[];
  isPending: boolean;
  isError: boolean;
  selectedContact: Contact | null;
  onSelect: (contact: Contact) => void;
  inputName: string;
  openDrop: boolean;
  setOpenDrop: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
type tabFilter = "All" | "Unread" | "Groups" | "Favorites";
function SidebarBody({
  search,
  setSearch,
  filteredContacts,
  selectedContact,
  onSelect,
  inputName,
  isPending,
  isError,
  openDrop,
  setOpenDrop,
  setOpen,
}: SidebarBodyProps) {
  const [addNewDropDown, setAddNewDropDown] = useState(false);
  const { showContacts, setShowContacts } = useChatContacts();
  const [directTab, setDirectTab] = useState<tabFilter>("All");
  // Tabs
  const directTabs: tabFilter[] = ["All", "Unread", "Groups", "Favorites"];
  return (
    <div className="bg-primary-100 relative flex flex-col border-r border-primary-200 h-screen">
      {/* Close ContactLeft */}
      <button
        className={`md:hidden absolute top-1/2 -right-3 z-10 bg-primary-100 border border-primary-200 rounded-full p-1.5 shadow-md hover:bg-primary-200 transition-colors cursor-pointer ${!showContacts && "hidden"}`}
        aria-label="Close sidebar"
        onClick={() => setShowContacts(false)}
      >
        <ChevronLeft size={16} className="text-text-600" />
      </button>
      <div className="flex justify-between items-center px-4 py-2">
        <h1 className="text-xl"> Nexus</h1>
        <div className="flex items-center gap-x-2 scale-90">
          <ThemeToggler />
          <div className="relative">
            <motion.button
              onClick={() => setAddNewDropDown((prev) => !prev)}
              className="cursor-pointer hover:bg-primary-200 p-1.5 rounded-full transition-all"
            >
              <CirclePlus />
            </motion.button>
            <AddNew
              addNewDropDown={addNewDropDown}
              setAddNewDropDown={setAddNewDropDown}
            />
          </div>
          <div className="relative">
            <motion.button
              onClick={() => setOpenDrop((prev) => !prev)}
              className="hover:cursor-pointer hover:bg-primary-200 p-1.5 rounded-full transition-all"
            >
              <EllipsisVertical />
            </motion.button>
            <SettingsDropDown
              openDrop={openDrop}
              setOpen={setOpen}
              setOpenDrop={setOpenDrop}
            />
          </div>
        </div>
      </div>
      {/* Search */}
      <div className="p-2">
        <input
          type="text"
          name={inputName}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-primary-200 w-full text-sm p-1.5 rounded-md outline-0 outline-primary-300 focus:outline-none focus:ring-1 focus:ring-primary-300 transition-all"
          placeholder="Search or start a new conversation"
        />
      </div>
      {/* Direct Tabs */}
      <div className="p-2">
        <ul className="flex gap-1">
          {directTabs.map((tab) => (
            <li key={tab} className="flex-1">
              <button
                onClick={() => setDirectTab(tab)}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 border border-slate-800/20 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  directTab === tab
                    ? "bg-primary-300/60 text-text-800 shadow-sm"
                    : "text-text-600 hover:bg-primary-400/20 hover:text-text-800"
                }`}
              >
                <span className="truncate">{tab}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ul className="flex flex-col gap-y-2 px-2 overflow-auto scrollbar-thumb-primary-200">
        {isPending ? (
          <li
            className="flex justify-center py-6"
            aria-label="Loading contacts"
          >
            <SyncLoader size={10} color="var(--color-primary-500)" />
          </li>
        ) : isError ? (
          <li className="px-2 py-4 text-sm text-center text-red-600" role="alert">
            Failed to fetch contacts. Please try again.
          </li>
        ) : filteredContacts.length === 0 ? (
          <li className="text-sm text-center text-text-600 px-2 mt-4">
            No contact found
          </li>
        ) : (
          filteredContacts.map((contact, index) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isSelected={selectedContact?.id === contact.id}
              isPriority={index < PRIORITY_COUNT}
              onSelect={onSelect}
            />
          ))
        )}
      </ul>
    </div>
  );
}

// Main component
export default function ContactLeft({
  contacts,
  selectedContact,
  isPending,
  isError,
  onSelectContact,
  showContacts,
  setShowContacts,
  setOpen,
}: ContactLeftProps) {
  const [search, setSearch] = useState("");
  const [openDrop, setOpenDrop] = useState(false);
  const sideBarRef = useRef<HTMLDivElement>(null);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter((contact) => {
      const fullName =
        `${contact.first_name} ${contact.last_name}`.toLowerCase();
      return (
        fullName.includes(query) ||
        (contact.message ?? "").toLowerCase().includes(query)
      );
    });
  }, [contacts, search]);

  const handleSelect = useCallback(
    (contact: Contact) => {
      onSelectContact(contact);
      setShowContacts(false);
    },
    [onSelectContact, setShowContacts],
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex flex-col h-screen">
        <SidebarBody
          search={search}
          setSearch={setSearch}
          filteredContacts={filteredContacts}
          isPending={isPending}
          isError={isError}
          selectedContact={selectedContact}
          onSelect={handleSelect}
          inputName="contact-search-desktop"
          openDrop={openDrop}
          setOpenDrop={setOpenDrop}
          setOpen={setOpen}
        />
      </div>

      {/* Mobile */}
      <div
        ref={sideBarRef}
        className={`fixed text-sm inset-y-0 left-0 z-50 w-72 bg-background transition-transform duration-300 md:hidden ${
          showContacts ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <aside>
          <SidebarBody
            search={search}
            setSearch={setSearch}
            filteredContacts={filteredContacts}
            isPending={isPending}
            isError={isError}
            selectedContact={selectedContact}
            onSelect={handleSelect}
            inputName="contact-search-mobile"
            openDrop={openDrop}
            setOpenDrop={setOpenDrop}
            setOpen={setOpen}
          />
        </aside>
      </div>
    </>
  );
}
