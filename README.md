# 🏋️ GearUp - Sports & Outdoor Gear Rental Frontend

> **"Rent Sports & Outdoor Gear Instantly"** — A modern, blazing-fast, and responsive **Next.js App Router** application built for a premier sports and outdoor equipment rental service.

---

## 📋 Project Overview

**GearUp** is a feature-rich frontend application designed for customers, vendors (providers), and platform administrators. Customers can browse available gear, select rental delivery and return dates, and complete secure payments. Providers manage their inventory, equipment pricing, and incoming orders through an intuitive vendor dashboard. Admins oversee overall platform health, user access, and content moderation.

> 💡 *Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, and Radix UI components.*

---

## 👥 Roles & Permissions

GearUp implements role-based access control (RBAC) with protected routes enforced via Next.js middleware and proxy logic:

| Role | Description | Frontend UI Expectations |
| :--- | :--- | :--- |
| **Customer** | Users who rent sports gear | Public catalog browsing, interactive date-pickers, checkout & secure payment flow, order tracking dashboard, and post-rental review submission. |
| **Provider** | Gear vendors & rental shops | Protected provider dashboard, complete inventory CRUD forms (with image upload preview), and incoming order management tables with real-time status updates. |
| **Admin** | Platform moderators | Protected admin dashboard, user management tables (suspend/activate controls), global platform statistics, and comprehensive content moderation. |

---

## ✨ Key Features & UI/UX Requirements

### 🌐 Public Features
- **Responsive Gear Grid**: Optimized equipment cards displaying price per day, category badges, brand specs, and live availability status.
- **Advanced Search & Filter**: Instant sidebar & top-bar filters for categories, price ranges, brand specs, and date availability.
- **Gear Details Page**: Comprehensive view featuring image galleries, detailed specifications, vendor info, and an interactive "Rent Now" scheduling section.
- **Robust Loading & Error States**: Seamless skeleton loaders and graceful error boundary fallbacks (`error.tsx`).

### 🛍️ Customer Features
- **Authentication Flows**: Secure registration with role selection (Customer / Provider) and login validation.
- **Rental Checkout Flow**: Interactive date-picker checkout UI preventing past dates or conflicting bookings.
- **Payment Gateway Integration**: Seamless redirection to **Stripe Checkout** or **SSLCommerz** gateways with dedicated `/payment/success` and `/payment/cancel` confirmation pages.
- **Customer Dashboard & Portal**: Order history tracking with dynamic status badges, payment records, and review submission forms upon return.

### 🏪 Provider Features
- **Vendor Dashboard**: Overview metrics showing total gear listed, active rentals, and pending order pipelines.
- **Inventory CRUD Management**: Full forms to add, edit, and remove gear items with image URL uploads, daily rate pricing, and stock status toggles.
- **Order Pipeline Table**: Dedicated management table with action triggers (`Confirm`, `Mark Picked Up`, `Mark Returned`).

### 🛡️ Admin Features
- **Platform Overview**: High-level telemetry on total users, active gear inventory, and platform rentals.
- **User Management Table**: Searchable data table with pagination and instant "Suspend/Activate" account toggles.
- **Content Moderation**: Global inspection views for all catalog listings and platform rental transactions.

---

## 🗺️ Frontend Routes & API Mapping

| Next.js Route | Component / Feature | Backend API Integration |
| :--- | :--- | :--- |
| `/` | Home page with featured gear & workflows | `GET /api/gear` |
| `/gear-items` | Browse, search & filter inventory | `GET /api/gear`, `GET /api/categories` |
| `/gear-items/[id]` | Gear details & rent booking CTA | `GET /api/gear/:id` |
| `/register` | Role selection & registration form | `POST /api/auth/register` |
| `/login` | User login form | `POST /api/auth/login` |
| `/customer-cart` | Customer cart & active orders | `GET /api/rentals`, `GET /api/payments` |
| `/payment/success` & `/payment/cancel` | Payment outcome validation pages | (Session/URL parameter verification) |
| `/dashboard/provider` | Provider inventory & overview | `GET /api/provider/gear` |
| `/dashboard/provider/gear/new` | Add new gear form | `POST /api/provider/gear` |
| `/dashboard/admin` | Admin overview & user management | `GET /api/admin/users`, `PATCH /api/admin/users/:id` |

---

## 📊 Rental Order Lifecycle Statuses

```
[PLACED] ──► [CONFIRMED] ──► [PAID] ──► [PICKED_UP] ──► [RETURNED]
    │                                                        │
    └──────────────────► [CANCELLED] ◄───────────────────────┘
```

- 🟡 **`PLACED`**: Pending order awaiting vendor confirmation.
- 🔵 **`CONFIRMED`**: Verified by vendor, payment link unlocked for customer.
- 🟣 **`PAID`**: Payment completed successfully via Stripe/SSLCommerz.
- 🟢 **`PICKED_UP`**: Equipment handed over to the customer for use.
- ⚪ **`RETURNED`**: Gear returned; customer review form enabled.
- 🔴 **`CANCELLED`**: Order aborted or rejected.

---

## 🚀 Getting Started & Installation

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager
- Running GearUp Backend API service

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Apollo-Level2-Web-Dev/B7A5.git
   cd gear-Up-Client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and configure your backend endpoint:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI & Shadcn UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner Toast
- **Theme Management**: next-themes (Dark/Light mode support)

---

## 📄 License

This project is developed as part of the Web Development curriculum (Assignment 5 - GearUp Frontend).
