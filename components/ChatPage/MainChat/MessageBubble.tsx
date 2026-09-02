// components/chat/MessageBubble.tsx
"use client";

import { ChatMessage } from "@/app/types/types";
import { BookCopy, ChevronDown, Trash2 } from "lucide-react";
import { useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { AnimatePresence, motion } from "framer-motion";

type MessageBubbleProps = {
  message: ChatMessage;
  isCurrentUser: boolean;
  onDelete: (messageId: number) => void;
  onCopy: (content: string) => void;
};

export default function MessageBubble({
  message,
  isCurrentUser,
  onDelete,
  onCopy,
}: MessageBubbleProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef =  useClickOutside<HTMLDivElement>({
    enabled: showMenu,
    onOutsideClick: () => setShowMenu(false),
    onEscape: () => setShowMenu(false),
  });

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex flex-col max-w-[75%]">
        {!isCurrentUser && (
          <span className="text-xs text-text-500 ml-1 mb-1">
            {message.sender.firstName} {message.sender.lastName}
          </span>
        )}
        
        <div
          className={`relative rounded-2xl px-4 py-2 text-sm wrap-break-word group ${
            isCurrentUser
              ? "bg-primary-200 text-text-800 rounded-br-md"
              : "bg-text-400 text-white rounded-bl-md"
          }`}
        >
          <button
            className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/10 cursor-pointer z-10"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            aria-label="Message options"
          >
            <ChevronDown size={16} />
          </button>

          <p className="pr-6 whitespace-pre-wrap">{message.content}</p>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className={`absolute top-10 bg-primary-100 rounded-lg shadow-lg p-1 z-20 min-w-35 right-0`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full flex items-center gap-x-2 text-left p-2 rounded-lg text-sm text-text-800 hover:bg-background-100 transition-colors cursor-pointer"
                  onClick={() => {
                    onCopy(message.content);
                    setShowMenu(false);
                  }}
                >
                  <BookCopy size={16} className="shrink-0" />
                  <span>Copy Message</span>
                </button>
                
                {isCurrentUser && (
                  <button
                    className="w-full flex items-center gap-x-2 text-left p-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    onClick={() => {
                      onDelete(message.id);
                      setShowMenu(false);
                    }}
                  >
                    <Trash2 size={16} className="shrink-0" />
                    <span>Delete Message</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className={`flex items-center gap-1 mt-1 ${
            isCurrentUser ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-xs text-text-500">
            {formatTime(message.createdAt)}
          </span>
          {isCurrentUser && (
            <span className="text-xs text-text-400">
              {message.isRead ? "Read" : "Sent"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}