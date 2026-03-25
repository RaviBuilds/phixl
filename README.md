# 📸 AI Image Restorer | Senior-Level Next.js SaaS

A high-performance, full-stack Image Restoration application built with the **Next.js 15 App Router**, **Supabase**, and **Replicate AI**. This project demonstrates a "Server-First" architecture, moving heavy logic and sensitive API keys away from the client to provide a secure, snappy user experience.

---

## 🏗️ Technical Architecture

This application is designed to mimic a professional-grade production environment. It prioritizes security, SEO, and performance by leveraging modern React patterns.

### 🛡️ Security First (Server-Side Logic)

Unlike standard React SPAs, this app uses **Next.js Server Actions** to interact with the Replicate API. This ensures that:

- **API Keys:** Your `REPLICATE_API_TOKEN` never touches the browser.
- **Database:** Credits and user data are mutated via secure server-side functions, preventing client-side spoofing.
- **Bundle Size:** Complex logic stays on the server, keeping the JavaScript sent to the user minimal.

### ⚡ Performance & UX

- **Component Splitting:** The landing page is a **Server Component** by default. Interactive elements like the "Before/After" slider are isolated into `"use client"` components.
- **Streaming & Suspense:** Utilizing `loading.tsx` to provide instant skeleton states while the AI model processes images.
- **Optimistic UI:** Using React hooks to handle form states during image uploads.

---

## 🛠️ Tech Stack

| Layer          | Technology                      |
| :------------- | :------------------------------ |
| **Framework**  | Next.js 15 (App Router)         |
| **Auth & DB**  | Supabase (PostgreSQL + GoTrue)  |
| **AI Engine**  | Replicate (GFPGAN / CodeFormer) |
| **Styling**    | Tailwind CSS                    |
| **Deployment** | Vercel                          |

---

## 📅 Roadmap: The 5-Day Build

### Day 1: The Component Split

- Refactored React JSX into the Next.js `/app` directory.
- Implemented **Server Components** for SEO-critical content.
- Created a high-performance "Before/After" image comparison tool as a **Client Component**.

### Day 2: Supabase Integration

- Configured **Supabase Auth** for secure user login.
- Set up a PostgreSQL schema to track user credits.
- Implemented **Server Actions** to handle database mutations without a traditional REST API.

### Day 3 & 4: The AI Pipeline

- Integrated **Replicate API** for image restoration.
- Built the `restoreImage` Server Action to handle file uploads and AI processing securely.
- Implemented error handling and state management for the image generation lifecycle.

### Day 5: Polish & Deployment

- Added `loading.tsx` for skeleton loading states.
- Optimized images using `next/image` for LCP (Largest Contentful Paint) improvements.
- Deployed to **Vercel** with automated CI/CD.

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18.x or later
- A Supabase account
- A Replicate API token

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Replicate AI
REPLICATE_API_TOKEN=your_replicate_token

# Deployment
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
