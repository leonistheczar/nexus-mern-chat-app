import ChatClient from "@/components/ChatPage/ChatClient";
import { ChatContactsProvider } from "@/lib/providers/ChatUIProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
  description: "Connect and communicate with your Nexus community.",
};
export default function ChatPage() {
  return (
    <ChatContactsProvider>
      <ChatClient />
    </ChatContactsProvider>
  )
}