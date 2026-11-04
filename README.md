# 📚 AssignFlow — Assignment & Review Dashboard

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A modern, role-based SaaS Assignment & Review Dashboard built with React 19, TypeScript, Tailwind CSS v4, and Lucide Icons. Designed for academic environments where professors manage assignments and track student submissions in real time, and students can view deadlines and submit their work with a verified two-step confirmation process.

---

## 🌐 Live Demo & Repository

- **GitHub Repository**: [https://github.com/Ramashishyadav01/AssignFlow](https://github.com/Ramashishyadav01/AssignFlow)
- **Live Deployment on Vercel**: Ready for one-click deployment via Vercel with automatic CI/CD on git push.

---

## 🌟 Features Overview

### 👨‍🏫 Admin / Professor Capabilities
- **Real-Time Analytics Overview**:
  - Total Assignments created by the active professor
  - Total Students Assigned across all managed tasks
  - Total Submissions received
  - Total Pending submissions awaiting review
  - Class Completion percentage progress indicator
- **Assignment Management (CRUD)**:
  - **Create**: Add new assignments with full validation (Title, Description, Due Date, Google Drive Link).
  - **Target Audience**: Assign either to **All Students** or **Specific Students** via multi-select checkboxes.
  - **Edit**: Update details, instructions, links, or assigned students with instant synchronization across student dashboards.
  - **Delete**: Safely delete assignments with an accessible confirmation dialog that automatically cleans up associated submission records.
- **Student Submission Tracking**:
  - Detailed modal view and dedicated route (`/admin/assignments/:id`).
  - Highlights top summary metrics: **Submitted count** (green), **Pending count** (amber), and **Completion %**.
  - Quick filter buttons: `All`, `Submitted`, and `Pending`.
  - **Mobile-First Responsive Layout**: On mobile viewports, submissions display as clean cards with avatars, student names, emails, and prominent `Submitted` / `Pending` badges that never get cut off. On tablet and desktop, an expandable data table provides horizontal scrolling.
- **Strict Role & Data Isolation**:
  - Admin 1 (`admin1@joineazy.com`) sees only Admin 1's assignments and students.
  - Admin 2 (`admin2@joineazy.com`) sees only Admin 2's assignments and students.

### 👨‍🎓 Student Capabilities
- **Personalized Overview**:
  - Stat cards for Total Assigned, Submitted, Pending, and Overdue assignments.
  - Dynamic progress indicator displaying completion percentage.
- **My Assignments Feed**:
  - Shows only assignments specifically targeted to the logged-in student (or assigned to all).
  - Dynamic status indicators: `Submitted` (green), `Pending` (amber), and `Overdue` (red).
  - Direct integration link to open assignment materials in Google Drive in a new tab.
- **Mandatory Two-Step Submission Confirmation**:
  1. **Step 1**: Student reviews the assignment and clicks **"Yes, I have submitted"**.
  2. **Step 2**: An accessible confirmation modal appears asking the student to verify their submission.
  3. **Step 3**: Upon clicking **"Yes, Confirm"**, the submission is timestamped and saved to `localStorage`, immediately turning the button into a verified green badge and updating the professor's tracking metrics in real time.
- **Search, Filter & Sort**:
  - Filter by `All`, `Submitted`, `Pending`, or `Overdue`.
  - Live search by assignment title or description.
  - Sort chronologically by due date or alphabetically by title.

### 🔐 Authentication & Session Flow
- **Passwordless Mock Authentication**: Sign in using any seeded email or use the one-click **Demo Accounts** switcher.
- **Role-Based Guards**: Protected routes automatically direct Admins to `/admin` and Students to `/student`, while blocking unauthorized cross-role access.
- **Session Continuity**: User session is saved in `localStorage` and persists across page reloads.

---

## 👥 Seeded Demo Accounts

You can sign in with any of these pre-configured accounts:

### Admins (Professors)
| Name | Email | Role | Scope |
|------|-------|------|-------|
| Prof. Ajit Sharma | `admin1@joineazy.com` | Admin | Owns React Fundamentals & Algorithm Analysis |
| Prof. Sunil Singh | `admin2@joineazy.com` | Admin | Owns Database Design Project |

### Students
| Name | Email | Role |
|------|-------|------|
| Rahul Verma | `rahul@student.com` | Student |
| Priya Sharma | `priya@student.com` | Student |
| Neha Gupta | `neha@student.com` | Student |
| Rohit Kumar | `rohit@student.com` | Student |
| Pooja Singh | `pooja@student.com` | Student |

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Core Framework** | React 19 (Functional Components & Hooks) | Component-driven UI and lifecycle |
| **Language** | TypeScript | Strong typing, interfaces, and code reliability |
| **Build Tool** | Vite 8 | Ultra-fast HMR and optimized production bundles |
| **Routing** | React Router DOM v7 | Client-side routing with nested layouts and route guards |
| **Styling** | Tailwind CSS v4 | Utility-first, mobile-responsive modern design system |
| **Icons** | Lucide React | Clean, consistent SaaS icons |
| **State Management** | React Context API | Global authentication, assignments, and toast notifications |
| **Storage** | Browser `localStorage` | Client-side data persistence across refreshes |

---

## 📁 Folder Structure & File Architecture

```
AssignFlow/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                      # Static branding assets
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AssignmentCard.tsx           # Admin card with metrics, badges & actions
│   │   │   ├── AssignmentDetailModal.tsx    # Modal showing responsive student submissions
│   │   │   ├── AssignmentForm.tsx           # Validated assignment create/edit form
│   │   │   └── StudentSubmissionRow.tsx     # Student table row with status badge
│   │   ├── common/
│   │   │   ├── Badge.tsx                    # Reusable status badges (success, warning, etc.)
│   │   │   ├── Button.tsx                   # Reusable button with variants & loading state
│   │   │   ├── ConfirmDialog.tsx            # Confirmation modal for dangerous actions
│   │   │   ├── EmptyState.tsx               # Contextual empty state feedback
│   │   │   ├── Modal.tsx                    # Accessible portal dialog with backdrop
│   │   │   ├── ProgressBar.tsx              # Colored progress indicator (0-100%)
│   │   │   ├── StatCard.tsx                 # Metric card with icons and subtitle
│   │   │   └── Toast.tsx                    # Toast notification system & provider
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx          # Responsive dashboard wrapper
│   │   │   ├── Header.tsx                   # Sticky top navigation bar
│   │   │   └── Sidebar.tsx                  # Collapsible desktop sidebar & mobile drawer
│   │   └── student/
│   │       ├── StudentAssignmentCard.tsx    # Student card with status & Drive link
│   │       ├── StudentProgress.tsx          # Student metric summary cards
│   │       └── SubmissionModal.tsx          # Two-step confirmation dialog
│   ├── context/
│   │   ├── AuthContext.tsx                  # User authentication state & login methods
│   │   └── AssignmentContext.tsx            # Global assignment & submission state
│   ├── data/
│   │   └── seedData.ts                      # Seed users, assignments, and submissions
│   ├── hooks/
│   │   └── useLocalStorage.ts               # Generic type-safe localStorage hook
│   ├── pages/
│   │   ├── AdminDashboard.tsx               # Admin analytics & assignment management
│   │   ├── AssignmentDetails.tsx            # Standalone assignment detail & tracking page
│   │   ├── Login.tsx                        # Clean SaaS login with demo quick-switcher
│   │   ├── NotFound.tsx                     # 404 page
│   │   └── StudentDashboard.tsx             # Student assignment & submission dashboard
│   ├── routes/
│   │   └── ProtectedRoute.tsx               # Role-based route guard
│   ├── utils/
│   │   ├── dateUtils.ts                     # Formatting, overdue checks, days left calculation
│   │   ├── storage.ts                       # localStorage accessors & initializers
│   │   └── validation.ts                    # Form input validation rules
│   ├── App.tsx                              # React Router route configuration
│   ├── main.tsx                             # Entry point with context providers
│   ├── index.css                            # Tailwind CSS styling
│   └── vite-env.d.ts                        # Vite client type definitions
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🏗️ Component Architecture & Design Patterns

1. **Separation of Concerns**:
   - `pages/` handle routing parameters, top-level layout coordination, and data filtering.
   - `components/` are decoupled and modular (e.g., `AssignmentCard`, `AssignmentForm`, `Modal`).
   - `context/` manages global shared state (`AuthContext` for user session, `AssignmentContext` for CRUD operations, `ToastContext` for feedback).
   - `utils/` encapsulate pure business logic (validation rules, date calculations, storage drivers).

2. **Compound & Controlled Components**:
   - Forms use controlled React state with immediate inline error clearing on change.
   - Modals leverage React Portals (`createPortal(..., document.body)`) to avoid z-index and overflow issues.

3. **Guaranteed Responsive Submission View**:
   - On wide displays (`sm` and above), student submissions render in a clean, horizontally scrollable table.
   - On small screens (`< 640px`), submissions automatically switch to a card list layout where the student's name, email, and color-coded **`Submitted` / `Pending`** badge are guaranteed never to be clipped or truncated.

---

## 💾 Data Management & LocalStorage Architecture

The application operates without an external database, utilizing browser `localStorage` as a single source of truth:

| LocalStorage Key | Data Stored | Notes |
|------------------|-------------|-------|
| `af_users` | List of `User` objects | Seeded once on first run; preserved across refreshes |
| `af_assignments` | List of `Assignment` objects | Contains creator ID and target student IDs |
| `af_submissions` | List of `Submission` objects | Records assignment ID, student ID, and ISO timestamp |
| `af_currentUser` | Active user ID | Maintains login session across page refreshes |

### Storage Lifecycle:
1. `initStorage()` runs in `main.tsx` on application mount. It checks if keys already exist; if not, it populates them with initial seed data.
2. Every mutation (`addAssignment`, `updateAssignment`, `deleteAssignment`, `markSubmitted`) persists directly to `localStorage` and triggers a synchronized React state update.
3. Reloading or refreshing the browser restores the exact application state seamlessly.

---

## 🎨 Key Design Decisions

1. **Clean Light SaaS Theme**:
   - Swapped out heavy dark gradients for a clean `bg-slate-50` backdrop with crisp white cards (`bg-white border border-gray-200/80 shadow-sm`), aligned with modern tools like Linear, Notion, and Stripe.
2. **Accessible Visual Feedback**:
   - Emerald (`bg-emerald-50 text-emerald-700`) for **Submitted** states.
   - Amber (`bg-amber-50 text-amber-700`) for **Pending** states.
   - Red (`bg-red-50 text-red-700`) for **Overdue** deadlines.
3. **Two-Step Submission Safeguard**:
   - Prevents accidental submissions by requiring explicit confirmation in a modal before writing to storage.
4. **Toast Notification System**:
   - Non-blocking bottom-right notifications with auto-dismiss (3 seconds) for all key actions (creation, editing, deletion, submissions).

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or above recommended)
- `npm` (packaged with Node.js)

### Installation & Run Steps
```bash
# 1. Clone the repository
git clone https://github.com/Ramashishyadav01/AssignFlow.git

# 2. Navigate to project root
cd AssignFlow

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open **`http://localhost:5173`** in your browser to view the application.

### Production Build & Preview
```bash
# Compile and build optimized production assets
npm run build

# Preview the production build locally
npm run preview
```

---

## ☁️ Deployment on Vercel

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "feat: deploy update"
   git push origin main
   ```
2. In your [Vercel Dashboard](https://vercel.com/), click **Add New > Project** and import the `AssignFlow` repository.
3. Verify settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Future pushes to `main` will automatically trigger a new deployment.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
