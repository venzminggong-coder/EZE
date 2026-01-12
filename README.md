# READYPH - Disaster Preparedness App

## Overview
READYPH is a Progressive Web App (PWA) designed to educate users about disaster preparedness in the Philippines through interactive quizzes, hazard maps, and gamified learning modules.

## Vercel Deployment (Recommended)
1. **GitHub**: Push these files to a new GitHub repository.
2. **Vercel**: Connect your GitHub account and import the `readyph` repo.
3. **Environment Variables**: Add `VITE_API_KEY` in the Vercel project settings with your Google Gemini API Key.
4. **Build Settings**: Vercel will auto-detect Vite. The build command is `npm run build` and the output directory is `dist`.

## Local Development
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open `http://localhost:3000`

## Features
*   **7 Learning Modules**: Earthquake, Typhoon, Volcano, Landslide, Storm Surge, Industrial, Epidemic.
*   **Gamification**: XP and Leveling system.
*   **Interactive Map**: Regional analysis of Philippine hazards.
*   **AI Integration**: Dynamic explanations via Google Gemini API.