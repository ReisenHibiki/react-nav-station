# 🐟 Fish Navigation Station

A full-stack community navigation platform built with Next.js, Drizzle ORM, and Supabase.

Users can explore content cards, create and join settlements (communities), interact through comments, and manage their own virtual currency wallet.

## ✨ Features

### 🔐 Authentication

- User registration and login
- Supabase Auth integration
- User profile management
- Protected API routes

### 🗂 Content Navigation

- Card-based content navigation system
- Dynamic card detail pages
- Categorized content sections
- Reusable card components

### 🏘 Settlement System

A community system where users can:

- Create settlements
- Search and join settlements
- Send join requests
- Accept or reject membership requests
- Manage settlement members
- Leave settlements
- Automatically handle settlement deletion when the owner leaves

### 💬 Comment System

A reusable comment component supporting:

- Comments on multiple resources:
  - Cards
  - Profiles
  - Settlements
- Cursor-based pagination
- Create comments
- Delete own comments
- User avatar and profile information display

### 🪙 Wallet System

A virtual currency system:

- User wallet
- Transaction records
- Daily check-in rewards
- Transaction history tracking
- Database transaction locking to prevent concurrency issues

## 🛠 Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Material UI Icons

### Backend

- Next.js Route Handlers
- Drizzle ORM
- PostgreSQL

### Database & Authentication

- Supabase
  - PostgreSQL Database
  - Authentication
  - Storage

### Deployment

- Vercel
