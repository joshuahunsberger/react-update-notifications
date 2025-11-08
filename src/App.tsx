import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import ReloadPrompt from "./ReloadPrompt";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="App">
      <nav style={styles.nav}>
        <Link style={styles.navLink} to="/">
          Home
        </Link>
        <Link style={styles.navLink} to="/about">
          About
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      <ReloadPrompt />
    </div>
  );
}

// Define types for the styles object
const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    padding: "1em",
    backgroundColor: "#282c34",
    borderBottom: "1px solid #444",
  },
  navLink: {
    color: "white",
    margin: "0 1em",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default App;
