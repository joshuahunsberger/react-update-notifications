import "./App.css";
import ReloadPrompt from "./ReloadPrompt";

function App() {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Service Worker Demo - v2.0</h1>
          <p>We've just deployed a new version.</p>
        </header>

        <ReloadPrompt />
      </div>
    </>
  );
}

export default App;
