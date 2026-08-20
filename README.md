# ⚡ Code Room — Real-Time Collaborative Cloud IDE

<div align="center">

![Code Room Banner](client/public/codeRoom-Photoroom.png)

**A high-performance, real-time collaborative code editor platform empowering developers, teams, and students to write, chat, and compile multi-language code together seamlessly in the browser.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.2-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

---

## 🌟 Highlights & Features

### 🚀 Stunning Developer-First Landing Page
- **Interactive Hero Showcase**: Live simulated Monaco editor mockup with active typing, syntax coloring, floating room chat preview, and simulated test runner.
- **Instant 1-Click Room Generator**: Generate unique UUID rooms and jump straight into coding without registration friction.
- **Interactive Multi-Language Sandbox**: Test-drive algorithm compilation live in the browser for JavaScript, Python, C++, and Java before joining a room.
- **Bento Feature Grid**: Highlights key technical capabilities with sleek glassmorphism and glowing dark-mode aesthetics.
- **Minimalist Custom Mouse Pointer**: Hardware-accelerated floating cursor tip with smooth trailing halo aura and interactive element hover expansion.

### ⚡ Real-Time Multi-User Collaboration
- **Zero-Latency Synchronization**: High-throughput Socket.io pipelines ensuring keystrokes, syntax edits, and code formatting stream across all connected peers in sub-10ms.
- **Monaco Editor Core Engine**: Powered by the Microsoft Monaco Editor (VS Code core) featuring intelligent autocomplete, bracket colorization, multi-cursor editing, and standard IDE shortcuts.

### 💻 Multi-Language Cloud Execution & Compilation
- In-browser code compilation and standard output/error telemetry for:
  - 🟨 **JavaScript** (Node.js ES6+)
  - 🟦 **Python** (Python 3.10)
  - 🔷 **C++** (GCC 12)
  - 🟧 **Java** (OpenJDK 17)

### 💬 Integrated In-Room Chat & Presence
- Built-in real-time team chat channel with timestamps, user color badges, and system toast alerts when collaborators join or leave.

### 🔒 Persistent Room Storage
- Sessions and latest code buffers are safely vaulted into MongoDB so users rejoining or entering late access the latest synchronized workspace.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
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
│   │   ├── api/                # Code execution API clients (Piston)
│   │   ├── components/         # Modular UI Components
│   │   │   ├── Navbar.jsx              # Sticky glassmorphism header
│   │   │   ├── HeroSection.jsx         # Hero banner & instant room launcher
│   │   │   ├── FeaturesBento.jsx       # Bento grid feature cards
│   │   │   ├── InteractivePlayground.jsx# In-browser test runner sandbox
│   │   │   ├── HowItWorks.jsx          # 3-step progression guide
│   │   │   ├── FAQ.jsx                 # Expandable accordion
│   │   │   ├── CallToAction.jsx        # Bottom quick launcher banner
│   │   │   ├── CustomMousePointer.jsx  # Floating cursor follower
│   │   │   └── Footer.jsx              # Tech stack & branding footer
│   │   ├── pages/
│   │   │   ├── Home.jsx                # Full interactive landing page
│   │   │   └── EditorPage.jsx          # Live collaborative IDE & chat dashboard
│   │   ├── socket.js           # Socket.io client initialization
│   │   ├── App.jsx             # React routing setup
│   │   └── index.css           # Tailwind CSS & global design tokens
│   └── package.json
├── server/                     # Backend Application (Node.js + Express + Socket.io)
│   ├── models/                 # Mongoose schemas (Room data persistence)
│   ├── index.js                # Server entry point & Socket event handlers
│   └── package.json
└── README.md
```

---

## 🚀 Local Development Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster URI)
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
   FRONTEND_URL=http://localhost:5174
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
3. Create a `.env.local` file in `client/`:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
4. Launch the Vite dev server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5174/`.

---

## 🌐 Deployment

### Frontend (Vercel)
1. Import the repository into [Vercel](https://vercel.com).
2. Set the **Root Directory** to `client`.
3. Set the Environment Variable:
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
5. Deploy!

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
