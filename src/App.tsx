import "./App.css";
import ReloadPrompt from "./ReloadPrompt";

function App() {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Service Worker Demo - v1.0</h1>
          <p>This is the first deployed version.</p>
        </header>

        <ReloadPrompt />
      </div>
    </>
  );
}

export default App;
