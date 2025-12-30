function HomePage() {
  // This is the text we will change between v1 and v2
  const version: string = "v2.0";
  const message: string = "This is the second deployed version.";
  return (
    <header className="App-header">
      <h1>Service Worker Demo - {version}</h1>
      <p>{message}</p>
      <p>
        The app is now checking for updates in the background every hour and when the tab regains focus.
      </p>
    </header>
  );
}
export default HomePage;
