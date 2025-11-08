function HomePage() {
  // This is the text we will change between v1 and v2
  const version: string = "v1.0"; // Change to 'v2.0' for the update
  const message: string = "This is the first deployed version."; // Change this too

  return (
    <header className="App-header">
      <h1>Service Worker Demo - {version}</h1>
      <p>{message}</p>
      <p>
        The app is now checking for updates in the background every 60 seconds.
      </p>
    </header>
  );
}
export default HomePage;
