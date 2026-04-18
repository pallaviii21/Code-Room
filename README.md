# Code Room

A real-time collaborative code editor platform empowering users to write, chat, and execute code together over the web effortlessly. Code Room supports active persistent sessions and native compilation for multiple popular languages directly within the browser dashboard.

![Code Room Demo](client/public/codeRoom-Photoroom.png)

## Highlights & Features
- ⚡ **Real-time Synchronization**: Powered by Socket.io, code editing occurs perfectly in-sync across all participants.
- 💻 **Live Compilation & Execution**: In-house support for compiling and testing algorithms in **JavaScript**, **Python**, **C++**, and **Java** simultaneously.
- 💬 **Live Room Chat**: Integrated chat dashboards allowing users to communicate without leaving the programming workflow.
- 🔒 **Persistent Code Storage**: Rooms and live code payloads are safely vaulted into MongoDB so users rejoining or entering late access code seamlessly. 
- 🎨 **Sleek UI/UX**: Utilizing TailwindCSS, the IDE mimics modern dark-mode VS Code themes with syntax highlighting driven identically by the underlying structural Monaco Editor engine.

## Technology Stack

### Frontend
- **Framework**: React / Vite
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor (VS Code core engine)

### Backend
- **Server**: Node.js / Express
- **Real-time Interface**: Socket.io
- **Database**: MongoDB (Mongoose)

---

## Local Development Workflow

Code-Room is structured as a fullstack application, cleanly decoupled into independent `client` and `server` modules.

### Prerequisites
- Node.js (v18+)
- Local or Atlas MongoDB URI
- Global C++/Java compilers and Python (If local code execution is utilized) Let `g++`, `javac`, and `python` exist in your path.

### Backend Setup
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Prepare environment variables: Duplicate a `.env` file at the `server/` level featuring:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_cluster_url
   FRONTEND_URL=http://localhost:5174
   ```
4. Start the server: `npm run dev`

### Frontend Setup
1. Open a new terminal and navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Configure dynamic environment parameters inside `.env.local` inside `client/`:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
4. Start the Vite development interface: `npm run dev`

---

## Deployment Strategy

This repository was designed specifically avoiding hard-linked environments so that decoupling allows maximum flexibility for robust serverless setups.

1. **Frontend**: Geared flawlessly to execute `npm run build` on **Vercel**. Lock `VITE_BACKEND_URL` to your production host to ensure all routing automatically shifts.
2. **Backend**: Structurally arranged for zero-friction runtime on **Render**. Utilize standard HTTP builds relying natively on `npm start` while declaring the production `FRONTEND_URL` inside your Render dashboard's env-wizard to tightly lock all web-tier CORS parameters safely.
