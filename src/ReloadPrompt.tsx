import React, { useEffect, useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

const UPDATE_INTERVAL_MS: number = 60 * 60 * 1000;
const FOCUS_THROTTLE_MS: number = 5 * 60 * 1000;

function ReloadPrompt() {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  const lastCheckTimestamp = useRef<number>(Date.now());

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_, registration) {
      console.log("Service Worker registered");
      setRegistration(registration || null);
    },
    onRegisterError(error) {
      console.log("Service Worker registration error:", error);
    },
  });

  const updateCheck = async (reg: ServiceWorkerRegistration | null) => {
    try {
      if (!reg || !navigator) return;

      if (reg.installing) return;

      if ("connection" in navigator && !navigator.onLine) return;

      await reg.update();
    } catch (e) {
      console.warn("Update check failed:", e);
    }
  };

  useEffect(() => {
    if (!registration) return;

    const intervalId = setInterval(() => {
      lastCheckTimestamp.current = Date.now();
      updateCheck(registration);
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [registration]);

  useEffect(() => {
    if (!registration) return;

    const handleFocus = () => {
      const now = Date.now();
      if (now - lastCheckTimestamp.current < FOCUS_THROTTLE_MS) return;

      lastCheckTimestamp.current = now;
      updateCheck(registration);
    };

    lastCheckTimestamp.current = Date.now();
    updateCheck(registration);

    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, [registration]);

  const handleUpdate = () => {
    updateServiceWorker(false);
    window.location.reload();
  };

  if (needRefresh) {
    return (
      <div style={styles.container}>
        <div style={styles.message}>New version available!</div>
        <button style={styles.button} onClick={handleUpdate}>
          Refresh
        </button>
      </div>
    );
  }

  return null;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    backgroundColor: "#007bff",
    color: "white",
    padding: "1em",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    gap: "1em",
  },
  message: {
    flex: 1,
  },
  button: {
    backgroundColor: "white",
    color: "#007bff",
    border: "none",
    padding: "0.5em 1em",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default ReloadPrompt;
