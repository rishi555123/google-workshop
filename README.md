# 🍃 Food Link

A real-time platform connecting restaurants with NGOs to redistribute surplus food.

## Quick Start

```bash
npm install
npm start
```

## Project Structure

```
src/
  components/        ← All UI components
    Header.js
    Footer.js
    Home.js
    AboutUs.js
    HowItWorks.js
    Login.js
    Register.js
    EditProfile.js
    RestaurantDashboard.js
    NGODashboard.js
  services/          ← All data/logic (swap here for Firebase later)
    storageService.js   ← localStorage CRUD
    authService.js      ← login, register, delete account
    GeminiHelper.js     ← AI food freshness scanning
  App.js             ← Page router
  App.css            ← Global styles
```

## Environment Variables

Create a `.env` file in the project root:

```
REACT_APP_GEMINI_KEY=your_gemini_api_key_here
```

Get a free Gemini key at: https://aistudio.google.com/app/apikey

## Deploy to GitHub Pages

```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Add to package.json:
#    "homepage": "https://YOUR_USERNAME.github.io/food-link"
#    "predeploy": "npm run build"
#    "deploy": "gh-pages -d build"

# 3. Deploy
npm run deploy
```

## Phase Roadmap

- ✅ Phase 1: localStorage (current)
- ⬜ Phase 2: GitHub Pages deployment
- ⬜ Phase 3: Firebase Firestore (replace storageService.js)
- ⬜ Phase 4: Custom domain + final deployment