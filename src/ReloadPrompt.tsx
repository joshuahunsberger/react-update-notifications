import React, { useEffect, useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

const UPDATE_INTERVAL_MS: number = 60 * 60 * 1000;
const FOCUS_THROTTLE_MS: number = 5 * 60 * 1000

function ReloadPrompt() {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [swUrl, setSwUrl] = useState<string | null>(null);

  const lastCheckTimestamp = useRef<number>(Date.now())

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swScriptUrl, registration) {
      console.log("Service Worker registered");
      setRegistration(registration || null);
      setSwUrl(swScriptUrl);
    },
    onRegisterError(error) {
      console.log("Service Worker registration error:", error);
    },
  });

  const updateCheck = async (
    reg: ServiceWorkerRegistration | null,
    url: string | null
  ) => {
    try {
      if (!reg || !url || !navigator) return;

      if (reg.installing) {
        console.log("Update check skipped: Another update is installing.");
        return;
      }

      if ("connection" in navigator && !navigator.onLine) {
        console.log("Update check skipped: App is offline.");
        return;
      }

      const resp = await fetch(url, {
        cache: "no-store",
        headers: {
          cache: "no-store",
          "cache-control": "no-cache",
        },
      });

      if (resp?.status === 200) {
        console.log("Server reachable, calling registration.update()");
        await reg.update();
      }
    } catch (e) {
      console.warn("Update check failed:", e);
    }
  };

  useEffect(() => {
    if (!registration || !swUrl) return;

    const intervalId = setInterval(() => {
      lastCheckTimestamp.current = Date.now()
      updateCheck(registration, swUrl);
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [registration, swUrl]);

  useEffect(() => {
    if (!registration || !swUrl) {
      return
    }

    const handleFocus = () => {
      const now = Date.now()
      if (now - lastCheckTimestamp.current < FOCUS_THROTTLE_MS) {
        console.log(
          'Focus check skipped: Throttled. Last check was too recent.',
        )
        return
      }

      lastCheckTimestamp.current = now
      console.log('Tab gained focus, checking for new update...')
      updateCheck(registration, swUrl)
    }

    console.log('Initial component load, checking for new update...')
    lastCheckTimestamp.current = Date.now()
    updateCheck(registration, swUrl)

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [registration, swUrl])

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
