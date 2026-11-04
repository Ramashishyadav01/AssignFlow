# 📚 AssignFlow — Assignment & Review Dashboard

> A role-based SaaS Assignment & Review Dashboard built with React, Vite, TypeScript, Tailwind CSS, and Lucide Icons. Designed for academic environments where professors manage assignments and track student submissions in real time.

---

## 🌟 Key Features

### 👨‍🏫 Admin / Professor Dashboard
- **Dashboard Overview**: Dynamic statistic cards displaying Total Assignments created by the logged-in admin, Students Assigned, Submissions Received, Pending Submissions, and Overall Class Completion %.
- **Assignment Management (CRUD)**:
  - Create new assignments with validation (Title, Description, Due Date, Google Drive Link).
  - Target assignments to **All Students** or **Selected Students** via multi-select checkboxes.
  - Edit existing assignments (updates reflected across relevant student dashboards).
  - Delete assignments with a safe confirmation dialog (cascading cleanup of submissions).
- **Student Submission Tracking**:
  - Detailed modal and dedicated detail page (`/admin/assignments/:id`).
  - Table of assigned students with their individual submission status, submission timestamp, and direct Google Drive assignment link.
  - Dynamic completion progress bar (e.g., 3/5 students = 60%).
- **Strict Data Isolation**: Admin 1 (`admin1@joineazy.com`) only views and manages assignments created by Admin 1; Admin 2 (`admin2@joineazy.com`) only sees Admin 2's assignments.

### 👨‍🎓 Student Dashboard
- **Overview & Progress Summary**: Progress cards showing Total Assigned, Submitted, Pending, and Overdue assignments.
- **Search, Filter & Sort**: Filter assignments by **All**, **Submitted**, **Pending**, or **Overdue**; search by title or description; sort by due date or title.
- **Google Drive Integration**: Direct link to open assignments/materials in a new browser tab.
- **Two-Step Submission Confirmation**:
  1. Student clicks **"Yes, I have submitted"**.
  2. A confirmation modal appears asking the student to verify their submission.
  3. Once confirmed, status changes immediately to **Submitted** with timestamp, updating both the student's dashboard and the professor's tracking view in real time.
- **Student Data Isolation**: Each student (Rahul, Priya, Neha, Rohit, Pooja) only sees assignments assigned to them or the whole class.

### 🔐 Authentication & Session Persistence
- **Mock Login System**: Sign in using any seeded email address or use the one-click **Demo Accounts** selector.
- **Role-Based Routing**: Protected routes automatically redirect Admins to `/admin` and Students to `/student`.
- **Session Persistence**: Stored in `localStorage` under `af_currentUser` — survives page refreshes.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 (Functional Components & Hooks)
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Build Tool**: Vite v8
- **Language**: TypeScript
- **State Management**: React Context API (`AuthContext`, `AssignmentContext`, `ToastContext`)
- **Persistence**: Browser `localStorage` (no external database required)

---

## 👥 Seeded Demo Accounts

You can sign in with any of these accounts with one click on the login screen:

### Admins / Professors
| Name | Email | Role |
|------|-------|------|
| Prof. Ajit Sharma | `admin1@joineazy.com` | Admin |
| Prof. Sunil Singh | `admin2@joineazy.com` | Admin |

### Students
| Name | Email | Role |
|------|-------|------|
| Rahul Verma | `rahul@student.com` | Student |
| Priya Sharma | `priya@student.com` | Student |
| Neha Gupta | `neha@student.com` | Student |
| Rohit Kumar | `rohit@student.com` | Student |
| Pooja Singh | `pooja@student.com` | Student |

---

## 📁 Project Architecture

```
AssignFlow/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AssignmentCard.tsx           # Admin card with metrics & actions
│   │   │   ├── AssignmentDetailModal.tsx    # Modal showing student submission table
│   │   │   ├── AssignmentForm.tsx           # Validated assignment create/edit form
│   │   │   └── StudentSubmissionRow.tsx     # Student row with submission status badge
│   │   ├── common/
│   │   │   ├── Badge.tsx                    # Status badges (success, warning, danger, info)
│   │   │   ├── Button.tsx                   # Reusable button with variants & loading state
│   │   │   ├── ConfirmDialog.tsx            # Modal confirmation for deletion
│   │   │   ├── EmptyState.tsx               # Empty state feedback component
│   │   │   ├── Modal.tsx                    # Accessible portal modal dialog
│   │   │   ├── ProgressBar.tsx              # Colored percentage progress bar
│   │   │   ├── StatCard.tsx                 # Metric card with icons
│   │   │   └── Toast.tsx                    # Toast notifications provider & hook
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx          # Wrapper with responsive sidebar and header
│   │   │   ├── Header.tsx                   # Sticky top bar with user profile & mobile toggle
│   │   │   └── Sidebar.tsx                  # Collapsible desktop & mobile drawer navigation
│   │   └── student/
│   │       ├── StudentAssignmentCard.tsx    # Student card with status & submit trigger
│   │       ├── StudentProgress.tsx          # Student metric summary cards
│   │       └── SubmissionModal.tsx          # Two-step submission confirmation dialog
│   ├── context/
│   │   ├── AuthContext.tsx                  # Current user, login, logout
│   │   └── AssignmentContext.tsx            # CRUD assignments & submissions
│   ├── data/
│   │   └── seedData.ts                      # Seed users, assignments, and submissions
│   ├── hooks/
│   │   └── useLocalStorage.ts               # Generic localStorage hook
│   ├── pages/
│   │   ├── AdminDashboard.tsx               # Admin analytics & assignment management
│   │   ├── AssignmentDetails.tsx            # Full-page assignment & submission tracking
│   │   ├── Login.tsx                        # SaaS login with demo quick-switcher
│   │   ├── NotFound.tsx                     # 404 page
│   │   └── StudentDashboard.tsx             # Student assignment & submission dashboard
│   ├── routes/
│   │   └── ProtectedRoute.tsx               # Role-based route guard
│   ├── utils/
│   │   ├── dateUtils.ts                     # Formatting, overdue checks, days remaining
│   │   ├── storage.ts                       # localStorage accessors & initializers
│   │   └── validation.ts                    # Form input validation rules
│   ├── App.tsx                              # Route definitions
│   ├── main.tsx                             # Context providers & DOM mounting
│   ├── index.css                            # Tailwind CSS styling
│   └── vite-env.d.ts                        # Vite client type definitions
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- npm (comes bundled with Node.js)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/Ramashishyadav01/AssignFlow.git

# 2. Enter directory
cd AssignFlow

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit **http://localhost:5173** in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 💾 LocalStorage Persistence Scheme

The application persists all state across page reloads using isolated keys:
- `af_users`: Seeded users list
- `af_assignments`: Assignments list with creator and target student IDs
- `af_submissions`: Verified student submission records with timestamp
- `af_currentUser`: ID of the currently logged-in user

---

## 📄 License

This project is open-source under the MIT License.
