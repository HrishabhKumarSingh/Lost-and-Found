# 🔍 Lost & Found System (LFS)

[![Live Demo](https://img.shields.io/badge/Live_Demo-lost--and--found.vercel.app-000000?style=for-the-badge&logo=vercel)](https://lost-and-found-kohl-beta.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A production-ready, full-stack web application built with **Next.js 14 (App Router)**, **MongoDB Atlas**, and **Tailwind CSS**. Designed for university campuses and communities to report lost belongings, list recovered items, and safely coordinate returns through a privacy-preserving **Response Verification System**.

🌐 **Live Website**: [https://lost-and-found-kohl-beta.vercel.app](https://lost-and-found-kohl-beta.vercel.app/)

---

## 📖 Table of Contents

- [Problem Statement & Solution](#-problem-statement--solution)
- [Key Features](#-key-features)
- [How the Response Verification System Works](#-how-the-response-verification-system-works)
- [Security & Architecture](#-security--architecture)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running Locally](#running-locally)
  - [Building for Production](#building-for-production)
- [Deploying to Vercel](#-deploying-to-vercel)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Problem Statement & Solution

In universities, libraries, transit hubs, and public spaces, losing personal belongings (phones, keys, ID cards, bags) is frequent. Conventional bulletin boards and open social media groups create major vulnerabilities:
1. **Fraudulent Claims**: Anyone can claim valuable items through guesswork or dishonest responses.
2. **Privacy Violations**: Publicly exposing personal phone numbers or contact details invites spam, harassment, and social engineering scams.

### The Solution: Secret Question Verification
The **Lost & Found System** enforces contact number gating:
- When a user posts a lost or found item, they set a **secret verification question** only the true owner would know (e.g., *"What brand of keychain is attached?"* or *"What is inside the small front pocket?"*).
- Claimants submit answers privately.
- The item creator reviews incoming answers in their dashboard.
- **The creator's contact phone number is strictly hidden** until the creator reviews and explicitly approves the correct answer.

---

## ✨ Key Features

- **⚡ Next.js 14 App Router**: Serverless architecture optimized with server components, streaming, and fast client-side navigation.
- **🛡️ Contact Protection & Anti-Fraud**: Phone numbers are never exposed in public feeds or item detail views; access is only granted upon owner approval.
- **🔒 Production Security Standard**:
  - Salted `bcryptjs` password hashing (12 rounds).
  - Cryptographically signed HS256 JWT tokens.
  - In-memory sliding-window IP rate limiting on authentication routes.
  - Strict HTTP security headers (Content Security Policy, HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff).
  - Robust Insecure Direct Object Reference (IDOR) access control on item deletion, moderation, and edits.
- **🖼️ Client-Side Image Compression**: Automatic canvas-based JPEG compression (max 1200px, 85% quality) before upload, preventing payload limits and speeding up feed browsing.
- **📋 Real-time Community Feed**: Instant search by item title and category filtering (**All**, **Lost**, **Found**).
- **👤 User Dashboards**:
  - **My Listings**: Manage your posted items, view claims, approve/reject answers, and reactivate closed listings.
  - **My Responses**: Monitor real-time status of your claims (**In Review**, **Approved**, **Rejected**) with one-click access to the owner's phone number once verified.
- **📜 Privacy Policy & Compliance**: Dedicated `/privacy` documentation detailing zero-sale data handling, retention policies, and protected phone disclosure rules.

---

## 🔒 How the Response Verification System Works

```
┌────────────────────────────────────────────────────────┐
│ 1. User A (Owner) lists Lost "Black Backpack"          │
│    Sets Question: "What color is the inner lining?"    │
└───────────────────────────┬────────────────────────────┘
                            │ (Publicly viewable on Feed)
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. User B (Finder) finds the backpack                  │
│    Submits private claim answer: "Neon Orange"         │
└───────────────────────────┬────────────────────────────┘
                            │ (Sent to User A's moderation inbox)
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. User A reviews answer in "My Listings"              │
│    Verifies "Neon Orange" is correct -> Clicks Approve │
└───────────────────────────┬────────────────────────────┘
                            │ (Status updated to "Approved")
                            ▼
┌────────────────────────────────────────────────────────┐
│ 4. User B opens "My Responses"                         │
│    Status shows "Approved"                             │
│    Clicks "Show Contact Number"                        │
│    📞 User A's Phone is unlocked for safe coordination │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Serverless Route Handlers) |
| **Frontend** | [React 18](https://react.dev/), [Tailwind CSS 3.4](https://tailwindcss.com/) |
| **Icons & UI** | [Lucide React](https://lucide.dev/), [React Responsive Carousel](https://github.com/leandrowd/react-responsive-carousel) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose 8](https://mongoosejs.com/) |
| **Security** | `bcryptjs` (Salt 12), `jsonwebtoken` (HS256), `validator` |
| **Hosting** | [Vercel](https://vercel.com/) |

---

## 📁 Project Directory Structure

```text
lost-and-found/
├── app/
│   ├── api/                     # Next.js Serverless Route Handlers
│   │   ├── activateItem/[id]/   # Reactivate closed item
│   │   ├── confirmResponse/[id]/# Approve or reject claimant answer
│   │   ├── deleteitem/          # Authenticated item deletion
│   │   ├── edititem/            # Authenticated item update
│   │   ├── getitem/             # Public feed items retrieval
│   │   ├── getnumber/[id]/      # Protected owner contact disclosure
│   │   ├── item/[id]/           # Single item details & claim history
│   │   ├── login/               # User authentication endpoint
│   │   ├── mylistings/[id]/     # User's created listings
│   │   ├── myresponses/[id]/    # User's submitted claims
│   │   ├── postitem/            # Create item listing with compressed photos
│   │   ├── sendmessage/         # Support inquiry form
│   │   ├── signout/             # Session termination
│   │   ├── signup/              # New user account registration
│   │   └── submitAnswer/        # Submit answer to secret question
│   ├── feed/                    # Community feed with search & filters
│   ├── item/[id]/               # Item details, photo carousel & claim modal
│   ├── login/                   # Clean authentication page
│   ├── my-listings/             # Created items & moderation dashboard
│   ├── privacy/                 # Privacy policy & data protection docs
│   ├── responses/               # Claim tracking & contact disclosure
│   ├── signup/                  # Registration page with field validation
│   ├── ClientLayout.jsx         # App state wrappers (Auth, Toast, Modals)
│   ├── globals.css              # Global styles & Tailwind directives
│   ├── layout.js                # Root HTML layout with metadata & favicon
│   └── page.js                  # Landing page with system overview
├── components/
│   ├── ConfirmDialog.jsx        # Accessible confirmation modal
│   ├── Footer.jsx               # Site footer with security & privacy links
│   ├── ItemCard.jsx             # Responsive item card with image fallbacks
│   ├── Navbar.jsx               # Responsive header navigation
│   ├── PostItemModal.jsx        # Item creation modal with canvas compression
│   └── Toast.jsx                # Global notification context & UI
├── lib/
│   ├── api.js                   # Axios client with automatic Bearer token injection
│   ├── auth.js                  # JWT signing, verification & header extraction
│   ├── AuthContext.jsx          # Client-side session provider & persistence
│   ├── mongodb.js               # Cached MongoDB connection pool for serverless
│   ├── rateLimit.js             # Sliding-window IP rate limiter
│   └── utils.js                 # Helpers (formatRelativeTime, cn, getImageUrl)
├── models/
│   ├── Item.js                  # MongoDB Item schema
│   ├── Message.js               # Contact form message schema
│   ├── Response.js              # Secret question claim answer schema
│   └── User.js                  # User schema with bcrypt password hashing
├── public/                      # Static assets & SVG icons (icon.svg)
├── next.config.js               # Remote image hosts & strict security headers
├── package.json                 # Dependencies and build scripts
├── tailwind.config.js           # Tailwind theme configuration
└── README.md                    # Project documentation
```

---

## 📡 API Endpoints Reference

All endpoints return standard JSON responses and are hosted at `/api/*`:

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/signup` | Register user with email, phone, and hashed password | No |
| `POST` | `/api/login` | Authenticate credentials; returns signed JWT & user profile | No |
| `POST` | `/api/signout` | Invalidate user session | Yes |
| `GET` | `/api/getitem` | Retrieve items for community feed (sanitized) | No |
| `GET` | `/api/item/:id` | Retrieve single item and moderation answers | No |
| `POST` | `/api/postitem` | Upload new lost/found item with compressed photos | Yes |
| `POST` | `/api/edititem` | Update item details (creator only) | Yes |
| `POST` | `/api/deleteitem` | Remove item listing (creator only) | Yes |
| `POST` | `/api/activateItem/:id` | Reactivate inactive listing | Yes |
| `POST` | `/api/submitAnswer` | Submit an answer to the verification question | Yes |
| `POST` | `/api/confirmResponse/:id` | Creator approves (`Yes`) or rejects (`No`) claim | Yes |
| `GET` | `/api/mylistings/:userId` | Retrieve items created by authenticated user | Yes |
| `GET` | `/api/myresponses/:userId` | Retrieve claims submitted by authenticated user | Yes |
| `GET` | `/api/getnumber/:userId` | Protected route to reveal contact phone after approval | Yes |
| `POST` | `/api/sendmessage` | Submit message through contact form | No |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.x` or higher
- **MongoDB Atlas** cluster or a local MongoDB instance

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

### Environment Configuration

Create a `.env.local` file in the root of your project:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lostandfound?retryWrites=true&w=majority

# 64-character JWT secret key
JWT_SECRET=your_super_secret_jwt_key_here

# App URL (optional for local development, defaults to current host)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Important**: Never commit your `.env.local` file to GitHub. It is included in `.gitignore` by default.

### Running Locally

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

---

## ☁️ Deploying to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your `Lost-and-Found` repository.
4. In the **Environment Variables** section, add:
   * `MONGODB_URI`: Your MongoDB Atlas URI.
   * `JWT_SECRET`: A secure random string for JWT signing.
5. In **MongoDB Atlas** → **Network Access**, ensure IP `0.0.0.0/0` is allowed so Vercel's serverless functions can connect.
6. Click **Deploy**. Vercel will build and assign a free HTTPS URL (e.g. `https://your-project.vercel.app`).

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
