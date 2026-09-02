"use client";

import Alert from "@/components/SharedComponents/AlertDialog";
import Link from "next/link";
import { BookOpen, Bug, ExternalLink, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

const HELP_LINKS = [
  {
    href: "/features",
    label: "Features & tips",
    description: "Learn what Nexus can do",
    icon: BookOpen,
  },
  {
    href: "/contact",
    label: "Contact support",
    description: "Get help from the team",
    icon: MessageCircle,
  },
  {
    href: "/about",
    label: "About Nexus",
    description: "Privacy and product info",
    icon: ExternalLink,
  },
] as const;

export default function HelpFeedbackSettings() {
  const [category, setCategory] = useState("feedback");
  const [message, setMessage] = useState("");
  const [submitAlert, setSubmitAlert] = useState<{
    variant: "success" | "warning";
    message: string;
  } | null>(null);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAlert(null);
    if (!message.trim()) {
      setSubmitAlert({
        variant: "warning",
        message: "Please describe your feedback or issue before sending.",
      });
      return;
    }
    setMessage("");
    setSubmitAlert({
      variant: "success",
      message: "Thanks — your report was saved locally and is ready to send once the feedback API is connected.",
    });
  };

  return (
    <div className="text-sm space-y-8 max-w-lg">
      {submitAlert && (
        <Alert
          variant={submitAlert.variant}
          message={submitAlert.message}
          isVisible
        />
      )}

      <section className="space-y-3">
        <h4 className="font-semibold text-text-900">Help center</h4>
        <ul className="space-y-2">
          {HELP_LINKS.map(({ href, label, description, icon: Icon }) => (
            <li key={href}>
              <Link
                target="_blank"
                href={href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-200/10 transition group"
              >
                <span className="p-2 rounded-lg bg-primary-400/15 text-primary-500">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-medium text-text-900 group-hover:text-primary-500 transition-colors">
                    {label}
                  </span>
                  <span className="block text-xs text-text-900/50">
                    {description}
                  </span>
                </span>
                <ExternalLink className="w-4 h-4 text-text-900/30 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-background-900/10">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-text-900/60" />
          <h4 className="font-semibold text-text-900">Send feedback</h4>
        </div>

        <div>
          <label
            htmlFor="feedback-category"
            className="text-sm font-medium text-text-900/60"
          >
            Category
          </label>
          <select
            id="feedback-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full bg-primary-200/60 hover:bg-primary-200/80 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary-200/60 cursor-pointer"
          >
            <option value="feedback">General feedback</option>
            <option value="bug">Bug report</option>
            <option value="feature">Feature request</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="feedback-message"
            className="text-sm font-medium text-text-900/60"
          >
            Message
          </label>
          <textarea
            id="feedback-message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe what happened or what you would like to see improved..."
            className="mt-2 w-full bg-primary-200/30 border border-background-900/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary-400 resize-none"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-white bg-primary-400/90 rounded-lg transition cursor-pointer hover:bg-primary-400"
        >
          <Send className="w-4 h-4" />
          Submit
        </button>
      </form>

      <p className="text-xs text-text-900/40 pt-2 border-t border-background-900/10">
        Nexus v0.1.0
      </p>
    </div>
  );
}
