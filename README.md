# Customer Support Ticketing System

A modern, full-stack Customer Support Ticketing System. This project features a polished React frontend built with Vite and Tailwind CSS, and a Node.js + Express backend interacting with PostgreSQL via Prisma. 

## Features

- **Create Tickets**: Users can submit support requests and select relevant products.
- **Product Integration**: Product data is fetched dynamically from the Escuelajs Fake Store API.
- **Admin Dashboard**: A centralized view for managing all customer requests with status filtering.
- **Conversation Threads**: Detailed view of individual tickets showing original messages and admin replies.
- **Product Catalog**: A beautiful, filterable grid displaying all premium products.
- **Extra Polish**: 
  - 🌙 Native Dark Mode Toggle
  - ✨ Glassmorphism effects and modern aesthetics
  - 🔄 Smooth micro-interactions and transitions
  - 🔍 Instant search filtering
  - 📱 Fully responsive layout

## Tech Stack

**Frontend:**
- React 19 (Vite)
- React Router v7
- Tailwind CSS v4
- Axios
- Lucide React (Icons)
- React Hot Toast

**Backend:**
- Node.js + Express
- Prisma (ORM)
- PostgreSQL
- TypeScript

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm
- PostgreSQL (If setting up local DB, though the default Prisma schema points to what you configure)
*Note: The backend is pre-configured to use the provided database URL in `.env`.*

### Setup Instructions

1. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Run the backend:**
   ```bash
   npm run dev
   ```
   *The backend will start at `http://localhost:5000`*

3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

4. **Run the frontend:**
   ```bash
   npm run dev
   ```
   *The frontend will start at `http://localhost:5173`*

Open your browser to the local frontend URL and enjoy the ticketing system experience!
