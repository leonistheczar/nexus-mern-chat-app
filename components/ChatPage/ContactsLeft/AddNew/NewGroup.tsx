"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChatContacts } from "@/lib/providers/ChatProvider";
import {
  X,
  Users,
  Hash,
  Camera,
  Lock,
  Globe,
  ImageIcon,
  ArrowLeft,
  ArrowRight,
  Search,
  AtSign,
  User,
  UserPlus,
  UserCheck,
  Check,
  Phone,
  CircleCheck,
} from "lucide-react";
import { Contact } from "@/app/types/types";
import { useClickOutside } from "@/hooks/useClickOutside";

interface GroupFormData {
  name: string;
  description: string;
  photo: File | null;
  photoPreview: string;
  isPrivate: boolean;
}

export default function NewGroup() {
  const { isCreateGroupOpen, setIsCreateGroupOpen, contacts } =
    useChatContacts();
  const groupModalRef = useClickOutside<HTMLDivElement>({
    enabled: isCreateGroupOpen,
    onOutsideClick: () => setIsCreateGroupOpen(false),
    onEscape: () => setIsCreateGroupOpen(false),
  });
  const [step, setStep] = useState(1);
  const [groupData, setGroupData] = useState<GroupFormData>({
    name: "",
    description: "",
    photo: null,
    photoPreview: "",
    isPrivate: false,
  });
  const [selectedMembers, setSelectedMembers] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isCreateGroupOpen) {
      setGroupData({
        name: "",
        description: "",
        photo: null,
        photoPreview: "",
        isPrivate: false,
      });
      setSelectedMembers([]);
      setSearchQuery("");
      setFilteredContacts([]);
      setStep(1);
      setError("");
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isCreateGroupOpen]);

  // Filter contacts based on search query
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setFilteredContacts([]);
      return;
    }

    const filtered = contacts.filter(
      (contact) =>
        !selectedMembers.find((member) => member.id === contact.id) &&
        (contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.contact.includes(searchQuery)),
    );

    setFilteredContacts(filtered);
  }, [searchQuery, contacts, selectedMembers]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setGroupData((prev) => ({
      ...prev,
      photo: file,
      photoPreview: previewUrl,
    }));
    setError("");
  };

  const removePhoto = () => {
    if (groupData.photoPreview) {
      URL.revokeObjectURL(groupData.photoPreview);
    }
    setGroupData((prev) => ({
      ...prev,
      photo: null,
      photoPreview: "",
    }));
  };

  const handleAddMember = (contact: Contact) => {
    setSelectedMembers((prev) => [...prev, contact]);
    setFilteredContacts((prev) => prev.filter((c) => c.id !== contact.id));
    searchInputRef.current?.focus();
  };

  const handleRemoveMember = (contactId: number) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== contactId));
  };

  const handleCreateGroup = async () => {
    if (!groupData.name.trim()) {
      setError("Group name is required");
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const groupPayload = {
        name: groupData.name,
        description: groupData.description,
        isPrivate: groupData.isPrivate,
        photo: groupData.photo,
        members: selectedMembers.map((m) => m.id),
      };

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Creating group:", groupPayload);
      handleReset();
    } catch (err) {
      setError("Failed to create group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !groupData.name.trim()) {
      setError("Group name is required");
      return;
    }
    setError("");
    setStep(step + 1);
    if (step === 1) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError("");
  };

  const handleReset = () => {
    if (groupData.photoPreview) {
      URL.revokeObjectURL(groupData.photoPreview);
    }
    setGroupData({
      name: "",
      description: "",
      photo: null,
      photoPreview: "",
      isPrivate: false,
    });
    setSelectedMembers([]);
    setSearchQuery("");
    setFilteredContacts([]);
    setStep(1);
    setError("");
    setIsSubmitting(false);
    setIsCreateGroupOpen(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <AnimatePresence>
      {isCreateGroupOpen && (
        <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <motion.div
            ref={groupModalRef}
            className="relative z-10 w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-primary-100 shadow-2xl border border-background-200 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-background-200 shrink-0">
              <div className="flex items-center gap-x-4">
                {step > 1 ? (
                  <button
                    onClick={handleBack}
                    className="p-2 bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors cursor-pointer"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="w-5 h-5 text-primary-600" />
                  </button>
                ) : (
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-text-800 leading-tight">
                    Create New Group
                  </h2>
                  <p className="text-xs text-text-600 leading-tight">
                    {step === 1 && "Set up group details"}
                    {step === 2 && "Add members to group"}
                    {step === 3 && "Review and create"}
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

            {/* Progress Steps */}
            <div className="px-4 pt-3 shrink-0">
              <div className="flex gap-2 mb-2">
                <div
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? "bg-primary-500" : "bg-background-200"}`}
                />
                <div
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? "bg-primary-500" : "bg-background-200"}`}
                />
                <div
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= 3 ? "bg-primary-500" : "bg-background-200"}`}
                />
              </div>
              <div className="flex justify-between text-xs text-text-500 mb-2">
                <span
                  className={step >= 1 ? "text-primary-600 font-medium" : ""}
                >
                  Details
                </span>
                <span
                  className={step >= 2 ? "text-primary-600 font-medium" : ""}
                >
                  Members
                </span>
                <span
                  className={step >= 3 ? "text-primary-600 font-medium" : ""}
                >
                  Review
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Step 1: Group Details */}
              {step === 1 && (
                <div className="space-y-5">
                  {/* Group Photo */}
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      {groupData.photoPreview ? (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-background-200">
                          <img
                            src={groupData.photoPreview}
                            alt="Group"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                          >
                            <X className="w-6 h-6 text-white" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-24 h-24 rounded-full bg-primary-200/60 border-2 border-dashed border-background-200 flex flex-col items-center justify-center hover:bg-primary-200/80 transition-colors cursor-pointer"
                        >
                          <ImageIcon className="w-8 h-8 text-text-400" />
                          <span className="text-xs text-text-500 mt-1">
                            Add Photo
                          </span>
                        </button>
                      )}
                      {!groupData.photoPreview && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-1 -right-1 p-1.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors cursor-pointer shadow-md"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-text-500 mt-3">
                      {groupData.photoPreview
                        ? "Click photo to remove"
                        : "Add a group photo (optional)"}
                    </p>
                  </div>

                  {/* Group Name */}
                  <div>
                    <label className="block text-sm font-medium text-text-700 mb-2">
                      Group Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-500" />
                      <input
                        ref={nameInputRef}
                        type="text"
                        value={groupData.name}
                        onChange={(e) =>
                          setGroupData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && groupData.name.trim()) {
                            handleNext();
                          }
                        }}
                        placeholder="Enter group name"
                        maxLength={50}
                        className="w-full pl-10 pr-4 py-2.5 bg-primary-200/60 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-text-700 placeholder-text-600 text-sm"
                      />
                    </div>
                    <p className="text-xs text-text-400 text-right mt-1">
                      {groupData.name.length}/50
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-text-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={groupData.description}
                      onChange={(e) =>
                        setGroupData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="What's this group about?"
                      maxLength={200}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-primary-200/60 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-text-700 placeholder-text-600 text-sm resize-none"
                    />
                    <p className="text-xs text-text-400 text-right mt-1">
                      {groupData.description.length}/200
                    </p>
                  </div>

                  {/* Privacy */}
                  <div>
                    <label className="block text-sm font-medium text-text-700 mb-3">
                      Privacy Setting
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setGroupData((prev) => ({
                            ...prev,
                            isPrivate: false,
                          }))
                        }
                        className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer text-left ${
                          !groupData.isPrivate
                            ? "border-primary-500 bg-primary-50/50"
                            : "border-background-200 hover:border-background-300 bg-primary-200/60"
                        }`}
                      >
                        <Globe className="w-5 h-5 mb-2 text-text-600" />
                        <p className="text-sm font-medium text-text-800">
                          Public
                        </p>
                        <p className="text-xs text-text-500 mt-1">
                          Anyone can join
                        </p>
                        {!groupData.isPrivate && (
                          <div className="absolute top-2.5 right-2">
                            <CircleCheck color="#0aa345" size={22} />
                          </div>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setGroupData((prev) => ({ ...prev, isPrivate: true }))
                        }
                        className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer text-left ${
                          groupData.isPrivate
                            ? "border-primary-500 bg-primary-50/50"
                            : "border-background-200 hover:border-background-300 bg-primary-200/60"
                        }`}
                      >
                        <Lock className="w-5 h-5 mb-2 text-text-600" />
                        <p className="text-sm font-medium text-text-800">
                          Private
                        </p>
                        <p className="text-xs text-text-500 mt-1">
                          Invite only
                        </p>
                        {groupData.isPrivate && (
                          <div className="absolute top-2.5 right-2">
                            <CircleCheck color="#0aa345" size={22} />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Add Members */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium text-text-700 mb-1">
                      Add Members
                    </h3>
                    <p className="text-sm text-text-500">
                      Search and select contacts to add
                    </p>
                  </div>

                  {/* Selected Members */}
                  {selectedMembers.length > 0 && (
                    <div>
                      {/* // In Step 2, wrap the count in an animated span */}
                      <motion.span
                        key={selectedMembers.length}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-xs text-primary-600 font-medium"
                      >
                        <span>Selected Members: {selectedMembers.length}</span>
                      </motion.span>
                      <div className="flex flex-wrap gap-2">
                        {selectedMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-2 bg-primary-200/60 border border-primary-300 rounded-lg px-3 py-1.5"
                          >
                            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
                              {member.profile_pic ? (
                                <img
                                  src={member.profile_pic}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-medium text-primary-600">
                                  {getInitials(
                                    member.first_name,
                                    member.last_name,
                                  )}
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-text-700">
                              {member.first_name} {member.last_name}
                            </span>
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="p-0.5 hover:bg-red-100 rounded transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5 text-text-500 hover:text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-text-700 mb-2">
                      Search Contacts
                    </label>
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

                  {/* Search Results */}
                  {searchQuery.trim().length > 0 && (
                    <div className="space-y-1">
                      {filteredContacts.length > 0 ? (
                        filteredContacts.map((contact) => (
                          <div
                            key={contact.id}
                            className="flex items-center justify-between p-3 hover:bg-primary-200/40 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center gap-x-3 min-w-0">
                              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
                                {contact.profile_pic ? (
                                  <img
                                    src={contact.profile_pic}
                                    alt=""
                                    className="w-full h-full object-cover"
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
                                <p className="text-xs text-text-500 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {contact.contact}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddMember(contact)}
                              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-primary-400 text-white text-xs font-medium rounded-md hover:bg-primary-500 transition-colors ml-2 cursor-pointer"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              Add
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Search className="w-8 h-8 text-text-400 mb-2" />
                          <p className="text-sm text-text-500">
                            No contacts found
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {searchQuery.trim().length === 0 &&
                    selectedMembers.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <UserPlus className="w-8 h-8 text-text-400 mb-2" />
                        <p className="text-sm text-text-500">
                          Search contacts to add members
                        </p>
                        <p className="text-xs text-text-400 mt-1">
                          You can skip this and add members later
                        </p>
                      </div>
                    )}

                  <div className="pt-2 border-t border-background-200">
                    <p className="text-xs text-text-500 text-center">
                      You can add more members after creating the group
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="text-center">
                    <Users className="w-10 h-10 text-primary-500 mx-auto mb-2" />
                    <h3 className="text-base font-medium text-text-700">
                      Review Group
                    </h3>
                    <p className="text-sm text-text-500">
                      Check details before creating
                    </p>
                  </div>

                  <div className="bg-primary-200/60 rounded-lg p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      {groupData.photoPreview ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-background-200 shrink-0">
                          <img
                            src={groupData.photoPreview}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                          <Users className="w-8 h-8 text-primary-500" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-base font-semibold text-text-800">
                          {groupData.name || "Untitled Group"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {groupData.isPrivate ? (
                            <>
                              <Lock className="w-3.5 h-3.5 text-text-500" />
                              <span className="text-xs text-text-500 font-medium">
                                Private
                              </span>
                            </>
                          ) : (
                            <>
                              <Globe className="w-3.5 h-3.5 text-text-500" />
                              <span className="text-xs text-text-500 font-medium">
                                Public
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {groupData.description && (
                      <div className="pt-3 border-t border-background-200">
                        <p className="text-xs text-text-500 font-medium mb-1">
                          Description
                        </p>
                        <p className="text-sm text-text-600">
                          {groupData.description}
                        </p>
                      </div>
                    )}

                    {/* Members */}
                    <div className="pt-3 border-t border-background-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-text-500 font-medium">
                          Members ({selectedMembers.length})
                        </p>
                        <button
                          onClick={() => setStep(2)}
                          className="text-xs text-primary-600 hover:text-primary-700 cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      {selectedMembers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedMembers.slice(0, 5).map((member) => (
                            <div
                              key={member.id}
                              className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden"
                              title={`${member.first_name} ${member.last_name}`}
                            >
                              {member.profile_pic ? (
                                <img
                                  src={member.profile_pic}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-medium text-primary-600">
                                  {getInitials(
                                    member.first_name,
                                    member.last_name,
                                  )}
                                </span>
                              )}
                            </div>
                          ))}
                          {selectedMembers.length > 5 && (
                            <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center">
                              <span className="text-xs font-medium text-text-700">
                                +{selectedMembers.length - 5}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-text-400 italic">
                          No members added
                        </p>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-background-200 shrink-0">
              {step < 3 ? (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 px-4 py-2.5 bg-background-200 hover:bg-background-300 rounded-lg transition-colors font-medium text-sm text-text-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={step === 1 && !groupData.name.trim()}
                    className="flex-1 px-4 py-2.5 bg-primary-400 rounded-lg hover:bg-primary-400/80 transition-colors font-medium text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateGroup}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 bg-primary-400 rounded-lg hover:bg-primary-400/80 transition-colors font-medium text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Group...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Create Group
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
