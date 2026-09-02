// components/LogOut.tsx
"use client";
import { LogOut as LogOutIcon } from "lucide-react";
import { motion } from "framer-motion";

type LogOutProps = {
  setOpen?: (value: boolean) => void;
  setOpenDrop?: (value: boolean) => void;
  setOpenSettings?: (value: boolean) => void;
  className?: string;
};

export default function LogOut({ 
  setOpen, 
  setOpenDrop, 
  setOpenSettings,
  className = ""
}: LogOutProps) {
  const handleClick = () => {
    setOpen?.(true);
    setOpenDrop?.(false);
    setOpenSettings?.(false);
  };

  return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        className={`group flex w-full items-center gap-x-2 rounded-lg p-2 hover:cursor-pointer hover:bg-red-500/10 ${className}`}
        onClick={handleClick}
      >
        <LogOutIcon size={18} className="group-hover:text-red-500" />
        <span className="group-hover:text-red-500">Logout</span>
      </motion.button>
  );
}