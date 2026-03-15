import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Toast from "./Toast";

const UserMenu: React.FC = () => {
  const { user, isLoading, signOut, saveToGoogleDrive, loadFromGoogleDrive } = useAuth();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; isError: boolean } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSave = async () => {
    setOpen(false);
    const msg = await saveToGoogleDrive();
    setToast({ message: msg, isError: !msg.includes("!") });
  };

  const handleLoad = async () => {
    setOpen(false);
    const msg = await loadFromGoogleDrive();
    setToast({ message: msg, isError: !msg.includes("!") });
  };

  const handleLogout = async () => {
    setOpen(false);
    await signOut();
  };

  return (
    <div className="relative" ref={menuRef}>
      {toast && (
        <Toast
          message={toast.message}
          isError={toast.isError}
          onDismiss={() => setToast(null)}
        />
      )}
      <button
        onClick={() => setOpen((prev) => !prev)}
        disabled={isLoading}
        className="w-9 h-9 rounded-full overflow-hidden opacity-80 hover:opacity-100 disabled:opacity-40 focus:outline-none cursor-pointer disabled:cursor-not-allowed transition-opacity"
        title={user?.name}
      >
        {user?.picture ? (
          <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0] ?? "?"}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Save to Google Drive
          </button>
          <button
            onClick={handleLoad}
            disabled={isLoading}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Load from Google Drive
          </button>
          <hr className="my-1 border-gray-200" />
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
