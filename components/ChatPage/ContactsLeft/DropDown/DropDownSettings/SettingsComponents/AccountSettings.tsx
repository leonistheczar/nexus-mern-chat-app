"use client";

import Alert from "@/components/SharedComponents/AlertDialog";
import { useChatContacts } from "@/lib/providers/ChatUIProvider";
import { Eye, EyeOff, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import SettingsToggle from "./SettingsToggle";
import { useUserPreferences } from "../userPreferencesStore";
import LogOut from "../../shared/LogOut";

export default function AccountSettings() {
  const { setOpen, setOpenSettings} = useChatContacts();
  const { twoFactorEnabled, setTwoFactorEnabled } = useUserPreferences();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState<{
    variant: "success" | "warning";
    message: string;
  } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState<string | null>(null);

  const handlePasswordSave = () => {
    setPasswordAlert(null);
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setPasswordAlert({
        variant: "warning",
        message: "Fill in all password fields before saving.",
      });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordAlert({
        variant: "warning",
        message: "New password must be at least 8 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordAlert({
        variant: "warning",
        message: "New password and confirmation do not match.",
      });
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordAlert({
      variant: "success",
      message: "Password updated successfully.",
    });
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);
    setDeleteAlert(
      "Account deletion was requested. Connect your backend to complete this action.",
    );
  };

  return (
    <div  className="text-sm space-y-8 max-w-xl">
      {passwordAlert && (
        <Alert
          variant={passwordAlert.variant}
          message={passwordAlert.message}
          isVisible
        />
      )}
      {deleteAlert && (
        <Alert variant="info" message={deleteAlert} isVisible />
      )}

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-text-900">
          <ShieldCheck className="w-5 h-5 text-primary-500" />
          <h4 className="font-semibold">Change password</h4>
        </div>

        {(
          [
            {
              id: "current-password",
              label: "Current password",
              value: currentPassword,
              setValue: setCurrentPassword,
              show: showCurrent,
              setShow: setShowCurrent,
            },
            {
              id: "new-password",
              label: "New password",
              value: newPassword,
              setValue: setNewPassword,
              show: showNew,
              setShow: setShowNew,
            },
            {
              id: "confirm-password",
              label: "Confirm new password",
              value: confirmPassword,
              setValue: setConfirmPassword,
              show: showConfirm,
              setShow: setShowConfirm,
            },
          ] as const
        ).map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className="text-sm font-medium text-text-900/60"
            >
              {field.label}
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                id={field.id}
                type={field.show ? "text" : "password"}
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                autoComplete={
                  field.id === "current-password" ? "current-password" : "new-password"
                }
                className="flex-1 bg-transparent outline-none text-text-900 border-b pb-4 tranisition focus:border-primary-300"
              />
              <span
                role="button"
                onClick={(e) => {e.preventDefault(); e.stopPropagation(); field.setShow((prev) => !prev)}}
                className="p-2 text-text-900/50 hover:text-text-900 cursor-pointer"
                aria-label={field.show ? "Hide password" : "Show password"}
              >
                {field.show ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handlePasswordSave}
          className="px-4 py-2 text-white bg-primary-400/90 rounded-lg transition duration-100 cursor-pointer hover:bg-primary-400"
        >
          Update password
        </button>
      </section>

      <section className="space-y-4 pt-2 border-t border-background-900/10">
        <SettingsToggle
          id="two-factor"
          label="Two-step verification"
          description="Add an extra layer of security when signing in."
          checked={twoFactorEnabled}
          onChange={setTwoFactorEnabled}
        />
        <div className="h-px bg-background-900/20" />
        <div>
          <p className="text-sm font-medium text-text-900">Active session</p>
          <p className="mt-1 text-xs text-text-900/50">
            This device · Windows · Current session
          </p>
        </div>
      </section>

      <section className="space-y-3 pt-2 border-t border-background-900/10">
      <div className="w-fit"><LogOut setOpen={setOpen} setOpenSettings={setOpenSettings}></LogOut></div>

        {!showDeleteConfirm && (
          <button
            type="button"
            onClick={(e) => {e.stopPropagation(); setShowDeleteConfirm(true)}}  
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 bg-red-500/10 hover:bg-red-500/20 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete account
          </button>
        )} 
        {showDeleteConfirm && ( 
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 space-y-3">
            <p className="text-sm text-text-900 leading-relaxed">
              This permanently removes your account and chat history. This
              cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg bg-background-200 text-sm cursor-pointer hover:bg-background-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm cursor-pointer hover:bg-red-600"
              >
                Delete my account
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
