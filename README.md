# Stale Client / App Update Demo (Vite + React + TypeScript)

This repository is a live demonstration of how to proactively detect new application updates in a React (Vite) Single-Page Application (SPA) and prompt the user to refresh.

This solves the "stale client" problem, where a user keeps a browser tab open, we deploy a new version, and the user's old JavaScript fails when it tries to interact with new or changed functionality.

**Built with TypeScript, React 19, React Router, and Vite.**

## The Problem

1.  A user loads your React SPA and leaves the browser tab open.
2.  You deploy a new version of your app with (e.g., new JavaScript bundles with different file hashes).
3.  The user returns to the open tab and clicks a button.
4.  The old, cached JavaScript tries to fetch a new API endpoint, or use changed logic, and the app crashes or enters an error state.
5.  This leads to user frustration and support tickets, all of which are resolved by a simple "hard refresh" (which the user doesn't know to do).

## The Solution

This demo uses a **Service Worker** to manage the application's lifecycle. We use the `vite-plugin-pwa` package to automate this.

**This is *not* a full, offline-capable PWA.** It simply uses the service worker's built-in update mechanism to detect new deployments.

### Features

- **Automatic hourly update checks**: The app checks for new versions every hour in the background
- **Focus-based update detection**: When you return to the tab, it checks for updates (throttled to once every 5 minutes)
- **User-friendly prompt**: A non-intrusive notification appears when an update is available
- **Multi-page demo**: Includes React Router with Home and About pages to demonstrate that updates work across navigation

### How It Works

1.  **Build:** On `npm run build`, `vite-plugin-pwa` generates a service worker file (`sw.js`) that includes a "precache manifest" (a list of all your app's assets like `index-a83b.js`, `main-c29e.css`, etc.).
2.  **Deploy (v1):** You deploy your site. When a user first visits, the `sw.js` is registered and installed. It is now "controlling" the page.
3.  **Deploy (v2):** You make a change to your app (like in `HomePage.tsx`) and deploy again.
4.  **Detection:** The app automatically checks for updates in multiple ways:
    - **On page load/refresh**: The browser checks for a new `sw.js` file in the background
    - **Every hour**: The app proactively fetches the service worker to check for changes
    - **On tab focus**: When you return to the tab after 5+ minutes, it checks for updates
5.  **Waiting:** When a new version is detected, the browser downloads and installs the new **v2** service worker, but it doesn't activate it immediately (to prevent breaking the current page). It moves to a "waiting" state.
6.  **Prompt:** Our client-side code (using the `<ReloadPrompt />` component) detects this "waiting" worker and shows the "New version available\!" prompt.
7.  **Activate:** When the user clicks "Refresh", we send a message to the waiting worker telling it to "skip waiting" and take control. The page then reloads, successfully pulling in the **v2** code.

## How to Demo This on Your Fork

The update logic requires two separate *deployments*. The easiest way to see this in action is to use GitHub Pages.

### Step 1: Fork & Configure

1.  **Fork** this repository.

2.  **Clone** your fork to your local machine:

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

3.  **Install** dependencies:

    ```bash
    npm install
    ```

4.  **IMPORTANT:** You must edit three files to point to *your* forked repo's URL:

      * **In `vite.config.ts`:**
        Change `const REPO_NAME = 'react-update-notifications'` to match your repo's name.
      * **In `src/main.tsx`:**
        Change `const REPO_NAME = 'react-update-notifications'` to match your repo's name.
      * **In `package.json`:**
        Change the `"homepage": "..."` value to match your GitHub Pages URL (e.g., `https://your-username.github.io/your-repo-name`).

### Step 2: Enable GitHub Pages

1.  Go to your forked repo's **Settings \> Pages**.
2.  Under **Build and deployment \> Source**, select **Deploy from a branch**.
3.  Under **Branch**, select **`gh-pages`** and **`/ (root)`** for the folder. Click **Save**.
    *(Note: This branch won't exist until you run the `deploy` script for the first time. This is fine.)*

### Step 3: Deploy "Version 1"

1.  Check out the `v1` tag. This represents your first production deployment.
    ```bash
    git checkout v1
    ```
2.  Run the deploy script. This will build the app and push the `dist` folder to your `gh-pages` branch.
    ```bash
    npm run deploy
    ```
3.  Wait 2-3 minutes for the GitHub Pages deployment to go live.

### Step 4: Test "Version 1"

1.  Open your live GitHub Pages URL (e.g., `https://your-username.github.io/your-repo-name`).
2.  You should see the app with the title **"Service Worker Demo - v1.0"** and the message "This is the first deployed version."
3.  Try navigating between the Home and About pages using the navigation links.
4.  Open your browser's Dev Tools \> **Application** tab \> **Service Workers**.
5.  You should see a service worker listed as **activated and running** for your site.
6.  **KEEP THIS BROWSER TAB OPEN.** This is your "stale client".

### Step 5: Deploy "Version 2"

1.  Check out the `v2` tag. This represents your new update.
    ```bash
    git checkout v2
    ```
2.  Run the deploy script again.
    ```bash
    npm run deploy
    ```
3.  Wait 1-2 minutes for this *new* deployment to go live on GitHub Pages.

### Step 6: See the Update Prompt\!

1.  Go back to the browser tab you **kept open** (the one still showing v1.0).
2.  Do a **simple, normal refresh** (click the refresh button or press `F5` / `Cmd+R`).
      * **Do NOT** do a "hard refresh" (`Ctrl+Shift+R` or `Cmd+Shift+R`), as this bypasses the service worker and will skip the demo.
      * **Alternatively**, just wait up to an hour or switch to another tab for 5+ minutes then come back—the app will automatically check for updates!
3.  The page will load, and for a moment, you'll still see "v1.0" and the original message.
4.  In the background, the browser detects the new "waiting" service worker.
5.  After a few seconds, the **"New version available\!"** prompt will appear in the bottom-left corner.
6.  Click the **"Refresh"** button in the prompt.
7.  The page will reload, and you will now see the updated content with the new version number and message.

You have successfully simulated the stale client update flow\!

## How to Verify It's Working

- Open **Dev Tools \> Console** to see logs about update checks (hourly checks, focus checks, throttling messages)
- Open **Dev Tools \> Application \> Service Workers** to see the "waiting" service worker appear when an update is detected
- Navigate between pages—the update prompt will appear regardless of which page you're on
