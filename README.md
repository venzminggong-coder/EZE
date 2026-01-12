# READYPH - Disaster Preparedness App

## Overview
READYPH is a Progressive Web App (PWA) designed to educate users about disaster preparedness in the Philippines through interactive quizzes, hazard maps, and gamified learning modules.

## File Structure
Ensure your project folder contains the following files:

```text
/
├── index.html              # Entry point, loads styles and scripts
├── index.tsx               # React root mounting logic
├── App.tsx                 # Main application component and UI logic
├── constants.ts            # Static data (Questions, Modules, Regions)
├── types.ts                # TypeScript interfaces
├── manifest.json           # PWA configuration for mobile install
├── metadata.json           # App metadata
└── services/
    └── geminiService.ts    # AI integration logic
```

## How to Run Locally

Since this project uses ES Modules directly in the browser (via `importmap` in `index.html`), you cannot just double-click `index.html`. You must serve it over HTTP.

### Option 1: VS Code Live Server (Recommended)
1.  Open the project folder in **VS Code**.
2.  Install the **Live Server** extension.
3.  Right-click `index.html` and select **"Open with Live Server"**.

### Option 2: Node.js Serve
1.  Open your terminal in the project folder.
2.  Run: `npx serve .`
3.  Open the URL provided (usually `http://localhost:3000`).

## How to Install on Mobile (PWA)

1.  **Deploy**: Host these files on a secure server (HTTPS) like GitHub Pages, Vercel, or Netlify.
2.  **Android**: Open in Chrome -> Tap Menu (⋮) -> **"Add to Home Screen"** or **"Install App"**.
3.  **iOS**: Open in Safari -> Tap Share -> **"Add to Home Screen"**.

## Features
*   **7 Learning Modules**: Earthquake, Typhoon, Volcano, Landslide, Storm Surge, Industrial, Epidemic.
*   **Gamification**: XP, Ranks, Leaderboards, and Achievements.
*   **Interactive Map**: 3D Isometric view of Philippine regions with hazard data.
*   **AI Integration**: Explanations generated via Google Gemini API (requires API Key).
