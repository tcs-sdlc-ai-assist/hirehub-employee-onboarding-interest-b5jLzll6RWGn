# HireHub Onboarding Portal

A modern, single-page onboarding portal built with React 18 and Vite. HireHub allows candidates to submit their interest in joining the company and provides an admin dashboard for managing submissions.

---

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Build](#build)
  - [Preview Production Build](#preview-production-build)
- [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Admin Credentials](#admin-credentials)
- [License](#license)

---

## Project Description

HireHub Onboarding Portal is a client-side web application that streamlines the candidate onboarding process. Candidates can browse information about the company and submit their interest through a validated form. Administrators can log in to view, edit, and delete submissions through a protected dashboard.

All data is persisted in the browser using `localStorage` (submissions) and `sessionStorage` (admin authentication), requiring no backend server or database.

---

## Features

- **Landing Page** — Hero section with company highlights, feature cards (Innovation, Career Growth, Great Culture, Global Impact), and call-to-action buttons
- **Candidate Interest Form** (`/apply`)
  - Fields: Full Name, Email Address, Mobile Number, Department of Interest
  - Client-side validation (required checks, email format, 10-digit mobile number, allowed departments)
  - Duplicate email detection
  - Success banner with 4-second auto-dismiss
  - Inline error messages that clear on user input
- **Admin Login** (`/admin`) — Hardcoded credential authentication with error messaging
- **Protected Admin Dashboard**
  - Stat cards: Total Submissions, Unique Departments, Latest Submission Date
  - Submissions table with row numbering, department badges, and formatted dates
  - Edit functionality via modal dialog (email is read-only)
  - Delete functionality with browser confirmation prompt
  - Logout support from dashboard and navigation header
- **localStorage Data Persistence** — UUID generation, ISO timestamps, graceful handling of corrupted data
- **sessionStorage Admin Authentication** — Session-scoped login/logout
- **Responsive Design** — Mobile-friendly layouts with breakpoints at 768px and 480px
- **Sticky Navigation Header** — Brand link and context-aware Login/Logout toggle
- **Comprehensive Test Suite** — Unit and component tests using Vitest and React Testing Library

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| [React 18](https://react.dev/) | UI library |
| [Vite 5](https://vitejs.dev/) | Build tool and dev server |
| [React Router DOM v6](https://reactrouter.com/) | Client-side routing |
| [PropTypes](https://www.npmjs.com/package/prop-types) | Runtime prop validation |
| Plain CSS | Styling with CSS custom properties |
| localStorage | Candidate submission persistence |
| sessionStorage | Admin authentication state |
| [Vitest](https://vitest.dev/) | Test runner |
| [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) | Component testing |
| [@testing-library/user-event](https://testing-library.com/docs/user-event/intro/) | User interaction simulation |

---

## Folder Structure

```
hirehub-onboarding-portal/
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── vite.config.js                # Vite configuration
├── vitest.config.js              # Vitest configuration
├── vercel.json                   # Vercel SPA rewrite rules
├── CHANGELOG.md                  # Project changelog
├── DEPLOYMENT.md                 # Deployment guide
├── README.md                     # Project documentation (this file)
├── public/
│   └── vite.svg                  # Favicon
└── src/
    ├── main.jsx                  # Application entry point
    ├── App.jsx                   # Root component with routes
    ├── App.css                   # Global styles and CSS custom properties
    ├── setupTests.js             # Test setup (jest-dom matchers)
    ├── components/
    │   ├── Header.jsx            # Sticky navigation header
    │   ├── Header.test.jsx       # Header component tests
    │   ├── LandingPage.jsx       # Landing page with hero and features
    │   ├── InterestForm.jsx      # Candidate interest form
    │   ├── InterestForm.test.jsx # Interest form component tests
    │   ├── AdminLogin.jsx        # Admin login form
    │   ├── AdminDashboard.jsx    # Admin dashboard with stats and table
    │   ├── AdminDashboard.test.jsx # Dashboard component tests
    │   ├── ProtectedRoute.jsx    # Auth guard for admin routes
    │   ├── SubmissionTable.jsx   # Submissions data table
    │   └── EditModal.jsx         # Edit submission modal dialog
    └── utils/
        ├── adminAuth.js          # Admin authentication utilities
        ├── adminAuth.test.js     # Auth utility tests
        ├── storage.js            # localStorage CRUD utilities
        ├── storage.test.js       # Storage utility tests
        ├── validators.js         # Form validation functions
        └── validators.test.js    # Validator utility tests
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd hirehub-onboarding-portal
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

### Build

Create a production build:

```bash
npm run build
```

The optimized output is generated in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

This serves the `dist/` directory at `http://localhost:4173`.

---

## Running Tests

Run the full test suite:

```bash
npm test
```

Run tests in watch mode during development:

```bash
npm run test:watch
```

The test suite includes:

- **Unit tests** for validators, storage utilities, and admin authentication
- **Component tests** for Header, InterestForm, and AdminDashboard
- Tests use **Vitest** with the `jsdom` environment and **React Testing Library**

---

## Deployment

This project is configured for deployment on [Vercel](https://vercel.com) as a static single-page application.

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project into Vercel
3. Vercel auto-detects Vite — confirm the following settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Deploy

The included `vercel.json` configures SPA rewrites so that client-side routes (`/apply`, `/admin`) work correctly on direct access and page refresh.

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## Admin Credentials

The admin dashboard is protected by hardcoded credentials:

| Field | Value |
| --- | --- |
| Username | `admin` |
| Password | `admin` |

Navigate to `/admin` and enter these credentials to access the dashboard. Authentication is stored in `sessionStorage` and is cleared when the browser tab is closed.

---

## License

This project is **Private** and proprietary. All rights reserved. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.