# 🔍 Lost & Found System (LFS)

[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A modern, full-featured web application built with **Next.js 14 (App Router)** and **Tailwind CSS** designed to help communities report lost belongings, list found items, and safely reunite them with their rightful owners using a patent anti-fraud **Response Validation System**.

---

## 📖 Table of Contents

- [Problem Statement & Solution](#-problem-statement--solution)
- [Key Features](#-key-features)
- [How the Response Validation System Works](#-how-the-response-validation-system-works)
- [Application Architecture](#-application-architecture)
- [Project Directory Structure](#-project-directory-structure)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
  - [Building for Production](#building-for-production)
- [Demo Credentials](#-demo-credentials)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Problem Statement & Solution

In colleges, libraries, airports, and public spaces, losing personal belongings (smartphones, earphones, wallets, keys) is extremely common. Traditional bulletin boards and open social media groups suffer from:
1. **Fraudulent Claims**: Anyone can claim an expensive item by guessing or lying.
2. **Privacy Risks**: Displaying phone numbers publicly invites spam, scammers, and unwanted calls.

### The Solution
**Lost & Found System** solves both problems through **Response Validation**:
- When an owner lists a lost item, they create a **secret verification question** only the true owner would know (e.g., *"What is the sticker on the back?"* or *"What is the lock-screen wallpaper?"*).
- When a finder locates the item, they submit an answer.
- The owner reviews the submitted answer in their private moderation panel.
- **Only upon the owner's approval is the owner's contact phone number revealed** to the claimant so they can coordinate a safe handover.

---

## ✨ Key Features

- **⚡ Next.js 14 App Router**: Server and client components optimized for lightning-fast page transitions and SEO.
- **🎨 Modern Tailwind CSS UI**: Glassmorphic sticky navigation bar, responsive grid layouts, subtle elevations, and clean mobile-first design.
- **🛡️ Secure Claim Verification**: Owners protect their personal information with custom security questions.
- **📋 Real-time Community Feed**: Instant search and filtering by category (**All**, **Lost**, **Found**) with auto-refresh when new items are posted.
- **🖼️ Multi-Image Showcase Carousel**: Smooth responsive photo gallery for inspected items.
- **👤 User Dashboards**:
  - **My Listings**: Manage all your posted items with active/inactive status badges, edit information, or delete listings.
  - **My Responses**: Real-time status tracking for claims you have submitted (In Review, Approved, Rejected) with one-click owner contact revelation.
- **👁️ Password Visibility Toggles**: Interactive show/hide eye icons on both Login and Sign-up password inputs.
- **⚡ 1-Click Quick Demo Sign-In**: Instant login button for testing without manual typing.
- **🔌 Standalone Out-of-the-Box Operation**: Built-in Next.js Route Handlers (`app/api/*`) provide local data persistence with zero external backend dependencies needed.

---

## 🔒 How the Response Validation System Works

```
┌────────────────────────────────────────────────────────┐
│ 1. Sarah (Owner) posts Lost "Smartphone"               │
│    Sets Question: "What is the color of the phone?"    │
└───────────────────────────┬────────────────────────────┘
                            │ (Listed on Feed)
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. John (Finder) browses Feed, finds the Smartphone    │
│    Clicks "I Found This" and submits answer:           │
│    "Midnight Black with a transparent silicone case"   │
└───────────────────────────┬────────────────────────────┘
                            │ (Claim sent to Owner)
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. Sarah opens "My Listings" -> Smartphone             │
│    Reviews John's answer: Correct! -> Clicks "Approve" │
└───────────────────────────┬────────────────────────────┘
                            │ (Claim status updated to "Approved")
                            ▼
┌────────────────────────────────────────────────────────┐
│ 4. John opens "My Responses"                           │
│    Badge turns green "Approved"                        │
│    Clicks "Show Contact Number"                        │
│    📞 Reveals Sarah's Phone: +1 (555) 789-0123         │
└────────────────────────────────────────────────────────┘
```

---

## 🏗️ Application Architecture

The project is structured following the modern Next.js 14 App Router paradigm:

- **Frontend Pages (`app/`)**: Client components utilizing React hooks (`useState`, `useEffect`, `useCallback`) for dynamic rendering and instant state updates.
- **State Management (`lib/AuthContext.jsx`)**: Centralized authentication context storing JWT tokens and active user sessions with automatic local storage persistence.
- **API Client (`lib/api.js`)**: Configured Axios client with automatic Bearer token injection and configurable backend routing.
- **Backend Route Handlers (`app/api/`)**: Next.js serverless route handlers managing in-memory collections with `globalThis` persistence across hot-reloads.
- **Reusable Components (`components/`)**: Modular UI components including `Navbar`, `ItemCard`, `PostItemModal`, `Toast`, and `ConfirmDialog`.

---

## 📁 Project Directory Structure

```text
lost-and-found/
├── app/
│   ├── api/                     # Next.js Serverless API Route Handlers
│   │   ├── activateItem/[id]/   # Reactivate inactive items
│   │   ├── confirmResponse/[id]/# Approve or reject claimant answers
│   │   ├── deleteitem/          # Delete item listing
│   │   ├── edititem/            # Edit item details
│   │   ├── getitem/             # Fetch all items for feed
│   │   ├── getnumber/[id]/      # Retrieve owner phone number after approval
│   │   ├── item/[id]/           # Fetch single item and associated claims
│   │   ├── login/               # User authentication endpoint
│   │   ├── mylistings/[id]/     # Fetch items created by specific user
│   │   ├── myresponses/[id]/    # Fetch claims submitted by specific user
│   │   ├── postitem/            # Create new lost/found item
│   │   ├── sendmessage/         # Contact form submissions
│   │   ├── signout/             # User session termination
│   │   ├── signup/              # New user registration
│   │   └── submitAnswer/        # Submit security question claim answer
│   ├── feed/
│   │   └── page.js              # Community feed page with filter & search
│   ├── item/
│   │   └── [id]/page.js         # Item detail, photo carousel & claim modal
│   ├── login/
│   │   └── page.js              # Login page with password eye toggle & demo signin
│   ├── my-listings/
│   │   └── page.js              # User's created listings dashboard
│   ├── responses/
│   │   └── page.js              # User's submitted claims tracking dashboard
│   ├── signup/
│   │   └── page.js              # Registration page with dual eye toggles
│   ├── ClientLayout.jsx         # Client-side layout with AuthProvider & ToastProvider
│   ├── globals.css              # Global styles and Tailwind directives
│   ├── layout.js                # Root HTML layout with Inter font configuration
│   └── page.js                  # Modern landing page with hero & steps guide
├── components/
│   ├── ConfirmDialog.jsx        # Reusable modal for destructive confirmations
│   ├── ItemCard.jsx             # Responsive item card with badge & image fallbacks
│   ├── Navbar.jsx               # Sticky glassmorphic navbar with mobile menu
│   ├── PostItemModal.jsx        # Modal for posting lost and found items
│   └── Toast.jsx                # Toast notification system
├── lib/
│   ├── api.js                   # Centralized Axios API client
│   ├── AuthContext.jsx          # React Authentication Context provider & hook
│   ├── dataStore.js             # In-memory data store with globalThis persistence
│   └── utils.js                 # Helper utilities (formatRelativeTime, cn, truncateText)
├── public/                      # Static SVG illustrations and assets
├── jsconfig.json                # Path alias configuration (@/* -> ./*)
├── next.config.js               # Next.js configuration and S3 remote image domains
├── package.json                 # Project dependencies and npm scripts
├── postcss.config.js            # PostCSS configuration for Tailwind CSS
├── tailwind.config.js           # Tailwind color palettes and theme extensions
└── README.md                    # Project documentation
```

---

## 📡 API Endpoints Reference

All endpoints are hosted locally under `/api/*` and return standard JSON:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/signup` | Register a new user account | No |
| `POST` | `/api/login` | Authenticate with email & password; returns JWT & user | No |
| `POST` | `/api/signout` | Invalidate current user session | Yes |
| `GET` | `/api/getitem` | Retrieve all items for the community feed | No |
| `GET` | `/api/item/:id` | Retrieve single item details and submitted claims | No |
| `POST` | `/api/postitem` | Create a new lost or found item | Yes |
| `POST` | `/api/edititem` | Update item title, description, or question | Yes |
| `POST` | `/api/deleteitem` | Delete an item listing | Yes |
| `POST` | `/api/activateItem/:id` | Reactivate an inactive item listing | Yes |
| `POST` | `/api/submitAnswer` | Submit answer to an item's secret question | Yes |
| `POST` | `/api/confirmResponse/:id` | Owner approves (`Yes`) or rejects (`No`) claim | Yes |
| `GET` | `/api/mylistings/:userId` | Retrieve all items posted by the specified user | Yes |
| `GET` | `/api/myresponses/:userId` | Retrieve all claims submitted by the specified user | Yes |
| `GET` | `/api/getnumber/:userId` | Retrieve owner contact phone number (post-approval) | Yes |
| `POST` | `/api/sendmessage` | Submit message from landing contact form | No |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher (tested on Node.js `v20.x` and `v24.x`)
- **npm**: `v9.x` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HrishabhKumarSingh/Lost-and-Found.git
   cd Lost-and-Found
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

### Running the Development Server

Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Building for Production

To create an optimized production build:
```bash
npm run build
```

To run the production server:
```bash
npm start
```

---

## 🔑 Demo Credentials

For quick evaluation, the in-memory data store includes pre-configured accounts:

| Role | Email | Password | Phone |
|---|---|---|---|
| **Demo User** | `demo@example.com` | `password123` | `+1 (555) 019-2834` |
| **Owner (Sarah)** | `sarah@example.com` | `password123` | `+1 (555) 789-0123` |
| **Finder (John)** | `john@example.com` | `password123` | `+1 (555) 321-6540` |

> 💡 **Tip**: On the **[Login Page](http://localhost:3000/login)**, click the **"Quick Sign In with Demo Account"** button to log in with 1-click.

---

## ⚙️ Environment Variables

By default, the application runs entirely locally using its built-in Next.js API route handlers. If you wish to connect an external Express/MongoDB backend, create a `.env.local` file in the root directory:

```env
# Optional: Point to external backend (defaults to /api if omitted)
NEXT_PUBLIC_API_URL=https://your-custom-backend-api.com
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
