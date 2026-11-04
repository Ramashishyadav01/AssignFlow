# 📚 AssignFlow

A role-based assignment management dashboard built for academic environments. Professors can create and manage assignments; students can view and submit them — all in a clean, responsive UI.

---

## ✨ Features

### 👨‍🏫 Admin / Professor
- Create new assignments with title, description, due date, and Google Drive link
- Assign to **all students** or **specific students**
- Edit and delete existing assignments
- View submission status per student for each assignment

### 👨‍🎓 Student
- View assignments assigned specifically to them or to the whole class
- Track due dates and submission status
- Mark assignments as submitted

### 🔐 Authentication
- Mock login system — select any user from the login screen (no password required)
- Role-based routing: Admins see the Admin Dashboard, Students see the Student Dashboard

---

## 🛠️ Tech Stack

| Technology | Version |
|------------|---------|
| React | 19.x |
| TypeScript | 7.x |
| Tailwind CSS | 4.x |
| Vite | 8.x |

> Data is persisted in **localStorage** — no backend or database required.

---

## 📁 Project Structure

```
AssignFlow/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/              # Images and SVGs
│   ├── components/
│   │   ├── LoginPage.tsx    # Role-selector login screen
│   │   ├── Navbar.tsx       # Top navigation bar
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx       # Admin home view
│   │   │   ├── AdminAssignmentCard.tsx  # Card with edit/delete/submission view
│   │   │   └── AssignmentForm.tsx       # Create / edit assignment form
│   │   └── student/
│   │       ├── StudentDashboard.tsx     # Student home view
│   │       └── StudentAssignmentCard.tsx # Card with submit button
│   ├── context/
│   │   └── AppContext.tsx   # Global state via React Context
│   ├── data/
│   │   ├── seedData.ts      # Initial users, assignments, and submissions
│   │   └── storage.ts       # localStorage read/write helpers
│   ├── App.tsx              # Root component & role-based routing
│   └── main.tsx             # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or above)
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Ramashishyadav01/AssignFlow.git

# 2. Navigate into the project directory
cd AssignFlow

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be running at **http://localhost:5173**

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build for production (runs TypeScript check + Vite build) |
| `npm run preview` | Preview the production build locally |

---

## 👥 Demo Accounts

The app comes with pre-seeded users. Just click any name on the login screen — no password needed.

### Admins / Professors
| Name | Email |
|------|-------|
| Prof. Ajit Sharma | ajit123@uni.edu |
| Prof. Sunil Singh | sunil@uni.edu |

### Students
| Name | Email |
|------|-------|
| Ashish Yadav | ashish11@uni.edu |
| Prince Singh | prince33@uni.edu |
| Vishal Kumar | vishal@uni.edu |
| Deepak Yadav | deepak55@uni.edu |
| Sandeep Rai | sandeep66@uni.edu |

---

## 📝 Pre-Seeded Assignments

| Title | Assigned To | Due Date |
|-------|-------------|----------|
| React Fundamentals Report | All Students | Nov 15, 2026 |
| Algorithm Analysis Assignment | Ashish, Prince, Vishal | Nov 20, 2026 |
| Database Design Project | All Students | Nov 10, 2026 |
| Machine Learning Lab | Deepak, Sandeep | Nov 25, 2026 |
| Operating Systems Essay | All Students | Dec 01, 2026 |

---

## 🔧 How It Works

- All data is stored in the browser's **localStorage**, initialized from `seedData.ts` on the first visit.
- The `AppContext` provides global state (users, assignments, submissions) and actions (add, update, delete, submit).
- The app reads the current user's role and renders either the **Admin Dashboard** or **Student Dashboard** accordingly.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Ramashishyadav01">Ramashish Yadav</a>
</div>
