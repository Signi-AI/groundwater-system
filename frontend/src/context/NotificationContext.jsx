import React, { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notifications") || "[]");
    } catch {
      return [];
    }
  });

  const [pushEnabled, setPushEnabled] = useState(() => {
    const v = localStorage.getItem("push_enabled");
    return v === null ? true : v === "true";
  });

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("push_enabled", String(pushEnabled));
  }, [pushEnabled]);

  const addNotification = (title, message) => {
    if (!pushEnabled) return;
    const note = {
      id: Date.now(),
      title,
      message,
      time: new Date().toLocaleString(),
      read: false,
    };
    setItems((prev) => [note, ...prev].slice(0, 30));
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => setItems([]);

  const unread = items.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        items,
        unread,
        pushEnabled,
        setPushEnabled,
        addNotification,
        markAllRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be inside NotificationProvider");
  return ctx;
}