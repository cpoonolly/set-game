import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  isError?: boolean;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isError, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in
    const show = setTimeout(() => setVisible(true), 10);
    // Start fade-out after 2.5s
    const hide = setTimeout(() => setVisible(false), 2500);
    // Remove after fade-out transition
    const remove = setTimeout(onDismiss, 3000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      clearTimeout(remove);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md shadow-md text-sm font-medium text-white transition-opacity duration-500 ${
        isError ? "bg-red-500" : "bg-gray-800"
      } ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {message}
    </div>
  );
};

export default Toast;
