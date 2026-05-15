# Changelog

All notable changes to the HireHub Onboarding Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-03-17

### Added

- **Landing Page** with hero section, feature cards (Innovation, Career Growth, Great Culture, Global Impact), and call-to-action buttons navigating to the application form.
- **Candidate Interest Form** (`/apply`) with fields for full name, email address, mobile number, and department of interest.
  - Client-side validation for all fields (required checks, email format, 10-digit mobile number, allowed department list).
  - Duplicate email detection to prevent repeated submissions.
  - Success banner with auto-dismiss after 4 seconds.
  - Inline error messages that clear when the user begins correcting input.
- **Admin Login** (`/admin`) with hardcoded credentials (`admin` / `admin`).
  - Session-based authentication using `sessionStorage`.
  - Error messaging for invalid login attempts.
- **Protected Admin Dashboard** accessible only after successful admin login.
  - Stat cards displaying total submissions, unique departments, and latest submission date.
  - Submissions table with row numbering, department badges, and formatted dates.
  - **Edit** functionality via modal dialog with validation for name, mobile, and department (email is read-only).
  - **Delete** functionality with browser confirmation prompt.
  - Logout support from both the dashboard and the navigation header.
- **localStorage Data Persistence** for candidate submissions with UUID generation and ISO timestamp tracking.
  - Graceful handling of corrupted or non-array data in storage.
  - Utility functions: `getSubmissions`, `saveSubmissions`, `addSubmission`, `updateSubmission`, `deleteSubmission`, `isEmailDuplicate`.
- **sessionStorage Admin Authentication** with `login`, `logout`, and `isAuthenticated` utility functions.
- **Form Validation Utilities** for name, email, mobile number, and department with descriptive error messages.
- **Responsive Design** with CSS custom properties for consistent theming.
  - Mobile-friendly layouts for navigation, feature cards, stat cards, tables, forms, and modals.
  - Breakpoints at 768px and 480px.
- **Navigation Header** with sticky positioning, brand link, and context-aware Login/Logout toggle.
- **Vercel Deployment Configuration** (`vercel.json`) with SPA rewrites for client-side routing support.
- **Test Suite** using Vitest and React Testing Library.
  - Unit tests for validators, storage utilities, and admin authentication.
  - Component tests for Header, InterestForm, and AdminDashboard.
  - Mocking of storage and auth modules in component tests.

### Technical Stack

- React 18 with Vite 5
- React Router DOM v6 for client-side routing
- PropTypes for runtime prop validation
- Vitest with jsdom environment for testing
- @testing-library/react and @testing-library/user-event for component tests