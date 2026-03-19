# 🎫 Premium Customer Support Ticketing System

A beautifully crafted, modern Customer Support Ticketing System designed as a comprehensive full-stack showcase. 
Built with **React 19, Vite, and Tailwind CSS v4** on the frontend, and secured by **Node.js, Express, and Prisma ORM** on the backend.

## 🚀 Live Deployments

- **Frontend Production (Vercel):** [Live Project Domain](https://agilite-assignment.vercel.app/)
- **Frontend Staging (Vercel):** [Dev Environment Domain](https://agilite-assignment-git-dev-rom204s-projects.vercel.app/)

- **Backend API (Render) Production:** [Live Project Domain](https://agilite-assignment.onrender.com)
- **Backend API (Render) Staging:** [Dev Environment Domain](https://agilite-assignment-1.onrender.com)

*Note: The frontend is configured with a smart, zero-config routing system that automatically detects Vercel preview environments and routes requests seamlessly to the assigned Staging backend (`https://agilite-assignment-1.onrender.com`).*

## 🧪 Review & Evaluation Guide

This application utilizes a strict, stateless JSON Web Token (JWT) architecture. To test the core functionalities, you can log in using two distinct flows:

### 1. The Customer Experience (Google Sign-In)
- Navigate to the **Home** or **Dashboard** page.
- Click the standard **Sign in with Google** button.
- **What happens:** You will be authenticated as a standard `Customer`. The backend generates a secure session, and your ticket management will be strictly scoped *only to tickets tied to your Google email*. 

### 2. The Admin Experience (Recruiter Fast-Track)
- Navigate to the **Home** or **Dashboard** login walls.
- Below the Google Login button, click the **Login as Demo Admin** button (shield icon).
- **What happens:** You bypass the Google OAuth requirement entirely. The backend instantly issues a hardcoded Administrator JWT. In this mode, you have global access to all customer tickets, the ability to leave official Support Replies, and full visualization on the Admin Analytics Pie Chart!

## ✨ Key Features

- **🔐 Enterprise-Grade Authentication (Google OAuth)**
  - Fully stateless, secure JSON Web Token (JWT) architecture.
  - Role-Based Access Control (RBAC): Automatically determines `Admin` vs `Customer` roles based on Google Identity and strict environment variable (`ADMIN_EMAIL`) matching.
  - Dedicated **Demo Admin Bypass** route explicitly built for recruiters to easily evaluate the platform without requiring a registered Google account.
- **📊 Advanced Analytics Dashboard**
  - Interactive Recharts visualizing ticket distribution per customer.
  - Instant toggle filtering for Open, Closed, and All tickets.
- **🛡️ Secure Ticket Management**
  - Customer ticket data is strictly isolated and scoped natively via JWT ownership.
  - Admins can freely monitor threads, reply, and securely close tickets.
- **💳 Dynamic Product Integration**
  - Asynchronously interfaces with the Escuelajs Fake Store API to assign related products to tickets.
  - Click-to-preview product modals embedded directly in tickets with smart image fallbacks.

## 🎨 Design & Polish
- 🌙 **Native Dark Mode** toggle with persistent `window.matchMedia` detection.
- 🔮 Sophisticated **Glassmorphism** overlays and dynamic mesh background gradients.
- 📱 A fully fluid, intrinsically responsive layout down to mobile phone widths.
- ⚡ **Micro-interactions** including hover states, sliding toasts (`react-hot-toast`), and elegant layout animations.

## 🛠️ Technology Stack

**Frontend**
- React 19 (Vite) / TypeScript
- `@react-oauth/google` & `jwt-decode`
- React Router v7
- Tailwind CSS v4
- Axios (With secure Bearer Token interceptors)
- Recharts
- Lucide React (Icons)

**Backend**
- Node.js & Express / TypeScript
- `google-auth-library` & `jsonwebtoken`
- Prisma ORM
- PostgreSQL (Neon Serverless Db)

## 💻 Running Locally

### Prerequisites
- Node.js (v18+)
- Postgres Database (or rely on the default connection string provided)

### Environment Setup (`.env`)
You must create `.env` files in both the frontend and backend directories.

**frontend/.env**:
```env
# Required for Local login testing
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
```

**backend/.env**:
```env
DATABASE_URL=postgresql://user:password@host/db
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
JWT_SECRET=any_secure_string_like_12345
# If set, logging in with this Google Email grants Administrator privileges
ADMIN_EMAIL=your_email@gmail.com
```

### Starting the Servers

1. **Start the Backend API:**
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```
*(Runs on `http://localhost:5001`)*

2. **Start the Frontend Client:**
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5173`)*
