"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Settings, MessageSquare} from "lucide-react";
import React from "react";
import { useChatContacts } from "../../../../lib/providers/ChatUIProvider";
import { useClickOutside } from "@/hooks/useClickOutside";
import LogOut from "@/components/ChatPage/ContactsLeft/DropDown/shared/LogOut"
type DropDownTypes = {
  openDrop: boolean, 
  setOpen: React.Dispatch<React.SetStateAction<boolean>>, 
  setOpenDrop: React.Dispatch<React.SetStateAction<boolean>>,
}
export default function SettingsDropDown({openDrop, setOpen, setOpenDrop}: DropDownTypes){
    // Contact Provider
    const {setOpenSettings} = useChatContacts();
    const settingsDropDownRef = useClickOutside<HTMLDivElement>({
      enabled: openDrop,
      onEscape: () => setOpenDrop(false),
      onOutsideClick: () => setOpenDrop(false),
    })
    return(
        <AnimatePresence>
        {openDrop && (
          <motion.div
            ref={settingsDropDownRef}
            key="menu"
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.95,
            }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
            className="absolute z-99 -right-4 lg:left-0 mt-2 w-48 bg-secondary-100 px-3 py-4 rounded-xl flex flex-col gap-y-1 shadow-md"
          >
            <motion.button
              className="p-2 flex w-full self-stretch gap-x-2 items-center hover:cursor-pointer hover:bg-primary-300/50 rounded-lg"
              onClick={() => {setOpenDrop(false); setOpenSettings(true);}}
            >
              <Settings size={18} />
              <span>Settings</span>
            </motion.button>

            <motion.button
              className="p-2 flex w-full gap-x-2 items-center hover:cursor-pointer hover:bg-primary-300/50 rounded-lg"
              onClick={() => setOpenDrop(false)}
            >
              <MessageSquare size={18} />
              <span>Mark all as read</span>
            </motion.button>

            <div className="w-full h-px bg-slate-800/40 my-1" />

            <LogOut setOpen={setOpen} setOpenDrop={setOpenDrop} />
          </motion.div>
        )}
      </AnimatePresence>
    )
}