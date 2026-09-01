"use client";
import { useClickOutside } from "@/hooks/useClickOutside";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

type ConfirmationDialogProps = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;

  onConfirm?: () => void;
  onCancel: () => void;
};

export default function ConfirmationDialog({
  isOpen,
  title,
  setOpen,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const variantStyles = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-primary-100 hover:bg-primary-200",
  };
  const confirmationDialogRef = useClickOutside<HTMLDivElement>({
    enabled: isOpen,
    onEscape: () => setOpen(false),
    onOutsideClick: () => setOpen(false),
  });
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              ref={confirmationDialogRef}
              className="w-full max-w-md rounded-2xl bg-background-100 p-6 shadow-xl"
            >
              <h2 className="text-xl font-semibold">{title}</h2>

              <p className="mt-3 text-sm text-muted-foreground">
                {description}
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="rounded-lg px-4 py-2 cursor-pointer hover:bg-background-200"
                >
                  {cancelText}
                </button>

                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`rounded-lg px-4 py-2 cursor-pointer text-white transition ${variantStyles[variant]}`}
                >
                  {isLoading ? "Processing..." : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
