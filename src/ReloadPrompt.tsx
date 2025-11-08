import { useRegisterSW } from "virtual:pwa-register/react";

function ReloadPrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered() {
      console.log("Service Worker registered.");
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

// Basic styles
const styles = {
  container: {
    position: "fixed" as const,
    bottom: "20px",
    left: "20px",
    backgroundColor: "#007bff",
    color: "white",
    padding: "1em",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 1000,
    display: "flex" as const,
    alignItems: "center" as const,
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
    cursor: "pointer" as const,
    fontWeight: "bold" as const,
  },
};

export default ReloadPrompt;
