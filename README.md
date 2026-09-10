# ⚡ Code Room — AI-Powered Real-Time Collaborative Cloud IDE

<div align="center">

![Code Room Banner](client/public/codeRoom-Photoroom.png)

**A high-performance, real-time collaborative cloud IDE with built-in Google Gemini AI pair programming, 1-click automated error debugging, live multi-user synchronization, and instant multi-language code compilation in the browser.**

[![Version](https://img.shields.io/badge/Version-1.1.0-blue?style=for-the-badge)](https://github.com/pallaviii21/Code-Room/releases)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75FF?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.2-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

---

## 🌟 Highlights & Key Features

### 🤖 Built-In AI Pair Programmer & Automated Debugger *(New in v1.1.0)*
- **🛠️ 1-Click Terminal Error Diagnoser & Auto-Fixer**: When compiler errors, syntax exceptions, or runtime crashes occur, the **"Auto-Fix with AI"** button instantly diagnoses root causes using **Google Gemini 2.5 Flash** and patches the Monaco Editor buffer in 1 click across all connected collaborators.
- **👥 In-Room Collaborative `@ai` Teammate**: Mention `@ai` or `/ai` directly in room chat. The AI assistant inspects the live editor buffer in real-time, explains complex logic, suggests Big-O optimizations, and produces test cases visible to the entire room simultaneously.
- **⚡ Quick Prompt Suggestions**: Instant action chips (`@ai explain`, `@ai optimize`, `@ai write tests`, `@ai find bugs`) to accelerate group pair programming and technical interview prep.
- **🆓 100% Free AI Tier**: Uses Google's free-tier Gemini API (no credit card required) with graceful fallbacks so the workspace never fails.

### 🌗 Dynamic Light Mode & Dark Mode Workspace *(New in v1.1.0)*
- **1-Click Theme Switcher**: Toggle smoothly between deep dark mode and clean, high-contrast light mode directly from the top navigation bar.
- **Synchronized Monaco Engine**: Automatically switches Microsoft Monaco Editor between `vs-dark` and `light` themes with matching gutters, selection highlights, and token colorization.
- **Persistent Preferences**: Saves your theme choice in `localStorage` so it stays active across page reloads.

### 📐 Fully Adjustable & Resizable Layout *(New in v1.1.0)*
- **Interactive Drag Handles**: Drag-to-resize the output terminal height (120px to 75% screen) and sidebar width (240px to 540px).
- **Terminal Window Controls**: Maximize terminal (85% height) for inspecting deep stack traces, minimize into a bottom bar, or clear in 1 click.
- **Distraction-Free Mode**: 1-click collapse/expand sidebar toggle for full-width code editing.
- **Dedicated Chat & Users Tabs**: Chat messages and AI responses enjoy full unconstrained vertical height with auto-scrolling.

### ⚡ Real-Time Multi-User Collaboration
- **Zero-Latency Synchronization**: High-throughput Socket.io pipelines streaming keystrokes, syntax edits, and code formatting across connected peers in sub-10ms.
- **Monaco Editor Core Engine**: Powered by Microsoft Monaco Editor (the foundation of VS Code) featuring intelligent autocomplete, bracket colorization, multi-cursor editing, and standard IDE shortcuts.

### 💻 Multi-Language Cloud Execution & Compilation
- In-browser code compilation and standard output/error telemetry for:
  - 🟨 **JavaScript** (Node.js ES6+)
  - 🟦 **Python** (Python 3.10)
  - 🔷 **C++** (GCC 12)
  - 🟧 **Java** (OpenJDK 17)
  - 🌐 **TypeScript**, **Rust**, **Go**

### 💬 Integrated In-Room Chat & Presence
- Built-in real-time team chat channel with timestamps, user color badges, and system toast alerts when collaborators join or leave.

### 🔒 Persistent Room Storage
- Sessions and latest code buffers are safely vaulted into MongoDB so users rejoining or entering late access the latest synchronized workspace.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **AI Engine** | Google Gemini 2.5 Flash (`@google/generative-ai`) — Free Tier |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Monaco Editor (`@monaco-editor/react`), React Router v7, Lucide Icons, React Hot Toast |
| **Backend** | Node.js, Express, Socket.io |
| **Database** | MongoDB, Mongoose |
| **Code Runner** | Piston Cloud API / Native Compiler Sandbox |

---

## 📁 Repository Structure

```text
Code-Room/
├── client/                     # Frontend Application (React + Vite + Tailwind CSS)
│   ├── public/                 # Static assets & logos
│   ├── src/
│   │   ├── api/                # Piston code execution & Gemini AI clients
│   │   │   ├── piston.js       # Code runner API
│   │   │   └── ai.js           # AI error diagnostic & auto-fix API
│   │   ├── components/         # Modular UI Components
│   │   │   ├── Navbar.jsx              # Sticky glassmorphism header
│   │   │   ├── HeroSection.jsx         # Hero banner & instant room launcher
│   │   │   ├── FeaturesBento.jsx       # Bento grid feature cards
│   │   │   ├── InteractivePlayground.jsx# In-browser test runner sandbox
│   │   │   ├── AiFixModal.jsx          # AI error explanation & 1-click patch modal
│   │   │   ├── HowItWorks.jsx          # 3-step progression guide
│   │   │   ├── FAQ.jsx                 # Expandable accordion
│   │   │   ├── CallToAction.jsx        # Bottom quick launcher banner
│   │   │   ├── CustomMousePointer.jsx  # Floating cursor follower
│   │   │   └── Footer.jsx              # Tech stack & branding footer
│   │   ├── pages/
│   │   │   ├── Home.jsx                # Full interactive landing page
│   │   │   └── EditorPage.jsx          # Live collaborative IDE, AI chat & terminal
│   │   ├── socket.js           # Socket.io client initialization
│   │   ├── App.jsx             # React routing setup
│   │   └── index.css           # Tailwind CSS & global design tokens
│   └── package.json
├── server/                     # Backend Application (Node.js + Express + Socket.io)
│   ├── models/                 # Mongoose schemas (Room data persistence)
│   ├── services/
│   │   └── aiService.js        # Gemini AI error debugger & @ai chat assistant
│   ├── index.js                # Server entry point, Socket handlers & AI routes
│   └── package.json
└── README.md
```

---

## 🚀 Local Development Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster URI)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey) (100% Free, no credit card required)
- Git

---

### 1. Clone the Repository
```bash
git clone https://github.com/pallaviii21/Code-Room.git
cd Code-Room
```

---

### 2. Backend Setup
1. Navigate into the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `server/`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_cluster_url
   FRONTEND_URL=http://localhost:5173
   GEMINI_API_KEY=your_free_gemini_api_key   # Get free at https://aistudio.google.com/app/apikey
   GEMINI_MODEL=gemini-2.5-flash
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

---

### 3. Frontend Setup
1. Open a new terminal and navigate to `client`:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `client/`:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
4. Launch the Vite dev server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173/`.

---

## 🌐 Deployment

### Frontend (Vercel)
1. Import the repository into [Vercel](https://vercel.com).
2. Set the **Root Directory** to `client`.
3. Set Environment Variable:
   - `VITE_BACKEND_URL` = `https://your-backend-service.onrender.com`
4. Deploy!

### Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com).
2. Set the **Root Directory** to `server`.
3. Set the **Build Command** to `npm install` and **Start Command** to `npm start`.
4. Configure Environment Variables:
   - `PORT` = `5000`
   - `MONGO_URI` = `your_mongodb_atlas_connection_string`
   - `FRONTEND_URL` = `https://your-frontend.vercel.app`
   - `GEMINI_API_KEY` = `your_google_gemini_api_key`
   - `GEMINI_MODEL` = `gemini-2.5-flash`
5. Deploy!

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
