import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

// Set a short interval for demo purposes
const UPDATE_INTERVAL_MS: number = 60 * 1000; // 60 seconds

function ReloadPrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    /**
     * This callback is fired when the service worker is registered.
     */
    onRegistered(registration) {
      if (registration) {
        console.log("Service Worker registered.");
        // Set up the interval to check for updates
        setInterval(() => {
          console.log("Checking for new service worker update...");
          registration.update(); // Manually trigger an update check
        }, UPDATE_INTERVAL_MS);
      }
    },
    onRegisterError(error) {
      console.log("Service Worker registration error:", error);
    },
  });

  const handleUpdate = () => {
    updateServiceWorker(true);
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

// Define types for the styles object
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
