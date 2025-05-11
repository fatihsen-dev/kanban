# Kanban Frontend

A modern, responsive frontend for the Kanban board application, built with React and TypeScript. Designed for seamless real-time collaboration, intuitive user experience, and easy extensibility.

## Tech Stack

-  **Framework:** React 19 (with Vite)
-  **Language:** TypeScript
-  **Styling:** Tailwind CSS
-  **State Management:** Zustand
-  **Data Fetching:** React Query
-  **Forms:** React Hook Form
-  **UI Components:** Radix UI, Lucide React
-  **Markdown:** @uiw/react-md-editor
-  **Real-time:** WebSocket (via react-use-websocket)
-  **Build Tool:** Vite

## Features

-  Real-time Kanban board with drag-and-drop task management
-  Responsive design for desktop and mobile
-  User authentication and authorization (JWT)
-  Team and project management
-  Project sharing and invitation system
-  Customizable columns and tasks
-  Rich Markdown support for task descriptions
-  Toast notifications and modern UI/UX

## Main Components & Structure

-  **Pages:** Organized under `src/pages` (e.g., Home, Login, Register, Project)
-  **Components:** Reusable UI elements in `src/components`
-  **State:** Global state managed with Zustand (`src/store`)
-  **Context:** Context providers for auth and app-wide state (`src/contexts`)
-  **Hooks:** Custom React hooks in `src/hooks`
-  **Schemas:** Zod schemas for validation (`src/schemas`)
-  **Styles:** Tailwind CSS configuration in `src/styles`

## Getting Started

### Prerequisites

-  Node.js (18+ recommended)
-  npm or bun

### Development Setup

1. Install dependencies:
   ```
   npm install
   # or
   bun install
   ```
2. Set up environment variables and backend API URL if needed.
3. Start the development server:
   ```
   npm run dev
   # or
   bun run dev
   ```
4. Open the app at: `http://localhost:5173` (or the port specified by Vite)

### Production Build

1. Build for production:
   ```
   npm run build
   # or
   bun run build
   ```
2. The static files will be generated in the `dist/` directory. You can host them on any static file server.

## Notes

-  Fully integrated with the backend. The backend server must be running for all API calls.
-  Uses WebSocket connection for real-time updates.
-  The project is structured according to modern frontend development standards.

---

For more details, check the code or feel free to reach out with questions.
